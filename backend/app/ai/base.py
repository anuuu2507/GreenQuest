from abc import ABC, abstractmethod
import json
import re
import logging
from backend.app.models import PlanRequest, AdventurePlan, PlanStep

logger = logging.getLogger("greenquest.ai")


class BaseGemmaProvider(ABC):
    """Abstract base class for open-weight Gemma inference providers."""

    @abstractmethod
    async def generate_plan(self, request: PlanRequest) -> AdventurePlan:
        """Generate a structured outdoor adventure plan using Gemma."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider identifier."""
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Name of the specific Gemma model."""
        pass

    def parse_and_validate_json(self, raw_text: str, request: PlanRequest) -> AdventurePlan:
        """
        Robustly extracts, parses, and validates the JSON payload from model output.
        Handles markdown blocks, surrounding text, and schema alignment.
        """
        cleaned = raw_text.strip()

        # Remove markdown code fence if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\s*```$", "", cleaned)
            cleaned = cleaned.strip()

        # Find outer JSON boundaries
        first_brace = cleaned.find("{")
        last_brace = cleaned.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            cleaned = cleaned[first_brace : last_brace + 1]

        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as err:
            logger.error(f"Failed to decode JSON from Gemma output: {err}\nRaw text: {raw_text[:500]}")
            raise ValueError(f"Model generated non-JSON response: {str(err)}") from err

        if not isinstance(data, dict):
            raise ValueError("Parsed model response is not a valid JSON dictionary")

        # Map steps safely
        raw_steps = data.get("steps", [])
        if not raw_steps or not isinstance(raw_steps, list):
            raise ValueError("Model response did not contain a valid 'steps' list")

        parsed_steps = []
        for idx, s in enumerate(raw_steps, start=1):
            if not isinstance(s, dict):
                continue
            duration = int(s.get("duration", max(5, request.duration // len(raw_steps))))
            activity = str(s.get("activity", f"Step {idx}")).strip()
            description = str(s.get("description", "Enjoy your surroundings and connect with nature.")).strip()
            prompt = s.get("mindfulness_prompt")
            if prompt:
                prompt = str(prompt).strip()

            parsed_steps.append(
                PlanStep(
                    order=idx,
                    duration=duration,
                    activity=activity,
                    description=description,
                    mindfulness_prompt=prompt,
                )
            )

        if not parsed_steps:
            raise ValueError("No valid steps could be parsed from the model response")

        # Normalize duration if steps do not sum up to requested duration
        total_parsed = sum(s.duration for s in parsed_steps)
        if total_parsed != request.duration and len(parsed_steps) > 1:
            ratio = request.duration / total_parsed
            cumulative = 0
            for i, s in enumerate(parsed_steps):
                if i == len(parsed_steps) - 1:
                    s.duration = max(3, request.duration - cumulative)
                else:
                    new_dur = max(3, round(s.duration * ratio))
                    s.duration = new_dur
                    cumulative += new_dur

        things_to_bring = data.get("things_to_bring", [])
        if not isinstance(things_to_bring, list) or not things_to_bring:
            things_to_bring = ["Water bottle", "Comfortable walking shoes", "Weather-appropriate clothing"]
        else:
            things_to_bring = [str(item) for item in things_to_bring if item]

        safety_tips = data.get("safety_tips", [])
        if not isinstance(safety_tips, list) or not safety_tips:
            safety_tips = [
                "Stay mindful of your surroundings and trail markers",
                "Keep hydrated and check local weather conditions",
                "Inform someone of your route if exploring unfamiliar trails",
            ]
        else:
            safety_tips = [str(tip) for tip in safety_tips if tip]

        offline_tip = data.get(
            "offline_tip",
            "Set your phone to silent or airplane mode, place it deep in your pocket, and let your natural senses take over.",
        )

        motto = data.get("touch_grass_motto", "Phone down. Adventure on.")

        title = str(data.get("title", f"{request.location} {request.activity} Quest")).strip()
        difficulty = str(data.get("difficulty", request.fitness_level)).capitalize()

        return AdventurePlan(
            title=title,
            location=request.location,
            duration=request.duration,
            activity=request.activity,
            difficulty=difficulty,
            steps=parsed_steps,
            things_to_bring=things_to_bring,
            safety_tips=safety_tips,
            offline_tip=offline_tip,
            touch_grass_motto=motto,
            model_used=self.model_name,
        )
