from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import pandas as pd
import requests
from bs4 import BeautifulSoup

try:
    import pyarrow as pa
    import pyarrow.parquet as pq
except Exception as exc:  # pragma: no cover
    raise RuntimeError(
        "pyarrow is required to write parquet outputs. Install with: pip install pyarrow"
    ) from exc

URL = "https://www.ultimatespecs.com/car-specs/Toyota/145988/Toyota-GR-Supra-30-Auto.html"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
}

KNOWN_SECTIONS = [
    "Body, Model and Production details",
    "Engine Technical Data",
    "Fuel Consumption (Economy), Emissions and Range",
    "Performance",
    "Size, Dimensions, Aerodynamics and Weight",
    "Interior size, Dimensions",
    "Brakes, Tires, Steering and Suspension",
]

SECTION_TO_SLUG = {
    "Body, Model and Production details": "body_model_production",
    "Engine Technical Data": "engine_technical_data",
    "Fuel Consumption (Economy), Emissions and Range": "fuel_emissions_range",
    "Performance": "performance",
    "Size, Dimensions, Aerodynamics and Weight": "size_dimensions_weight",
    "Interior size, Dimensions": "interior_dimensions",
    "Brakes, Tires, Steering and Suspension": "chassis_brakes_tires_suspension",
}


def clean_text(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "")).strip()


def normalize_label(label: str) -> str:
    label = clean_text(label).lower()
    label = label.replace("num.", "number")
    label = label.replace("/", " ")
    label = label.replace("-", " ")
    label = re.sub(r"[()]+", " ", label)
    label = re.sub(r"[^a-z0-9]+", "_", label)
    return re.sub(r"_+", "_", label).strip("_")


def to_float(text: Optional[str]) -> Optional[float]:
    if not text:
        return None
    m = re.search(r"-?\d+(?:\.\d+)?", text.replace(",", ""))
    return float(m.group()) if m else None


def to_int(text: Optional[str]) -> Optional[int]:
    val = to_float(text)
    return int(val) if val is not None else None


def extract_unit(text: Optional[str], pattern: str) -> Optional[float]:
    if not text:
        return None
    m = re.search(pattern, text, flags=re.I)
    return float(m.group(1)) if m else None


def extract_unit_string(text: Optional[str], pattern: str) -> Optional[str]:
    if not text:
        return None
    m = re.search(pattern, text, flags=re.I)
    return clean_text(m.group(1)) if m else None


def get_text_lines_from_html(html: str) -> List[str]:
    soup = BeautifulSoup(html, "html.parser")
    lines = [clean_text(x) for x in soup.get_text("\n").splitlines()]
    return [x for x in lines if x]


def split_label_value(line: str) -> Optional[Tuple[str, str]]:
    if " : " in line:
        left, right = line.split(" : ", 1)
        return clean_text(left), clean_text(right)
    if ":" in line:
        left, right = line.split(":", 1)
        return clean_text(left), clean_text(right)
    return None


def is_noise_line(line: str) -> bool:
    if not line:
        return True
    noise_prefixes = (
        "How fast is",
        "How many horsepower",
        "How much does",
        "What is the",
        "What engine is",
        "If you found an error",
        "Compare with another car",
        "More pictures",
        "##",
    )
    return line.startswith(noise_prefixes)


def parse_sections_from_lines(lines: List[str]) -> Dict[str, Dict[str, str]]:
    starts: List[Tuple[str, int]] = []
    for i, line in enumerate(lines):
        for section in KNOWN_SECTIONS:
            if line.endswith(section):
                starts.append((section, i))
                break

    sections: Dict[str, Dict[str, str]] = {}
    for idx, (section, start_i) in enumerate(starts):
        end_i = starts[idx + 1][1] if idx + 1 < len(starts) else len(lines)
        block = lines[start_i + 1:end_i]
        rows: Dict[str, str] = {}

        i = 0
        while i < len(block):
            line = block[i]
            if is_noise_line(line):
                i += 1
                continue

            pair = split_label_value(line)
            if not pair:
                i += 1
                continue

            label, value = pair
            j = i + 1
            continuations: List[str] = []
            while j < len(block):
                nxt = block[j]
                if split_label_value(nxt):
                    break
                if is_noise_line(nxt):
                    break
                continuations.append(nxt)
                j += 1

            if continuations:
                value = clean_text(value + " | " + " | ".join(continuations))
            rows[label] = value
            i = j

        sections[section] = rows
    return sections


