from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.part import Part, PartFitment
from app.models.source import ExtractedClaim, MLObservation
from app.models.vehicle import Vehicle, VehicleSpec
from app.pipelines.utils import stable_id


def build_vehicle_part_training_view(db: Session) -> pd.DataFrame:
    rows = []
    fitments = db.execute(select(PartFitment, Part, Vehicle).join(Part, PartFitment.part_id == Part.part_id).join(Vehicle, PartFitment.vehicle_id == Vehicle.vehicle_id, isouter=True)).all()
    specs_by_vehicle = {s.vehicle_id: s for s in db.scalars(select(VehicleSpec)).all()}
    for fit, part, vehicle in fitments:
        spec = specs_by_vehicle.get(fit.vehicle_id) if fit.vehicle_id else None
        base_hp = spec.base_hp if spec else None
        rows.append({
            "vehicle_id": fit.vehicle_id,
            "make": vehicle.make if vehicle else None,
            "model": vehicle.model if vehicle else None,
            "generation": vehicle.generation if vehicle else None,
            "chassis_code": vehicle.chassis_code if vehicle else None,
            "engine_code": vehicle.engine_code if vehicle else None,
            "engine_family": vehicle.engine_family if vehicle else None,
            "drivetrain": vehicle.drivetrain if vehicle else None,
            "base_hp": base_hp,
            "base_torque_lbft": spec.base_torque_lbft if spec else None,
            "curb_weight_kg": spec.curb_weight_kg if spec else None,
            "part_id": part.part_id,
            "brand": part.brand,
            "part_name": part.name,
            "category": part.category,
            "subcategory": part.subcategory,
            "price_usd": part.current_price_usd or part.price_usd,
            "hp_gain": part.hp_gain,
            "torque_gain_lbft": part.torque_gain_lbft,
            "weight_delta_kg": part.weight_delta_kg,
            "reliability_penalty": part.reliability_penalty,
            "tune_required": part.tune_required,
            "fueling_required": part.fueling_required,
            "cooling_upgrade_required": part.cooling_upgrade_required,
            "projected_hp_simple": (base_hp or 0) + (part.hp_gain or 0),
        })
    return pd.DataFrame(rows)


def materialize_claim_observations(db: Session) -> int:
    count = 0
    claims = db.scalars(select(ExtractedClaim).where(ExtractedClaim.value_numeric.is_not(None))).all()
    for claim in claims:
        obs_id = stable_id("obs", claim.claim_id, claim.claim_type, claim.value_numeric)
        if db.get(MLObservation, obs_id):
            continue
        features = {
            "subject": claim.subject,
            "parts_mentioned": claim.parts_mentioned,
            "fuel_type": claim.fuel_type,
            "boost_psi": claim.boost_psi,
            "claim_text": claim.claim_text,
        }
        db.add(MLObservation(
            observation_id=obs_id,
            vehicle_id=claim.vehicle_id,
            target_type=claim.claim_type,
            target_value=claim.value_numeric,
            target_unit=claim.unit,
            feature_json=json.dumps(features, sort_keys=True),
            label_source="extracted_claim",
            source_claim_id=claim.claim_id,
            quality_score=claim.confidence_score,
        ))
        count += 1
    db.commit()
    return count


def export_ml_datasets(db: Session, out_dir: str | Path = "app/data/processed") -> dict[str, str]:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    paths = {}
    df = build_vehicle_part_training_view(db)
    csv_path = out / "vehicle_part_training_view.csv"
    parquet_path = out / "vehicle_part_training_view.parquet"
    df.to_csv(csv_path, index=False)
    try:
        df.to_parquet(parquet_path, index=False)
        paths["vehicle_part_training_view_parquet"] = str(parquet_path)
    except Exception:
        pass
    paths["vehicle_part_training_view_csv"] = str(csv_path)
    return paths
