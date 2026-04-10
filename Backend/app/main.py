from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.validate import router as validate_router
from app.api.analyze import router as analyze_router
from app.api.score import router as score_router


app = FastAPI(title="RedlineIQ API", version="0.1.0", description="Backend API for Racecar build and optimization")

app.include_router(health_router)
app.include_router(validate_router)
app.include_router(analyze_router)
app.include_router(score_router)


@app.get("/")
def root():
    return {
        "service": "RedlineIQ API",
        "status": "running",
        "docs": "/docs"
    }