/**
 * THE PITCH ROOM — EXECUTIVE STUDIO APPLICATION LOGIC
 * High-Agency Frontend & Generative UI Architecture
 */

// --- Pre-packaged Hollywood Treatment Treatments ---
const TREATMENTS = {
    apollo: "Project Apollo Zero: A washed-up NASA telemetry engineer discovers that the classified Apollo 11 lunar broadcast contains a hidden radio frequency that was not human. Now, at age 82, she is the only living person who knows the cryptographic cipher to decode the signal before a subterranean lunar relay initiates an irreversible planetary blackout.",
    horror: "The Whispering Walls: A broke young couple buys a remote, centuries-old house in Maine sight-unseen, intending to flip it. But as they peel back layers of drywall, they discover the framing was built out of acoustic resonance chambers designed by an 18th-century occultist to amplify and trap the screams of dying people — and every nail they remove releases another entity.",
    drama: "The Silk Diplomat: 1854. While Western gunboats force open Edo-period Japan, an idealistic young translator who secretly speaks both Dutch and Japanese orchestrates an unauthorized backchannel peace treaty between an American naval commodore and an introspective samurai minister, risking execution by both empires to prevent a war of annihilation."
};

// --- State ---
let isDeliberating = false;
let deliberationTimerInterval = null;
let deliberationStartTimestamp = 0;
let currentMemoRaw = '';
let studioChartInstance = null;

// --- DOM References ---
const pitchInput = document.getElementById('pitch-input');
const charCounter = document.getElementById('char-counter');
const btnConvene = document.getElementById('btn-convene');
const liveStatusLabel = document.getElementById('live-status-label');

const pitchStage = document.getElementById('pitch-stage');
const deliberationScreen = document.getElementById('deliberation-screen');
const verdictStage = document.getElementById('verdict-stage');
const errorStage = document.getElementById('error-stage');

const fullVerdictMarkdown = document.getElementById('full-verdict-markdown');
const errorDescMsg = document.getElementById('error-desc-msg');
const feedTimer = document.getElementById('feed-timer');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Character Counter
    if (pitchInput) {
        pitchInput.addEventListener('input', updateCharCount);
        // Default to Apollo Zero
        loadTreatment('apollo', document.querySelector('.preset-tab'));
    }

    // Keyboard Shortcut (Ctrl+Enter / Cmd+Enter)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!isDeliberating && pitchStage && !pitchStage.classList.contains('hidden')) {
                e.preventDefault();
                conveneCommittee();
            }
        }
    });
});

// --- Character Counter ---
function updateCharCount() {
    if (!pitchInput || !charCounter) return;
    const len = pitchInput.value.length;
    charCounter.textContent = `${len.toLocaleString()} / 3,000 CHARACTERS`;
}

// --- Treatment Selector ---
function loadTreatment(key, tabEl) {
    if (TREATMENTS[key] && pitchInput) {
        pitchInput.value = TREATMENTS[key];
        updateCharCount();
        
        // Update active class on tabs
        document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
        if (tabEl) tabEl.classList.add('active');
        
        pitchInput.focus();
    }
}

function clearPitchInput() {
    if (pitchInput) {
        pitchInput.value = '';
        updateCharCount();
        document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
        pitchInput.focus();
    }
}

// --- Convene Greenlight Committee ---
async function conveneCommittee() {
    const pitch = pitchInput ? pitchInput.value.trim() : '';

    if (!pitch || pitch.length < 15) {
        highlightErrorField();
        return;
    }

    if (isDeliberating) return;
    isDeliberating = true;

    // Show Deliberation Transmission
    switchStage('deliberation');
    setGlobalStatus('DELIBERATING', '#D4AF37');
    startDeliberationTimer();
    animateAgentSequence();

    try {
        const response = await fetch('/api/pitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pitch }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `HTTP Error ${response.status} from Studio Server`);
        }

        const data = await response.json();

        if (data.status === 'success' && data.verdict) {
            currentMemoRaw = data.verdict;
            renderStudioMemo(data.verdict, data.session_id);
            switchStage('verdict');
            setGlobalStatus('VERDICT RATIFIED', '#10B981');
        } else {
            throw new Error('Malformed verdict payload received from committee.');
        }
    } catch (err) {
        console.error('Deliberation error:', err);
        if (errorDescMsg) {
            errorDescMsg.textContent = err.message || 'An unexpected error occurred during committee deliberation.';
        }
        switchStage('error');
        setGlobalStatus('DELIBERATION FAILED', '#F43F5E');
    } finally {
        stopDeliberationTimer();
        isDeliberating = false;
    }
}

