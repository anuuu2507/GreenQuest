import logging
from backend.app.config import settings
from backend.app.ai.base import BaseGemmaProvider
from backend.app.ai.huggingface_provider import HuggingFaceGemmaProvider
from backend.app.ai.ollama_provider import OllamaGemmaProvider
from backend.app.ai.mock_provider import MockGemmaProvider

logger = logging.getLogger("greenquest.ai.factory")

_cached_provider: BaseGemmaProvider | None = None


def get_ai_provider() -> BaseGemmaProvider:
    """
    Returns the configured open-weight Gemma inference provider.
    Supports Hugging Face Inference API, local Ollama, and local dev fallback.
    """
    global _cached_provider
    if _cached_provider is not None:
        return _cached_provider

    provider_choice = settings.GEMMA_PROVIDER.lower().strip()

    if provider_choice == "huggingface":
        if settings.HF_TOKEN and settings.HF_TOKEN != "your_huggingface_token_here":
            logger.info(f"Initialized HuggingFaceGemmaProvider with model: {settings.GEMMA_MODEL_ID}")
            _cached_provider = HuggingFaceGemmaProvider(
                token=settings.HF_TOKEN,
                model_id=settings.GEMMA_MODEL_ID,
            )
        else:
            logger.warning(
                "GEMMA_PROVIDER is 'huggingface' but HF_TOKEN is not configured in .env. "
                "Falling back to Gemma 2 Offline Dev Engine for local development. "
                "Provide a valid HF_TOKEN to call Hugging Face Serverless endpoint."
            )
            _cached_provider = MockGemmaProvider()

    elif provider_choice == "ollama":
        logger.info(f"Initialized OllamaGemmaProvider pointing to {settings.OLLAMA_BASE_URL} ({settings.OLLAMA_MODEL})")
        _cached_provider = OllamaGemmaProvider(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
        )

    else:
        logger.info("Initialized MockGemmaProvider (local offline development engine)")
        _cached_provider = MockGemmaProvider()

    return _cached_provider


def reset_ai_provider():
    """Utility to reset cached provider (useful for testing)."""
    global _cached_provider
    _cached_provider = None
