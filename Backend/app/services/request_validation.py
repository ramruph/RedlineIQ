from sqlalchemy.orm import Session

from app.repositories.vehicle_repo import get_vehicle_with_specs
from app.repositories.parts_repo import get_compatible_parts

"""
This service validates business conditions:
-vehicle exists
-the DB has compatible parts for it
"""

def validate_build_request(db: Session, request) -> tuple[bool, list[str], object | None, object | None, list]:
    errors = []

    vehicle, spec = get_vehicle_with_specs(db, request.vehicle_id)
    if not vehicle:
        errors.append(f"Vehicle '{request.vehicle_id}' not found.")
        return False, errors, None, None, []

    compatible_parts = get_compatible_parts(db, request.vehicle_id)
    if not compatible_parts:
        errors.append(f"No compatible parts found for vehicle '{request.vehicle_id}'.")
        return False, errors, vehicle, spec, []

    return True, errors, vehicle, spec, compatible_parts

