from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable

import pandas as pd


def slugify(value: Any, max_len: int = 100) -> str:
    value = "" if value is None else str(value)
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "_", value).strip("_")
    return (value or "unknown")[:max_len]


def stable_id(prefix: str, *parts: Any, max_len: int = 120) -> str:
    raw = "|".join("" if p is None else str(p) for p in parts)
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]
    human = slugify("_".join(str(p) for p in parts if p is not None), max_len=70)
    return f"{prefix}_{human}_{digest}"[:max_len]


def sha256_text(text: str) -> str:
    return hashlib.sha256((text or "").encode("utf-8")).hexdigest()


def file_hash(path: str | Path) -> str:
    h = hashlib.sha256()
    with Path(path).open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def read_any_table(path: str | Path) -> pd.DataFrame:
    path = Path(path)
    suffix = path.suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(path)
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path)
    if suffix == ".parquet":
        return pd.read_parquet(path)
    if suffix == ".json":
        return pd.read_json(path)
    if suffix == ".jsonl":
        return pd.read_json(path, lines=True)
    raise ValueError(f"Unsupported tabular file type: {path}")


def read_text_file(path: str | Path) -> str:
    return Path(path).read_text(encoding="utf-8", errors="ignore")


def clean_money(value: Any) -> float | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    text = str(value).strip()
    if not text:
        return None
    text = re.sub(r"[^0-9.\-]", "", text)
    if text in {"", ".", "-"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def clean_float(value: Any) -> float | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    text = str(value).strip()
    if not text:
        return None
    match = re.search(r"-?\d+(?:\.\d+)?", text.replace(",", ""))
    if not match:
        return None
    return float(match.group(0))


def clean_int(value: Any) -> int | None:
    x = clean_float(value)
    return int(x) if x is not None else None


def clean_bool(value: Any) -> bool | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    text = str(value).strip().lower()
    if text in {"1", "true", "yes", "y", "in stock", "available"}:
        return True
    if text in {"0", "false", "no", "n", "out of stock", "sold out"}:
        return False
    return None


def first_present(row: dict[str, Any], candidates: Iterable[str], default: Any = None) -> Any:
    lowered = {str(k).strip().lower(): k for k in row.keys()}
    for name in candidates:
        key = lowered.get(name.lower())
        if key is not None:
            val = row.get(key)
            if val is not None and not (isinstance(val, float) and pd.isna(val)) and str(val).strip() != "":
                return val
    return default


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [slugify(c, 80) for c in df.columns]
    return df


def row_payload(row: dict[str, Any]) -> str:
    clean = {}
    for k, v in row.items():
        if pd.isna(v):
            clean[k] = None
        elif isinstance(v, (datetime, pd.Timestamp)):
            clean[k] = v.isoformat()
        else:
            clean[k] = v
    return json.dumps(clean, default=str, sort_keys=True)


def chunk_text(text: str, chunk_chars: int = 3500, overlap_chars: int = 300) -> list[str]:
    text = re.sub(r"\s+", " ", text or "").strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_chars, len(text))
        chunks.append(text[start:end].strip())
        if end == len(text):
            break
        start = max(0, end - overlap_chars)
    return chunks
