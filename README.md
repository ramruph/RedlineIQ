# RedlineIQ


```
flowchart TD
    A[Raw Data Files<br/>CSV, JSON, HTML, TXT, Parquet] --> B[Landing Zone<br/>data/raw]

    B --> C[Python Ingestion Layer<br/>pandas + pathlib + SQLAlchemy]
    C --> D[Pydantic Validation<br/>schema contracts + type safety]

    D --> E[Raw/Staging Tables<br/>raw_forum_posts<br/>raw_course_transcripts<br/>raw_parts<br/>raw_vehicle_specs]

    E --> F[Transform Layer<br/>SQL + Python + dbt later]

    F --> G[Core RedlineIQ Tables<br/>vehicles<br/>vehicle_specs<br/>parts<br/>part_fitments<br/>part_dependencies<br/>part_exclusions]

    F --> H[Evidence Tables<br/>evidence_part_mentions<br/>extracted_build_evidence<br/>build_outcomes]

    G --> I[Analytics / App Layer<br/>FastAPI + frontend]
    H --> I

    G --> J[ML Feature Tables<br/>vehicle_part_features<br/>build_training_examples]
    H --> J

    J --> K[Model Training<br/>sklearn/XGBoost/PyTorch later]
    K --> L[MLflow Registry<br/>models + metrics]

    J --> M[Feature Store Later<br/>Feast]
    M --> N[Prediction API<br/>FastAPI]
```






PostgreSQL = storage
SQLAlchemy = database objects
Pydantic = API contracts
FastAPI = backend interface
Engine = decision logic
Frontend = display layer
ML = intelligence upgrade later



FastAPI is responsible for:
- receiving HTTP requests
- validating incoming data
- getting a database session
- calling your engine logic
- returning structured JSON responses

RedlineIQ is an intelligent racecar/build planning platform that can answer questions like:
- What parts combination gets me to 500 whp on a GR Supra within budget?
- What supporting mods are required for this target?
- What reliability risk am I creating?
- What setup is best for drag / street / track / time attack?
- Which build path is most cost-efficient?
- What real-world community evidence supports that recommendation?







## Resources
- https://www.ultimatespecs.com/car-specs/Toyota/145989/Toyota-GR-Supra-30.html
- a90shop.com
- https://www.startmycar.com/us


