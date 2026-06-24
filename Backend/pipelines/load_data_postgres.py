"""

Expected CSVs in CLEANED_DATA_DIR (default: data/cleaned):
- products_clean.csv
- product_categories_clean.csv
- product_evidence_chunks.csv
- forum_evidence_clean.csv
- hpacademy_rag_chunks.csv
- vehicle_dimensions_cleaned.csv

"""
from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
PROJECT_ROOT = Path(__file__).resolve().parents[2]


ENV_PATH = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")

CLEANED_DATA_DIR = Path(
    os.getenv("CLEANED_DATA_DIR", PROJECT_ROOT / "data" / "cleaned")
)

SCHEMA_PATH = Path(
    os.getenv(
        "SQL_SCHEMA_PATH",
        PROJECT_ROOT / "backend" / "pipelines" / "db_schema"/ "redlineiq_schema.sql",
    )
)

CANONICAL_A90_VEHICLE_ID = "toyota_gr_supra_a90"
DEFAULT_A90_VARIANT_ID = "toyota_gr_supra_a90_3_0_auto_2024_2025"

# -----------------------------------------------------------------------------
# MVP Source of truth for recommendation category relevance
# -----------------------------------------------------------------------------
CATEGORY_USE_CASE_MAP = {
    "engine_power": {
        "use_cases": ["street", "drag", "track"],
        "power_bands": ["450_550whp", "550_650whp"],
    },
    "exhaust": {
        "use_cases": ["street", "drag", "track"],
        "power_bands": ["400_550whp", "550_650whp"],
    },
    "tuning": {
        "use_cases": ["street", "drag", "track"],
        "power_bands": ["400_550whp", "550_650whp", "650whp_plus"],
    },
    "fueling": {
        "use_cases": ["street", "drag", "track"],
        "power_bands": ["500_650whp", "650whp_plus"],
    },
    "cooling": {
        "use_cases": ["track", "time_attack", "street"],
        "power_bands": ["450_550whp", "550_650whp", "650whp_plus"],
    },
    "brakes": {
        "use_cases": ["track", "time_attack", "street"],
        "power_bands": ["any"],
    },
    "aero": {
        "use_cases": ["track", "time_attack"],
        "power_bands": ["any"],
    },
}

USE_CASES = [
    {"use_case_id": "street", "use_case_name": "Street", "description": "Daily/street focused build with drivability and reasonable risk."},
    {"use_case_id": "drag", "use_case_name": "Drag", "description": "Straight-line acceleration and peak power focus."},
    {"use_case_id": "track", "use_case_name": "Track", "description": "Open track/road-course reliability and repeatability."},
    {"use_case_id": "time_attack", "use_case_name": "Time Attack", "description": "Lap-time focused build with aero, grip, cooling, and braking."},
]

POWER_BANDS = [
    {"power_band_id": "any", "label": "Any power level", "min_whp": None, "max_whp": None, "description": "Relevant independent of power target."},
    {"power_band_id": "400_550whp", "label": "400–550whp", "min_whp": 400, "max_whp": 550, "description": "Mild to moderate bolt-on range."},
    {"power_band_id": "450_550whp", "label": "450–550whp", "min_whp": 450, "max_whp": 550, "description": "Common street/track B58 target range."},
    {"power_band_id": "500_650whp", "label": "500–650whp", "min_whp": 500, "max_whp": 650, "description": "Higher-power range where fueling starts to matter."},
    {"power_band_id": "550_650whp", "label": "550–650whp", "min_whp": 550, "max_whp": 650, "description": "Advanced street/track/drag range."},
    {"power_band_id": "650whp_plus", "label": "650whp+", "min_whp": 650, "max_whp": None, "description": "High-output builds with significant supporting mods."},
]

# Child/dependent tables first when clearing.
TABLE_CLEAR_ORDER = [
    "load_audit",
    "recommendation_events",
    "rag_chunks",
    "product_evidence_chunks",
    "hpacademy_chunks",
    "forum_evidence",
    "part_dependencies",
    "category_recommendation_rules",
    "product_categories",
    "part_fitments",
    "vehicle_dimensions",
    "products",
    "vehicle_variants",
    "vehicles",
    "engines",
    "power_bands",
    "use_cases",
]


