
"""
This is what prevents stupid or invalid builds from winning.

Checks:
- budget
- street-legal requirement
- one part per category
- reliability floor
"""

from app.engine.dependency_checks import check_part_dependencies
from app.engine.exclusion_checks import check_part_exclusions
from app.engine.realism import run_realism_checks

def check_budget(projected_cost: float, max_budget_usd: float) -> tuple[bool, str | None]:
    if projected_cost > max_budget_usd:
        return False, f"Build exceeds budget: {projected_cost:.2f} > {max_budget_usd:.2f}"
    return True, None


def check_street_legal(selected_parts, require_street_legal: bool) -> tuple[bool, str | None]:
    if not require_street_legal:
        return True, None

    illegal_parts = [p.name for p in selected_parts if not p.street_legal]
    if illegal_parts:
        return False, f"Build includes non-street-legal parts: {', '.join(illegal_parts)}"
    return True, None


def check_one_per_category(snapshot: dict) -> tuple[bool, str | None]:
    duplicates = [cat for cat, count in snapshot["category_counts"].items() if count > 1]
    if duplicates:
        return False, f"Multiple parts selected in same category: {', '.join(duplicates)}"
    return True, None


def check_reliability(reliability_score: float, reliability_floor: float) -> tuple[bool, str | None]:
    if reliability_score < reliability_floor:
        return False, f"Reliability below floor: {reliability_score:.2f} < {reliability_floor:.2f}"
    return True, None


def validate_candidate_build(vehicle, snapshot: dict, score: dict, request, dependencies, exclusions) -> tuple[bool, list[str], list[str]]:
    errors = []
    warnings = []

    checks = [
        check_budget(score["projected_cost_usd"], request.max_budget_usd),
        check_street_legal(snapshot["selected_parts"], request.require_street_legal),
        check_one_per_category(snapshot),
        check_reliability(score["reliability_score"], request.reliability_floor),
    ]

    for ok, reason in checks:
        if not ok and reason:
            errors.append(reason)

    errors.extend(
        check_part_dependencies(
            selected_parts=snapshot["selected_parts"],
            dependencies=dependencies,
            projected_hp=score["projected_hp"],
        )
    )

    errors.extend(
        check_part_exclusions(
            selected_parts=snapshot["selected_parts"],
            exclusions=exclusions,
        )
    )

    realism_errors, realism_warnings = run_realism_checks(
        vehicle=vehicle,
        selected_parts=snapshot["selected_parts"],
        projected_hp=score["projected_hp"],
        activity_type=request.activity_type,
    )

    errors.extend(realism_errors)
    warnings.extend(realism_warnings)

    return len(errors) == 0, errors, warnings