// --- Deliberation Timer & Stepper ---
function startDeliberationTimer() {
    deliberationStartTimestamp = Date.now();
    if (feedTimer) feedTimer.textContent = '00:00 ELAPSED';

    deliberationTimerInterval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - deliberationStartTimestamp) / 1000);
        const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const secs = String(elapsedSec % 60).padStart(2, '0');
        if (feedTimer) feedTimer.textContent = `${mins}:${secs} ELAPSED`;
    }, 1000);
}

function stopDeliberationTimer() {
    if (deliberationTimerInterval) {
        clearInterval(deliberationTimerInterval);
        deliberationTimerInterval = null;
    }
}

function animateAgentSequence() {
    const cardShark = document.getElementById('card-shark');
    const cardAuteur = document.getElementById('card-auteur');
    const cardChair = document.getElementById('card-chair');
    const statusText = document.getElementById('deliberation-status-text');

    const pillShark = document.getElementById('status-pill-shark');
    const pillAuteur = document.getElementById('status-pill-auteur');
    const pillChair = document.getElementById('status-pill-chair');

    // Initial state: Shark active
    if (cardShark) cardShark.classList.add('active');
    if (cardAuteur) cardAuteur.classList.remove('active');
    if (cardChair) cardChair.classList.remove('active');

    if (pillShark) pillShark.textContent = 'ANALYZING COMPS';
    if (pillAuteur) pillAuteur.textContent = 'QUEUED';
    if (pillChair) pillChair.textContent = 'STANDBY';

    // Step 2: Auteur active
    setTimeout(() => {
        if (!isDeliberating) return;
        if (cardShark) cardShark.classList.remove('active');
        if (cardAuteur) cardAuteur.classList.add('active');
        if (pillShark) pillShark.textContent = 'COMPS RETRIEVED';
        if (pillAuteur) pillAuteur.textContent = 'RESEARCHING FESTIVALS';
        if (statusText) statusText.textContent = 'The Auteur Whisperer is cross-referencing prestigious comps from Parallel API...';
    }, 6000);

    // Step 3: Chair synthesizing
    setTimeout(() => {
        if (!isDeliberating) return;
        if (cardAuteur) cardAuteur.classList.remove('active');
        if (cardChair) cardChair.classList.add('active');
        if (pillAuteur) pillAuteur.textContent = 'EVIDENCE SUBMITTED';
        if (pillChair) pillChair.textContent = 'EXECUTIVE SYNTHESIS';
        if (statusText) statusText.textContent = 'The Chair is balancing financial risk against artistic merit...';
    }, 15000);
}

// --- Render Studio Memorandum ---
function renderStudioMemo(rawText, sessionId) {
    // 1. Session ID & Date
    const sessionEl = document.getElementById('memo-session-id');
    const dateEl = document.getElementById('memo-date');
    if (sessionEl) sessionEl.textContent = sessionId ? sessionId.substring(0, 10).toUpperCase() : 'GL-2026';
    if (dateEl) {
        const d = new Date();
        dateEl.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    }

    // 2. Decision Parsing
    const decisionSeal = document.getElementById('final-decision-badge');
    const decisionSub = document.getElementById('final-decision-sub');
    
    let decision = 'PASS';
    let sealClass = 'text-red';

    if (/GREENLIGHT WITH NOTES/i.test(rawText)) {
        decision = 'GREENLIGHT W/ NOTES';
        sealClass = 'text-amber';
        if (decisionSub) decisionSub.textContent = 'Ratified with strict budget cap & rewrites';
    } else if (/GREENLIGHT/i.test(rawText)) {
        decision = 'GREENLIGHT';
        sealClass = 'text-emerald';
        if (decisionSub) decisionSub.textContent = 'Full Studio Greenlight Ratified';
    } else {
        decision = 'PASS';
        sealClass = 'text-red';
        if (decisionSub) decisionSub.textContent = 'Project Shelved by Studio Chair';
    }

    if (decisionSeal) {
        decisionSeal.textContent = decision;
        decisionSeal.className = 'verdict-decision-seal ' + sealClass;
    }

    // 3. Extract Clash Matrix
    extractClashMatrix(rawText);

    // 4. Render Full Markdown Article
    if (fullVerdictMarkdown) {
        fullVerdictMarkdown.innerHTML = parseMarkdownToHtml(rawText);
    }

    // 5. Initialize Chart.js Interactive Simulator
    setTimeout(() => {
        initStudioRoiChart(20);
    }, 80);
}