def slugify(value: str | None) -> str:
    if value is None or pd.isna(value):
        return ""
    value = str(value).lower().strip()
    value = re.sub(r"https?://", "", value)
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    return value


def stable_id(*parts: Any, prefix: str = "") -> str:
    raw_parts = []
    for p in parts:
        try:
            is_missing = pd.isna(p)
        except Exception:
            is_missing = p is None
        raw_parts.append("" if p is None or is_missing else str(p))
    raw = "||".join(raw_parts)
    return f"{prefix}{hashlib.md5(raw.encode('utf-8')).hexdigest()[:12]}"


def product_id_from_url(url: str | None, name: str | None = None, brand: str | None = None) -> str:
    if url and not pd.isna(url):
        tail = str(url).rstrip("/").split("/")[-1]
        return slugify(tail)[:180]
    return stable_id(brand, name, prefix="part_")


def engine_id_from_code(engine_code: str | None) -> str | None:
    if engine_code is None or pd.isna(engine_code):
        return None
    s = str(engine_code).lower()
    if "b58" in s:
        return "bmw_b58"
    if "b48" in s:
        return "bmw_b48"
    if "2jz" in s and "gte" in s:
        return "toyota_2jz_gte"
    return slugify(engine_code)[:80]

def is_comment_only_sql(statement: str) -> bool:
    """
    Return True if a SQL statement contains only comments/whitespace.
    This prevents psycopg2 from trying to execute empty comment blocks.
    """
    meaningful_lines = []

    for line in statement.splitlines():
        stripped = line.strip()

        if not stripped:
            continue

        if stripped.startswith("--"):
            continue

        meaningful_lines.append(stripped)

    return len(meaningful_lines) == 0

def vehicle_id_from_row(row: pd.Series) -> str:
    make = str(row.get("make", "")).lower()
    model = str(row.get("model", "")).lower()
    platform = str(row.get("platform_code", "")).lower()
    generation = str(row.get("generation", "")).lower()
    if "toyota" in make and "supra" in model and ("j29" in platform or "mk5" in generation or "a90" in platform):
        return CANONICAL_A90_VEHICLE_ID
    return slugify(f"{row.get('make')} {row.get('model')} {row.get('generation')}")[:100]


def variant_id_from_row(row: pd.Series, vehicle_id: str, engine_id: str | None) -> str:
    # Preserve provided variant_id if present, otherwise create one from trim/year/engine.
    existing = row.get("variant_id")
    if existing and not pd.isna(existing):
        return str(existing)
    source_vehicle_id = row.get("source_variant_id") or row.get("vehicle_id")
    if source_vehicle_id and not pd.isna(source_vehicle_id) and str(source_vehicle_id) != vehicle_id:
        return slugify(str(source_vehicle_id))
    trim = slugify(row.get("trim"))
    ys = int(row.get("year_start")) if pd.notna(row.get("year_start")) else None
    ye = int(row.get("year_end")) if pd.notna(row.get("year_end")) else None
    engine = engine_id or "unknown_engine"
    if vehicle_id == CANONICAL_A90_VEHICLE_ID and "3_0" in trim and engine == "bmw_b58":
        return DEFAULT_A90_VARIANT_ID
    return slugify(f"{vehicle_id}_{trim}_{engine}_{ys}_{ye}")[:160]


def to_bool_series(s: pd.Series) -> pd.Series:
    return s.fillna(False).astype(str).str.lower().isin(["true", "1", "yes", "y"])


def read_csv(name: str) -> pd.DataFrame:
    path = CLEANED_DATA_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Missing {path}. Set CLEANED_DATA_DIR or copy cleaned files there.")
    return pd.read_csv(path)


