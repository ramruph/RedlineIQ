from itertools import combinations

from app.engine.features import build_feature_snapshot
from app.engine.scoring import score_build
from app.engine.constraints import validate_candidate_build

from app.repositories.parts_repo import get_dependencies_for_part_ids, get_exclusions_for_part_ids


def generate_candidate_builds(parts, max_parts=4):
    for i in range(1, min(max_parts, len(parts)) + 1):
        for combo in combinations(parts, i):
            yield list(combo)


def optimize_build(vehicle, spec, compatible_parts, request, db):
    best_result = None
    best_score = float("-inf")

    for selected_parts in generate_candidate_builds(compatible_parts, max_parts=4):
        snapshot = build_feature_snapshot(vehicle, spec, selected_parts)
        score = score_build(snapshot, request)

        selected_ids = [p.part_id for p in selected_parts]
        dependencies = get_dependencies_for_part_ids(db, selected_ids)
        exclusions = get_exclusions_for_part_ids(db, selected_ids)

        is_valid, errors, warnings = validate_candidate_build(
            vehicle=vehicle,
            snapshot=snapshot,
            score=score,
            request=request,
            dependencies=dependencies,
            exclusions=exclusions,
        )

        if not is_valid:
            continue

        if score["objective_score"] > best_score:
            best_score = score["objective_score"]
            best_result = {
                "snapshot": snapshot,
                "score": score,
                "errors": errors,
                "warnings": warnings,
            }

    return best_result