# backend/app/routes/analytics.py

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import find_all, find_one, get_database
from app.schemas import AnalyticsSummaryResponse


router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def analytics_summary(db: Session = Depends(get_database)):
    counts_sql = """
        SELECT
            (SELECT COUNT(*) FROM products) AS product_count,
            (SELECT COUNT(*) FROM vehicles) AS vehicle_count,
            (SELECT COUNT(*) FROM vehicle_variants) AS variant_count,
            (SELECT COUNT(*) FROM forum_evidence) AS evidence_count,
            (SELECT COUNT(*) FROM hpacademy_chunks) AS hpacademy_chunk_count,
            (SELECT COUNT(*) FROM product_evidence_chunks) AS product_chunk_count;
    """

    category_sql = """
        SELECT
            system_category,
            COUNT(*) AS product_count,
            ROUND(AVG(price)::NUMERIC, 2) AS avg_price
        FROM products
        GROUP BY system_category
        ORDER BY product_count DESC;
    """

    counts = find_one(db, counts_sql)
    category_counts = find_all(db, category_sql)

    return {
        **counts,
        "category_counts": category_counts,
    }


@router.get("/fitments")
def fitment_summary(db: Session = Depends(get_database)):
    sql = """
        SELECT
            fitment_scope,
            COUNT(*) AS fitment_count,
            ROUND(AVG(confidence_score)::NUMERIC, 3) AS avg_confidence
        FROM part_fitments
        GROUP BY fitment_scope
        ORDER BY fitment_count DESC;
    """

    return find_all(db, sql)


@router.get("/recommendation-rules")
def recommendation_rules_summary(db: Session = Depends(get_database)):
    sql = """
        SELECT
            system_category,
            use_case_id,
            power_band_id,
            relevance_score
        FROM category_recommendation_rules
        ORDER BY system_category, use_case_id, power_band_id;
    """

    return find_all(db, sql)