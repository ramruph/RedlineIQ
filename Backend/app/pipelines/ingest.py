from __future__ import annotations

from pathlib import Path

from sqlalchemy.orm import Session

from app.models.source import DataSource, RawIngestRecord
from app.pipelines.utils import file_hash, read_any_table, row_payload, sha256_text, stable_id


def register_source(db: Session, path: Path, source_type: str, source_name: str | None = None) -> DataSource:
    fid = file_hash(path)
    source = DataSource(
        source_id=stable_id("src", source_type, source_name or path.stem, fid[:10]),
        source_type=source_type,
        source_name=source_name or path.stem,
        file_path=str(path),
        file_hash=fid,
        status="loaded",
    )
    existing = db.get(DataSource, source.source_id)
    if existing:
        return existing
    db.add(source)
    db.flush()
    return source


def ingest_tabular_file(db: Session, path: str | Path, record_type: str, source_name: str | None = None) -> int:
    path = Path(path)
    df = read_any_table(path)
    source = register_source(db, path, record_type, source_name)
    loaded = 0
    for i, row in df.iterrows():
        payload = row_payload(row.to_dict())
        h = sha256_text(payload)
        raw_id = stable_id("raw", source.source_id, i, h[:10])
        if db.get(RawIngestRecord, raw_id):
            continue
        db.add(
            RawIngestRecord(
                raw_record_id=raw_id,
                source_id=source.source_id,
                record_type=record_type,
                natural_key=str(row.get("product_url") or row.get("url") or row.get("part_id") or i),
                payload_json=payload,
                source_hash=h,
            )
        )
        loaded += 1
    source.rows_loaded = (source.rows_loaded or 0) + loaded
    db.commit()
    return loaded
