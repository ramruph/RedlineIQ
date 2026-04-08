

def build_explanation(vehicle, score: dict, selected_parts: list, simulation: dict | None = None) -> str:
    if not selected_parts:
        return "No valid build could be generated."

    part_names = ", ".join(p.name for p in selected_parts)

    sentence = (
        f"Selected build for {vehicle.make} {vehicle.model} uses {part_names}. "
        f"Projected cost is ${score['projected_cost_usd']:.0f} with reliability score "
        f"{score['reliability_score']:.1f}."
    )

    if simulation:
        sentence += (
            f" Estimated output is {simulation['projected_hp']:.0f} HP and "
            f"{simulation['projected_torque_lbft']:.0f} lb-ft"
        )

        if simulation.get("estimated_0_60_sec") is not None:
            sentence += f", with an estimated 0-60 of {simulation['estimated_0_60_sec']:.2f} seconds"

        sentence += "."

    return sentence