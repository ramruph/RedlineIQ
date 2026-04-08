from app.schemas.simulation import SimulationResult

"""
- one place for performance estimation
- deterministic behavior
- easy testing
easy future replacement with ML

Future:
- keep weight computation rule-based
- replace 0–60 estimate with ML model
- replace top speed estimate with more realistic physics
"""

#clamping - restricting values to a certain range
def clamp(value: float, minimum: float, maximum: float):
    return max(minimum, min(value, maximum))

def compute_projected_hp(base_hp: float, total_hp_gain: float) -> float:
    return base_hp + total_hp_gain


def compute_projected_torque(base_torque_lbft: float, total_torque_gain: float) -> float:
    return base_torque_lbft + total_torque_gain


def compute_projected_weight(base_weight_kg: float | None, total_weight_delta: float) -> float | None:
    if base_weight_kg is None:
        return None
    return base_weight_kg + total_weight_delta


def compute_hp_per_kg(projected_hp: float, projected_weight_kg: float | None) -> float | None:
    if projected_weight_kg is None or projected_weight_kg <= 0:
        return None
    return projected_hp / projected_weight_kg

def estimate_0_60(projected_hp: float, projected_weight_kg: float | None, drivetrain: str) -> float | None:
    if projected_weight_kg is None or projected_hp <= 0:
        return None

    base = (projected_weight_kg / projected_hp) * 5.2

    drivetrain_adjustment = {
        "AWD": -0.35,
        "4WD": -0.35,
        "RWD": 0.0,
        "FWD": 0.2,
    }.get(drivetrain, 0.0)

    result = base + drivetrain_adjustment
    return round(clamp(result, 2.0, 12.0), 2)


def estimate_quarter_mile(projected_hp: float, projected_weight_kg: float | None) -> float | None:
    if projected_weight_kg is None or projected_hp <= 0:
        return None

    result = (projected_weight_kg / projected_hp) * 8.8
    return round(clamp(result, 8.5, 20.0), 2)



def estimate_top_speed(base_hp: float,projected_hp: float,stock_top_speed_mph: float | None) -> float | None:
    if projected_hp <= 0:
        return None

    if stock_top_speed_mph is not None and base_hp > 0:
        hp_ratio = projected_hp / base_hp
        result = stock_top_speed_mph * (hp_ratio ** 0.18)
        return round(clamp(result, 80.0, 260.0), 1)

    fallback = 120 + (projected_hp * 0.08)
    return round(clamp(fallback, 80.0, 260.0), 1)



def run_simulation(vehicle, spec, snapshot: dict) -> dict:
    base_hp = snapshot["base_hp"]
    base_torque = snapshot["base_torque_lbft"]
    base_weight = snapshot["base_weight_kg"]

    projected_hp = compute_projected_hp(base_hp, snapshot["total_hp_gain"])
    projected_torque = compute_projected_torque(base_torque, snapshot["total_torque_gain"])
    projected_weight = compute_projected_weight(base_weight, snapshot["total_weight_delta"])
    hp_per_kg = compute_hp_per_kg(projected_hp, projected_weight)

    estimated_0_60_sec = estimate_0_60(
        projected_hp=projected_hp,
        projected_weight_kg=projected_weight,
        drivetrain=vehicle.drivetrain,
    )

    estimated_quarter_mile_sec = estimate_quarter_mile(
        projected_hp=projected_hp,
        projected_weight_kg=projected_weight,
    )

    stock_top_speed = getattr(spec, "stock_top_speed_mph", None) if spec else None

    estimated_top_speed_mph = estimate_top_speed(
        base_hp=base_hp,
        projected_hp=projected_hp,
        stock_top_speed_mph=stock_top_speed,
    )

    return {
        "projected_hp": projected_hp,
        "projected_torque_lbft": projected_torque,
        "projected_weight_kg": projected_weight,
        "hp_per_kg": round(hp_per_kg, 4) if hp_per_kg is not None else None,
        "estimated_0_60_sec": estimated_0_60_sec,
        "estimated_quarter_mile_sec": estimated_quarter_mile_sec,
        "estimated_top_speed_mph": estimated_top_speed_mph,
    }



