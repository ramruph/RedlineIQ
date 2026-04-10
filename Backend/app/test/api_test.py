from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_validate_build_missing_fields():
    response = client.post("/validate-build", json={})
    assert response.status_code == 422


def test_analyze_build_bad_vehicle():
    payload = {
        "vehicle_id": "fake_vehicle",
        "target_hp": 500,
        "max_budget_usd": 10000,
        "activity_type": "Street",
        "reliability_floor": 70,
        "require_street_legal": True
    }
    response = client.post("/analyze-build", json=payload)
    assert response.status_code in (400, 422)