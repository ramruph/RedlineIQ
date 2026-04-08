def compute_reliability_score(total_penalty:float):
    score = 100.0 - total_penalty
    return max(0.0, min(100.0, score))

def compute_objective_score(projected_hp: float, total_cost:float, reliability_score:float, target_hp: float | None, activity_type:str):
    hp_component = projected_hp

    target_bonus = 0.0
    if target_hp:
        if projected_hp >= target_hp:
            target_bonus = 100.0
        else:
            target_bonus = -((target_hp - projected_hp) * 0.5)

    cost_penalty = total_cost * 0.1
    reliability_bonus = reliability_score * 0.5

    activity_bonus = 0.0
    if activity_type == "Street":
        activity_bonus = reliability_score * 0.2
    elif activity_type == "Drag":
        activity_bonus = projected_hp * 0.1
    elif activity_type in {"Circuit", "Time_Attack"}:
        activity_bonus = reliability_score * 0.3

    return hp_component + target_bonus + reliability_bonus + activity_bonus - cost_penalty

def score_build(snapshot: dict, request) -> dict:
    projected_hp = snapshot["base_hp"] + snapshot["total_hp_gain"]
    projected_torque = snapshot["base_torque_lbft"] + snapshot["total_torque_gain"]
    projected_cost = snapshot["total_cost"]

    projected_weight = None
    if snapshot["base_weight_kg"] is not None:
        projected_weight = snapshot["base_weight_kg"] + snapshot["total_weight_delta"]

    reliability_score = compute_reliability_score(snapshot["total_reliability_penalty"])

    objective_score = compute_objective_score(
        projected_hp=projected_hp,
        total_cost=projected_cost,
        reliability_score=reliability_score,
        target_hp=request.target_hp,
        activity_type=request.activity_type,
    )

    return {
        "projected_hp": projected_hp,
        "projected_torque_lbft": projected_torque,
        "projected_cost_usd": projected_cost,
        "projected_weight_kg": projected_weight,
        "reliability_score": reliability_score,
        "objective_score": objective_score,
    }