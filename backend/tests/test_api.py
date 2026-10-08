import os
import sys
from pathlib import Path

# Ensure project root is in sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

# Configure testing environment before importing app
os.environ["GEMMA_PROVIDER"] = "mock"
os.environ["DATABASE_PATH"] = ":memory:"

from backend.app.main import app
from backend.app.storage import storage
from backend.app.ai.factory import reset_ai_provider

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_env():
    # Use clean in-memory SQLite for isolated test runs
    storage.__init__(db_path=":memory:")
    reset_ai_provider()
    yield


def test_health_endpoint():
    """Verify system health, open-weight marker, and active provider info."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["open_weight"] is True
    assert "model_provider" in data
    assert "model_name" in data


def test_successful_plan_generation():
    """Verify that a valid plan request creates a comprehensive structured outdoor plan."""
    payload = {
        "location": "Bhimavaram Nature Trail",
        "duration": 60,
        "activity": "Walking",
        "fitness_level": "Beginner",
        "interests": ["native trees", "bird sounds"],
        "custom_notes": "Prefer quiet paths away from roads"
    }
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 201
    plan = response.json()

    assert "id" in plan
    assert plan["location"] == "Bhimavaram Nature Trail"
    assert plan["duration"] == 60
    assert plan["activity"] == "Walking"
    assert plan["difficulty"] == "Beginner"
    assert len(plan["steps"]) >= 3
    assert len(plan["things_to_bring"]) > 0
    assert len(plan["safety_tips"]) > 0
    assert "offline_tip" in plan
    assert "touch_grass_motto" in plan
    assert plan["completed"] is False

    # Check step duration sum
    total_step_time = sum(step["duration"] for step in plan["steps"])
    assert total_step_time == 60


def test_request_validation_duration_too_short():
    """Duration under 10 minutes should fail validation."""
    payload = {
        "location": "Central Park",
        "duration": 5,
        "activity": "Walking",
        "fitness_level": "Beginner"
    }
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 422


def test_request_validation_duration_too_long():
    """Duration over 360 minutes (6 hours) should fail validation."""
    payload = {
        "location": "Central Park",
        "duration": 400,
        "activity": "Walking",
        "fitness_level": "Beginner"
    }
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 422


def test_request_validation_missing_location():
    """Missing or empty location should fail validation."""
    payload = {
        "location": "A",
        "duration": 45,
        "activity": "Nature exploration",
        "fitness_level": "Beginner"
    }
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 422


def test_request_validation_invalid_fitness_level():
    """Fitness level outside allowed values should fail validation."""
    payload = {
        "location": "Forest Lake",
        "duration": 45,
        "activity": "Walking",
        "fitness_level": "OlympicAthlete"
    }
    response = client.post("/api/plan", json=payload)
    assert response.status_code == 422


def test_malformed_input():
    """Completely malformed JSON payload should return 422 Unprocessable Entity."""
    response = client.post(
        "/api/plan",
        content="not-json-content",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422


def test_model_failure_handling():
    """Verify that model execution failure is handled gracefully without crashing."""
    with patch("backend.app.ai.mock_provider.MockGemmaProvider.generate_plan") as mock_generate:
        mock_generate.side_effect = RuntimeError("Simulated Gemma inference engine timeout")
        payload = {
            "location": "Sunset Ridge",
            "duration": 30,
            "activity": "Walking",
            "fitness_level": "Beginner"
        }
        response = client.post("/api/plan", json=payload)
        assert response.status_code == 503
        data = response.json()
        assert "Gemma inference provider error" in data["detail"]


def test_plan_lifecycle_and_completion():
    """Verify generating a plan, fetching it, completing it, and reviewing stats."""
    payload = {
        "location": "Bhimavaram Botanical Park",
        "duration": 30,
        "activity": "Birdwatching",
        "fitness_level": "Beginner"
    }
    create_res = client.post("/api/plan", json=payload)
    assert create_res.status_code == 201
    plan_id = create_res.json()["id"]

    # Retrieve plan
    get_res = client.get(f"/api/plans/{plan_id}")
    assert get_res.status_code == 200
    assert get_res.json()["completed"] is False

    # Complete plan
    complete_res = client.post(
        f"/api/plans/{plan_id}/complete",
        json={"reflection": "Felt completely refreshed after 30 mins outside listening to birds!", "rating": 5}
    )
    assert complete_res.status_code == 200
    completed_plan = complete_res.json()
    assert completed_plan["completed"] is True
    assert completed_plan["rating"] == 5
    assert "Felt completely refreshed" in completed_plan["completion_reflection"]

    # Check stats
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_plans"] >= 1
    assert stats["completed_plans"] >= 1
    assert stats["total_minutes_outside"] >= 30
    assert stats["screen_free_hours_gained"] >= 0.5
