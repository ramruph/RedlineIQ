from sqlalchemy import select

from app.db.sessions import SessionLocal
from app.models.vehicle import Vehicle, VehicleSpec
from app.models.part import Part, PartFitment


def main():
    db = SessionLocal()

    try:
        vehicle_id = "toyota_grsupra_a90_b58"

        vehicle = db.scalar(
            select(Vehicle).where(Vehicle.vehicle_id == vehicle_id)
        )

        spec = db.scalar(
            select(VehicleSpec).where(VehicleSpec.vehicle_id == vehicle_id)
        )

        fitments = db.scalars(
            select(Part)
            .join(PartFitment, Part.part_id == PartFitment.part_id)
            .where(PartFitment.vehicle_id == vehicle_id)
        ).all()

        print("\n=== VEHICLE ===")
        print(vehicle.make, vehicle.model, vehicle.generation, vehicle.engine_code)
        print("Base HP:", spec.base_hp)
        print("Weight KG:", spec.curb_weight_kg)

        print("\n=== COMPATIBLE PARTS ===")
        for part in fitments:
            print(
                f"{part.name} | category={part.category} | "
                f"price=${part.price_usd} | hp_gain={part.hp_gain}"
            )

    finally:
        db.close()


if __name__ == "__main__":
    main()