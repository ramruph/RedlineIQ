# backend/app/routes/vehicles.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import find_all, find_one, get_database
from app.schemas import VehicleResponse, VehicleVariantResponse


router = APIRouter()


@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(db: Session = Depends(get_database)):
    sql = """
        SELECT
            vehicle_id,
            make,
            model,
            generation,
            platform_code,
            year_start,
            year_end,
            body_style,
            market
        FROM vehicles
        ORDER BY make, model, generation;
    """
    return find_all(db, sql)


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: str, db: Session = Depends(get_database)):
    sql = """
        SELECT
            vehicle_id,
            make,
            model,
            generation,
            platform_code,
            year_start,
            year_end,
            body_style,
            market
        FROM vehicles
        WHERE vehicle_id = :vehicle_id;
    """
    vehicle = find_one(db, sql, {"vehicle_id": vehicle_id})

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle


@router.get("/{vehicle_id}/variants", response_model=list[VehicleVariantResponse])
def list_vehicle_variants(vehicle_id: str, db: Session = Depends(get_database)):
    sql = """
        SELECT
            variant_id,
            vehicle_id,
            engine_id,
            trim,
            year_start,
            year_end,
            drivetrain,
            transmission,
            stock_hp,
            stock_tq,
            curb_weight_lbs
        FROM vehicle_variants
        WHERE vehicle_id = :vehicle_id
        ORDER BY year_start, trim;
    """
    return find_all(db, sql, {"vehicle_id": vehicle_id})