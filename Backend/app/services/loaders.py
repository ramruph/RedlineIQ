import csv
from pathlib import Path

from app.db.sessions import SessionLocal
from app.models.vehicle import Vehicle, VehicleSpec
from app.models.part import Part, PartFitment


def str_to_bool(value: str) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


def load_vehicles(db, filepath: str):
    with Path(filepath).open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if db.get(Vehicle, row["vehicle_id"]):
                continue

            db.add(
                Vehicle(
                    vehicle_id=row["vehicle_id"],
                    make=row["make"],
                    model=row["model"],
                    generation=row["generation"] or None,
                    chassis_code=row["chassis_code"] or None,
                    year_start=int(row["year_start"]),
                    year_end=int(row["year_end"]),
                    trim=row["trim"] or None,
                    engine_code=row["engine_code"] or None,
                    drivetrain=row["drivetrain"],
                )
            )
    db.commit()


def load_vehicle_specs(db, filepath: str):
    with Path(filepath).open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if db.get(VehicleSpec, row["vehicle_spec_id"]):
                continue

            db.add(
                VehicleSpec(
                    vehicle_spec_id=row["vehicle_spec_id"],
                    vehicle_id=row["vehicle_id"],
                    base_hp=float(row["base_hp"]),
                    base_torque_lbft=float(row["base_torque_lbft"]) if row["base_torque_lbft"] else None,
                    curb_weight_kg=float(row["curb_weight_kg"]) if row["curb_weight_kg"] else None,
                    induction_type=row["induction_type"] or None,
                )
            )
    db.commit()


def load_parts(db, filepath: str):
    with Path(filepath).open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if db.get(Part, row["part_id"]):
                continue

            db.add(
                Part(
                    part_id=row["part_id"],
                    brand=row["brand"],
                    name=row["name"],
                    category=row["category"],
                    price_usd=float(row["price_usd"]),
                    hp_gain=float(row["hp_gain"]),
                    torque_gain_lbft=float(row["torque_gain_lbft"]),
                    weight_delta_kg=float(row["weight_delta_kg"]),
                    reliability_penalty=float(row["reliability_penalty"]),
                    street_legal=str_to_bool(row["street_legal"]),
                )
            )
    db.commit()


def load_fitments(db, filepath: str):
    with Path(filepath).open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if db.get(PartFitment, row["fitment_id"]):
                continue

            db.add(
                PartFitment(
                    fitment_id=row["fitment_id"],
                    part_id=row["part_id"],
                    vehicle_id=row["vehicle_id"] or None,
                    fitment_type=row["fitment_type"],
                    fitment_notes=row["fitment_notes"] or None,
                )
            )
    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        load_vehicles(db, "app/data/vehicles.csv")
        load_vehicle_specs(db, "app/data/vehicles_specs.csv")
        load_parts(db, "app/data/parts.csv")
        load_fitments(db, "app/data/parts_fitment.csv")
        print("CSV data loaded successfully.")
    finally:
        db.close()