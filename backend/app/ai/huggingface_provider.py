import asyncio
import logging
from huggingface_hub import InferenceClient
from backend.app.models import PlanRequest, AdventurePlan
from backend.app.ai.base import BaseGemmaProvider
from backend.app.ai.prompts import SYSTEM_PROMPT, build_user_prompt

logger = logging.getLogger("greenquest.ai.huggingface")


class HuggingFaceGemmaProvider(BaseGemmaProvider):
    """Inference provider using Hugging Face Serverless API with Google Gemma open-weight models."""

    def __init__(self, token: str, model_id: str = "google/gemma-2-2b-it"):
        self.token = token
        self._model_id = model_id
        self.client = InferenceClient(token=token if token else None)

    @property
    def provider_name(self) -> str:
        return "Hugging Face Inference (Open-Weight)"

    @property
    def model_name(self) -> str:
        return self._model_id

    async def generate_plan(self, request: PlanRequest) -> AdventurePlan:
        prompt_content = f"{SYSTEM_PROMPT}\n\n{build_user_prompt(request)}"
        messages = [
            {"role": "user", "content": prompt_content}
        ]

        def _call_hf() -> str:
            logger.info(f"Calling Hugging Face Inference API for Gemma model: {self._model_id}")
            # Try chat_completion first
            try:
                chat_res = self.client.chat_completion(
                    messages=messages,
                    model=self._model_id,
                    max_tokens=1500,
                    temperature=0.6,
                )
                if hasattr(chat_res, "choices") and chat_res.choices:
                    return chat_res.choices[0].message.content
            except Exception as chat_err:
                logger.warning(f"Chat completion failed, attempting text_generation fallback: {chat_err}")
                
            # Fallback to direct text generation with formatted turn markers
            full_prompt = (
                f"<start_of_turn>user\n{prompt_content}<end_of_turn>\n<start_of_turn>model\n"
            )
            raw_output = self.client.text_generation(
                prompt=full_prompt,
                model=self._model_id,
                max_new_tokens=1500,
                temperature=0.6,
                return_full_text=False,
            )
            return raw_output

        try:
            raw_text = await asyncio.to_thread(_call_hf)
            if not raw_text:
                raise ValueError("Received empty response from Gemma inference endpoint")
            return self.parse_and_validate_json(raw_text, request)
        except Exception as e:
            logger.error(f"Hugging Face Gemma inference error: {e}", exc_info=True)
            raise RuntimeError(f"Gemma inference error ({self._model_id}): {str(e)}") from e
