export type UseCase = 'street' | 'drag' | 'track' | 'time_attack';
export type RiskTolerance = 'low' | 'medium' | 'high';

export interface Vehicle {
  vehicle_id: string;
  make: string;
  model: string;
  generation?: string | null;
  platform_code?: string | null;
  year_start?: number | null;
  year_end?: number | null;
  body_style?: string | null;
  market?: string | null;
}

export interface VehicleVariant {
  variant_id: string;
  vehicle_id: string;
  engine_id?: string | null;
  trim?: string | null;
  year_start?: number | null;
  year_end?: number | null;
  drivetrain?: string | null;
  transmission?: string | null;
  stock_hp?: number | null;
  stock_tq?: number | null;
  curb_weight_lbs?: number | null;
}

export interface Product {
  product_id: string;
  product_name: string;
  brand?: string | null;
  price?: number | null;
  regular_price?: number | null;
  product_url?: string | null;
  system_category?: string | null;
  subsystem?: string | null;
  reliability_risk?: string | null;
  emissions_risk?: string | null;
  install_complexity?: string | null;
  requires_tune?: boolean | null;
  requires_fueling?: boolean | null;
  requires_cooling?: boolean | null;
}

export interface RecommendRequest {
  vehicle_id: string;
  variant_id?: string | null;
  engine_id?: string | null;
  use_case: UseCase;
  target_whp: number;
  budget: number;
  risk_tolerance: RiskTolerance;
  max_parts: number;
}

export interface RecommendedProduct {
  product_id: string;
  product_name: string;
  brand?: string | null;
  price?: number | null;
  system_category?: string | null;
  subsystem?: string | null;
  fitment_scope?: string | null;
  fitment_confidence?: number | null;
  category_relevance?: number | null;
  recommendation_score: number;
  reason: string;
}

export interface RecommendResponse {
  vehicle_id: string;
  variant_id?: string | null;
  engine_id?: string | null;
  use_case: string;
  target_whp: number;
  power_bands: string[];
  budget: number;
  estimated_total_cost: number;
  recommended_products: RecommendedProduct[];
  warnings: string[];
  confidence_score: number;
}

export interface EvidenceItem {
  evidence_id: string;
  vehicle_id?: string | null;
  variant_id?: string | null;
  source_dataset?: string | null;
  evidence_type?: string | null;
  author?: string | null;
  created_at?: string | null;
  cleaned_content?: string | null;
  mentioned_categories?: string | null;
  lap_time_seconds?: number | null;
  track_name?: string | null;
  evidence_quality_score?: number | null;
}

export interface AnalyticsSummary {
  product_count: number;
  vehicle_count: number;
  variant_count: number;
  evidence_count: number;
  hpacademy_chunk_count: number;
  product_chunk_count: number;
  category_counts: Array<{
    system_category: string | null;
    product_count: number;
    avg_price?: number | null;
  }>;
}

export interface RetrievedChunk {
  chunk_id: string;
  source_table?: string | null;
  source_id?: string | null;
  vehicle_id?: string | null;
  variant_id?: string | null;
  product_id?: string | null;
  source_type?: string | null;
  title?: string | null;
  chunk_text?: string | null;
  metadata?: Record<string, unknown> | null;
  distance?: number | null;
}

export interface BuildExplanationRequest {
  vehicle_id: string;
  variant_id?: string | null;
  use_case: string;
  target_whp: number;
  budget: number;
  estimated_total_cost?: number | null;
  recommended_products: RecommendedProduct[];
  top_k: number;
}

export interface BuildExplanationResponse {
  run_id?: string | null;
  question?: string | null;
  answer: string;
  provider?: string | null;
  model?: string | null;
  latency_ms?: number | null;
  retrieved_chunks: RetrievedChunk[];
}

export interface VehicleRequestPayload {
  email: string;
  make: string;
  model: string;
  generation?: string;
  year_range?: string;
  engine?: string;
  use_case?: string;
  why?: string;
  source?: string;
}

export interface BuildSubmissionPayload {
  email: string;
  car: string;
  engine?: string;
  transmission?: string;
  current_power?: string;
  goal_power?: string;
  budget?: string;
  use_case?: string;
  current_mods?: string;
  pain_point?: string;
  contact_ok?: boolean;
  source?: string;
}

export interface LeadPayload {
  email: string;
  interest_area?: string;
  message?: string;
  source?: string;
}