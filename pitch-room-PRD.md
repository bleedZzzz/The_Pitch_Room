# PRD: The Pitch Room

## 1. Overview

**Product name:** The Pitch Room
**One-liner:** An AI executive suite that argues over your movie — backed by real box office and critical data — and delivers a data-driven greenlight verdict.

**Context:** Built for the Agentic Cinema hackathon (Google Cloud + Parallel partner track). Solo developer, no manual coding — built via natural-language prompts in Google Antigravity.

**Hard deadline:** Sep 9, 2026, 2:00pm PDT.

---

## 2. Problem Statement

Independent filmmakers, screenwriters, and small production teams have no accessible way to "pressure test" a pitch before taking it to real investors or executives. Real studio greenlight decisions involve competing, often opposing incentives (commercial viability vs. artistic merit), but that debate currently only happens inside closed-door rooms with professionals most indie creators don't have access to.

## 3. Goal

Give any user a realistic, two-sided, data-backed simulation of a studio greenlight debate for their pitch, ending in a clear verdict with visible reasoning — not just a flat AI opinion.

## 4. Non-Goals

- Not a full screenplay-writing tool.
- Not a scheduling/budgeting tool (that's a stretch feature at most, not core).
- Not trying to give legally binding investment advice — this is a creative/decision-support tool.
- Not supporting more than text-based pitch input for v1 (no PDF script parsing required for MVP).

## 5. Users

- **Primary:** Indie filmmakers / screenwriters wanting an early gut-check on a pitch.
- **Secondary:** Hackathon judges evaluating the project's technical execution and real-world usefulness.

## 6. Core Features (MVP — must have)

### 6.1 Pitch Input
- User provides a short text pitch or logline (a few sentences, not a full script).
- No file upload required for MVP.

### 6.2 The Shark (Financier Agent)
- Analyzes the pitch purely on commercial/financial viability.
- Uses the Parallel API to research real comparable films (similar genre, scale, cast tier) and their box office performance.
- Outputs a structured verdict: position (greenlight/pass), reasoning, list of comps used.
- Personality: blunt, skeptical, numbers-first.

### 6.3 The Auteur Whisperer (Creative Agent)
- Analyzes the same pitch purely on artistic/creative merit.
- Uses the Parallel API to research real festival winners or critically acclaimed films with similar themes/tone.
- Outputs the same structured verdict shape as the Shark.
- Personality: passionate, prestige-focused, dismissive of pure commercial logic.

### 6.4 The Chair (Orchestrator Agent)
- Receives both agents' verdicts.
- Produces a final synthesized decision: greenlight / pass / greenlight with notes.
- Must explicitly reference where the two agents disagreed and explain the trade-off reasoning — not just pick a side.

### 6.5 Output Display
- Show all three verdicts clearly: Shark's take, Auteur Whisperer's take, Chair's final call — with the comps/sources each research-based agent used.

## 7. Stretch Features (only after MVP is fully working)

- **The Hype Machine** (marketing/trend agent).
- **The Calendar** (release window/distribution agent).
- Multi-pitch comparison (run 2 pitches and compare verdicts side by side).

## 8. Success Criteria

- All three MVP agents run end-to-end on a real sample pitch without manual intervention.
- The Shark and Auteur Whisperer produce genuinely different (not templated/generic) verdicts backed by real Parallel research data, not hallucinated comps.
- The Chair's synthesis visibly reflects both agents' input rather than restating one side.
- System is demoable live in under 60 seconds per pitch for the demo video.

## 9. Constraints

- Must use Gemini as the underlying model (hackathon requirement).
- Must use Google's agent-building technology — implemented via Google ADK (Agent Development Kit).
- Must use Parallel as the real-time research tool (chosen partner track).
- No paid Google Cloud billing account required for build/test — uses a free Google AI Studio API key.
- Solo developer with Python proficiency (not a beginner), building via Antigravity's AI-assisted workflow rather than hand-writing all code manually.

## 10. Risks

- Parallel API rate limits or result quality could affect comp accuracy — needs error handling and fallback messaging if research fails.
- AI Studio free-tier request limits (~250/day on Flash) could interfere with heavy testing — pace testing accordingly.
- Final hosting (Cloud Run) may be blocked by billing account issues — fallback to Render/Railway free hosting is acceptable and documented.
