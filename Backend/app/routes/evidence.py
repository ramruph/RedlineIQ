from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import find_all, get_database
from app.schemas import EvidenceResponse


router = APIRouter()


@router.get("/", response_model=list[EvidenceResponse])
def list_evidence(
    vehicle_id: str | None = Query(default="toyota_gr_supra_a90"),
    variant_id: str | None = Query(default=None),
    evidence_type: str | None = Query(default=None),
    category: str | None = Query(default=None),
    min_quality: float = Query(default=0, ge=0, le=100),
    limit: int = Query(default=50, ge=1, le=250),
    db: Session = Depends(get_database),
):
    sql = """
        SELECT
            evidence_id,
            vehicle_id,
            variant_id,
            source_dataset,
            evidence_type,
            author,
            created_at::TEXT AS created_at,
            LEFT(cleaned_content, 1000) AS cleaned_content,
            mentioned_categories,
            lap_time_seconds,
            track_name,
            evidence_quality_score
        FROM forum_evidence
        WHERE
            (:vehicle_id IS NULL OR vehicle_id = :vehicle_id)
            AND (:variant_id IS NULL OR variant_id = :variant_id)
            AND (:evidence_type IS NULL OR evidence_type = :evidence_type)
            AND (:category IS NULL OR mentioned_categories ILIKE '%' || :category || '%')
            AND COALESCE(evidence_quality_score, 0) >= :min_quality
        ORDER BY evidence_quality_score DESC NULLS LAST, created_at DESC NULLS LAST
        LIMIT :limit;
    """

    return find_all(
        db,
        sql,
        {
            "vehicle_id": vehicle_id,
            "variant_id": variant_id,
            "evidence_type": evidence_type,
            "category": category,
            "min_quality": min_quality,
            "limit": limit,
        },
    )