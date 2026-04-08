#optimizer from recommending “technically scored” but nonsense builds.

def check_power_support_realism(selected_parts, projected_hp: float) -> list[str]:
    errors: list[str] = []
    categories = {p.category for p in selected_parts}

    if projected_hp >= 600:
        if "fuel_system" not in categories:
            errors.append("High-horsepower build lacks fuel system support.")
        if "cooling" not in categories:
            errors.append("High-horsepower build lacks cooling support.")
        if "ecu" not in categories:
            errors.append("High-horsepower build lacks ECU/tuning support.")

    return errors


def check_activity_realism(selected_parts, activity_type: str) -> list[str]:
    warnings: list[str] = []
    categories = {p.category for p in selected_parts}

    if activity_type == "DRAG":
        if "tires" not in categories:
            warnings.append("Drag-oriented build does not include tire upgrade support.")
        if "drivetrain" not in categories and "fuel_system" not in categories:
            warnings.append("Drag-oriented build may lack supporting drivetrain or fueling upgrades.")

    elif activity_type in {"CIRCUIT", "TIME_ATTACK"}:
        if "brakes" not in categories:
            warnings.append("Circuit-oriented build does not include brake upgrades.")
        if "cooling" not in categories:
            warnings.append("Circuit-oriented build may suffer from thermal limitations.")
        if "suspension" not in categories:
            warnings.append("Circuit-oriented build does not include suspension tuning support.")

    elif activity_type == "STREET":
        race_only = [p.name for p in selected_parts if not p.street_legal]
        if race_only:
            warnings.append("Street build contains race-only components.")

    return warnings


def check_vehicle_realism(vehicle, projected_hp: float) -> list[str]:
    errors: list[str] = []

    # simple early platform ceilings for MVP realism
    conservative_platform_caps = {
        "toyota_corolla_ae86_4age": 300,
        "toyota_supra_a70_7mgte": 700,
        "toyota_supra_a80_2jzgte": 1200,
        "toyota_grsupra_a90_b58": 900,
        "nissan_gtr_r32_rb26dett": 900,
        "nissan_gtr_r34_rb26dett": 900,
        "nissan_gtr_r35_vr38dett": 1400,
    }

    cap = conservative_platform_caps.get(vehicle.vehicle_id)
    if cap and projected_hp > cap:
        errors.append(
            f"Projected horsepower {projected_hp:.1f} exceeds current realism cap for {vehicle.vehicle_id}."
        )

    return errors

def run_realism_checks(vehicle, selected_parts, projected_hp: float, activity_type: str) -> tuple[list[str], list[str]]:
    errors = []
    warnings = []

    errors.extend(check_power_support_realism(selected_parts, projected_hp))
    errors.extend(check_vehicle_realism(vehicle, projected_hp))
    warnings.extend(check_activity_realism(selected_parts, activity_type))

    return errors, warnings