import uvicorn
import sys
from pathlib import Path

# Ensure project root is in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.app.config import settings

if __name__ == "__main__":
    print(f"🌲 Starting GreenQuest Backend on http://{settings.HOST}:{settings.PORT}")
    print(f"🌿 Active Gemma Provider: {settings.GEMMA_PROVIDER}")
    uvicorn.run(
        "backend.app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
