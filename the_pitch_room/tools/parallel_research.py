"""
Parallel Research Tool — Shared tool for The Shark and The Auteur Whisperer.

Calls the Parallel Search API to find real comparable films, box office data,
festival results, and critical reception. Returns structured search results
that agents use as evidence in their verdicts.
"""

import os
import json
from typing import Optional


def parallel_research(query: str, objective: str, num_results: int = 5) -> dict:
    """Search the web for real film industry data using the Parallel API.

    Use this tool to research real comparable films, box office performance,
    festival winners, critical reception, and industry trends. Always use
    this tool to back up your arguments with real data — never fabricate
    film comparisons or box office numbers.

    Args:
        query: Concise search query (3-6 words), e.g. "low budget horror box office hits"
        objective: Natural language description of what you're looking for and why,
                   e.g. "Find horror films made for under $10M that earned over $100M
                   to support the financial case for this pitch"
        num_results: Maximum number of results to return (default 5, max 10)

    Returns:
        dict: A dictionary with:
            - status: "success" or "error"
            - results: list of {title, url, excerpts, publish_date} (on success)
            - error: error message string (on failure)
    """
    api_key = os.environ.get("PARALLEL_API_KEY")

    if not api_key:
        return {
            "status": "error",
            "error": "PARALLEL_API_KEY environment variable is not set. "
                     "Get your key at https://platform.parallel.ai",
            "results": []
        }

    try:
        from parallel import Parallel

        client = Parallel(api_key=api_key)

        search = client.search(
            objective=objective,
            search_queries=[query],
            mode="fast",
            advanced_settings={
                "max_results": min(num_results, 10)
            }
        )

        results = []
        for result in search.results:
            results.append({
                "title": result.title or "Untitled",
                "url": result.url,
                "excerpts": result.excerpts if result.excerpts else [],
                "publish_date": result.publish_date
            })

        return {
            "status": "success",
            "results": results,
            "search_id": search.search_id
        }

    except ImportError:
        # Fallback: use requests directly if the SDK isn't available
        return _parallel_research_fallback(query, objective, num_results, api_key)
    except Exception as e:
        return {
            "status": "error",
            "error": f"Parallel API request failed: {str(e)}",
            "results": []
        }


def _parallel_research_fallback(
    query: str, objective: str, num_results: int, api_key: str
) -> dict:
    """Fallback implementation using raw HTTP requests if the Parallel SDK
    is not available."""
    import requests

    try:
        response = requests.post(
            "https://api.parallel.ai/v1/search",
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key
            },
            json={
                "objective": objective,
                "search_queries": [query],
                "mode": "fast",
                "advanced_settings": {
                    "max_results": min(num_results, 10)
                }
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        results = []
        for r in data.get("results", []):
            results.append({
                "title": r.get("title", "Untitled"),
                "url": r.get("url", ""),
                "excerpts": r.get("excerpts", []),
                "publish_date": r.get("publish_date")
            })

        return {
            "status": "success",
            "results": results,
            "search_id": data.get("search_id", "")
        }

    except Exception as e:
        return {
            "status": "error",
            "error": f"Parallel API fallback request failed: {str(e)}",
            "results": []
        }
