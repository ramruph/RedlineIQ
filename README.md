# RedlineIQ


```
┌──────────────────────────────── FRONTEND ────────────────────────────────┐
│ React + TypeScript + Tailwind                                           │
│                                                                         │
│  BuildGoals   Garage   Drivetrain   Performance   Reliability   Pricing │
│       │          │          │             │             │          │     │
│       └──────────────────────┬─────────────────────────────────────┘     │
│                              │                                           │
│                    API calls to FastAPI backend                          │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────── FASTAPI API ────────────────────────────────┐
│ /validate-build                                                        │
│ /score-build                                                           │
│ /optimize-build                                                        │
│ /simulate-build                                                        │
│ /analyze-build                                                         │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────── APPLICATION LAYER ────────────────────────────┐
│ Pydantic Schemas                                                       │
│ - request validation                                                   │
│ - response formatting                                                  │
│                                                                        │
│ Services / Repositories                                                │
│ - load vehicles/parts                                                  │
│ - query fitments                                                       │
│ - return data to engine                                                │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────── CORE ENGINE ────────────────────────────────┐
│ Scoring Engine      -> score build quality                             │
│ Constraint Engine   -> budget / compatibility / exclusions             │
│ Optimizer           -> best part combination                           │
│ Simulation Engine   -> hp / torque / 0-60 / cost outputs              │
│ Reliability Engine  -> risk / penalty outputs                          │
│ Explain Engine      -> why this build won                              │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────── DATA LAYER ─────────────────────────────────┐
│ SQLAlchemy ORM models                                                  │
│ PostgreSQL                                                             │
│                                                                        │
│ tables:                                                                │
│ vehicles, vehicle_specs, parts, part_fitments,                         │
│ part_dependencies, part_exclusions, build_goals, build_results         │
└─────────────────────────────────────────────────────────────────────────┘

Later ML layers:
- performance prediction model
- learned ranking model
- reliability classifier
- personalization
- telemetry anomaly detection

```



```
redlineiq/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health.py
│   │   │   ├── validate.py
│   │   │   ├── score.py
│   │   │   ├── optimize.py
│   │   │   ├── simulate.py
│   │   │   └── analyze.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── init_db.py
│   │   ├── domain/
│   │   │   ├── enums.py
│   │   │   └── constants.py
│   │   ├── models/
│   │   │   ├── vehicle.py
│   │   │   ├── part.py
│   │   │   └── build.py
│   │   ├── schemas/
│   │   │   ├── vehicle.py
│   │   │   ├── part.py
│   │   │   ├── build.py
│   │   │   └── analysis.py
│   │   ├── repositories/
│   │   │   ├── vehicle_repo.py
│   │   │   ├── part_repo.py
│   │   │   └── build_repo.py
│   │   ├── services/
│   │   │   ├── loaders.py
│   │   │   └── validators.py
│   │   ├── engine/
│   │   │   ├── scoring.py
│   │   │   ├── constraints.py
│   │   │   ├── optimizer.py
│   │   │   ├── simulation.py
│   │   │   ├── reliability.py
│   │   │   ├── explain.py
│   │   │   └── aggregate.py
│   │   ├── data/
│   │   │   ├── vehicles.csv
│   │   │   ├── vehicle_specs.csv
│   │   │   ├── parts.csv
│   │   │   ├── part_fitments.csv
│   │   │   ├── part_dependencies.csv
│   │   │   └── part_exclusions.csv
│   │   └── main.py
│   ├── tests/
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env
├── frontend/
└── docker-compose.yml
```






PostgreSQL = storage
SQLAlchemy = database objects
Pydantic = API contracts
FastAPI = backend interface
Engine = decision logic
Frontend = display layer
ML = intelligence upgrade later


