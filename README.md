# RedlineIQ
RedlineIQ is a performance car build planning platform that helps users choose parts, compare build paths, and understand the tradeoffs behind a modification plan.

The current version focuses on the Toyota GR Supra A90/A91 platform and recommends parts based on vehicle fitment, build goal, target power, budget, risk level, and supporting evidence. The system also uses retrieval and an LLM to explain why a recommendation was made, but the long-term goal is much larger than an AI chatbot.

RedlineIQ is being built as a data-driven automotive intelligence platform for enthusiasts, builders, and future ML-powered recommendation systems.


## Why I built this
Planning a performance car build is hard because the information is scattered.

A single build decision can involve:
- Parts (Products) pages
- Forum posts
- Dyno results
- Track discussions
- Tuning requirements
- Supporting modifications
- Fitment notes
- Budget constraints
- Reliability tradeoffs
- Emissions and installation risks

RedlineIQ brings this information into one structured system so users can compare build paths with more context.

#### Goal - Help answer questions like this:
- What parts combination gets me to 500 whp on a GR Supra within budget?
- What supporting mods are required for this target?
- What reliability risk am I creating?
- What setup is best for drag / street / track / time attack?
- Which build path is most cost-efficient?
- What real-world community evidence supports that recommendation?







## Screenshots of Prototype UI

### Dashboard View
![Dashboard View](docs/images/Main%20Dashboard%20Screen.png)

### Build Screen
![Build Optimizer](docs/images/Build%20Goal%20Screen.png)

### Garage Catalog Page
![Results Page](docs/images/Garage%20Catalog%20Screen.png)



## Roadmap

### Version 0.1 — MVP

- Toyota GR Supra A90/A91 support
- Build recommendation API
- React build planner
- PostgreSQL schema
- pgvector RAG retrieval
- LLM-generated build explanation
- Evidence display
- Product catalog
- Basic analytics

### Version 0.2 — Data Quality

- Product deduplication
- Better fitment validation
- Source tracking
- Chunk quality checks
- Retrieval evaluation
- Data quality reports
- More complete product metadata

### Version 0.3 — More Vehicles

Planned expansion:

- Toyota Supra A80
- Nissan GT-R R35
- Nissan Skyline GT-R R32/R34
- Nissan 240SX
- Toyota AE86
- Mazda RX-7 FD
- BMW M platforms
- Honda K-series platforms

### Version 0.4 — Build Planning Features

- Saved garages
- Saved builds
- Build comparison
- Multi-stage build planning
- Part watchlists
- Price tracking
- Budget alerts
- Build export/share
- Compatibility warnings
- Supporting modification checklist

### Version 0.5 - LLM Extraction Pipeline
Future LLM work will extract structured data from messy text sources.

Example:

```text
Forum post
    ↓
LLM extraction
    ↓
Validated structured output
    ↓
Evidence database
    ↓
ML features
```

Extraction targets:

- Part mentions
- Power levels
- Dyno claims
- Track results
- Fueling requirements
- Cooling requirements
- Tuning requirements
- Reliability concerns
- Install difficulty
- Build context
- Confidence level

### Version 0.6 — ML Ranking

Future supervised ranking will use interaction data such as:

- Recommended products
- Clicked products
- Saved products
- Removed products
- Regenerated builds
- Budget changes
- Use case changes
- Evidence expanded
- Builds exported

Potential models:

- Logistic regression baseline
- Random Forest
- XGBoost
- LightGBM ranker
- Neural ranking model

Potential metrics:

- Precision@K
- Recall@K
- NDCG@K
- Mean reciprocal rank
- Constraint violation rate
- User save rate
- Build acceptance rate



### Version 1.0
GenAI + ML recommendation and product analytics platform that transforms unstructured automotive parts data into structured intelligence, recommends optimized build paths, and measures product impact through experimentation-ready metrics.





## Resources and Links
- https://www.ultimatespecs.com/car-specs/Toyota/145989/Toyota-GR-Supra-30.html
- a90shop.com
- https://www.startmycar.com/us
- https://fastapi.tiangolo.com/
- https://medium.com/data-science/learning-to-rank-a-complete-guide-to-ranking-using-machine-learning-4c9688d370d4
- https://ai.google.dev/gemini-api/docs
- https://hub.docker.com/_/python
- https://nginx.org/ 
- https://ai.google.dev/gemini-api/docs









