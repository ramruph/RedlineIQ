<p align="center">
  <img src="docs/images/SupraAtSebring.JPG" width="850" alt="Me and Toyota Supra on track at Sebring">
</p>

<h1 align="center">RedlineIQ</h1>

<p align="center">
  <strong>Automotive Intelligence Platform for Performance Car Build Planning</strong>
</p>


<p align="center">
  <a href="#demo">Demo</a> |
  <a href="#why-i-built-this">Why</a> |
  <a href="#tldr-summary">TLDR</a> |
  <a href="#tech-stack">Tech Stack</a> |
  <a href="#data-pipeline">Data Pipeline</a> |
  <a href="#genai--rag-flow">GenAI / RAG</a> |
  <a href="#run-locally">Run Locally</a> |
  <a href="#deployment">Deployment</a> |
  <a href="#roadmap">Roadmap</a> |
  <a href="#screenshots-of-prototype-ui">Screenshots</a> |
  <a href="#resources-and-links">Resources</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-Backend-blue" alt="Python badge">
  <img src="https://img.shields.io/badge/FastAPI-API-green" alt="FastAPI badge">
  <img src="https://img.shields.io/badge/React-Frontend-blue" alt="React badge">
  <img src="https://img.shields.io/badge/TypeScript-Frontend-blue" alt="TypeScript badge">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue" alt="PostgreSQL badge">
  <img src="https://img.shields.io/badge/pgvector-Semantic_Search-purple" alt="pgvector badge">
  <img src="https://img.shields.io/badge/RAG-GenAI-orange" alt="RAG badge">
  <img src="https://img.shields.io/badge/Docker-Ready-blue" alt="Docker badge">
</p>

RedlineIQ is a data-driven automotive intelligence platform for performance car build planning. It turns scattered, unstructured automotive knowledge into a structured recommendation system that helps enthusiasts compare parts, understand tradeoffs, evaluate risks, and choose build paths based on goals, budget, fitment, and supporting evidence.

The current MVP focuses on the Toyota GR Supra A90 platform and combines a React frontend, FastAPI backend, PostgreSQL database, `pgvector` semantic search, and LLM-generated explanations grounded in retrieved evidence.

## Why I built this
RedlineIQ was built from a personal connection to cars, motorsports, and machine learning. From my own experience, planning a serious performance car build can become a messy research process. Information is scattered across product pages, forums, dyno results, tuning discussions, fitment notes, budget constraints, reliability tradeoffs, and real-world community feedback.

The goal of RedlineIQ is to turn that scattered knowledge into structured intelligence for better build planning.

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
- Many other factors.

The long-term vision is to build an automotive intelligence platform for performance builds, not just a parts recommender or chatbot.


### Questions RedlineIQ Helps Answer
- What parts combination gets me to 500 whp on a GR Supra within budget?
- What supporting mods are required for this target?
- What reliability risk am I creating?
- What setup is best for drag / street / track / time attack?
- Which build path is most cost-efficient?
- What real-world community evidence supports that recommendation?


## Tech Stack
### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Vercel deployment
### Backend
- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Render deployment
### Database
- PostgreSQL
- pgvector
- Normalized relational schema for vehicles, variants, engines, products, fitments, evidence, and RAG chunks

### GenAI / RAG
- Local LLM development with Ollama
- Production LLM provider through backend API configuration
- Sentence-transformer embeddings (Huggingface)
- pgvector semantic search
- Grounded prompt templates
- Retrieved evidence returned with the generated answer


## Database Schema
RedlineIQ uses a normalized PostgreSQL schema with `pgvector` support to store vehicle data, product metadata, part fitment, build evidence, and RAG chunks.

View the full SQL schema here:

[View RedlineIQ SQL Schema](backend/pipelines/db_schema/redlineiq_schema.sql)

## Data Pipeline
```
Scraped product/forum/course data
        ↓
Cleaning and normalization
        ↓
PostgreSQL relational tables
        ↓
RAG chunk generation
        ↓
Embedding generation
        ↓
pgvector semantic search
        ↓
LLM grounded response
```

## GenAI / RAG Flow
- The LLM is instructed to:
    - Use only retrieved evidence for factual claims
    - Avoid inventing product claims, fitment, prices, dyno numbers, or reliability outcomes
    - Separate stated evidence from inferred recommendations
    - Mention risks and dependencies
    - Provide a confidence score

