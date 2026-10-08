import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from backend.app.config import settings
from backend.app.models import (
    PlanRequest,
    AdventurePlan,
    CompletePlanRequest,
    StatsResponse,
    HealthResponse,
)
from backend.app.ai.factory import get_ai_provider
from backend.app.storage import storage

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("greenquest.api")

app = FastAPI(
    title="GreenQuest API — AI Outdoor Activity Planner",
    description="Touch Grass with Google Gemma open-weight models. Plan real-world outdoor adventures and get off the screen.",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Returns system status, active open-weight Gemma model, and inference provider."""
    provider = get_ai_provider()
    return HealthResponse(
        status="healthy",
        model_provider=provider.provider_name,
        model_name=provider.model_name,
        open_weight=True,
        version="1.0.0",
    )


@app.post("/api/plan", response_model=AdventurePlan, status_code=status.HTTP_201_CREATED, tags=["Plans"])
async def create_plan(request: PlanRequest):
    """
    Generate a personalized outdoor activity plan using Google Gemma open-weight model.
    Saves the plan into history and returns structured timeline and safety guidance.
    """
    logger.info(f"Incoming plan request: {request.location} ({request.duration}m, {request.activity})")
    provider = get_ai_provider()

    try:
        plan = await provider.generate_plan(request)
    except ValueError as ve:
        logger.error(f"Validation or parsing failure in Gemma response: {ve}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Open-weight model output validation failed: {str(ve)}",
        )
    except RuntimeError as re:
        logger.error(f"Inference provider execution error: {re}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Gemma inference provider error: {str(re)}",
        )
    except Exception as exc:
        logger.error(f"Unexpected error while generating outdoor plan: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate plan due to an unexpected backend error.",
        )

    # Persist the generated plan
    saved_plan = storage.save_plan(plan)
    return saved_plan


@app.get("/api/plans", response_model=List[AdventurePlan], tags=["Plans"])
async def list_plans():
    """Retrieve historical adventure plans ordered by most recent."""
    return storage.list_plans()


@app.get("/api/plans/{plan_id}", response_model=AdventurePlan, tags=["Plans"])
async def get_plan(plan_id: str):
    """Retrieve a single adventure plan by ID."""
    plan = storage.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adventure plan not found")
    return plan


@app.post("/api/plans/{plan_id}/complete", response_model=AdventurePlan, tags=["Plans"])
async def complete_plan(plan_id: str, payload: CompletePlanRequest = None):
    """
    Mark an outdoor adventure as completed once user returns from the outdoors.
    Records screen-free time gained, reflection notes, and optional rating.
    """
    reflection = payload.reflection if payload else None
    rating = payload.rating if payload else None
    updated = storage.mark_completed(plan_id, reflection=reflection, rating=rating)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adventure plan not found")
    return updated


@app.get("/api/stats", response_model=StatsResponse, tags=["Analytics"])
async def get_stats():
    """Calculate real outdoor impact statistics and screen-free hours gained."""
    return storage.get_stats()
