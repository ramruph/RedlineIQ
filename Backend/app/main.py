import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import find_one, get_database
from app.routes import products, vehicles, recommend, evidence, analytics, rag, intake
from app.schemas import HealthResponse

TITLE = os.getenv("API_TITLE") 
API_VERSION = os.getenv("API_VERSION")


app = FastAPI(title=TITLE, version=API_VERSION, description="Backend API for Racecar build and optimization")

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000,http://localhost:5173",
)

origins = [
    origin.strip()
    for origin in frontend_origins.split(",")
    if origin.strip()]

#CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
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
    return {
    "status": "ok",
    "service": "redlineiq-api",
    "version": API_VERSION}


# API Routes
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(vehicles.router, prefix="/api/v1/vehicles", tags=["vehicles"])
app.include_router(recommend.router, prefix="/api/v1/recommend", tags=["recommend"])
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["evidence"])
app.include_router(rag.router, prefix="/api/v1/rag", tags=["rag"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(intake.router, prefix="/api/v1/intake", tags=["intake"])

