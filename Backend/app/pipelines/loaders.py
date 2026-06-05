from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.models.part import Part, PartFitment
from app.models.source import KnowledgeChunk, KnowledgeDocument, PartPriceEvent
from app.models.vehicle import Vehicle, VehicleSpec
from app.pipelines.ingest import register_source
from app.pipelines.utils import (
    chunk_text,
    clean_bool,
    clean_float,
    clean_int,
    clean_money,
    file_hash,
    first_present,
    normalize_columns,
    read_any_table,
    read_text_file,
    row_payload,
    sha256_text,
    stable_id,
)


def upsert_vehicle(db: Session, row: dict, default_vehicle_id: str | None = None) -> Vehicle:
    make = str(first_present(row, ["make", "manufacturer"], "Toyota"))
    model = str(first_present(row, ["model", "vehicle_model"], "GR Supra"))
    year_start = clean_int(first_present(row, ["year_start", "year", "from_year"], 2020)) or 2020
    year_end = clean_int(first_present(row, ["year_end", "year", "to_year"], year_start)) or year_start
    trim = first_present(row, ["trim", "version"], None)
    engine_code = first_present(row, ["engine_code", "engine", "engine_type"], None)
    chassis_code = first_present(row, ["chassis_code", "chassis", "platform"], None)
    vehicle_id = default_vehicle_id or str(first_present(row, ["vehicle_id"], None) or stable_id("veh", make, model, trim, year_start, year_end, engine_code))

    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        vehicle = Vehicle(
            vehicle_id=vehicle_id,
            make=make,
            model=model,
            generation=first_present(row, ["generation"], None),
            chassis_code=chassis_code,
            platform_code=first_present(row, ["platform_code"], None),
            year_start=year_start,
            year_end=year_end,
            trim=trim,
            engine_code=engine_code,
            engine_family=first_present(row, ["engine_family"], None),
            drivetrain=str(first_present(row, ["drivetrain", "drive"], "RWD")),
            body_style=first_present(row, ["body_style", "body"], None),
            transmission_options=first_present(row, ["transmission_options", "transmission"], None),
            market_region=first_present(row, ["market_region", "region"], None),
            is_active=True,
        )
        db.add(vehicle)
    return vehicle


def load_vehicle_specs_file(db: Session, path: str | Path, source_name: str = "vehicle_specs") -> int:
    path = Path(path)
    df = normalize_columns(read_any_table(path))
    source = register_source(db, path, "vehicle_specs", source_name)
    count = 0
    for _, s in df.iterrows():
        row = s.to_dict()
        vehicle = upsert_vehicle(db, row)
        spec_id = str(first_present(row, ["vehicle_spec_id"], None) or stable_id("vspec", vehicle.vehicle_id, source.source_id))
        spec = db.get(VehicleSpec, spec_id)
        if not spec:
            spec = VehicleSpec(
                vehicle_spec_id=spec_id,
                vehicle_id=vehicle.vehicle_id,
                base_hp=clean_float(first_present(row, ["base_hp", "horsepower", "power", "hp"], 0)) or 0,
                base_torque_lbft=clean_float(first_present(row, ["base_torque_lbft", "torque", "torque_lbft"], None)),
                curb_weight_kg=clean_float(first_present(row, ["curb_weight_kg", "weight_kg", "kerb_weight_kg"], None)),
                weight_distribution_f=clean_float(first_present(row, ["weight_distribution_f", "front_weight_distribution"], None)),
                wheelbase_mm=clean_float(first_present(row, ["wheelbase_mm", "wheelbase"], None)),
                length_mm=clean_float(first_present(row, ["length_mm", "length"], None)),
                width_mm=clean_float(first_present(row, ["width_mm", "width"], None)),
                height_mm=clean_float(first_present(row, ["height_mm", "height"], None)),
                fuel_type=first_present(row, ["fuel_type", "fuel"], None),
                induction_type=first_present(row, ["induction_type", "induction", "aspiration"], None),
                displacement_l=clean_float(first_present(row, ["displacement_l", "engine_displacement_l", "displacement"], None)),
                cylinders=clean_int(first_present(row, ["cylinders", "num_cylinders"], None)),
                redline_rpm=clean_int(first_present(row, ["redline_rpm", "redline"], None)),
                drag_coefficient=clean_float(first_present(row, ["drag_coefficient", "cd"], None)),
                frontal_area_m2=clean_float(first_present(row, ["frontal_area_m2", "frontal_area"], None)),
                stock_top_speed_mph=clean_float(first_present(row, ["stock_top_speed_mph", "top_speed_mph"], None)),
                stock_0_60_sec=clean_float(first_present(row, ["stock_0_60_sec", "0_60_mph_sec", "zero_to_sixty"], None)),
                stock_quarter_mile_sec=clean_float(first_present(row, ["stock_quarter_mile_sec", "quarter_mile_sec"], None)),
                source_name=source.source_name,
                source_url=first_present(row, ["source_url", "url"], None),
                confidence_score=clean_float(first_present(row, ["confidence_score"], 0.8)) or 0.8,
            )
            db.add(spec)
            count += 1
    source.rows_loaded = count
    db.commit()
    return count


