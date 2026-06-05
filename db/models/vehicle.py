from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, func, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    vehicle_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    make: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    generation: Mapped[Optional[str]] = mapped_column(String(50))
    chassis_code: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    platform_code: Mapped[Optional[str]] = mapped_column(String(50))
    year_start: Mapped[int] = mapped_column(Integer, nullable=False)
    year_end: Mapped[int] = mapped_column(Integer, nullable=False)
    trim: Mapped[Optional[str]] = mapped_column(String(80))
    engine_code: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    engine_family: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    drivetrain: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    body_style: Mapped[Optional[str]] = mapped_column(String(50))
    transmission_options: Mapped[Optional[str]] = mapped_column(String(120))
    market_region: Mapped[Optional[str]] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    specs: Mapped[list["VehicleSpec"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")
    fitments: Mapped[list["PartFitment"]] = relationship(back_populates="vehicle")


class VehicleSpec(Base):
    __tablename__ = "vehicle_specs"

    vehicle_spec_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.vehicle_id", ondelete="CASCADE"), nullable=False, index=True)

    base_hp: Mapped[float] = mapped_column(Float, nullable=False)
    base_torque_lbft: Mapped[Optional[float]] = mapped_column(Float)
    curb_weight_kg: Mapped[Optional[float]] = mapped_column(Float)
    weight_distribution_f: Mapped[Optional[float]] = mapped_column(Float)
    wheelbase_mm: Mapped[Optional[float]] = mapped_column(Float)
    length_mm: Mapped[Optional[float]] = mapped_column(Float)
    width_mm: Mapped[Optional[float]] = mapped_column(Float)
    height_mm: Mapped[Optional[float]] = mapped_column(Float)
    fuel_type: Mapped[Optional[str]] = mapped_column(String(40))
    induction_type: Mapped[Optional[str]] = mapped_column(String(40))
    displacement_l: Mapped[Optional[float]] = mapped_column(Float)
    cylinders: Mapped[Optional[int]] = mapped_column(Integer)
    redline_rpm: Mapped[Optional[int]] = mapped_column(Integer)
    drag_coefficient: Mapped[Optional[float]] = mapped_column(Float)
    frontal_area_m2: Mapped[Optional[float]] = mapped_column(Float)
    stock_top_speed_mph: Mapped[Optional[float]] = mapped_column(Float)
    stock_0_60_sec: Mapped[Optional[float]] = mapped_column(Float)
    stock_quarter_mile_sec: Mapped[Optional[float]] = mapped_column(Float)
    source_name: Mapped[Optional[str]] = mapped_column(String(100))
    source_url: Mapped[Optional[str]] = mapped_column(Text)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    vehicle: Mapped["Vehicle"] = relationship(back_populates="specs")