def create_schema(engine) -> None:
    """Create schema from the external SQL file instead of hardcoding DDL in Python."""
    if not SCHEMA_PATH.exists():
        raise FileNotFoundError(f"Schema SQL file not found: {SCHEMA_PATH}")

    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")

    with engine.begin() as conn:
        # Execute statement-by-statement for reliable SQLAlchemy behavior.
        for statement in schema_sql.split(";"):
            statement = statement.strip()
            
            if not statement:
                continue

            if is_comment_only_sql(statement):
                continue
            
            conn.execute(text(statement))


def assert_required_tables_exist(engine) -> None:
    required = [
        "use_cases",
        "power_bands",
        "engines",
        "vehicles",
        "vehicle_variants",
        "vehicle_dimensions",
        "products",
        "product_categories",
        "part_fitments",
        "category_recommendation_rules",
        "part_dependencies",
        "forum_evidence",
        "hpacademy_chunks",
        "product_evidence_chunks",
        "rag_chunks",
        "recommendation_events",
        "load_audit",
    ]
    with engine.connect() as conn:
        existing = {
            row[0]
            for row in conn.execute(text("""
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public'
            """))
        }

    missing = sorted(set(required) - existing)
    if missing:
        raise RuntimeError(
            "Schema did not create required tables: "
            + ", ".join(missing)
            + f"\nCheck that SCHEMA_PATH points to the updated schema file: {SCHEMA_PATH}"
        )

def clear_tables(engine) -> None:
    with engine.begin() as conn:
        existing = {
            row[0]
            for row in conn.execute(text("""
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public'
            """))
        }
        for table in TABLE_CLEAR_ORDER:
            if table in existing:
                conn.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;"))
            else:
                print(f"Skipping missing table during truncate: {table}")

def write_table(df: pd.DataFrame, table: str, engine, source_file: str) -> None:
    df = df.copy()
    df = df.where(pd.notnull(df), None)

    text_heavy_tables = {
        "hpacademy_chunks",
        "forum_evidence",
        "product_evidence_chunks",
    }

    if table in text_heavy_tables:
        df.to_sql(
            table,
            engine,
            if_exists="append",
            index=False,
            chunksize=100,
            method=None,
        )
    else:
        df.to_sql(
            table,
            engine,
            if_exists="append",
            index=False,
            chunksize=500,
            method="multi",
        )

    audit = pd.DataFrame([{
        "load_id": stable_id(table, source_file, len(df), prefix="load_"),
        "table_name": table,
        "source_file": source_file,
        "row_count": len(df),
    }])

    audit.to_sql(
        "load_audit",
        engine,
        if_exists="append",
        index=False,
        method="multi",
    )

    print(f"Loaded {len(df):,} rows -> {table}")

def transform_category_rules() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    use_cases = pd.DataFrame(USE_CASES)
    power_bands = pd.DataFrame(POWER_BANDS)
    rows = []
    for system_category, config in CATEGORY_USE_CASE_MAP.items():
        for use_case_id in config["use_cases"]:
            for power_band_id in config["power_bands"]:
                rows.append({
                    "rule_id": stable_id(system_category, use_case_id, power_band_id, prefix="rule_"),
                    "system_category": system_category,
                    "use_case_id": use_case_id,
                    "power_band_id": power_band_id,
                    "relevance_score": 0.90 if power_band_id != "any" else 0.80,
                    "notes": f"Seeded from CATEGORY_USE_CASE_MAP: {system_category} supports {use_case_id} at {power_band_id}",
                })
    rules = pd.DataFrame(rows).drop_duplicates(["system_category", "use_case_id", "power_band_id"])
    return use_cases, power_bands, rules


