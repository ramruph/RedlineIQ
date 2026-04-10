from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.sessions import get_db
from app.schemas.build import BuildRequest
from app.services.request_validation import validate_build_request

router = APIRouter(prefix="/validate-build", tags=['validation'])

@router.post("/")
def validate_build(request: BuildRequest, db: Session = Depends(get_db)):
    is_valid, errors, vehicle, spec, compatible_parts = validate_build_request(db, request)
    
    return {
        "is_valid": is_valid, 
        "errors": errors, 
        "vehicle": vehicle.make_model if vehicle else None,
        "compatible_part_count" : len(compatible_parts)
    }

