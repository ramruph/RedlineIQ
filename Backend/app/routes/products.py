
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import find_all, find_one, get_database
from app.schemas import ProductDetailResponse, ProductResponse


router = APIRouter()


@router.get("/", response_model=list[ProductResponse])
def list_products(
    vehicle_id: str | None = Query(default=None),
    variant_id: str | None = Query(default=None),
    engine_id: str | None = Query(default=None),
    category: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=250),
    db: Session = Depends(get_database),
):
    sql = """
        SELECT DISTINCT
            p.product_id,
            p.product_name,
            p.brand,
            p.price,
            p.regular_price,
            p.product_url,
            p.system_category,
            p.subsystem,
            p.reliability_risk,
            p.emissions_risk,
            p.install_complexity,
            p.requires_tune,
            p.requires_fueling,
            p.requires_cooling
        FROM products p
        LEFT JOIN part_fitments pf
            ON p.product_id = pf.product_id
        WHERE
            (:category IS NULL OR p.system_category = :category)
            AND (
                (:vehicle_id IS NULL AND :variant_id IS NULL AND :engine_id IS NULL)
                OR pf.vehicle_id = :vehicle_id
                OR pf.variant_id = :variant_id
                OR pf.engine_id = :engine_id
                OR pf.fitment_scope = 'universal'
            )
        ORDER BY p.price NULLS LAST, p.product_name
        LIMIT :limit;
    """

    return find_all(
        db,
        sql,
        {
            "vehicle_id": vehicle_id,
            "variant_id": variant_id,
            "engine_id": engine_id,
            "category": category,
            "limit": limit,
        },
    )


@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_product(product_id: str, db: Session = Depends(get_database)):
    sql = """
        SELECT
            product_id,
            product_name,
            brand,
            price,
            regular_price,
            product_url,
            system_category,
            subsystem,
            reliability_risk,
            emissions_risk,
            install_complexity,
            requires_tune,
            requires_fueling,
            requires_cooling,
            description,
            specifications,
            fitment,
            combined_text
        FROM products
        WHERE product_id = :product_id;
    """

    product = find_one(db, sql, {"product_id": product_id})

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.get("/{product_id}/fitments")
def get_product_fitments(product_id: str, db: Session = Depends(get_database)):
    sql = """
        SELECT
            pf.fitment_id,
            pf.product_id,
            pf.vehicle_id,
            v.make,
            v.model,
            v.generation,
            pf.variant_id,
            vv.trim,
            pf.engine_id,
            e.engine_code,
            pf.year_start,
            pf.year_end,
            pf.fitment_scope,
            pf.fitment_notes,
            pf.confidence_score,
            pf.source
        FROM part_fitments pf
        LEFT JOIN vehicles v
            ON pf.vehicle_id = v.vehicle_id
        LEFT JOIN vehicle_variants vv
            ON pf.variant_id = vv.variant_id
        LEFT JOIN engines e
            ON pf.engine_id = e.engine_id
        WHERE pf.product_id = :product_id
        ORDER BY pf.confidence_score DESC NULLS LAST;
    """

    return find_all(db, sql, {"product_id": product_id})