from app.db.sessions import SessionLocal
from app.repositories.vehicle_repo import get_vehicle_with_specs
from app.repositories.parts_repo import get_compatible_parts
from app.schemas.build import BuildRequest
from app.engine.aggregate import run_build_analysis


def main():
    db = SessionLocal()
    try:
        request = BuildRequest(
            vehicle_id="toyota_grsupra_a90_b58",
            target_hp=550,
            max_budget_usd=10000,
            activity_type="Street",
            reliability_floor=70.0,
            require_street_legal=True,
        )

        vehicle, spec = get_vehicle_with_specs(db, request.vehicle_id)
        parts = get_compatible_parts(db, request.vehicle_id)

        result = run_build_analysis(vehicle, spec, parts, request)

        from pprint import pprint
        pprint(result)

    finally:
        db.close()


if __name__ == "__main__":
    main()

    