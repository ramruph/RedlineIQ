from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.source import DataSource, KnowledgeDocument, PartPriceEvent


def list_data_sources(db: Session, source_type: str | None = None, limit: int = 100):
    stmt = select(DataSource).order_by(DataSource.ingested_at.desc()).limit(limit)
    if source_type:
        stmt = stmt.where(DataSource.source_type == source_type)
    return db.scalars(stmt).all()


def search_knowledge_documents(db: Session, query: str, document_type: str | None = None, limit: int = 25):
    stmt = select(KnowledgeDocument).where(KnowledgeDocument.text.ilike(f"%{query}%")).limit(limit)
    if document_type:
        stmt = stmt.where(KnowledgeDocument.document_type == document_type)
    return db.scalars(stmt).all()


def get_price_history(db: Session, part_id: str):
    return db.scalars(
        select(PartPriceEvent)
        .where(PartPriceEvent.part_id == part_id)
        .order_by(PartPriceEvent.observed_at.desc())
    ).all()
