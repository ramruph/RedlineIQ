from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle, VehicleSpec


def get_vehicle_with_specs(db: Session, vehicle_id: str):
    vehicle = db.scalar(
        select(Vehicle).where(Vehicle.vehicle_id == vehicle_id)
    )
    if not vehicle:
        return None, None
    
    spec = db.scalar(
        select(VehicleSpec).where(VehicleSpec.vehicle_id == vehicle_id)
    )
    return vehicle, spec