def transform_vehicle_dimensions() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    vd = read_csv("vehicle_dimensions_cleaned.csv")
    vehicles_rows, engines_rows, variants_rows, dims_rows = [], [], [], []

    for _, row in vd.iterrows():
        vehicle_id = vehicle_id_from_row(row)
        engine_id = engine_id_from_code(row.get("engine_code"))
        variant_id = variant_id_from_row(row, vehicle_id, engine_id)

        vehicles_rows.append({
            "vehicle_id": vehicle_id,
            "make": row.get("make"),
            "model": row.get("model"),
            "generation": "A90/A91 Mk5" if vehicle_id == CANONICAL_A90_VEHICLE_ID else row.get("generation"),
            "platform_code": "J29/A90" if vehicle_id == CANONICAL_A90_VEHICLE_ID else row.get("platform_code"),
            "chassis_code": "A90" if vehicle_id == CANONICAL_A90_VEHICLE_ID else row.get("platform_code"),
            "year_start": 2019 if vehicle_id == CANONICAL_A90_VEHICLE_ID else row.get("year_start"),
            "year_end": 2026 if vehicle_id == CANONICAL_A90_VEHICLE_ID else row.get("year_end"),
            "body_style": row.get("body_style"),
            "market": "US",
        })

        if engine_id:
            engines_rows.append({
                "engine_id": engine_id,
                "engine_code": "B58" if engine_id == "bmw_b58" else "B48" if engine_id == "bmw_b48" else row.get("engine_code"),
                "manufacturer": "BMW" if engine_id in ["bmw_b58", "bmw_b48"] else None,
                "displacement_l": 3.0 if engine_id == "bmw_b58" else 2.0 if engine_id == "bmw_b48" else None,
                "configuration": "I6" if engine_id == "bmw_b58" else "I4" if engine_id == "bmw_b48" else None,
                "induction": row.get("aspiration"),
                "fuel_type": None,
                "notes": None,
            })

        variants_rows.append({
            "variant_id": variant_id,
            "vehicle_id": vehicle_id,
            "engine_id": engine_id,
            "trim": row.get("trim"),
            "year_start": row.get("year_start"),
            "year_end": row.get("year_end"),
            "drivetrain": row.get("drivetrain"),
            "transmission": row.get("transmission"),
            "stock_hp": row.get("horsepower_hp"),
            "stock_tq": row.get("torque_lbft"),
            "curb_weight_lbs": row.get("curb_weight_lb"),
        })

        dims_rows.append({
            "variant_id": variant_id,
            "full_name": row.get("full_name"),
            "wheelbase_in": row.get("wheelbase_in"),
            "length_in": row.get("length_in"),
            "width_in": row.get("width_in"),
            "height_in": row.get("height_in"),
            "curb_weight_lb": row.get("curb_weight_lb"),
            "front_tires": row.get("front_tires"),
            "rear_tires": row.get("rear_tires"),
            "turning_circle_ft": row.get("turning_circle_ft"),
            "front_suspension": row.get("front_suspension"),
            "rear_suspension": row.get("rear_suspension"),
            "source_name": row.get("source_name"),
            "source_url": row.get("source_url"),
            "raw_json": json.dumps(row.where(pd.notnull(row), None).to_dict()),
        })

    # Seed known engine aliases used by product fitment flags.
    engines_rows.extend([
        {"engine_id": "bmw_b48", "engine_code": "B48", "manufacturer": "BMW", "displacement_l": 2.0, "configuration": "I4", "induction": "turbo", "fuel_type": None, "notes": "Seeded for A90 2.0 fitment."},
        {"engine_id": "bmw_b58", "engine_code": "B58", "manufacturer": "BMW", "displacement_l": 3.0, "configuration": "I6", "induction": "turbo", "fuel_type": None, "notes": "Seeded for A90 3.0 fitment."},
    ])

    return (
        pd.DataFrame(vehicles_rows).drop_duplicates("vehicle_id"),
        pd.DataFrame(engines_rows).drop_duplicates("engine_id"),
        pd.DataFrame(variants_rows).drop_duplicates("variant_id"),
        pd.DataFrame(dims_rows).drop_duplicates("variant_id"),
    )


def transform_products() -> pd.DataFrame:
    products_df = read_csv("products_clean.csv")
    products_df["product_id"] = products_df.apply(lambda r: product_id_from_url(r.get("product_url"), r.get("product_name"), r.get("brand")), axis=1)
    for col in ["requires_tune", "requires_fueling", "requires_cooling", "requires_professional_install"]:
        if col in products_df.columns:
            products_df[col] = to_bool_series(products_df[col])
    cols = [
        "product_id", "product_url", "product_name", "brand", "sku", "price", "regular_price",
        "description", "specifications", "fitment", "combined_text", "system_category", "subsystem",
        "requires_tune", "requires_fueling", "requires_cooling", "requires_professional_install",
        "emissions_risk", "reliability_risk", "install_complexity", "discount_pct", "price_bucket",
    ]
    return products_df[cols].drop_duplicates("product_id")


