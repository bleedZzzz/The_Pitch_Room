# 🎬 The Pitch Room

> An AI executive suite that argues over your movie — backed by real box office data — and delivers a data-driven greenlight verdict.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is The Pitch Room?

The Pitch Room is a multi-agent AI system that simulates a studio greenlight committee. Give it a movie pitch, and three AI executives will debate whether your film gets made — using **real comparable films and box office data** from the [Parallel API](https://parallel.ai), not hallucinated numbers.

### The Committee

| Agent | Role | Personality |
|---|---|---|
| 🦈 **The Shark** | Financier | Cold, numbers-obsessed. Kills anything that doesn't pencil out. Uses real box office comps. |
| 🎭 **The Auteur Whisperer** | Creative/Prestige | Champions artistic risk. Pulls real festival winners and critically acclaimed comps. |
| 🪑 **The Chair** | Orchestrator | Weighs both sides. Issues a final greenlight verdict with transparent reasoning. |

## Architecture

```
User Pitch
    ↓
┌─────────────────────────────────────┐
│         The Chair (Orchestrator)     │
│         Google ADK + Gemini          │
│                                     │
│   ┌──────────┐   ┌────────────────┐ │
│   │ The Shark │   │ The Auteur     │ │
│   │ 🦈        │   │ Whisperer 🎭   │ │
│   │           │   │                │ │
│   └─────┬─────┘   └───────┬────────┘ │
│         │                 │          │
│         └────────┬────────┘          │
│                  ↓                   │
│         Parallel API                 │
│    (Real-time web research)          │
│                                     │
└─────────────────────────────────────┘
    ↓
Final Greenlight Verdict
(with data from both sides)
```

## Tech Stack

| Layer | Tool |
|---|---|
| Agent Framework | [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/) |
| LLM | [Gemini](https://ai.google.dev/) via Google AI Studio |
| Research Tool | [Parallel API](https://parallel.ai) — real-time web search for film data |
| Web Server | FastAPI + Uvicorn |
| Package Manager | [uv](https://docs.astral.sh/uv/) |
| Deployment | Docker → Cloud Run (or any container host) |

## Setup

### Prerequisites

- Python 3.10–3.13
- [uv](https://docs.astral.sh/uv/) (package manager)
- A [Google AI Studio API key](https://aistudio.google.com/) (free)
- A [Parallel API key](https://platform.parallel.ai) (free tier available)

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/The_Pitch_Room.git
cd The_Pitch_Room

# 2. Create your .env file
cp .env.example .env
# Edit .env and add your API keys:
#   GOOGLE_API_KEY=your_google_api_key
#   PARALLEL_API_KEY=your_parallel_api_key

# 3. Install dependencies with uv
uv sync

# 4. Run the web server
uv run python server.py

# 5. Open http://localhost:8080 in your browser
```

### Run via ADK CLI (terminal mode)

```bash
uv run adk run the_pitch_room
```

### Run via ADK Web UI

```bash
uv run adk web the_pitch_room
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GOOGLE_API_KEY` | Google AI Studio / Vertex AI Express Mode API key | ✅ |
| `PARALLEL_API_KEY` | Parallel API key for real-time web research | ✅ |
| `PORT` | Server port (default: 8080) | ❌ |

## How Parallel API is Used

Both The Shark and The Auteur Whisperer use the [Parallel Search API](https://docs.parallel.ai/search/search-quickstart) to find **real comparable films** relevant to the pitch:

- **The Shark** searches for box office performance, ROI data, and market trends for similar genre/budget films
- **The Auteur Whisperer** searches for festival winners, critically acclaimed films, and cultural impact data

This ensures verdicts are grounded in real-world data, not AI hallucinations.

## Deployment

### Primary: Google Cloud Run

```bash
# Build and deploy
gcloud run deploy the-pitch-room \
  --source . \
  --set-env-vars GOOGLE_API_KEY=$GOOGLE_API_KEY,PARALLEL_API_KEY=$PARALLEL_API_KEY \
  --allow-unauthenticated
```

### Fallback: Any Container Host

The included `Dockerfile` works with any container platform (Render, Railway, Fly.io):

```bash
docker build -t the-pitch-room .
docker run -p 8080:8080 \
  -e GOOGLE_API_KEY=$GOOGLE_API_KEY \
  -e PARALLEL_API_KEY=$PARALLEL_API_KEY \
  the-pitch-room
```

> **Note:** Even when hosted outside Google Cloud, all AI calls still go through Google's Gemini API and Parallel's API — the hosting platform is separate from the AI services.

## Hackathon

Built for the **Agentic Cinema: The Blockbuster Hackathon** | Partner Track: **Parallel**

## License

MIT — see [LICENSE](LICENSE) for details.