def load_parts_file(db: Session, path: str | Path, source_name: str = "parts_catalog", default_vehicle_id: str | None = None) -> int:
    path = Path(path)
    df = normalize_columns(read_any_table(path))
    source = register_source(db, path, "parts", source_name)
    count = 0
    for _, s in df.iterrows():
        row = s.to_dict()
        name = str(first_present(row, ["name", "product_name", "title"], "Unknown Part"))
        brand = str(first_present(row, ["brand", "manufacturer"], "Unknown"))
        sku = first_present(row, ["sku", "part_number"], None)
        product_url = first_present(row, ["product_url", "source_product_url", "url"], None)
        part_id = str(first_present(row, ["part_id"], None) or stable_id("part", brand, name, sku, product_url))
        price = clean_money(first_present(row, ["price_usd", "price", "current_price_usd"], 0)) or 0.0
        part = db.get(Part, part_id)
        if not part:
            part = Part(part_id=part_id, brand=brand, name=name, category=str(first_present(row, ["category", "category_text"], "unknown")), price_usd=price)
            db.add(part)
        part.subcategory = first_present(row, ["subcategory", "category_value"], part.subcategory)
        part.description = first_present(row, ["description", "description_raw"], part.description)
        part.currency = str(first_present(row, ["currency", "currency_code"], part.currency or "USD"))
        part.hp_gain = clean_float(first_present(row, ["hp_gain", "horsepower_gain", "estimated_hp_gain"], part.hp_gain)) or part.hp_gain or 0.0
        part.torque_gain_lbft = clean_float(first_present(row, ["torque_gain_lbft", "torque_gain"], part.torque_gain_lbft)) or part.torque_gain_lbft or 0.0
        part.weight_delta_kg = clean_float(first_present(row, ["weight_delta_kg", "weight_delta"], part.weight_delta_kg)) or part.weight_delta_kg or 0.0
        part.reliability_penalty = clean_float(first_present(row, ["reliability_penalty"], part.reliability_penalty)) or part.reliability_penalty or 0.0
        part.cooling_penalty = clean_float(first_present(row, ["cooling_penalty"], part.cooling_penalty)) or part.cooling_penalty or 0.0
        part.install_difficulty = clean_int(first_present(row, ["install_difficulty"], part.install_difficulty)) or part.install_difficulty or 1
        part.street_legal = clean_bool(first_present(row, ["street_legal"], part.street_legal)) if first_present(row, ["street_legal"], None) is not None else part.street_legal
        part.tune_required = clean_bool(first_present(row, ["tune_required"], part.tune_required)) or False
        part.fueling_required = clean_bool(first_present(row, ["fueling_required"], part.fueling_required)) or False
        part.cooling_upgrade_required = clean_bool(first_present(row, ["cooling_upgrade_required"], part.cooling_upgrade_required)) or False
        part.source_name = source.source_name
        part.source_url = first_present(row, ["source_url", "url"], part.source_url)
        part.sku = sku or part.sku
        part.vendor_part_key = first_present(row, ["vendor_part_key"], part.vendor_part_key)
        part.source_product_url = product_url or part.source_product_url
        part.source_category_raw = first_present(row, ["category", "category_text", "source_category_raw"], part.source_category_raw)
        part.source_subcategory_raw = first_present(row, ["subcategory", "category_value"], part.source_subcategory_raw)
        part.current_price_usd = price
        part.current_regular_price_usd = clean_money(first_present(row, ["regular_price", "regular_price_usd"], None))
        part.current_sale_price_usd = clean_money(first_present(row, ["sale_price", "sale_price_usd"], None))
        part.currency_code = str(first_present(row, ["currency", "currency_code"], "USD"))
        part.in_stock = clean_bool(first_present(row, ["in_stock", "availability"], None))
        part.is_on_sale = bool(part.current_sale_price_usd and part.current_regular_price_usd and part.current_sale_price_usd < part.current_regular_price_usd)
        part.primary_image_url = first_present(row, ["primary_image_url", "image_url", "image_urls"], part.primary_image_url)
        part.description_raw = first_present(row, ["description_raw", "description"], part.description_raw)
        part.features_raw = first_present(row, ["features_raw", "features"], part.features_raw)
        part.fitment_raw = first_present(row, ["fitment_raw", "fitment"], part.fitment_raw)
        part.specifications_raw = first_present(row, ["specifications_raw", "specifications"], part.specifications_raw)
        part.extraction_status = "loaded"
        part.source_hash = sha256_text(row_payload(row))

        event_id = stable_id("price", part_id, source.source_id, part.source_hash[:10])
        if not db.get(PartPriceEvent, event_id):
            db.add(PartPriceEvent(price_event_id=event_id, part_id=part_id, source_id=source.source_id, price_usd=price, regular_price_usd=part.current_regular_price_usd, sale_price_usd=part.current_sale_price_usd, currency=part.currency_code or "USD", in_stock=part.in_stock, product_url=product_url, source_hash=part.source_hash))

        fit_vehicle_id = first_present(row, ["vehicle_id"], default_vehicle_id)
        if fit_vehicle_id and db.get(Vehicle, str(fit_vehicle_id)):
            fitment_id = stable_id("fit", part_id, fit_vehicle_id)
            if not db.get(PartFitment, fitment_id):
                db.add(PartFitment(fitment_id=fitment_id, part_id=part_id, vehicle_id=str(fit_vehicle_id), fitment_type="direct", fitment_notes=first_present(row, ["fitment", "fitment_raw"], None), source_name=source.source_name))
        count += 1
    source.rows_loaded = count
    db.commit()
    return count


