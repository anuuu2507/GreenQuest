import httpx
import logging
from backend.app.models import PlanRequest, AdventurePlan
from backend.app.ai.base import BaseGemmaProvider
from backend.app.ai.prompts import SYSTEM_PROMPT, build_user_prompt

logger = logging.getLogger("greenquest.ai.ollama")


class OllamaGemmaProvider(BaseGemmaProvider):
    """Local open-weight inference provider running Gemma through Ollama."""

    def __init__(self, base_url: str = "http://localhost:11434", model: str = "gemma2:2b"):
        self.base_url = base_url.rstrip("/")
        self._model = model

    @property
    def provider_name(self) -> str:
        return "Local Ollama (Open-Weight)"

    @property
    def model_name(self) -> str:
        return f"Ollama {self._model}"

    async def generate_plan(self, request: PlanRequest) -> AdventurePlan:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self._model,
            "format": "json",
            "stream": False,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(request)},
            ],
            "options": {
                "temperature": 0.6,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                raw_text = data.get("message", {}).get("content", "")
                if not raw_text:
                    raise ValueError("Ollama returned an empty response")
                return self.parse_and_validate_json(raw_text, request)
        except httpx.ConnectError as err:
            logger.error(f"Cannot connect to Ollama at {self.base_url}: {err}")
            raise RuntimeError(
                f"Ollama connection refused at {self.base_url}. Ensure Ollama is running (`ollama run {self._model}`)."
            ) from err
        except Exception as err:
            logger.error(f"Ollama inference failed: {err}")
            raise RuntimeError(f"Ollama inference error: {str(err)}") from err
