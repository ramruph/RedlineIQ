import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import find_one, get_database
from app.routes import products, vehicles, recommend, evidence, analytics, rag
from app.schemas import HealthResponse

TITLE = os.getenv("API_NAME")
API_VERSION = os.getenv("API_VERSION")


app = FastAPI(title=TITLE, version=API_VERSION, description="Backend API for Racecar build and optimization")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "http://localhost:3000",
                        "http://127.0.0.1:3000",
                        "http://192.168.68.112:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


@app.get("/")
def root():
    return {
        "service": "RedlineIQ API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok"}

# API Routes
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(vehicles.router, prefix="/api/v1/vehicles", tags=["vehicles"])
app.include_router(recommend.router, prefix="/api/v1/recommend", tags=["recommend"])
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["evidence"])
app.include_router(rag.router, prefix="/api/v1/rag", tags=["rag"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])