def transform_categories(products: pd.DataFrame) -> pd.DataFrame:
    c = read_csv("product_categories_clean.csv")
    c["product_id"] = c["product_url"].map(products.set_index("product_url")["product_id"])
    c = c[c["product_id"].notna()].copy()
    return c[["product_id", "product_url", "category", "category_value", "normalized_category"]].drop_duplicates()


def transform_fitments(vehicles: pd.DataFrame, variants: pd.DataFrame) -> pd.DataFrame:
    p = read_csv("products_clean.csv")
    p["product_id"] = p.apply(lambda r: product_id_from_url(r.get("product_url"), r.get("product_name"), r.get("brand")), axis=1)
    for col in ["fits_a90", "fits_b58", "fits_b48", "fits_3_0", "fits_2_0"]:
        if col in p.columns:
            p[col] = to_bool_series(p[col])

    vehicle_id = CANONICAL_A90_VEHICLE_ID if CANONICAL_A90_VEHICLE_ID in set(vehicles["vehicle_id"]) else vehicles.iloc[0]["vehicle_id"]
    b58_variant = None
    if "bmw_b58" in set(variants["engine_id"].dropna()):
        b58_variant = variants[variants["engine_id"].eq("bmw_b58")]["variant_id"].iloc[0]

    rows = []
    for _, row in p.iterrows():
        product_id = row["product_id"]
        year_start = row.get("model_year_min") if pd.notna(row.get("model_year_min")) else None
        year_end = row.get("model_year_max") if pd.notna(row.get("model_year_max")) else None

        if row.get("fits_a90") and (row.get("fits_b58") or row.get("fits_3_0")):
            scope, variant_id, engine_id, confidence = "specific_variant", b58_variant, "bmw_b58", 0.85
        elif row.get("fits_a90") and (row.get("fits_b48") or row.get("fits_2_0")):
            scope, variant_id, engine_id, confidence = "engine_family", None, "bmw_b48", 0.80
        elif row.get("fits_a90"):
            scope, variant_id, engine_id, confidence = "vehicle_generation", None, None, 0.75
        elif row.get("fits_b58"):
            scope, variant_id, engine_id, confidence = "engine_family", None, "bmw_b58", 0.70
        elif row.get("fits_b48"):
            scope, variant_id, engine_id, confidence = "engine_family", None, "bmw_b48", 0.70
        else:
            scope, variant_id, engine_id, confidence = "unknown", None, None, 0.30

        rows.append({
            "fitment_id": stable_id(product_id, vehicle_id, variant_id, engine_id, year_start, year_end, prefix="fit_"),
            "product_id": product_id,
            "vehicle_id": vehicle_id if scope in ["specific_variant", "vehicle_generation"] else None,
            "variant_id": variant_id,
            "engine_id": engine_id,
            "year_start": year_start,
            "year_end": year_end,
            "fitment_scope": scope,
            "fitment_notes": row.get("fitment"),
            "confidence_score": confidence,
            "source": "products_clean_fitment_flags",
        })
    return pd.DataFrame(rows).drop_duplicates("fitment_id")


