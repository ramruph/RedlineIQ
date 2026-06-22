--RedlineIQ Database Schema

--pgvector extension 
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS use_cases (
    use_case_id TEXT PRIMARY KEY,
    use_case_name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS power_bands (
    power_band_id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    min_whp NUMERIC,
    max_whp NUMERIC,
    description TEXT
);

CREATE TABLE IF NOT EXISTS engines (
    engine_id TEXT PRIMARY KEY,
    engine_code TEXT NOT NULL,
    manufacturer TEXT,
    displacement_l NUMERIC,
    configuration TEXT,
    induction TEXT,
    fuel_type TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    generation TEXT,
    platform_code TEXT,
    chassis_code TEXT,
    year_start INT,
    year_end INT,
    body_style TEXT,
    market TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_variants (
    variant_id TEXT PRIMARY KEY,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(vehicle_id),
    engine_id TEXT REFERENCES engines(engine_id),
    trim TEXT,
    year_start INT,
    year_end INT,
    drivetrain TEXT,
    transmission TEXT,
    stock_hp NUMERIC,
    stock_tq NUMERIC,
    curb_weight_lbs NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_dimensions (
    variant_id TEXT PRIMARY KEY REFERENCES vehicle_variants(variant_id),
    full_name TEXT,
    wheelbase_in NUMERIC,
    length_in NUMERIC,
    width_in NUMERIC,
    height_in NUMERIC,
    curb_weight_lb NUMERIC,
    front_tires TEXT,
    rear_tires TEXT,
    turning_circle_ft NUMERIC,
    front_suspension TEXT,
    rear_suspension TEXT,
    source_name TEXT,
    source_url TEXT,
    raw_json JSONB
);

CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    product_url TEXT UNIQUE,
    product_name TEXT NOT NULL,
    brand TEXT,
    sku TEXT,
    price NUMERIC,
    regular_price NUMERIC,
    description TEXT,
    specifications TEXT,
    fitment TEXT,
    combined_text TEXT,
    system_category TEXT,
    subsystem TEXT,
    requires_tune BOOLEAN,
    requires_fueling BOOLEAN,
    requires_cooling BOOLEAN,
    requires_professional_install BOOLEAN,
    emissions_risk TEXT,
    reliability_risk TEXT,
    install_complexity TEXT,
    discount_pct NUMERIC,
    price_bucket TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
    product_id TEXT NOT NULL REFERENCES products(product_id),
    product_url TEXT,
    category TEXT,
    category_value TEXT,
    normalized_category TEXT,
    PRIMARY KEY (product_id, category, category_value)
);

CREATE TABLE IF NOT EXISTS part_fitments (
    fitment_id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(product_id),
    vehicle_id TEXT REFERENCES vehicles(vehicle_id),
    variant_id TEXT REFERENCES vehicle_variants(variant_id),
    engine_id TEXT REFERENCES engines(engine_id),
    year_start INT,
    year_end INT,
    fitment_scope TEXT NOT NULL,
    fitment_notes TEXT,
    confidence_score NUMERIC,
    source TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS category_recommendation_rules (
    rule_id TEXT PRIMARY KEY,
    system_category TEXT NOT NULL,
    use_case_id TEXT REFERENCES use_cases(use_case_id),
    power_band_id TEXT REFERENCES power_bands(power_band_id),
    relevance_score NUMERIC DEFAULT 0.75,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (system_category, use_case_id, power_band_id)
);

CREATE TABLE IF NOT EXISTS part_dependencies (
    dependency_id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(product_id),
    required_category TEXT,
    required_subsystem TEXT,
    required_product_id TEXT REFERENCES products(product_id),
    dependency_reason TEXT,
    severity TEXT
);

CREATE TABLE IF NOT EXISTS forum_evidence (
    evidence_id TEXT PRIMARY KEY,
    vehicle_id TEXT REFERENCES vehicles(vehicle_id),
    variant_id TEXT REFERENCES vehicle_variants(variant_id),
    source_dataset TEXT,
    evidence_type TEXT,
    author TEXT,
    created_at TIMESTAMP,
    post_id TEXT,
    cleaned_content TEXT,
    links TEXT,
    images TEXT,
    youtube_videos TEXT,
    links_count INT,
    images_count INT,
    youtube_videos_count INT,
    mentioned_categories TEXT,
    lap_time_seconds NUMERIC,
    track_name TEXT,
    evidence_quality_score NUMERIC
);

CREATE TABLE IF NOT EXISTS hpacademy_chunks (
    chunk_id TEXT PRIMARY KEY,
    doc_id TEXT,
    source_type TEXT,
    course_type TEXT,
    course_name TEXT,
    module_title TEXT,
    lesson_title TEXT,
    item_url TEXT,
    video_url TEXT,
    chunk_index INT,
    chunk_text TEXT
);

CREATE TABLE IF NOT EXISTS product_evidence_chunks (
    chunk_id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(product_id),
    source_type TEXT,
    chunk_type TEXT,
    product_url TEXT,
    product_name TEXT,
    combined_text TEXT
);

-- Using sentence-transformers/all-MiniLM-L6-v2 => vector(384).
CREATE TABLE IF NOT EXISTS rag_chunks (
    chunk_id TEXT PRIMARY KEY,
    source_table TEXT,
    source_id TEXT,
    vehicle_id TEXT REFERENCES vehicles(vehicle_id),
    variant_id TEXT REFERENCES vehicle_variants(variant_id),
    product_id TEXT REFERENCES products(product_id),
    source_type TEXT,
    title TEXT,
    chunk_text TEXT,
    metadata JSONB,
    embedding_model TEXT DEFAULT 'sentence-transformers/all-MiniLM-L6-v2',
    embedding_dim INT DEFAULT 384,
    embedding vector(384)
);
-- google/embeddinggemma-300m => vector(768) - for later when we want to add higher quality embeddings for RAG retrieval
-- CREATE TABLE IF NOT EXISTS rag_chunks (
--     chunk_id TEXT PRIMARY KEY,
--     source_table TEXT,
--     source_id TEXT,
--     vehicle_id TEXT REFERENCES vehicles(vehicle_id),
--     variant_id TEXT REFERENCES vehicle_variants(variant_id),
--     product_id TEXT REFERENCES products(product_id),
--     source_type TEXT,
--     title TEXT,
--     chunk_text TEXT,
--     metadata JSONB,
--     embedding_model TEXT DEFAULT 'google/embeddinggemma-300m',
--     embedding_dim INT DEFAULT 768,
--     embedding vector(768)
-- );

CREATE TABLE IF NOT EXISTS recommendation_events (
    event_id TEXT PRIMARY KEY,
    session_id TEXT,
    vehicle_id TEXT REFERENCES vehicles(vehicle_id),
    variant_id TEXT REFERENCES vehicle_variants(variant_id),
    target_whp NUMERIC,
    budget NUMERIC,
    use_case TEXT,
    risk_tolerance TEXT,
    recommended_product_ids TEXT[],
    total_cost NUMERIC,
    confidence_score NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS load_audit (
    load_id TEXT PRIMARY KEY,
    table_name TEXT,
    source_file TEXT,
    row_count INT,
    loaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(system_category, subsystem);
CREATE INDEX IF NOT EXISTS idx_part_fitments_vehicle ON part_fitments(vehicle_id, variant_id, engine_id);
CREATE INDEX IF NOT EXISTS idx_category_rules_lookup ON category_recommendation_rules(use_case_id, power_band_id, system_category);




CREATE TABLE IF NOT EXISTS llm_runs (
    run_id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    vehicle_id TEXT,
    variant_id TEXT,
    use_case TEXT,
    target_whp NUMERIC,
    prompt_version TEXT,
    model_name TEXT,
    llm_provider TEXT,
    embedding_model TEXT,
    retrieved_chunk_ids TEXT[],
    answer TEXT,
    latency_ms NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);