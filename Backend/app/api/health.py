"""
Gives you a basic heartbeat endpoint and a quick test for deployment later.

Used to verify the API is alive
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok"}
