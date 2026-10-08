import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current directory or parent directory
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent

dotenv_path = ROOT_DIR / ".env"
if not dotenv_path.exists():
    dotenv_path = BASE_DIR / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    load_dotenv()


class Settings:
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]
    
    # Inference provider: 'huggingface' | 'ollama' | 'mock'
    GEMMA_PROVIDER: str = os.getenv("GEMMA_PROVIDER", "huggingface").lower()
    
    # Hugging Face Settings
    HF_TOKEN: str = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY", "")
    GEMMA_MODEL_ID: str = os.getenv("GEMMA_MODEL_ID", "google/gemma-2-2b-it")
    
    # Ollama Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma2:2b")
    
    # Database
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "data" / "greenquest.db"))


settings = Settings()
