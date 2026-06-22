# backend/app/routes/recommend.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import find_all, find_one, get_database
from app.schemas import RecommendRequest, RecommendResponse, RecommendedProduct


router = APIRouter()


def get_matching_power_bands(target_whp: float) -> list[str]:
    bands = ["any"]

    if 400 <= target_whp <= 550:
        bands.append("400_550whp")

    if 450 <= target_whp <= 550:
        bands.append("450_550whp")

    if 500 <= target_whp <= 650:
        bands.append("500_650whp")

    if 550 <= target_whp <= 650:
        bands.append("550_650whp")

    if target_whp >= 650:
        bands.append("650whp_plus")

    return bands


def risk_to_score(risk: str | None, tolerance: str) -> float:
    risk = (risk or "unknown").lower()

    base = {
        "low": 1.0,
        "medium": 0.65,
        "high": 0.25,
        "unknown": 0.50,
    }.get(risk, 0.50)

    if tolerance == "high":
        return min(base + 0.20, 1.0)

    if tolerance == "low" and risk == "high":
        return 0.05

    return base


def dependency_score(row: dict) -> float:
    score = 1.0

    if row.get("requires_tune"):
        score -= 0.10

    if row.get("requires_fueling"):
        score -= 0.15

    if row.get("requires_cooling"):
        score -= 0.10

    return max(score, 0.0)


def budget_fit_score(price: float | None, budget: float) -> float:
    if price is None:
        return 0.30

    if budget <= 0:
        return 0.0

    return max(0.0, min(1.0, 1 - (price / budget)))


def category_reason(row: dict, use_case: str, power_bands: list[str]) -> str:
    category = row.get("system_category") or "unknown category"
    relevance = row.get("category_relevance") or 0.25
    fitment_scope = row.get("fitment_scope") or "unknown fitment"

    return (
        f"{category} matched {use_case} build logic for power bands "
        f"{', '.join(power_bands)}. Fitment scope: {fitment_scope}. "
        f"Category relevance: {round(float(relevance), 2)}."
    )


@router.post("/", response_model=RecommendResponse)
def recommend_build(
    request: RecommendRequest,
    db: Session = Depends(get_database),
):
    vehicle_sql = """
        SELECT
            vv.variant_id,
            vv.vehicle_id,
            vv.engine_id,
            vv.stock_hp,
            vv.stock_tq
        FROM vehicle_variants vv
        WHERE vv.variant_id = :variant_id;
    """

    if request.variant_id:
        variant = find_one(db, vehicle_sql, {"variant_id": request.variant_id})
        if not variant:
            raise HTTPException(status_code=404, detail="Vehicle variant not found")

    power_bands = get_matching_power_bands(request.target_whp)

    sql = """
        SELECT DISTINCT
            p.product_id,
            p.product_name,
            p.brand,
            p.price,
            p.system_category,
            p.subsystem,
            p.requires_tune,
            p.requires_fueling,
            p.requires_cooling,
            p.reliability_risk,
            p.emissions_risk,
            p.install_complexity,
            pf.fitment_scope,
            pf.confidence_score AS fitment_confidence,
            COALESCE(MAX(crr.relevance_score), 0.25) AS category_relevance
        FROM products p
        JOIN part_fitments pf
            ON p.product_id = pf.product_id
        LEFT JOIN category_recommendation_rules crr
            ON p.system_category = crr.system_category
            AND crr.use_case_id = :use_case
            AND crr.power_band_id = ANY(:power_bands)
        WHERE
            (
                pf.vehicle_id = :vehicle_id
                OR pf.variant_id = :variant_id
                OR pf.engine_id = :engine_id
                OR pf.fitment_scope = 'universal'
            )
            AND p.price IS NOT NULL
        GROUP BY
            p.product_id,
            p.product_name,
            p.brand,
            p.price,
            p.system_category,
            p.subsystem,
            p.requires_tune,
            p.requires_fueling,
            p.requires_cooling,
            p.reliability_risk,
            p.emissions_risk,
            p.install_complexity,
            pf.fitment_scope,
            pf.confidence_score
        ORDER BY category_relevance DESC, fitment_confidence DESC, p.price ASC;
    """

    rows = find_all(
        db,
        sql,
        {
            "vehicle_id": request.vehicle_id,
            "variant_id": request.variant_id,
            "engine_id": request.engine_id,
            "use_case": request.use_case,
            "power_bands": power_bands,
        },
    )

    scored = []

    for row in rows:
        price = float(row["price"]) if row.get("price") is not None else None

        budget_score = budget_fit_score(price, request.budget)
        fitment_score = float(row.get("fitment_confidence") or 0.30)
        category_score = float(row.get("category_relevance") or 0.25)
        reliability_score = risk_to_score(row.get("reliability_risk"), request.risk_tolerance)
        dep_score = dependency_score(row)

        recommendation_score = (
            0.25 * category_score
            + 0.15 * fitment_score
            + 0.25 * reliability_score
            + 0.15 * budget_score
            + 0.10 * dep_score
            + 0.10 * 0.70
        )

        row["recommendation_score"] = round(recommendation_score, 4)
        row["reason"] = category_reason(row, request.use_case, power_bands)
        scored.append(row)

    scored.sort(key=lambda x: x["recommendation_score"], reverse=True)

    selected = []
    total_cost = 0.0
    warnings = []

    for row in scored:
        if len(selected) >= request.max_parts:
            break

        price = float(row["price"]) if row.get("price") is not None else 0.0

        if total_cost + price <= request.budget:
            selected.append(row)
            total_cost += price

    if not selected:
        warnings.append("No parts fit within the provided budget. Try increasing budget or loosening constraints.")

    if any(p.get("requires_tune") for p in selected):
        warnings.append("One or more recommended parts may require tuning.")

    if any(p.get("requires_fueling") for p in selected):
        warnings.append("One or more recommended parts may require fueling support.")

    if any(p.get("requires_cooling") for p in selected):
        warnings.append("One or more recommended parts may require cooling support.")

    confidence_score = round(
        sum(float(p.get("recommendation_score", 0)) for p in selected) / max(len(selected), 1),
        4,
    )

    return {
        "vehicle_id": request.vehicle_id,
        "variant_id": request.variant_id,
        "engine_id": request.engine_id,
        "use_case": request.use_case,
        "target_whp": request.target_whp,
        "power_bands": power_bands,
        "budget": request.budget,
        "estimated_total_cost": round(total_cost, 2),
        "recommended_products": [
            RecommendedProduct(
                product_id=p["product_id"],
                product_name=p["product_name"],
                brand=p.get("brand"),
                price=float(p["price"]) if p.get("price") is not None else None,
                system_category=p.get("system_category"),
                subsystem=p.get("subsystem"),
                fitment_scope=p.get("fitment_scope"),
                fitment_confidence=float(p.get("fitment_confidence") or 0),
                category_relevance=float(p.get("category_relevance") or 0),
                recommendation_score=float(p["recommendation_score"]),
                reason=p["reason"],
            )
            for p in selected
        ],
        "warnings": warnings,
        "confidence_score": confidence_score,
    }