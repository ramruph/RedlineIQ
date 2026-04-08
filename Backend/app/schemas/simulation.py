from pydantic import BaseModel
from typing import Optional

"""
Dedicated Object for simulation output

- the simulation layer should return one clear object
- frontend will later consume this directly
- can test it independently

"""

class SimulationResult(BaseModel):
    projected_hp: float
    projected_torque_lbft: float
    projected_weight_kg: Optional[float] = None
    hp_to_kg: Optional[float] = None
    estimated_0_60_sec: Optional[float] = None
    estimated_quarter_mile_sec: Optional[float] = None
    estimated_top_speed_mph: Optional[float]= None

