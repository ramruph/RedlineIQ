from pydantic import BaseModel, Field
from typing import Literal, Optional

class BuildRequest(BaseModel):
    vehicle_id: str
    target_hp: Optional[float] = None
    max_budget_usd: float = Field(..., gt=0)
    activity_type: Literal['Street','Drag','Time Attack','Circuit', 'Rally', 'Drift']
    reliability_floor: float = Field(default=0.0, ge=0.0, le=100.0)
    require_street_legal: bool = True

    