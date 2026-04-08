from typing import List


def build_feature_snapshot(vehicle, spec, selected_parts:List):
    """
    This is the layer that transforms vehicles, specs, selected_parts into a single computed view
    """

    total_hp_gain = sum(p.hp_gain for p in selected_parts)
    total_torque_gain = sum(p.torque_gain_lbft for p in selected_parts)

    total_cost = sum(p.price_usd for p in selected_parts)

    total_weight_delta = sum(p.weight_delta_kg for p in selected_parts)

    total_reliability_penalty = sum(p.reliability_penalty for p in selected_parts)

    category_counts = {}
    for part in selected_parts:
        category_counts[part.category] = category_counts.get(part.category, 0) + 1

    return {
        "vehicle_id": vehicle.vehicle_id, 
        "base_hp" : spec.base_hp if spec else 0.0,
        "base_torque_lbft" : spec.base_torque_lbft if spec and spec.base_torque_lbft else 0.0,
        "base_weight_kg" : spec.curb_weight_kg if spec and spec.curb_weight_kg else None,
        "total_hp_gain" : total_hp_gain,
        "total_torque_gain" : total_torque_gain,
        "total_cost" : total_cost,
        "total_weight_delta" : total_weight_delta,
        "total_reliability_penalty" : total_reliability_penalty,
        "category_counts" : category_counts,
        "selected_parts" : selected_parts
    }

    