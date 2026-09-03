"""
The Pitch Room — API Server

FastAPI server that connects the premium web UI to the ADK multi-agent system.
Serves the web interface and exposes a /api/pitch endpoint for running the
full greenlight committee deliberation.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager

from dotenv import load_dotenv

# Load .env before anything else
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part

# Import the root agent (The Chair)
from the_pitch_room.agent import root_agent


# --- Session Management ---
session_service = InMemorySessionService()
APP_NAME = "the_pitch_room"
USER_ID = "pitch_room_user"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown."""
    print("\n[Pitch Room] The Pitch Room is now open for business.")
    print("   Visit http://localhost:8080 to pitch your movie.\n")
    yield
    print("\n[Pitch Room] The Pitch Room is closed.\n")


# --- FastAPI App ---
app = FastAPI(
    title="The Pitch Room",
    description="An AI executive suite that argues over your movie pitch.",
    version="1.0.0",
    lifespan=lifespan,
)


class PitchRequest(BaseModel):
    pitch: str


class PitchResponse(BaseModel):
    status: str
    verdict: str
    session_id: str


@app.post("/api/pitch", response_model=PitchResponse)
async def evaluate_pitch(request: PitchRequest):
    """Submit a movie pitch for evaluation by the greenlight committee."""
    if not request.pitch or len(request.pitch.strip()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Pitch must be at least 10 characters long. Give us something to work with!"
        )

    try:
        # Create a new session for this pitch
        session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
        )

        # Create the runner
        runner = Runner(
            agent=root_agent,
            app_name=APP_NAME,
            session_service=session_service,
        )

        # Build the user message
        user_message = Content(
            role="user",
            parts=[Part(text=f"Here is a movie pitch for the greenlight committee to evaluate:\n\n{request.pitch}")]
        )

        # Run the agent and collect the full response
        final_response = ""
        async for event in runner.run_async(
            user_id=USER_ID,
            session_id=session.id,
            new_message=user_message,
        ):
            if event.is_final_response():
                for part in event.content.parts:
                    if part.text:
                        final_response += part.text

        if not final_response:
            raise HTTPException(
                status_code=500,
                detail="The committee deliberated but returned no verdict. Please try again."
            )

        return PitchResponse(
            status="success",
            verdict=final_response,
            session_id=session.id,
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during pitch evaluation: {e}", file=sys.stderr)
        raise HTTPException(
            status_code=500,
            detail=f"The Pitch Room encountered an error: {str(e)}"
        )


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "The Pitch Room",
        "agents": ["the_chair", "the_shark", "the_auteur_whisperer"],
        "google_api_key_set": bool(os.environ.get("GOOGLE_API_KEY")),
        "parallel_api_key_set": bool(os.environ.get("PARALLEL_API_KEY")),
    }


# --- Serve Web UI ---
web_dir = Path(__file__).parent / "web"

# Serve index.html at root
@app.get("/")
async def serve_index():
    index_path = web_dir / "index.html"
    if not index_path.exists():
        return JSONResponse(
            content={"error": "Web UI not found. Run from the project root directory."},
            status_code=404
        )
    return FileResponse(index_path)


# Mount static files (CSS, JS)
if web_dir.exists():
    app.mount("/static", StaticFiles(directory=str(web_dir)), name="static")


# --- CLI Entry Point ---
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )
