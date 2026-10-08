from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
import uuid


class PlanRequest(BaseModel):
    location: str = Field(..., min_length=2, max_length=120, description="City, park, neighborhood, or location name")
    duration: int = Field(..., ge=10, le=360, description="Available duration in minutes (10 to 360)")
    activity: str = Field(..., min_length=2, max_length=50, description="Activity preference (e.g., Walking, Running, Gardening, Birdwatching, Nature exploration, Cycling)")
    fitness_level: str = Field(default="Beginner", description="Experience level: Beginner, Intermediate, or Advanced")
    interests: Optional[List[str]] = Field(default_factory=list, description="Optional interests such as native flora, photography, tree identification")
    custom_notes: Optional[str] = Field(default=None, max_length=300, description="Optional preferences or equipment limitations")

    @field_validator("fitness_level")
    @classmethod
    def validate_fitness_level(cls, v: str) -> str:
        valid = ["beginner", "intermediate", "advanced"]
        if v.lower() not in valid:
            raise ValueError(f"fitness_level must be one of: {', '.join(valid).title()}")
        return v.capitalize()

    @field_validator("activity")
    @classmethod
    def validate_activity(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("activity cannot be empty")
        return cleaned


class PlanStep(BaseModel):
    order: Optional[int] = None
    duration: int = Field(..., ge=1, description="Duration in minutes for this step")
    activity: str = Field(..., min_length=2, description="Short title of the step")
    description: str = Field(..., min_length=5, description="Clear, engaging description of what to do outdoors")
    mindfulness_prompt: Optional[str] = Field(default=None, description="Sensory prompt to tune into nature and away from screens")


class AdventurePlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    title: str = Field(..., description="Evocative outdoor quest title")
    location: str
    duration: int
    activity: str
    difficulty: str
    steps: List[PlanStep] = Field(..., min_length=1)
    things_to_bring: List[str] = Field(default_factory=list)
    safety_tips: List[str] = Field(default_factory=list)
    offline_tip: str = Field(..., description="Guidance to pocket the phone and immerse in surroundings")
    touch_grass_motto: str = Field(default="Phone down. Adventure on.")
    completed: bool = False
    completed_at: Optional[str] = None
    completion_reflection: Optional[str] = None
    rating: Optional[int] = None
    model_used: str = "Gemma 2 Open-Weight"


class CompletePlanRequest(BaseModel):
    reflection: Optional[str] = Field(default=None, max_length=500, description="Thoughts after returning from the outdoors")
    rating: Optional[int] = Field(default=None, ge=1, le=5, description="Adventure satisfaction rating (1-5)")


class StatsResponse(BaseModel):
    total_plans: int
    completed_plans: int
    total_minutes_outside: int
    screen_free_hours_gained: float
    grass_touched_score: int
    activity_breakdown: dict[str, int]


class HealthResponse(BaseModel):
    status: str
    model_provider: str
    model_name: str
    open_weight: bool
    version: str
