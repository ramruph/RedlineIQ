from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class DataSource(Base):
    """Tracks every raw file / scrape / course transcript batch loaded into RedlineIQ."""

    __tablename__ = "data_sources"

    source_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    source_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)  # parts, vehicle_specs, forum, course
    source_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    file_path: Mapped[Optional[str]] = mapped_column(Text)
    file_hash: Mapped[Optional[str]] = mapped_column(String(64), index=True)
    rows_loaded: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="loaded")
    notes: Mapped[Optional[str]] = mapped_column(Text)
    ingested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    documents: Mapped[list["KnowledgeDocument"]] = relationship(back_populates="source", cascade="all, delete-orphan")


class RawIngestRecord(Base):
    """JSON-like raw row storage so you never lose the original scraped/uploaded values."""

    __tablename__ = "raw_ingest_records"

    raw_record_id: Mapped[str] = mapped_column(String(140), primary_key=True)
    source_id: Mapped[str] = mapped_column(ForeignKey("data_sources.source_id", ondelete="CASCADE"), nullable=False, index=True)
    record_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    natural_key: Mapped[Optional[str]] = mapped_column(String(220), index=True)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    source_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    processed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("source_id", "source_hash", name="uq_raw_source_hash"),)


class KnowledgeDocument(Base):
    """Forum posts, course transcript chunks, manuals, and notes for future RAG/LLM extraction."""

    __tablename__ = "knowledge_documents"

    document_id: Mapped[str] = mapped_column(String(140), primary_key=True)
    source_id: Mapped[Optional[str]] = mapped_column(ForeignKey("data_sources.source_id", ondelete="SET NULL"), index=True)
    document_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)  # forum_post, course_transcript, manual, note
    title: Mapped[Optional[str]] = mapped_column(String(240), index=True)
    author: Mapped[Optional[str]] = mapped_column(String(120), index=True)
    vehicle_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vehicles.vehicle_id", ondelete="SET NULL"), index=True)
    url: Mapped[Optional[str]] = mapped_column(Text)
    posted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), index=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    extraction_status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending")
    extraction_confidence: Mapped[Optional[float]] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    source: Mapped[Optional[DataSource]] = relationship(back_populates="documents")
    chunks: Mapped[list["KnowledgeChunk"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class KnowledgeChunk(Base):
    """Chunked text for embeddings/RAG and LLM structured extraction."""

    __tablename__ = "knowledge_chunks"

    chunk_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    document_id: Mapped[str] = mapped_column(ForeignKey("knowledge_documents.document_id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    token_estimate: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    embedding_model: Mapped[Optional[str]] = mapped_column(String(120))
    embedding_vector_id: Mapped[Optional[str]] = mapped_column(String(160))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    document: Mapped[KnowledgeDocument] = relationship(back_populates="chunks")


class ExtractedClaim(Base):
    """Structured facts extracted from forum/course text: dyno result, part route, reliability issue, lap time, etc."""

    __tablename__ = "extracted_claims"

    claim_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    document_id: Mapped[Optional[str]] = mapped_column(ForeignKey("knowledge_documents.document_id", ondelete="SET NULL"), index=True)
    chunk_id: Mapped[Optional[str]] = mapped_column(ForeignKey("knowledge_chunks.chunk_id", ondelete="SET NULL"), index=True)
    vehicle_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vehicles.vehicle_id", ondelete="SET NULL"), index=True)
    claim_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    subject: Mapped[Optional[str]] = mapped_column(String(180), index=True)
    value_numeric: Mapped[Optional[float]] = mapped_column(Float)
    unit: Mapped[Optional[str]] = mapped_column(String(40))
    claim_text: Mapped[str] = mapped_column(Text, nullable=False)
    parts_mentioned: Mapped[Optional[str]] = mapped_column(Text)
    fuel_type: Mapped[Optional[str]] = mapped_column(String(60))
    boost_psi: Mapped[Optional[float]] = mapped_column(Float)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    extractor_name: Mapped[Optional[str]] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PartPriceEvent(Base):
    """Historical price tracking for scraped catalog updates."""

    __tablename__ = "part_price_events"

    price_event_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    part_id: Mapped[str] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), nullable=False, index=True)
    source_id: Mapped[Optional[str]] = mapped_column(ForeignKey("data_sources.source_id", ondelete="SET NULL"), index=True)
    price_usd: Mapped[Optional[float]] = mapped_column(Float)
    regular_price_usd: Mapped[Optional[float]] = mapped_column(Float)
    sale_price_usd: Mapped[Optional[float]] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")
    in_stock: Mapped[Optional[bool]] = mapped_column(Boolean)
    product_url: Mapped[Optional[str]] = mapped_column(Text)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    source_hash: Mapped[Optional[str]] = mapped_column(String(64), index=True)


class MLObservation(Base):
    """Model-ready supervised examples built from vehicle specs, part sets, and extracted claims."""

    __tablename__ = "ml_observations"

    observation_id: Mapped[str] = mapped_column(String(160), primary_key=True)
    vehicle_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vehicles.vehicle_id", ondelete="SET NULL"), index=True)
    target_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)  # whp, crank_hp, tq, lap_time, reliability
    target_value: Mapped[Optional[float]] = mapped_column(Float)
    target_unit: Mapped[Optional[str]] = mapped_column(String(40))
    feature_json: Mapped[str] = mapped_column(Text, nullable=False)
    label_source: Mapped[str] = mapped_column(String(80), nullable=False, default="derived")
    source_claim_id: Mapped[Optional[str]] = mapped_column(ForeignKey("extracted_claims.claim_id", ondelete="SET NULL"), index=True)
    quality_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
