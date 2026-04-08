def _part_ids(selected_parts) -> set[str]:
    return {p.part_id for p in selected_parts}


def _part_categories(selected_parts) -> set[str]:
    return {p.category for p in selected_parts}


def check_part_dependencies(selected_parts, dependencies, projected_hp: float) -> list[str]:
    errors: list[str] = []

    selected_ids = _part_ids(selected_parts)
    selected_categories = _part_categories(selected_parts)

    for dep in dependencies:
        if dep.dependency_type == "REQUIRES_PART":
            if dep.depends_on_part_id and dep.depends_on_part_id not in selected_ids:
                errors.append(
                    f"Part {dep.part_id} requires part {dep.depends_on_part_id}."
                )

        elif dep.dependency_type == "REQUIRES_CATEGORY":
            if dep.depends_on_category and dep.depends_on_category not in selected_categories:
                errors.append(
                    f"Part {dep.part_id} requires category {dep.depends_on_category}."
                )

        elif dep.dependency_type == "REQUIRES_ONE_OF_CATEGORY":
            if dep.depends_on_category and dep.depends_on_category not in selected_categories:
                errors.append(
                    f"Part {dep.part_id} requires at least one part in category {dep.depends_on_category}."
                )

        elif dep.dependency_type == "REQUIRES_IF_HP_ABOVE":
            threshold = dep.min_required_hp or 0
            if projected_hp > threshold:
                if dep.depends_on_category and dep.depends_on_category not in selected_categories:
                    errors.append(
                        f"Projected HP {projected_hp:.1f} requires category {dep.depends_on_category} for part {dep.part_id}."
                    )
                if dep.depends_on_part_id and dep.depends_on_part_id not in selected_ids:
                    errors.append(
                        f"Projected HP {projected_hp:.1f} requires part {dep.depends_on_part_id} for part {dep.part_id}."
                    )

    return errors