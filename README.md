# RedlineIQ
RedlineIQ is a performance car build planning platform that helps users choose parts, compare build paths, and understand the tradeoffs behind a modification plan.

The current MVP focuses on the Toyota GR Supra A90/A91 platform and recommends parts based on vehicle fitment, build goal, target power, budget, risk level, and supporting evidence. The system also uses retrieval and an LLM to explain why a recommendation was made, but the long-term goal is much larger than an AI chatbot.

RedlineIQ is being built as a data-driven automotive intelligence platform for enthusiasts, builders, and future ML-powered recommendation systems.


## Why I built this
Planning a performance car build is hard because the information is scattered.

A single build decision can involve:
- Product pages
- Forum posts
- Dyno results
- Track discussions
- Tuning requirements
- Supporting modifications
- Fitment notes
- Budget constraints
- Reliability tradeoffs
- Emissions and installation risks

Most people end up jumping between forums, shops, YouTube videos, spreadsheets, and old posts to make decisions.
#### Goal - Help answer questions like this:
- What parts combination gets me to 500 whp on a GR Supra within budget?
- What supporting mods are required for this target?
- What reliability risk am I creating?
- What setup is best for drag / street / track / time attack?
- Which build path is most cost-efficient?
- What real-world community evidence supports that recommendation?


### Accomplishments
- Data gathered from various sources - forums, stores, racecar courses, vechicle specs
- EDA, ETL, and Postgres schema design and data added to PostgreSQL
- Built a FastAPI service over normalized PostgreSQL tables for 
    - vehicles, variants, parts, fitment logic, recommendation rules, forum evidence, and RAG-ready chunks.







## Screenshots of Prototype UI

### Dashboard View
![Dashboard View](docs/images/Main%20Dashboard%20Screen.png)

### Build Screen
![Build Optimizer](docs/images/Build%20Goal%20Screen.png)

### Garage Catalog Page
![Results Page](docs/images/Garage%20Catalog%20Screen.png)








## Version 1
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






# RedlineIQ

## Problem
Performance car build planning is noisy, fragmented, and high-risk.

## Solution
RedlineIQ uses GenAI, ML, RAG, and structured recommendation logic to generate explainable build plans.

## Demo
Screenshots and live app link.

## Architecture
Diagram of data → ML → RAG → API → UI → monitoring.

## Data
Parts catalog, forum evidence, dyno claims, lap times, HPA transcripts, chassis specs.

## Data Cleaning
Deduplication, category normalization, fitment extraction, risk extraction, evidence scoring.

## ML System
Recommendation scoring, dependency logic, optimization, ML ranking roadmap.

## LLM System
RAG, prompt versioning, grounded explanations, LLM evaluation.

## MLOps
MLflow, data validation, model registry, evaluation, monitoring.

## LLMOps
Tracing, prompt evaluation, latency/cost, unsupported-claim rate.

## Product Analytics
Funnels, save/export rate, evidence engagement, experiment design.

## Deployment
Docker, FastAPI, Postgres, frontend, CI/CD.

## Limitations
Not professional automotive advice, claims need validation, data coverage limitations.

## Future Work
More vehicles, price tracking, user feedback, bandit personalization, lap-time prediction.





Local LLM:
Ollama + gemma4:e2b

Local embeddings:
sentence-transformers/all-MiniLM-L6-v2 or BAAI/bge-small-en-v1.5

Database:
Postgres + pgvector

Backend:
FastAPI

Deployment LLM:
Gemini Flash

Frontend:
React/Vite on Vercel

Backend hosting:
Render

Database hosting:
Supabase



https://ai.google.dev/gemini-api/docs