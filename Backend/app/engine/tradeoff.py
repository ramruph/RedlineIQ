"""
Analyze tradeoffs
- gains
- penalties
- risks
- budget headroom 
- build character
"""

def summarize_strengths(simulation: dict, score: dict, request) -> list[str]:
    strengths = []

    if request.target_hp and simulation["projected_hp"] >= request.target_hp:
        strengths.append("Build meets the target horsepower goal.")

    if simulation.get("estimated_0_60_sec") is not None and simulation["estimated_0_60_sec"] < 4.0:
        strengths.append("Projected acceleration is strong for this build.")

    if score["reliability_score"] >= 80:
        strengths.append("Reliability remains strong for the selected configuration.")

    if score["projected_cost_usd"] <= request.max_budget_usd:
        strengths.append("Build stays within the specified budget.")

    return strengths


def summarize_weaknesses(simulation: dict, score: dict, request) -> list[str]:
    weaknesses = []

    if request.target_hp and simulation["projected_hp"] < request.target_hp:
        weaknesses.append("Build does not fully meet the target horsepower.")

    if score["reliability_score"] < 75:
        weaknesses.append("Reliability is reduced compared with a more conservative setup.")

    if simulation.get("projected_weight_kg") is not None and simulation["projected_weight_kg"] > 1600:
        weaknesses.append("Vehicle weight remains relatively high for maximum responsiveness.")

    return weaknesses


def summarize_warnings(score: dict, request) -> list[str]:
    warnings = []

    budget_headroom = request.max_budget_usd - score["projected_cost_usd"]
    if budget_headroom < 1000:
        warnings.append("Budget headroom is low, leaving limited room for supporting modifications.")

    if score["reliability_score"] < request.reliability_floor + 5:
        warnings.append("Reliability is close to the minimum allowed threshold.")

    return warnings


def generate_tradeoff_result(simulation: dict, score: dict, request) -> dict:
    return {
        "strengths": summarize_strengths(simulation, score, request),
        "weaknesses": summarize_weaknesses(simulation, score, request),
        "warnings": summarize_warnings(score, request),
    }