```
User build request
        ↓
Recommended products generated
        ↓
Build explanation query created
        ↓
Query embedded
        ↓
pgvector retrieves similar evidence chunks
        ↓
Prompt created with retrieved evidence
        ↓
LLM generates grounded explanation
        ↓
Answer + evidence returned to frontend
```

## Run Locally
You can run the project locally either with Docker (recommended) or by running the services manually.

#### Option 1: Docker (Recommended)
If you have Docker installed, you can spin up the full stack (frontend, backend, and database) with a single command:

```
docker compose up --build
```

This will start all services and handle dependencies automatically.

#### Option 2: Manual Setup
##### Backend
```cd backend
uvicorn app.main:app --reload 
``` 
##### Frontend
```cd app
npm install
npm run dev
```
##### Environment Variables
Frontend:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
Backend:
```
DATABASE_URL=your_database_url
LLM_PROVIDER=ollama_or_production_provider
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DIM=384
PROMPT_VERSION=redlineiq_rag_v1
```

## Deployment

### Current:

This version is deployed using:
- Vercel for the React/Vite frontend
- Render for the FastAPI backend
- Supabase Hosted PostgreSQL with pgvector support

Both frontend and backend are connected to GitHub and redeploy on push.

### Future Scaling Plan

The current MVP is beginning to run into memory limits on free-tier hosting. Future infrastructure will focus on services that can scale more efficiently as the platform expands to include deeper machine learning, larger datasets, more supported vehicles, more parts, and additional GenAI workflows.

Potential future improvements include:

- Dedicated backend compute
- Managed PostgreSQL with stronger memory and storage limits
- Background jobs for scraping, embedding, and extraction pipelines
- CI/CD checks for backend, frontend, and data pipeline changes
- Observability for API latency, retrieval quality, and LLM cost/performance

## Current Limitations

- Current MVP focuses on the Toyota GR Supra A90/A91 platform.
- Product and fitment coverage is still expanding.
- Recommendations are intended for research and planning, not professional mechanical advice.
- Free-tier hosting may cause slower initial load times.
- Retrieval quality and recommendation ranking are still being evaluated.
- Parts data, pricing, and availability can change over time and should be verified before purchase.

## Roadmap

### Version 0.1 — This Version

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

### Version 1.0 — Long-Term Vision

RedlineIQ aims to become a GenAI and ML-powered recommendation and product analytics platform that transforms unstructured automotive parts data into structured intelligence, recommends optimized build paths, and measures product impact through experimentation-ready metrics.





## Screenshots of Prototype UI
<p align="center">
  <strong>RedlineIQ Prototype Dashboard</strong>
</p>

<p align="center">
  <img src="docs/images/Main%20Dashboard%20Screen.png" width="850" alt="RedlineIQ dashboard view">
</p>

<p align="center">
  <strong>Garage Catalog Page</strong>
</p>


<p align="center">
  <img src="docs/images/Garage%20Catalog%20Screen.png" width="850" alt="RedlineIQ garage catalog page">
</p>



## TLDR Summary

RedlineIQ is a full-stack data product that demonstrates backend API development, relational data modeling, semantic search, Retrieval-Augmented Generation, recommendation logic, data pipeline design, Dockerized development, and cloud deployment.

The project shows the ability to take a messy real-world domain, structure the data, build retrieval and recommendation workflows, expose them through production-style APIs, and deliver them through a user-facing application.

### Data Science / ML Highlights

RedlineIQ demonstrates applied data science through:

- Structured data modeling from messy automotive sources
- Product and fitment data normalization
- Semantic search using sentence-transformer embeddings and `pgvector`
- Retrieval-Augmented Generation for grounded build explanations
- Recommendation logic based on goals, budget, fitment, risks, and supporting evidence
- Planned ranking models using user interaction signals
- Evaluation roadmap using Precision@K, Recall@K, NDCG@K, MRR, constraint violation rate, and build acceptance rate

## Resources and Links

- [Toyota GR Supra 3.0 specs - Ultimate Specs](https://www.ultimatespecs.com/car-specs/Toyota/145989/Toyota-GR-Supra-30.html)
- [A90 Shop](https://www.a90shop.com/)
- [StartMyCar](https://www.startmycar.com/us)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Learning to Rank Guide](https://medium.com/data-science/learning-to-rank-a-complete-guide-to-ranking-using-machine-learning-4c9688d370d4)
- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Python Docker Image](https://hub.docker.com/_/python)
- [NGINX Documentation](https://nginx.org/)