def years_from_lines(lines: List[str]) -> Tuple[Optional[int], Optional[int]]:
    joined = " ".join(lines[:80])
    years = [int(y) for y in re.findall(r"\b(19\d{2}|20\d{2}|21\d{2})\b", joined)]
    if not years:
        return None, None
    return min(years), max(years)


def title_from_lines(lines: List[str]) -> str:
    for line in lines[:60]:
        if line.endswith(" Specs") and line.startswith("Toyota "):
            return line.replace(" Specs", "")
    return "Toyota GR Supra 3.0 Auto"


def build_vehicle_bundle(url: str, lines: List[str], sections: Dict[str, Dict[str, str]]) -> Dict[str, pd.DataFrame]:
    sec_body = sections.get("Body, Model and Production details", {})
    sec_engine = sections.get("Engine Technical Data", {})
    sec_fuel = sections.get("Fuel Consumption (Economy), Emissions and Range", {})
    sec_perf = sections.get("Performance", {})
    sec_dims = sections.get("Size, Dimensions, Aerodynamics and Weight", {})
    sec_interior = sections.get("Interior size, Dimensions", {})
    sec_chassis = sections.get("Brakes, Tires, Steering and Suspension", {})

    title = title_from_lines(lines)
    year_start, year_end = years_from_lines(lines)
    vehicle_id = "toyota_gr_supra_3_0_auto_2024_2025"

    vehicles = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "make": "Toyota",
        "model": "GR Supra",
        "trim": "3.0 Auto",
        "full_name": title,
        "generation": sec_body.get("Generation"),
        "platform_code": "J29",
        "body_style": sec_body.get("Body"),
        "doors": to_int(sec_body.get("Num. of Doors")),
        "seats": to_int(sec_interior.get("Num. of Seats")),
        "year_start": year_start,
        "year_end": year_end,
        "source_name": "Ultimate Specs",
        "source_url": url,
    }])

    vehicle_powertrain_specs = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "engine_layout": sec_engine.get("Engine type - Number of cylinders"),
        "engine_code": sec_engine.get("Engine Code"),
        "fuel_type": sec_engine.get("Fuel type"),
        "fuel_system": sec_engine.get("Fuel System"),
        "lubrication_raw": sec_engine.get("Lubrication"),
        "engine_oil_viscosity": extract_unit_string(sec_engine.get("Lubrication"), r"All Weather:\s*([^|]+)"),
        "engine_oem_oil_specs": extract_unit_string(sec_engine.get("Lubrication"), r"OEM:\s*([^|]+)"),
        "engine_oil_api_acea": extract_unit_string(sec_engine.get("Lubrication"), r"API/ACEA:\s*([^|]+)"),
        "engine_oil_capacity_l": extract_unit(sec_engine.get("Lubrication"), r"Engine oil capacity \(with filter\):\s*(\d+(?:\.\d+)?)\s*L"),
        "engine_alignment": sec_engine.get("Engine Alignment"),
        "engine_position": sec_engine.get("Engine Position"),
        "displacement_cuin": extract_unit(sec_engine.get("Engine displacement"), r"(\d+(?:\.\d+)?)\s*cu-in"),
        "displacement_cc": extract_unit(sec_engine.get("Engine displacement"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "bore_in": extract_unit(sec_engine.get("Bore x Stroke"), r"(\d+(?:\.\d+)?)\s*x"),
        "stroke_in": extract_unit(sec_engine.get("Bore x Stroke"), r"x\s*(\d+(?:\.\d+)?)\s*inches"),
        "bore_mm": extract_unit(sec_engine.get("Bore x Stroke"), r"\|\s*(\d+(?:\.\d+)?)\s*x"),
        "stroke_mm": extract_unit(sec_engine.get("Bore x Stroke"), r"x\s*(\d+(?:\.\d+)?)\s*mm"),
        "valve_count": to_int(sec_engine.get("Number of valves")),
        "aspiration": sec_engine.get("Aspiration"),
        "compression_ratio": to_float(sec_engine.get("Compression Ratio")),
        "horsepower_hp": extract_unit(sec_engine.get("Horsepower"), r"(\d+(?:\.\d+)?)\s*HP"),
        "horsepower_ps": extract_unit(sec_engine.get("Horsepower"), r"/\s*(\d+(?:\.\d+)?)\s*PS"),
        "horsepower_kw": extract_unit(sec_engine.get("Horsepower"), r"/\s*(\d+(?:\.\d+)?)\s*kW"),
        "horsepower_rpm_band": extract_unit_string(sec_engine.get("Horsepower"), r"@\s*([^|]+rpm)"),
        "torque_lbft": extract_unit(sec_engine.get("Maximum torque"), r"(\d+(?:\.\d+)?)\s*lb-ft"),
        "torque_nm": extract_unit(sec_engine.get("Maximum torque"), r"/\s*(\d+(?:\.\d+)?)\s*Nm"),
        "torque_rpm_band": extract_unit_string(sec_engine.get("Maximum torque"), r"@\s*([^|]+rpm)"),
        "drivetrain": sec_engine.get("Drive wheels - Traction - Drivetrain"),
        "transmission": sec_engine.get("Transmission Gearbox - Number of speeds"),
    }])

    vehicle_fuel_emissions = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "fuel_consumption_low_wltp_mpg": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Low WLTP"), r"(\d+(?:\.\d+)?)\s*MPG"),
        "fuel_consumption_low_wltp_l_per_100km": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Low WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*L/100 km"),
        "fuel_consumption_low_wltp_mpg_uk": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Low WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*MPG UK"),
        "fuel_consumption_medium_wltp_mpg": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Medium WLTP"), r"(\d+(?:\.\d+)?)\s*MPG"),
        "fuel_consumption_medium_wltp_l_per_100km": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Medium WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*L/100 km"),
        "fuel_consumption_medium_wltp_mpg_uk": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Medium WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*MPG UK"),
        "fuel_consumption_high_wltp_mpg": extract_unit(sec_fuel.get("Fuel Consumption - Economy - High WLTP"), r"(\d+(?:\.\d+)?)\s*MPG"),
        "fuel_consumption_high_wltp_l_per_100km": extract_unit(sec_fuel.get("Fuel Consumption - Economy - High WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*L/100 km"),
        "fuel_consumption_high_wltp_mpg_uk": extract_unit(sec_fuel.get("Fuel Consumption - Economy - High WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*MPG UK"),
        "fuel_consumption_extra_high_wltp_mpg": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Extra high WLTP"), r"(\d+(?:\.\d+)?)\s*MPG"),
        "fuel_consumption_extra_high_wltp_l_per_100km": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Extra high WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*L/100 km"),
        "fuel_consumption_extra_high_wltp_mpg_uk": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Extra high WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*MPG UK"),
        "fuel_consumption_combined_wltp_mpg": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Combined WLTP"), r"(\d+(?:\.\d+)?)\s*MPG"),
        "fuel_consumption_combined_wltp_l_per_100km": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Combined WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*L/100 km"),
        "fuel_consumption_combined_wltp_mpg_uk": extract_unit(sec_fuel.get("Fuel Consumption - Economy - Combined WLTP"), r"\|\s*(\d+(?:\.\d+)?)\s*MPG UK"),
        "range_wltp_miles": extract_unit(sec_fuel.get("Range (WLTP)"), r"(\d+(?:\.\d+)?)\s*miles"),
        "range_wltp_km": extract_unit(sec_fuel.get("Range (WLTP)"), r"/\s*(\d+(?:\.\d+)?)\s*km"),
        "fuel_tank_gallons": extract_unit(sec_fuel.get("Fuel Tank Capacity"), r"(\d+(?:\.\d+)?)\s*gallons"),
        "fuel_tank_l": extract_unit(sec_fuel.get("Fuel Tank Capacity"), r"\|\s*(\d+(?:\.\d+)?)\s*L"),
        "fuel_tank_uk_gallons": extract_unit(sec_fuel.get("Fuel Tank Capacity"), r"\|\s*(\d+(?:\.\d+)?)\s*UK gallons"),
        "co2_emissions_wltp_g_km": extract_unit(sec_fuel.get("CO2 emissions WLTP"), r"(\d+(?:\.\d+)?)\s*g/km"),
        "co2_emissions_source_note": extract_unit_string(sec_fuel.get("CO2 emissions WLTP"), r"\(([^)]+)\)"),
        "emission_standard": sec_fuel.get("Emission standard"),
        "catalytic_converter": sec_fuel.get("Catalytic converter"),
    }])

    vehicle_factory_performance = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "top_speed_mph": extract_unit(sec_perf.get("Top Speed"), r"(\d+(?:\.\d+)?)\s*Mph"),
        "top_speed_kmh": extract_unit(sec_perf.get("Top Speed"), r"/\s*(\d+(?:\.\d+)?)\s*km/h"),
        "acceleration_0_100_kmh_s": extract_unit(sec_perf.get("Acceleration 0 to 100 km/h (0 to 62 mph)"), r"(\d+(?:\.\d+)?)\s*s"),
    }])

    vehicle_dimensions = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "wheelbase_in": extract_unit(sec_dims.get("Wheelbase"), r"(\d+(?:\.\d+)?)\s*inches"),
        "wheelbase_cm": extract_unit(sec_dims.get("Wheelbase"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "length_in": extract_unit(sec_dims.get("Length"), r"(\d+(?:\.\d+)?)\s*inches"),
        "length_cm": extract_unit(sec_dims.get("Length"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "width_in": extract_unit(sec_dims.get("Width"), r"(\d+(?:\.\d+)?)\s*inches"),
        "width_cm": extract_unit(sec_dims.get("Width"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "width_with_mirrors_in": extract_unit(sec_dims.get("Width with mirrors"), r"(\d+(?:\.\d+)?)\s*inches"),
        "width_with_mirrors_cm": extract_unit(sec_dims.get("Width with mirrors"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "height_in": extract_unit(sec_dims.get("Height"), r"(\d+(?:\.\d+)?)\s*inches"),
        "height_cm": extract_unit(sec_dims.get("Height"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "front_axle_track_in": extract_unit(sec_dims.get("Front Axle"), r"(\d+(?:\.\d+)?)\s*inches"),
        "front_axle_track_cm": extract_unit(sec_dims.get("Front Axle"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "rear_axle_track_in": extract_unit(sec_dims.get("Rear Axle"), r"(\d+(?:\.\d+)?)\s*inches"),
        "rear_axle_track_cm": extract_unit(sec_dims.get("Rear Axle"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "ground_clearance_in": extract_unit(sec_dims.get("Ground clearance"), r"(\d+(?:\.\d+)?)\s*inches"),
        "ground_clearance_cm": extract_unit(sec_dims.get("Ground clearance"), r"/\s*(\d+(?:\.\d+)?)\s*cm"),
        "drag_coefficient_cx": None if sec_dims.get("Aerodynamic drag coefficient - Cx") == "-" else to_float(sec_dims.get("Aerodynamic drag coefficient - Cx")),
        "curb_weight_lb": extract_unit(sec_dims.get("Curb Weight"), r"(\d+(?:\.\d+)?)\s*lbs"),
        "curb_weight_kg": extract_unit(sec_dims.get("Curb Weight"), r"/\s*(\d+(?:\.\d+)?)\s*kg"),
        "weight_power_ratio_kg_per_hp": extract_unit(sec_dims.get("Weight/Power Output Ratio"), r"(\d+(?:\.\d+)?)\s*kg/hp"),
        "trunk_capacity_cuft": extract_unit(sec_interior.get("Trunk / Boot capacity"), r"(\d+(?:\.\d+)?)\s*cu-ft"),
        "trunk_capacity_l": extract_unit(sec_interior.get("Trunk / Boot capacity"), r"/\s*(\d+(?:\.\d+)?)\s*L"),
    }])

    vehicle_chassis_specs = pd.DataFrame([{
        "vehicle_id": vehicle_id,
        "front_brake_type": extract_unit_string(sec_chassis.get("Front Brakes - Disc dimensions"), r"([^|]+)"),
        "front_brake_disc_in": extract_unit(sec_chassis.get("Front Brakes - Disc dimensions"), r"\((\d+(?:\.\d+)?)\s*inches"),
        "front_brake_disc_mm": extract_unit(sec_chassis.get("Front Brakes - Disc dimensions"), r"/\s*(\d+(?:\.\d+)?)\s*mm\)"),
        "rear_brake_type": extract_unit_string(sec_chassis.get("Rear Brakes - Disc dimensions"), r"([^|]+)"),
        "rear_brake_disc_in": extract_unit(sec_chassis.get("Rear Brakes - Disc dimensions"), r"\((\d+(?:\.\d+)?)\s*inches"),
        "rear_brake_disc_mm": extract_unit(sec_chassis.get("Rear Brakes - Disc dimensions"), r"/\s*(\d+(?:\.\d+)?)\s*mm\)"),
        "front_tires": sec_chassis.get("Front Tyres - Rims dimensions"),
        "rear_tires": sec_chassis.get("Rear Tyres - Rims dimensions"),
        "turning_circle_ft": extract_unit(sec_chassis.get("Turning circle"), r"(\d+(?:\.\d+)?)\s*feet"),
        "turning_circle_m": extract_unit(sec_chassis.get("Turning circle"), r"/\s*(\d+(?:\.\d+)?)\s*m"),
        "front_suspension": sec_chassis.get("Front Suspension"),
        "rear_suspension": sec_chassis.get("Rear Suspension"),
    }])

    source_facts_rows = []
    for section_name, rows in sections.items():
        for label, value in rows.items():
            source_facts_rows.append({
                "vehicle_id": vehicle_id,
                "source_name": "Ultimate Specs",
                "source_url": url,
                "section_name": section_name,
                "section_slug": SECTION_TO_SLUG.get(section_name, normalize_label(section_name)),
                "fact_label": label,
                "fact_key": normalize_label(label),
                "fact_value": value,
            })
    vehicle_source_facts = pd.DataFrame(source_facts_rows)

    return {
        "vehicles": vehicles,
        "vehicle_powertrain_specs": vehicle_powertrain_specs,
        "vehicle_fuel_emissions": vehicle_fuel_emissions,
        "vehicle_factory_performance": vehicle_factory_performance,
        "vehicle_dimensions": vehicle_dimensions,
        "vehicle_chassis_specs": vehicle_chassis_specs,
        "vehicle_source_facts": vehicle_source_facts,
    }


def scrape_ultimatespecs_to_redlineiq(url: str = URL) -> Dict[str, pd.DataFrame]:
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    lines = get_text_lines_from_html(response.text)
    sections = parse_sections_from_lines(lines)
    return build_vehicle_bundle(url, lines, sections)


def write_outputs(bundle: Dict[str, pd.DataFrame], outdir: Path) -> None:
    outdir.mkdir(parents=True, exist_ok=True)
    for table_name, df in bundle.items():
        df.to_csv(outdir / f"{table_name}.csv", index=False)
        pq.write_table(pa.Table.from_pandas(df, preserve_index=False), outdir / f"{table_name}.parquet")


def main() -> None:
    outdir = Path("output") / "ultimate_specs_gr_supra_seed"
    bundle = scrape_ultimatespecs_to_redlineiq(URL)
    write_outputs(bundle, outdir)
    summary = {name: {"rows": int(len(df)), "cols": list(df.columns)} for name, df in bundle.items()}
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
