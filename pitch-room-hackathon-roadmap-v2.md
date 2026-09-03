# The Pitch Room — Full Build Roadmap (v2)
**Agentic Cinema: The Blockbuster Hackathon | Partner Track: Parallel**

*Updated to route around Google Cloud billing account issues using Vertex AI Express Mode.*

---

## 1. The Project

**Name:** The Pitch Room
**One-liner:** An AI executive suite that argues over your movie — backed by real box office data — and delivers a greenlight verdict.

**Agents (MVP — build these first):**
| Agent | Role | Personality |
|---|---|---|
| The Shark | Financier | Cold, numbers-only, kills anything that doesn't pencil out |
| The Auteur Whisperer | Creative/Prestige | Champions artistic risk, pulls festival/critical comps |
| The Chair | Orchestrator | Weighs both sides, issues final verdict with reasoning |

**Stretch agents (only after the MVP works):** The Hype Machine (Marketing), The Calendar (Distribution).

---

## 2. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Dev environment | **Google Antigravity** | Natural-language prompts build/test/fix code — no manual coding |
| Access to Google Cloud | **Vertex AI / Agent Platform Express Mode** | Free, no billing account or credit card needed to build/prototype |
| Agent framework | **Google Agent Development Kit (ADK)**, Python | Orchestration; works with an Express Mode API key |
| Agent hosting/config | **Google Cloud Agent Builder (Agent Studio / Agent Engine)** | Same product, accessed via Express Mode — required by hackathon rules |
| LLM | **Gemini**, via Vertex AI | Included in Express Mode |
| Research tool | **Parallel API** | Your partner track |
| Final deployment | **Cloud Run** | The one step that may require a billing account — tackled last |
| Repo | **GitHub**, public + open-source license | Required for submission |
| Demo recording | **OBS Studio** or **Loom** → **YouTube** (public) | Required for submission |

---

## 3. Step-by-Step Roadmap

### Phase A — Setup (Day 1) — no billing needed
1. **Join the hackathon:** register at agentic-cinema.devpost.com.
2. **Get a Vertex AI Express Mode API key:** sign in with your Gmail account through Google's Express Mode signup (search "Vertex AI Express Mode," use the official Google Cloud docs link, not the regular console). No billing/credit card required. This gives you Gemini + Agent Builder/Agent Studio access immediately.
   - If it redirects you to the $300-trial/credit-card page instead of Express Mode, try an incognito window — an old billing account tied to your Google account can sometimes force the wrong flow.