def load_knowledge_file(db: Session, path: str | Path, document_type: str, source_name: str | None = None, default_vehicle_id: str | None = None) -> int:
    path = Path(path)
    source = register_source(db, path, document_type, source_name or path.stem)
    docs_loaded = 0
    if path.suffix.lower() in {".csv", ".xlsx", ".xls", ".parquet", ".json", ".jsonl"}:
        df = normalize_columns(read_any_table(path))
        rows = df.to_dict("records")
    else:
        rows = [{"title": path.stem, "text": read_text_file(path), "url": None, "author": None}]

    for i, row in enumerate(rows):
        text = str(first_present(row, ["text", "content", "body", "post_text", "transcript"], "") or "")
        if not text.strip():
            continue
        title = first_present(row, ["title", "thread_title", "course_title", "lesson_title"], path.stem)
        url = first_present(row, ["url", "post_url", "thread_url"], None)
        content_hash = sha256_text(f"{title}|{url}|{text}")
        doc_id = stable_id("doc", document_type, title, content_hash[:10])
        doc = db.get(KnowledgeDocument, doc_id)
        if not doc:
            doc = KnowledgeDocument(document_id=doc_id, source_id=source.source_id, document_type=document_type, title=str(title)[:240] if title else None, author=first_present(row, ["author", "username"], None), vehicle_id=first_present(row, ["vehicle_id"], default_vehicle_id), url=url, text=text, content_hash=content_hash, extraction_status="pending")
            db.add(doc)
            db.flush()
            for idx, chunk in enumerate(chunk_text(text)):
                db.add(KnowledgeChunk(chunk_id=stable_id("chunk", doc_id, idx), document_id=doc_id, chunk_index=idx, text=chunk, token_estimate=max(1, len(chunk) // 4)))
            docs_loaded += 1
    source.rows_loaded = docs_loaded
    db.commit()
    return docs_loaded
