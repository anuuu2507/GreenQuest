# 🌿 GreenQuest — AI Outdoor Activity Planner

> **Hacktoberfest 2026 Week 1 Challenge: "Touch Grass"**  
> *An open-source, open-weight AI application designed to get people off their screens and into the living world.*

[![Open-Weight Gemma](https://img.shields.io/badge/Model-Google%20Gemma-emerald.svg)](https://huggingface.co/google/gemma-2-2b-it)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python-009688.svg)](https://fastapi.tiangolo.com/)
[![React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Table of Contents
1. [What is GreenQuest?](#what-is-greenquest)
2. [Why It Exists](#why-it-exists)
3. [Hacktoberfest Week 1 — Touch Grass](#hacktoberfest-week-1--touch-grass)
4. [Why Open Innovation Matters](#why-open-innovation-matters)
5. [How Google Gemma is Used](#how-google-gemma-is-used)
6. [Architecture & Design](#architecture--design)
7. [Screens & User Experience](#screens--user-experience)
8. [Getting Started & Local Setup](#getting-started--local-setup)
9. [Environment Variables](#environment-variables)
10. [API Documentation](#api-documentation)
11. [Running Tests](#running-tests)
12. [Hacktoberfest 2–3 Minute Video Demo Guide](#hacktoberfest-23-minute-video-demo-guide)
13. [Limitations & Future Improvements](#limitations--future-improvements)

---

## What is GreenQuest?

**GreenQuest** is an AI outdoor activity planner that reverses the standard dynamic of AI applications. Instead of optimizing for prolonged digital engagement and continuous scrolling, GreenQuest uses open-weight AI to synthesize a personalized outdoor activity plan, and then explicitly directs the user to **put their device away and immerse themselves in the physical world.**

Users provide:
- **Location**: Specific park, trail, botanical garden, or local neighborhood
- **Time Available**: 10 to 180 minutes (with quick chips for 15, 30, 45, 60, 90, 120m)
- **Activity Preference**: Walking, Running, Gardening, Birdwatching, Nature Exploration, Cycling
- **Fitness / Experience Level**: Beginner, Intermediate, or Advanced
- **Nature Immersion Focus**: Native flora, acoustic bird songs, quiet tree canopies, stream exploration, soil grounding, etc.

The AI returns a structured, time-balanced plan with warm-up steps, exploratory movement, sensory awareness challenges, cool-down phases, essential pack checklists, and safety reminders.

---

## Why It Exists

Modern digital interfaces are engineered to capture human attention for as many minutes per day as possible. Generative AI tools often exacerbate this by encouraging endless back-and-forth chat conversations, prompting users to generate image after image or read wall after wall of text.

GreenQuest is built on an alternative premise:
1. **AI as an outdoor catalyst**: Use intelligence to eliminate the friction of planning outdoor time.
2. **Time-bounded interaction**: You should interact with the app for under two minutes.
3. **Intentional minimalism**: Once the plan is generated, the interface recedes. You are reminded to pocket your phone, look up at the sky, and listen to the wind.

---

## Hacktoberfest Week 1 — Touch Grass

The official Hacktoberfest Week 1 prompt challenges developers to:
> *"Build something with open-weight models or open-source AI that gets people off the screen and into the real world."*

GreenQuest directly satisfies every requirement of this challenge:
- **Core Open-Weight AI**: Powered by **Google Gemma** (Gemma 2 open-weight architecture), an official partner category for Hacktoberfest. No proprietary or closed-source AI APIs (e.g. OpenAI) are used.
- **Measurable Screen-Free Time**: The platform tracks "outside time" and "screen-free hours gained", celebrating real-world grounding points (*Grass Touched Score*) instead of app engagement or screen time.
- **Anti-Screen UX Philosophy**: The application features dedicated copy and a specialized "Adventure Mode" with pocket dimming that explicitly prompts:  
  *“Your plan is ready. Now close the app and go outside.”*  
  *“Phone down. Adventure on.”*  
  *“Check back when you're done.”*

---

## Why Open Innovation Matters

Choosing an **open-weight model** like Google Gemma over a closed proprietary API is a deliberate architectural and ethical choice:

1. **Local & Edge Inference**: Open-weight models can run directly on consumer workstations, local servers, or private edge devices (e.g., via Ollama or vLLM). Users do not need to transmit their location data or schedules to a third-party corporation.
2. **Modularity & Zero Vendor Lock-in**: The inference provider is decoupled behind a modular Python interface (`BaseGemmaProvider`). Teams can switch seamlessly between Hugging Face Serverless, self-hosted Ollama, vLLM, or local transformers without rewriting application business logic.
3. **Reproducibility & Cost Independence**: Proprietary APIs can change models, deprecate endpoints, or alter pricing tiers without warning. Open weights guarantee that anyone running GreenQuest five years from now can run the exact same model weights deterministically.
4. **Community Scrutiny & Safety**: Open weights permit direct auditing of model behavior, token generation dynamics, and prompt safety.

---

## How Google Gemma is Used

GreenQuest centers on Google's instruction-tuned open-weight models:
- **Default Model**: `google/gemma-2-2b-it` (lightweight, high-speed instruction following)
- **Supported High-Capacity Model**: `google/gemma-2-9b-it`
- **Supported Local Model**: `gemma2:2b` via Ollama

### Modular Inference Engine

The backend implements a factory pattern supporting three distinct run modes:

```
                  ┌───────────────────────┐
                  │      PlanRequest      │
                  └───────────┬───────────┘
                              │
                    [AI Factory Dispatch]
                              │
     ┌────────────────────────┼────────────────────────┐
     ▼                        ▼                        ▼
┌──────────────┐      ┌──────────────┐         ┌──────────────┐
│ Hugging Face │      │ Local Ollama │         │  Offline Dev │
│ Inference API│      │  (gemma2:2b) │         │    Engine    │
│(gemma-2-2b-it│      │              │         │  (Fallback)  │
└──────────────┘      └──────────────┘         └──────────────┘
     │                        │                        │
     └────────────────────────┼────────────────────────┘
                              ▼
            ┌──────────────────────────────────┐
            │  Structured JSON Parser & Guard  │
            │  (Regex code-block stripper +    │
            │   duration sum normalization)    │
            └─────────────────┬────────────────┘
                              ▼
                   ┌────────────────────┐
                   │   AdventurePlan    │
                   │  Pydantic Payload  │
                   └────────────────────┘
```

1. **Hugging Face Serverless (`huggingface`)**: Connects to the Hugging Face Hub using the official `huggingface_hub.InferenceClient`, invoking `google/gemma-2-2b-it`.
2. **Local Ollama (`ollama`)**: Sends JSON requests to a local Ollama daemon (`http://localhost:11434/api/chat`) running `gemma2:2b`. Completely private, offline, and free of API keys.
3. **Offline Development Engine (`mock`)**: A deterministic rule-and-schema synthesis engine used for automated CI/CD testing, quick frontend iteration, and development environments where GPU hardware or HF tokens are temporarily unavailable.

### Structured Output Enforcement

To prevent uncontrolled conversational filler, the system applies a strict JSON schema contract in the prompt:
- Rejects preamble and conversational sign-offs
- Mandates step durations whose sum equals the requested session duration
- Injects mindfulness prompts focused on tactile, auditory, and olfactory nature sensations
- Validates the parsed output through Pydantic models before storage

---

## Architecture & Design

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas-Confetti
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2
- **Persistence**: SQLite (standard library, zero external database setup required)
- **Inference**: Hugging Face Hub Client / Ollama REST API

### Project Structure

```
Hack-1/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application & REST endpoints
│   │   ├── config.py            # Environment configuration & dotenv
│   │   ├── models.py            # Pydantic models for plans & stats
│   │   ├── storage.py           # Persistent SQLite repository
│   │   └── ai/
│   │       ├── __init__.py
│   │       ├── base.py          # Abstract BaseGemmaProvider & JSON validator
│   │       ├── factory.py       # Provider instantiation factory
│   │       ├── prompts.py       # Strict JSON system & user prompt templates
│   │       ├── huggingface_provider.py # Hugging Face Gemma-2-2b client
│   │       ├── ollama_provider.py      # Local Ollama client
│   │       └── mock_provider.py        # Local dev & test engine
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py          # Pytest suite (validation, generation, errors)
│   ├── data/                    # SQLite database storage (auto-created)
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Standalone server runner
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Header, navigation, Gemma status badge
│   │   │   ├── Footer.tsx       # Hacktoberfest & touch grass credits
│   │   │   ├── LandingPage.tsx  # Hero, Touch Grass manifesto, starter presets
│   │   │   ├── PlannerPage.tsx  # Interactive parameters form & loading state
│   │   │   ├── PlanDetailPage.tsx # Timeline, packing list, safety tips, print
│   │   │   ├── AdventureMode.tsx # Minimal timer UI, pocket mode, audio chime
│   │   │   └── HistoryPage.tsx  # Adventure log & screen-free analytics
│   │   ├── api.ts               # Frontend API client
│   │   ├── types.ts             # TypeScript data contracts
│   │   ├── App.tsx              # Application shell & router
│   │   ├── main.tsx             # React entrypoint
│   │   └── index.css            # Tailwind CSS v4 base styling
│   ├── package.json
│   ├── vite.config.ts           # Vite + Tailwind v4 + API proxy config
│   └── tsconfig.json
├── .env.example                 # Documented environment variables
├── .gitignore                   # Git ignore rules
├── pytest.ini                   # Pytest path settings
└── README.md                    # Comprehensive documentation
```

---

## Screens & User Experience

| Screen | Purpose & Touch Grass Features |
|---|---|
| **1. Landing Page** | Explains the Touch Grass philosophy, displays current Gemma model status, and provides 1-click inspirational starter presets. |
| **2. Planner Page** | Captures location, duration, activity, fitness level, and nature focus. Features a rotating mindfulness loader during AI generation. |
| **3. Plan Detail Page** | Presents the complete quest: step timeline with sensory cues, interactive pack checklist, safety reminders, offline tip, and a **Print Offline Sheet** button for users who leave their phone at home. |
| **4. Adventure Mode** | **Intentionally minimal interface**. Features large countdown timer, current outdoor task, gentle web audio tone on phase changes, progress bar, and a **Pocket Mode** that dims the screen to black. Reminds users: *"Phone down. Adventure on."* |
| **5. History Page** | Logs completed adventures with post-quest reflections and 1–5 star ratings. Displays screen-free hours gained and total outdoor minutes. |

---

## Getting Started & Local Setup

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (v20+ recommended)
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/anuuu2507/GreenQuest.git
cd GreenQuest
```

---

### Step 2: Backend Setup

1. **Create and activate a virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install backend dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure Your Preferred Gemma AI Mode**:
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```

   Select one of the three setup options below:

   #### 🟢 Option 1: Normal Local Development (Zero Keys / Offline Mode)
   *Best for rapid frontend testing, UI review, and environments without GPU or tokens.*
   In `.env`:
   ```bash
   GEMMA_PROVIDER=mock
   ```
   *No external connections, API keys, or downloads required.*

   #### 🦙 Option 2: Gemma Through Local Ollama (100% Private Local Inference)
   *Best for complete local open-weight inference on your laptop or workstation.*
   1. Install Ollama from [ollama.com](https://ollama.com).
   2. Pull and start the open-weight Gemma model:
      ```bash
      ollama run gemma2:2b
      ```
   3. In `.env`:
      ```bash
      GEMMA_PROVIDER=ollama
      OLLAMA_BASE_URL=http://localhost:11434
      OLLAMA_MODEL=gemma2:2b
      ```

   #### 🤗 Option 3: Gemma Through Hugging Face Serverless (Cloud Open-Weight)
   *Best for running Gemma 2 without needing local GPU hardware.*
   1. Obtain a free Hugging Face token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
   2. In `.env`:
      ```bash
      GEMMA_PROVIDER=huggingface
      HF_TOKEN=hf_yourActualTokenHere
      GEMMA_MODEL_ID=google/gemma-2-2b-it
      ```

4. **Start the backend server**:
   ```bash
   python backend/run.py
   ```
   The backend will start at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI / Swagger docs at `http://127.0.0.1:8000/docs`.

---

### Step 3: Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. Vite automatically proxies `/api` calls to `http://127.0.0.1:8000`.

---

## Environment Variables

Configure these variables in `.env` at the root directory:

| Variable | Default | Description |
|---|---|---|
| `HOST` | `127.0.0.1` | Backend bind address |
| `PORT` | `8000` | Backend port |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed frontend origins |
| `GEMMA_PROVIDER` | `huggingface` | Provider choice: `huggingface`, `ollama`, or `mock` |
| `HF_TOKEN` | *empty* | Free Hugging Face token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `GEMMA_MODEL_ID` | `google/gemma-2-2b-it` | Hugging Face Gemma model repository ID |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama service endpoint (for local inference) |
| `OLLAMA_MODEL` | `gemma2:2b` | Ollama model tag |
| `DATABASE_PATH` | `data/greenquest.db` | SQLite database file location |

---

## API Documentation

### `GET /api/health`
Returns system status, active open-weight Gemma model, and inference provider.
```json
{
  "status": "healthy",
  "model_provider": "Hugging Face Inference (Open-Weight)",
  "model_name": "google/gemma-2-2b-it",
  "open_weight": true,
  "version": "1.0.0"
}
```

### `POST /api/plan`
Generates a structured outdoor activity plan using Google Gemma.
**Request Body**:
```json
{
  "location": "Bhimavaram Nature Trail",
  "duration": 60,
  "activity": "Walking",
  "fitness_level": "Beginner",
  "interests": ["native trees", "bird sounds"],
  "custom_notes": "Prefer quiet paths"
}
```
**Response (201 Created)**:
```json
{
  "id": "0628514c-4f4d-4a55-8527-c8a48e48e7ac",
  "created_at": "2026-10-07T16:37:35.396991",
  "title": "The Bhimavaram Walking Quest",
  "location": "Bhimavaram",
  "duration": 60,
  "activity": "Walking",
  "difficulty": "Beginner",
  "steps": [
    {
      "order": 1,
      "duration": 6,
      "activity": "Sensory Arrival & Gentle Stretches",
      "description": "Begin at your starting point. Take five slow, deep breaths...",
      "mindfulness_prompt": "Listen closely: Identify three distinct non-human sounds."
    },
    {
      "order": 2,
      "duration": 26,
      "activity": "Beginner Trail Exploration",
      "description": "Walk at an easy, rhythmic pace through trails...",
      "mindfulness_prompt": "Pocket your phone. Notice the rhythm of your footsteps."
    }
  ],
  "things_to_bring": ["Water bottle", "Comfortable walking shoes"],
  "safety_tips": ["Stay on marked paths", "Keep hydrated"],
  "offline_tip": "Keep your phone safely zipped in your pocket. Let sunlight be your interface.",
  "touch_grass_motto": "Two feet on the ground beats two thumbs on the screen.",
  "completed": false,
  "model_used": "google/gemma-2-2b-it"
}
```

### `GET /api/plans`
Lists past generated adventure plans ordered by creation date.

### `GET /api/plans/{id}`
Retrieves a specific adventure plan by ID.

### `POST /api/plans/{id}/complete`
Marks a plan as completed, logging user reflection and satisfaction score (1–5).
```json
{
  "reflection": "Felt completely restored after walking without checking notifications.",
  "rating": 5
}
```

### `GET /api/stats`
Computes total outdoor minutes, screen-free hours gained, and grass touched score.

---

## Running Tests

GreenQuest includes automated backend unit and integration tests using `pytest`:

```bash
pytest -v
```

### Test Coverage
- `test_health_endpoint`: Verifies system health, model metadata, and `open_weight: true`
- `test_successful_plan_generation`: Tests valid plan creation, duration normalization, and schema fields
- `test_request_validation_duration_too_short`: Ensures durations under 10 minutes return HTTP 422
- `test_request_validation_duration_too_long`: Ensures durations over 360 minutes return HTTP 422
- `test_request_validation_missing_location`: Validates location length constraints
- `test_request_validation_invalid_fitness_level`: Checks enumerated fitness levels
- `test_malformed_input`: Verifies non-JSON requests fail cleanly
- `test_model_failure_handling`: Verifies graceful HTTP 503 handling when model fails
- `test_plan_lifecycle_and_completion`: Tests creation, completion, reflection storage, and stats calculations

To verify the frontend TypeScript and build integrity:
```bash
cd frontend
npm run build
```

---

## Hacktoberfest 2–3 Minute Video Demo Guide

Follow this concise sequence when recording your 2–3 minute submission demo:

1. **Step 1: Open GreenQuest (0:00 – 0:25)**
   - Show the landing page and highlight the **Hacktoberfest Week 1: Touch Grass** badge.
   - Point out the active **Google Gemma Open-Weight** model status indicator.
   - Explain the core premise: using open-weight AI to get people off their screens and into nature.

2. **Step 2: Enter Adventure Parameters (0:25 – 0:50)**
   - Click **"Plan My Adventure"**.
   - Enter a location (e.g., *Bhimavaram Nature Trail* or your local park).
   - Select duration (e.g., *45 or 60 minutes*).
   - Select activity (*Walking* or *Birdwatching*) and experience level.
   - Choose a nature immersion focus (*Native tree spotting*, *Bird acoustic songs*).
   - Click **"Generate Outdoor Plan with Gemma"**.

3. **Step 3: Review the Generated Plan (0:50 – 1:20)**
   - Show the structured timeline produced by Gemma (warm-up, exploration, sensory focus, cool-down).
   - Highlight the sensory mindfulness prompt (*"Listen closely: Identify three distinct non-human sounds before stepping onto the path"*).
   - Check off a couple of items on the **Pack Checklist**.
   - Point out the **Print Offline Sheet** feature for leaving the phone behind completely.

4. **Step 4: Launch Adventure Mode & Put Phone Away (1:20 – 1:55)**
   - Click **"Start Adventure Mode"**.
   - Show the ultra-minimalist UI: large countdown timer, single active instruction, and no clutter.
   - Point out the anti-screen message:  
     *“Your plan is ready. Now close the app and go outside. Phone down. Adventure on.”*
   - Toggle **"Pocket Mode"** to demonstrate how the screen dims to black to discourage screen interaction.

5. **Step 5: Complete & Review Stats (1:55 – 2:30)**
   - Advance through the step timer to trigger completion (confetti celebration).
   - Add a brief reflection (*“Felt refreshed, listened to bird songs, zero screen distractions”*) and select 5 stars.
   - Navigate to **Adventures & Stats** to show the recorded outdoor minutes and screen-free hours gained.

---

## Limitations & Future Improvements

- **Weather Integration**: Future iterations can integrate open-source weather APIs (e.g. Open-Meteo) to dynamically adapt Gemma's packing recommendations for rain or temperature.
- **Audio Guides**: Adding offline text-to-speech for audible cue chimes so users can keep headphones on low without ever glancing at the screen.
- **Offline PWA Support**: Packaging the frontend as a Progressive Web App (PWA) with service workers for full offline operation on mobile devices.
- **On-Device WebGPU Gemma**: Running quantized Gemma models directly in the browser using WebGPU/Transformers.js for 100% serverless on-device generation.

---

## License

This project is licensed under the [MIT License](LICENSE).
Built with ❤️ for human wellbeing and open-source innovation during Hacktoberfest 2026.
