"""
endpoint is the one your frontend should eventually call.
It exposes the full intelligence chain in one request.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.sessions import get_db
from app.schemas.build import BuildRequest
from app.schemas.analysis import BuildAnalysisResult
from app.services.request_validation import validate_build_request
from app.engine.aggregate import run_build_analysis

router = APIRouter(prefix="/analyze-build", tags=["analysis"])


@router.post("", response_model=BuildAnalysisResult)
def analyze_build(request: BuildRequest, db: Session = Depends(get_db)):
    is_valid, errors, vehicle, spec, compatible_parts = validate_build_request(db, request)

    if not is_valid:
        raise HTTPException(status_code=400, detail=errors)

    result = run_build_analysis(vehicle, spec, compatible_parts, request, db)

    if not result:
        raise HTTPException(
            status_code=422,
            detail="No valid build could be generated under the current constraints."
        )

    return result