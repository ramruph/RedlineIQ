from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import String, Float, Boolean, DateTime, ForeignKey, func, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class Part(Base):
    __tablename__ = "parts"

    part_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    brand: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    subcategory: Mapped[Optional[str]] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)
    price_usd: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")
    hp_gain: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    torque_gain_lbft: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    weight_delta_kg: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    reliability_penalty: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    cooling_penalty: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    install_difficulty: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    street_legal: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    tune_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    fueling_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    cooling_upgrade_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    supports_activity_tags: Mapped[Optional[str]] = mapped_column(String(120))
    source_name: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    # --- Added fields ---
    sku: Mapped[Optional[str]] = mapped_column(String(80))
    vendor_part_key: Mapped[Optional[str]] = mapped_column(String(120))
    source_product_url: Mapped[Optional[str]] = mapped_column(Text)
    source_category_raw: Mapped[Optional[str]] = mapped_column(String(120))
    source_subcategory_raw: Mapped[Optional[str]] = mapped_column(String(120))
    current_price_usd: Mapped[Optional[float]] = mapped_column(Float)
    current_regular_price_usd: Mapped[Optional[float]] = mapped_column(Float)
    current_sale_price_usd: Mapped[Optional[float]] = mapped_column(Float)
    current_discount_pct: Mapped[Optional[float]] = mapped_column(Float)
    currency_code: Mapped[Optional[str]] = mapped_column(String(10))
    in_stock: Mapped[Optional[bool]] = mapped_column(Boolean)
    is_on_sale: Mapped[Optional[bool]] = mapped_column(Boolean)
    primary_image_url: Mapped[Optional[str]] = mapped_column(Text)
    source_last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    last_price_sync_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    description_raw: Mapped[Optional[str]] = mapped_column(Text)
    features_raw: Mapped[Optional[str]] = mapped_column(Text)
    fitment_raw: Mapped[Optional[str]] = mapped_column(Text)
    specifications_raw: Mapped[Optional[str]] = mapped_column(Text)
    extraction_status: Mapped[Optional[str]] = mapped_column(String(40))
    extraction_confidence: Mapped[Optional[float]] = mapped_column(Float)
    source_hash: Mapped[Optional[str]] = mapped_column(String(64))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    fitments: Mapped[list["PartFitment"]] = relationship(back_populates="part", cascade="all, delete-orphan")
    dependencies: Mapped[list["PartDependency"]] = relationship(back_populates="part", foreign_keys="PartDependency.part_id", cascade="all, delete-orphan")
    exclusions: Mapped[list["PartExclusion"]] = relationship(back_populates="part", foreign_keys="PartExclusion.part_id", cascade="all, delete-orphan")


class PartFitment(Base):
    __tablename__ = "part_fitments"

    fitment_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    part_id: Mapped[str] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), nullable=False, index=True)
    vehicle_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vehicles.vehicle_id", ondelete="CASCADE"), index=True)
    make: Mapped[Optional[str]] = mapped_column(String(50))
    model: Mapped[Optional[str]] = mapped_column(String(80))
    generation: Mapped[Optional[str]] = mapped_column(String(50))
    chassis_code: Mapped[Optional[str]] = mapped_column(String(50))
    engine_code: Mapped[Optional[str]] = mapped_column(String(50))
    engine_family: Mapped[Optional[str]] = mapped_column(String(50))
    year_start: Mapped[Optional[int]] = mapped_column(Integer)
    year_end: Mapped[Optional[int]] = mapped_column(Integer)
    trim: Mapped[Optional[str]] = mapped_column(String(80))
    fitment_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    fitment_notes: Mapped[Optional[str]] = mapped_column(Text)
    source_name: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    part: Mapped["Part"] = relationship(back_populates="fitments")
    vehicle: Mapped[Optional["Vehicle"]] = relationship(back_populates="fitments")


class PartDependency(Base):
    __tablename__ = "part_dependencies"

    dependency_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    part_id: Mapped[str] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), nullable=False, index=True)
    depends_on_part_id: Mapped[Optional[str]] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), index=True)
    depends_on_category: Mapped[Optional[str]] = mapped_column(String(50))
    dependency_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    min_required_hp: Mapped[Optional[float]] = mapped_column(Float)
    condition_expression: Mapped[Optional[str]] = mapped_column(Text)
    dependency_notes: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    part: Mapped["Part"] = relationship(back_populates="dependencies", foreign_keys=[part_id])


class PartExclusion(Base):
    __tablename__ = "part_exclusions"

    exclusion_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    part_id: Mapped[str] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), nullable=False, index=True)
    excludes_part_id: Mapped[Optional[str]] = mapped_column(ForeignKey("parts.part_id", ondelete="CASCADE"), index=True)
    excludes_category: Mapped[Optional[str]] = mapped_column(String(50))
    exclusion_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    exclusion_reason: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    part: Mapped["Part"] = relationship(back_populates="exclusions", foreign_keys=[part_id])