// --- Extract Shark & Auteur Clash Ledgers ---
function extractClashMatrix(text) {
    const sharkBody = document.getElementById('shark-memo-body');
    const auteurBody = document.getElementById('auteur-memo-body');

    const sharkMatch = text.match(/### (?:The )?Shark(?:'s Take)?[\s\S]*?(?=###|$)/i);
    const auteurMatch = text.match(/### (?:The )?Auteur(?: Whisperer)?(?:'s Take)?[\s\S]*?(?=###|$)/i);

    if (sharkBody) {
        if (sharkMatch) {
            let chunk = sharkMatch[0].replace(/###.*?\n/, '').trim();
            sharkBody.innerHTML = parseMarkdownToHtml(chunk);
        } else {
            sharkBody.innerHTML = '<p>The Shark conducted rigorous box office comps benchmarking, production risk evaluation, and estimated breakeven multiple analysis.</p>';
        }
    }

    if (auteurBody) {
        if (auteurMatch) {
            let chunk = auteurMatch[0].replace(/###.*?\n/, '').trim();
            auteurBody.innerHTML = parseMarkdownToHtml(chunk);
        } else {
            auteurBody.innerHTML = '<p>The Auteur Whisperer evaluated thematic depth, director pedigree, audience resonance, and Cannes/Sundance festival viability.</p>';
        }
    }
}

// --- Generative UI Chart.js Simulator ---
function initStudioRoiChart(initialBudget) {
    const canvas = document.getElementById('studio-roi-chart');
    if (!canvas) return;

    if (studioChartInstance) {
        studioChartInstance.destroy();
    }

    const data = computeProjections(initialBudget);

    studioChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: [
                'Production Budget',
                'Break-Even Target (2.5x)',
                'Domestic Theatrical',
                'International Gross',
                'Total Worldwide Gross'
            ],
            datasets: [{
                data: [data.budget, data.breakeven, data.domestic, data.intl, data.total],
                backgroundColor: [
                    'rgba(148, 163, 184, 0.35)', // Budget (Slate)
                    'rgba(244, 63, 94, 0.45)',    // Break-even (Crimson)
                    'rgba(59, 130, 246, 0.55)',   // Domestic (Blue)
                    'rgba(168, 85, 247, 0.55)',   // International (Purple)
                    'rgba(16, 185, 129, 0.7)'     // Total (Emerald)
                ],
                borderColor: [
                    '#94A3B8',
                    '#F43F5E',
                    '#3B82F6',
                    '#A855F7',
                    '#10B981'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#11141C',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    titleFont: { family: 'Outfit', size: 13 },
                    bodyFont: { family: 'JetBrains Mono', size: 12 },
                    callbacks: {
                        label: function(ctx) {
                            return ` $${ctx.raw.toLocaleString()}M`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#9CA3AF',
                        font: { family: 'JetBrains Mono', size: 11 },
                        callback: (v) => `$${v}M`
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#F3F4F6',
                        font: { family: 'Outfit', size: 11, weight: '600' }
                    }
                }
            }
        }
    });

    updateProjectionCards(data);
}

function handleSimSlider(val) {
    const budgetNum = parseInt(val, 10);
    const data = computeProjections(budgetNum);

    const displayEl = document.getElementById('sim-budget-display');
    if (displayEl) displayEl.textContent = `$${budgetNum.toLocaleString()},000,000`;

    if (studioChartInstance) {
        studioChartInstance.data.datasets[0].data = [
            data.budget,
            data.breakeven,
            data.domestic,
            data.intl,
            data.total
        ];
        studioChartInstance.update();
    }

    updateProjectionCards(data);
}

function computeProjections(b) {
    const breakeven = Math.round(b * 2.5);
    const domestic = Math.round(b * 1.9);
    const intl = Math.round(b * 2.6);
    const total = domestic + intl;
    const net = total - breakeven;
    return { budget: b, breakeven, domestic, intl, total, net };
}

function updateProjectionCards(d) {
    const beEl = document.getElementById('proj-breakeven');
    const domEl = document.getElementById('proj-domestic');
    const intlEl = document.getElementById('proj-intl');
    const netEl = document.getElementById('proj-net');

    if (beEl) beEl.textContent = `$${d.breakeven}M`;
    if (domEl) domEl.textContent = `$${d.domestic}M`;
    if (intlEl) intlEl.textContent = `$${d.intl}M`;
    if (netEl) {
        netEl.textContent = `${d.net >= 0 ? '+' : ''}$${d.net}M`;
        netEl.className = 'proj-value ' + (d.net >= 0 ? 'text-emerald' : 'text-red');
    }
}

// --- Copy Memo to Clipboard ---
function copyExecutiveMemo() {
    if (!currentMemoRaw) return;
    navigator.clipboard.writeText(currentMemoRaw).then(() => {
        const btnText = document.getElementById('copy-btn-text');
        if (btnText) {
            const orig = btnText.textContent;
            btnText.textContent = 'Copied to Clipboard!';
            setTimeout(() => { btnText.textContent = orig; }, 2000);
        }
    }).catch(err => {
        console.error('Clipboard copy failed:', err);
    });
}

function startNewPitch() {
    switchStage('pitch');
    setGlobalStatus('BOARDROOM ACTIVE', '#10B981');
    if (pitchInput) {
        pitchInput.focus();
    }
}

// --- Navigation / Stage Transitions ---
function switchStage(stageName) {
    pitchStage.classList.toggle('hidden', stageName !== 'pitch');
    deliberationScreen.classList.toggle('hidden', stageName !== 'deliberation');
    verdictStage.classList.toggle('hidden', stageName !== 'verdict');
    errorStage.classList.toggle('hidden', stageName !== 'error');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setGlobalStatus(text, color) {
    if (!liveStatusLabel) return;
    liveStatusLabel.textContent = text;
    liveStatusLabel.style.color = color;
}

function highlightErrorField() {
    if (!pitchInput) return;
    pitchInput.parentElement.style.borderColor = 'rgba(244, 63, 94, 0.6)';
    pitchInput.parentElement.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.3)';
    setTimeout(() => {
        pitchInput.parentElement.style.borderColor = '';
        pitchInput.parentElement.style.boxShadow = '';
    }, 1200);
}

// --- Markdown Parser with Semantic Highlighting ---
function parseMarkdownToHtml(md) {
    if (!md) return '';
    let html = md;

    // Entity sanitization
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal Rules
    html = html.replace(/^---+$/gm, '<hr>');

    // Bold / Italics
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

    // Highlight key decision words
    html = html.replace(/\b(GREENLIGHT WITH NOTES)\b/gi, '<span class="badge-notes">$1</span>');
    html = html.replace(/\b(GREENLIGHT)\b/gi, '<span class="badge-greenlight">$1</span>');
    html = html.replace(/\b(PASS)\b/gi, (match, p1, offset, str) => {
        const before = str.substring(Math.max(0, offset - 25), offset);
        if (/decision|verdict|position|final/i.test(before)) {
            return `<span class="badge-pass">${p1}</span>`;
        }
        return match;
    });

    // Paragraphs
    html = html.replace(/^(?!<[hluop]|<hr|<pre)(.+)$/gm, '<p>$1</p>');
    html = html.replace(/\n{2,}/g, '\n');

    return html;
}
