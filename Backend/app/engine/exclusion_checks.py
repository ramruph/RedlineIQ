
#This catches impossible or conflicting configurations before they win.

def check_part_exclusions(selected_parts, exclusions) -> list[str]:
    errors: list[str] = []

    selected_ids = {p.part_id for p in selected_parts}
    selected_categories = {p.category for p in selected_parts}

    for exc in exclusions:
        if exc.exclusion_type == "MUTUALLY_EXCLUSIVE_PART":
            if exc.excludes_part_id and exc.excludes_part_id in selected_ids:
                errors.append(
                    f"Part {exc.part_id} conflicts with part {exc.excludes_part_id}."
                )

        elif exc.exclusion_type == "MUTUALLY_EXCLUSIVE_CATEGORY":
            if exc.excludes_category:
                matching_count = sum(1 for p in selected_parts if p.category == exc.excludes_category)
                if exc.part_id in selected_ids and matching_count > 1:
                    errors.append(
                        f"Part {exc.part_id} conflicts with another part in category {exc.excludes_category}."
                    )

        elif exc.exclusion_type == "ACTIVITY_CONFLICT":
            # handled later by realism/activity rules if needed
            continue

    return errors