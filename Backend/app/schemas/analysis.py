from pydantic import BaseModel
from typing import List, Optional

#schemas for analysis results 

class SelectedPartsSummary(BaseModel):
    part_id: str
    part_name: str
    category: str
    price_usd: float
    hp_gain: float
    torque_gain_lbft: float
    reliability_penalty: float

class BuildScoreResult(BaseModel):
    projected_hp: float
    projected_torque_lbft: float
    projected_cost_usd: float
    projected_weight_kg: Optional[float] = None
    reliability_score: float
    objective_score: float

class BuildAnalysisResult(BaseModel):
    vehicle_id: str
    selected_parts: List[SelectedPartsSummary]
    score: BuildScoreResult
    explanation_summary: str
    warnings: List[str] = []

