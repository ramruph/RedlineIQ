from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.part import Part, PartFitment, PartDependency, PartExclusion

def get_compatible_parts(db: Session, vehicle_id: str):
    return db.scalars(
        select(Part)
        .join(PartFitment, Part.part_id == PartFitment.part_id)
        .where(PartFitment.vehicle_id == vehicle_id)
        .where(Part.is_active == True)).all()


def get_dependencies_for_part_ids(db: Session, part_ids: list[str]):
    if not part_ids:
        return []
    return db.scalars(
        select(PartDependency).where(PartDependency.part_id.in_(part_ids))
    ).all()


def get_exclusions_for_part_ids(db: Session, part_ids: list[str]):
    if not part_ids:
        return []
    return db.scalars(
        select(PartExclusion).where(PartExclusion.part_id.in_(part_ids))
    ).all()

def get_parts_by_ids(db: Session, parts_id: list[str]):
    if not parts_id:
        return []
    return db.scalars(
        select(Part).where(Part.part_id.in_(parts_id))).all()


