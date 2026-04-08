# Ties the whole optimization engine together
from app.engine.optimizer import optimize_build
from app.engine.explain import build_explanation
from app.engine.simulation import run_simulation
from app.engine.tradeoff import generate_tradeoff_result

def run_build_analysis(vehicle, spec, compatible_parts, request, db):
    optimzation_result = optimize_build(vehicle, spec, compatible_parts, request, db)

    if not optimzation_result:
        return None
    
    selected_parts = optimzation_result["snapshot"]["selected_parts"]
    score = optimzation_result["score"]
    explanation = build_explanation(vehicle, score, selected_parts)

    simulation = run_simulation(vehicle, spec, optimzation_result['snapshot'])
    tradeoff = generate_tradeoff_result(simulation, score, request)

    # merge warnings from realism/constraint phase
    warnings = list(set(optimzation_result.get("warnings", []) + tradeoff.get("warnings", [])))

    explanation = build_explanation(vehicle, score, selected_parts, simulation)



    return {
        "vehicle_id" : vehicle.vehicle_id, 
        "selected_parts" : [{
            "part_id" : p.part_id,
            "name" : p.name, 
            "category" : p.category,
            "hp_gain" : p.hp_gain,
            "torque_gain_lbft" : p.torque_gain_lbft,
            "reliability_penalty" : p.reliability_penalty,
            }
            for p in selected_parts],
        "score" : optimzation_result['score'],
        "tradeoff" : tradeoff,
        "simulation" : simulation,
        "explanation_summary" : explanation,
        "warnings" : []}


