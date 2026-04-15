export type ActivityType =
  | "STREET"
  | "DRAG"
  | "CIRCUIT"
  | "TIME_ATTACK"
  | "DRIFT";

export interface AnalyzeBuildRequest {
  vehicle_id: string;
  target_hp?: number | null;
  max_budget_usd: number;
  activity_type: ActivityType;
  reliability_floor: number;
  require_street_legal: boolean;
}

export interface SelectedPartSummary {
  part_id: string;
  name: string;
  category: string;
  price_usd: number;
  hp_gain: number;
  torque_gain_lbft: number;
  reliability_penalty: number;
}

export interface BuildScoreResult {
  projected_hp: number;
  projected_torque_lbft: number;
  projected_cost_usd: number;
  projected_weight_kg?: number | null;
  reliability_score: number;
  objective_score: number;
}

export interface SimulationResult {
  projected_hp: number;
  projected_torque_lbft: number;
  projected_weight_kg?: number | null;
  hp_per_kg?: number | null;
  estimated_0_60_sec?: number | null;
  estimated_quarter_mile_sec?: number | null;
  estimated_top_speed_mph?: number | null;
}

export interface TradeoffResult {
  strengths: string[];
  weaknesses: string[];
  warnings: string[];
}

export interface BuildAnalysisResult {
  vehicle_id: string;
  selected_parts: SelectedPartSummary[];
  score: BuildScoreResult;
  simulation: SimulationResult;
  tradeoffs: TradeoffResult;
  explanation_summary: string;
  warnings: string[];
}