def transform_dependencies(products: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for _, row in products.iterrows():
        product_id = row["product_id"]
        if row.get("requires_tune"):
            rows.append({"dependency_id": stable_id(product_id, "tune", prefix="dep_"), "product_id": product_id, "required_category": "tuning", "required_subsystem": "tune", "required_product_id": None, "dependency_reason": "Product extracted as requiring or recommending tune.", "severity": "recommended"})
        if row.get("requires_fueling"):
            rows.append({"dependency_id": stable_id(product_id, "fueling", prefix="dep_"), "product_id": product_id, "required_category": "fueling", "required_subsystem": "fueling", "required_product_id": None, "dependency_reason": "Product extracted as requiring fueling support.", "severity": "required"})
        if row.get("requires_cooling"):
            rows.append({"dependency_id": stable_id(product_id, "cooling", prefix="dep_"), "product_id": product_id, "required_category": "cooling", "required_subsystem": "cooling", "required_product_id": None, "dependency_reason": "Product extracted as requiring cooling support.", "severity": "recommended"})
    return pd.DataFrame(rows)


def transform_forum_evidence(vehicles: pd.DataFrame, variants: pd.DataFrame) -> pd.DataFrame:
    forums_df = read_csv("forum_evidence_clean.csv")
    vehicle_id = CANONICAL_A90_VEHICLE_ID if CANONICAL_A90_VEHICLE_ID in set(vehicles["vehicle_id"]) else vehicles.iloc[0]["vehicle_id"]

    b58_variant = variants[variants["engine_id"].eq("bmw_b58")]["variant_id"].iloc[0] if any(variants["engine_id"].eq("bmw_b58")) else None
    forums_df["vehicle_id"] = vehicle_id
    forums_df["variant_id"] = b58_variant
    cols = ["evidence_id", "vehicle_id", "variant_id", "source_dataset", "evidence_type", "author", "created_at", "post_id", "cleaned_content", "links", "images", "youtube_videos", "links_count", "images_count", "youtube_videos_count", "mentioned_categories", "lap_time_seconds", "track_name", "evidence_quality_score"]
    return forums_df[cols].drop_duplicates("evidence_id")


def transform_product_chunks(products: pd.DataFrame) -> pd.DataFrame:
    ch = read_csv("product_evidence_chunks.csv")
    ch["product_id"] = ch["product_url"].map(products.set_index("product_url")["product_id"])
    return ch[["chunk_id", "product_id", "source_type", "chunk_type", "product_url", "product_name", "combined_text"]].drop_duplicates("chunk_id")


def load_all() -> None:
    engine = create_engine(DATABASE_URL)
    try:
        create_schema(engine)
        assert_required_tables_exist(engine)
        clear_tables(engine)

        use_cases, power_bands, category_rules = transform_category_rules()
        vehicles, engines, variants, dims = transform_vehicle_dimensions()
        products = transform_products()
        categories = transform_categories(products)
        fitments = transform_fitments(vehicles, variants)
        dependencies = transform_dependencies(products)
        forum = transform_forum_evidence(vehicles, variants)
        hpa = read_csv("hpacademy_rag_chunks.csv")
        product_chunks = transform_product_chunks(products)

        write_table(use_cases, "use_cases", engine, "seeded_use_cases")
        write_table(power_bands, "power_bands", engine, "seeded_power_bands")
        write_table(engines, "engines", engine, "vehicle_dimensions_cleaned.csv")
        write_table(vehicles, "vehicles", engine, "vehicle_dimensions_cleaned.csv")
        write_table(variants, "vehicle_variants", engine, "vehicle_dimensions_cleaned.csv")
        write_table(dims, "vehicle_dimensions", engine, "vehicle_dimensions_cleaned.csv")
        write_table(products, "products", engine, "products_clean.csv")
        write_table(categories, "product_categories", engine, "product_categories_clean.csv")
        write_table(fitments, "part_fitments", engine, "products_clean.csv")
        write_table(category_rules, "category_recommendation_rules", engine, "CATEGORY_USE_CASE_MAP")
        if len(dependencies):
            write_table(dependencies, "part_dependencies", engine, "products_clean.csv")
        write_table(forum, "forum_evidence", engine, "forum_evidence_clean.csv")
        write_table(hpa, "hpacademy_chunks", engine, "hpacademy_rag_chunks.csv")
        write_table(product_chunks, "product_evidence_chunks", engine, "product_evidence_chunks.csv")

    except SQLAlchemyError as e:
        print("Database error while loading RedlineIQ data:")
        print(e)
        raise


if __name__ == "__main__":
    load_all()