3. **Parallel:** sign up for API access at parallel.ai, get your API key.
4. **GitHub:** create your public repo now, add an MIT or Apache 2.0 license immediately so it's visible from day one.
5. **Install Google Antigravity** (antigravity.google) — free public preview.
6. **Devpost project page:** create it now (you've already started this), add the thumbnail, name, and elevator pitch.

### Phase B — Build the agents (Days 2–5) — still no billing needed
7. Open Antigravity, start a new project, and feed it the prompts in Section 4, in order.
8. Configure Antigravity/your code to use your **Express Mode API key** (not a billing-linked project key) for all Gemini/Vertex calls.
9. Test each agent individually with a sample pitch before moving to the next.
10. Connect the Parallel tool (Prompt 4) — verify it returns real data, not placeholder text.
11. Build the Chair/orchestrator last (Prompt 5) — it depends on the other two.

### Phase C — Test the full system (Days 6–7) — still no billing needed
12. Run the complete pipeline on 3 different sample pitches (use original loglines, not copyrighted scripts).
13. Confirm the Shark and Auteur Whisperer produce genuinely different, data-backed opinions, and the Chair synthesizes them coherently.
14. Fix issues by returning to Antigravity with follow-up prompts describing the bug.

### Phase D — Resolve billing for final deployment (Days 8–9)
15. Only now do you need a working Cloud Run deployment for your public "hosted project" URL. Try, in order:
    - Check your Google Cloud billing page for an **identity verification banner** (common requirement for India-based accounts) and complete it if present.
    - Try creating the billing account again using a **debit/credit card** instead of UPI, which has shown to be more reliable for account activation.
    - If it still fails, note the exact error code and contact Google Cloud support via the Billing Troubleshooter — but don't let this block Phase B/C, since those don't need it.
16. **Fallback if billing truly can't be resolved in time:** deploy the same code to a free-tier host that doesn't require Google billing (e.g., Replit's hosting, or a free tier on Render/Railway), while still making all Gemini/Vertex/Parallel calls from that hosted app. This still satisfies "uses Google Cloud and Gemini" since the AI calls go through Google's APIs — the hosting platform itself is a separate concern from which APIs your code calls. Mention in your README which path you used and why.

### Phase E — Repo, README, demo video (Days 9–10)
17. Push final code to GitHub (Antigravity can push directly if connected to your GitHub account).
18. Generate the README via Prompt 6 in Section 4.
19. Record the demo video using the script in Section 5.
20. Upload to YouTube as public, confirm it plays correctly.

### Phase F — Submit (Day 11, with buffer before the deadline)
21. Go to the Devpost submission form.
22. Fill in: hosted project URL, video URL, repo URL, select **Parallel** as your track, write your project description.
23. Submit at least 24 hours before **Sep 9, 2026, 2:00pm PDT** in case of upload issues.

---

## 4. Antigravity Prompts (paste these in order)

**Prompt 1 — Project scaffold**
```
Create a new Python project using Google's Agent Development Kit (ADK).
Set up a multi-agent architecture with a top-level orchestrator agent
called "the_chair" and two sub-agents called "the_shark" and
"the_auteur_whisperer". Use Gemini as the underlying model for all
agents via Vertex AI, authenticated using a Vertex AI Express Mode API
key read from an environment variable called GOOGLE_API_KEY (not a
billing-linked service account). Structure the project so it can later
be deployed to Google Cloud Agent Builder / Agent Engine or an
alternative host. Include a requirements.txt and a basic README stub.
```

**Prompt 2 — The Shark (Financier agent)**
```
Build the "the_shark" agent. Its job: given a movie script or pitch
summary, evaluate it purely on financial viability. It should search
for real comparable films (similar genre/budget/cast tier) and their
box office performance, then argue for or against greenlighting based
on ROI potential. Personality: blunt, numbers-obsessed, skeptical,
dismissive of anything that doesn't have a clear financial case. Give
it a tool to call the Parallel API for real-time web research on
comparable films. Output should be a structured verdict: {position:
greenlight/pass, reasoning: string, comps_used: list}.
```

**Prompt 3 — The Auteur Whisperer (Creative agent)**
```
Build the "the_auteur_whisperer" agent. Its job: given the same script
or pitch, argue for its artistic/creative merit regardless of pure
financial logic. It should research real festival winners or critically
acclaimed films with similar themes/tone using the Parallel API, and
use those as evidence for creative risk being worth taking.
Personality: passionate, prestige-focused, dismissive of purely
commercial thinking. Same output structure as the_shark: {position:
greenlight/pass, reasoning: string, comps_used: list}.
```

**Prompt 4 — Connect Parallel**
```
Add a shared tool called "parallel_research" that both the_shark and
the_auteur_whisperer can call. It should send a query to the Parallel
API (docs: parallel.ai) and return structured search results (title,
snippet, source URL). Read the API key from an environment variable
called PARALLEL_API_KEY — do not hardcode it. Add error handling for
failed requests.
```

**Prompt 5 — The Chair (Orchestrator)**
```
Build "the_chair" as the top-level orchestrator agent. Given a script
or pitch, it should: 1) send it to the_shark and the_auteur_whisperer
in parallel, 2) wait for both verdicts, 3) synthesize a final decision
that explicitly acknowledges where the two agents disagreed and why,
and 4) output a final structured verdict: {final_decision: greenlight/
pass/greenlight with notes, summary: string, shark_position: object,
auteur_position: object}. The synthesis should show real reasoning
about the trade-off, not just pick one side.
```

**Prompt 6 — README + deploy prep**
```
Generate a clear README.md for this repo explaining: what the project
does, the multi-agent architecture, how the Parallel API is used, setup
instructions (env vars: GOOGLE_API_KEY, PARALLEL_API_KEY), and how to
run it locally. Include a section on deployment: primary path via
Google Cloud Agent Builder / Cloud Run, and a documented fallback path
if billing setup is delayed. Also generate a Dockerfile suitable for
either Cloud Run or a generic container host. Add an MIT license file
if one isn't already present.
```

---

## 5. Demo Video Script (aim for 2:45–3:00)

1. **0:00–0:20 — Hook:** Title card "The Pitch Room." One sentence: an AI executive suite that argues over whether your movie gets made, backed by real data.
2. **0:20–0:45 — The problem:** Pitch meetings involve competing incentives (money vs. art) with no data-backed way to simulate the debate.
3. **0:45–2:00 — Live demo (core of the video):** Feed a sample pitch into the running system. Show the Shark's verdict with real comps, the Auteur Whisperer's opposing verdict, and the Chair's synthesis. Narrate what's happening on screen — must be the actual running system, not mocked UI.
4. **2:00–2:30 — Architecture:** Quick screen of Agent Builder/Agent Studio or a simple diagram: Gemini + ADK + Parallel + hosting.
5. **2:30–3:00 — Close:** State the partner track (Parallel) and one sentence on real-world impact (a data-backed sanity check for indie filmmakers/producers before pitching).

---

## 6. Submission Checklist

- [ ] Hosted project URL (live link)
- [ ] Demo video (public YouTube, 3 min, shows real functioning system)
- [ ] Public GitHub repo with visible open-source license
- [ ] Repo demonstrates actual runtime use of Google Cloud/Gemini + Parallel (imported/called in code)
- [ ] Partner track selected: **Parallel**
- [ ] Devpost submission form completed
- [ ] Submitted before **Sep 9, 2026, 2:00pm PDT** (submit a day early if possible)
