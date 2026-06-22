from pydantic import BaseModel, Field
from typing import Any, Literal



class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class VehicleResponse(BaseModel):
    vehicle_id: str
    make: str
    model: str
    generation: str | None = None
    platform_code: str | None = None
    year_start: int | None = None
    year_end: int | None = None
    body_style: str | None = None
    market: str | None = None


class VehicleVariantResponse(BaseModel):
    variant_id: str
    vehicle_id: str
    engine_id: str | None = None
    trim: str | None = None
    year_start: int | None = None
    year_end: int | None = None
    drivetrain: str | None = None
    transmission: str | None = None
    stock_hp: float | None = None
    stock_tq: float | None = None
    curb_weight_lbs: float | None = None


class ProductResponse(BaseModel):
    product_id: str
    product_name: str
    brand: str | None = None
    price: float | None = None
    regular_price: float | None = None
    product_url: str | None = None
    system_category: str | None = None
    subsystem: str | None = None
    reliability_risk: str | None = None
    emissions_risk: str | None = None
    install_complexity: str | None = None
    requires_tune: bool | None = None
    requires_fueling: bool | None = None
    requires_cooling: bool | None = None


class ProductDetailResponse(ProductResponse):
    description: str | None = None
    specifications: str | None = None
    fitment: str | None = None
    combined_text: str | None = None


class RecommendRequest(BaseModel):
    vehicle_id: str = Field(default="toyota_gr_supra_a90")
    variant_id: str | None = Field(default="toyota_gr_supra_3_0_auto_2024_2025")
    engine_id: str | None = Field(default="bmw_b58")
    use_case: Literal["street", "drag", "track", "time_attack"] = "street"
    target_whp: float = Field(default=550, ge=250, le=1200)
    budget: float = Field(default=8000, ge=0)
    risk_tolerance: Literal["low", "medium", "high"] = "medium"
    max_parts: int = Field(default=8, ge=1, le=25)


class RecommendedProduct(BaseModel):
    product_id: str
    product_name: str
    brand: str | None = None
    price: float | None = None
    system_category: str | None = None
    subsystem: str | None = None
    fitment_scope: str | None = None
    fitment_confidence: float | None = None
    category_relevance: float | None = None
    recommendation_score: float
    reason: str


class RecommendResponse(BaseModel):
    vehicle_id: str
    variant_id: str | None = None
    engine_id: str | None = None
    use_case: str
    target_whp: float
    power_bands: list[str]
    budget: float
    estimated_total_cost: float
    recommended_products: list[RecommendedProduct]
    warnings: list[str]
    confidence_score: float


class EvidenceResponse(BaseModel):
    evidence_id: str
    vehicle_id: str | None = None
    variant_id: str | None = None
    source_dataset: str | None = None
    evidence_type: str | None = None
    author: str | None = None
    created_at: str | None = None
    cleaned_content: str | None = None
    mentioned_categories: str | None = None
    lap_time_seconds: float | None = None
    track_name: str | None = None
    evidence_quality_score: float | None = None


class RagSearchRequest(BaseModel):
    question: str
    vehicle_id: str | None = "toyota_gr_supra_a90"
    variant_id: str | None = "toyota_gr_supra_a90_3_0_auto_2024_2025"
    top_k: int = Field(default=5, ge=1, le=20)


class RagSearchResult(BaseModel):
    source_table: str
    source_id: str | None = None
    title: str | None = None
    chunk_text: str
    score: float | None = None
    metadata: dict[str, Any] | None = None


class AnalyticsSummaryResponse(BaseModel):
    product_count: int
    vehicle_count: int
    variant_count: int
    evidence_count: int
    hpacademy_chunk_count: int
    product_chunk_count: int
    category_counts: list[dict[str, Any]]


class RagAnswerRequest(BaseModel):
    question: str
    vehicle_id: str | None = "toyota_gr_supra_a90"
    variant_id: str | None = "toyota_gr_supra_a90_3_0_auto_2024_2025"
    top_k: int = Field(default=5, ge=1, le=20)


class BuildExplanationRequest(BaseModel):
    vehicle_id: str
    variant_id: str | None = None
    use_case: str
    target_whp: float
    budget: float
    estimated_total_cost: float | None = None
    recommended_products: list[dict]
    top_k: int = Field(default=8, ge=1, le=20)