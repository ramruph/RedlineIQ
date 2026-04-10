"""
This endpoint helps debug the scoring engine separately from the optimizer 
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.sessions import get_db
from app.schemas.build import BuildRequest
from app.services.request_validation import validate_build_request
from app.engine.features import build_feature_snapshot
from app.engine.scoring import score_build

router = APIRouter(prefix="/score-build", tags=["scoring"])


@router.post("")
def score_build_endpoint(request: BuildRequest, db: Session = Depends(get_db)):
    is_valid, errors, vehicle, spec, compatible_parts = validate_build_request(db, request)

    if not is_valid:
        return {
            "is_valid": False,
            "errors": errors,
        }

    # simple debug behavior: score all compatible parts together
    snapshot = build_feature_snapshot(vehicle, spec, compatible_parts)
    score = score_build(snapshot, request)

    return {
        "is_valid": True,
        "vehicle_id": vehicle.vehicle_id,
        "compatible_part_count": len(compatible_parts),
        "score": score,
    }