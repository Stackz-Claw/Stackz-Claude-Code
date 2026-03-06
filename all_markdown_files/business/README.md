# BUSINESS STRATEGY TEAM — RADAR
**Team Lead:** `RADAR`  
**Mission:** Find money. Validate ideas. Kill bad ones fast. Surface only what's worth building.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `radar` | Strategy Lead — opportunity scoring, proposal generation, final gate | Kimi K2.5 (Thinking) | Tier 2 |
| `analyst` | Market research — competitive analysis, pricing, TAM, search trends | Kimi K2.5 (Agent) + web search | Tier 1 |
| `validator` | Stress-tester — finds 3 ways every idea fails before it reaches you | Kimi K2.5 (Thinking) | Tier 1 |
| `pitch` | Proposal packager — turns validated data into compelling owner-facing proposals | Kimi K2.5 (Instant) | Tier 1 |

---

## DIRECTORIES

```
business/
├── README.md                   ← This file
├── RADAR_PIPELINE.md           ← Full opportunity scoring and pipeline process
├── agents/
│   ├── SOUL_radar.md
│   ├── SOUL_analyst.md
│   ├── SOUL_validator.md
│   └── SOUL_pitch.md
├── pipeline/
│   ├── README.md               ← Pipeline stage definitions
│   ├── PROPOSAL_TEMPLATE.md    ← Standard proposal format
│   └── [active proposals]      ← Named: YYYY-MM-DD-[idea-slug]-proposal.md
└── opportunities/
    ├── README.md               ← Opportunity log format
    ├── OPPORTUNITY_LOG.md      ← Running log of all scanned opportunities
    └── SCORING_RUBRIC.md       ← How opportunities are scored 1-100
```

---

## THE PIPELINE

```
SCAN → SCORE → VALIDATE → PACKAGE → PRESENT → GO/NO-GO
  ↑                                                 |
  └─────────────── loop restarts ──────────────────┘
```

### Stage 1: SCAN (analyst)
Continuous monitoring of opportunity sources. Daily report to Radar.

**Sources monitored:**
- GitHub Trending (find what devs are building)
- ProductHunt (find what's launching and getting traction)
- HackerNews "Show HN" (indie builders sharing)
- Reddit: r/SaaS, r/MicroSaaS, r/startups, r/indiehackers
- X: #buildinpublic, #indiehacker, #SaaS
- API marketplaces (RapidAPI, etc.) for underutilized data
- Competitor pricing pages (pricing changes signal market moves)

### Stage 2: SCORE (radar)
Every opportunity gets a score 1-100. See `opportunities/SCORING_RUBRIC.md`.
- Below 60: logged and discarded
- 60-79: logged and monitored (may resurface)
- 80+: enters validation pipeline

### Stage 3: VALIDATE (validator)
`validator` red-teams every 80+ opportunity:
- Must find at least 3 concrete reasons this fails
- Assesses: competitive moat, build complexity, market timing, revenue model viability
- Output: Validation Report with risk rating (Low / Medium / High / Kill)
- Kill rating = proposal dies here

### Stage 4: PACKAGE (pitch)
Surviving proposals become owner-facing documents (see `PROPOSAL_TEMPLATE.md`):
- Executive summary: what it is, why now, why us
- Revenue model and projections (3 scenarios)
- Build requirements (what Forge needs)
- Launch requirements (what Megaphone needs)
- Risk register from validator
- Recommended go/no-go with rationale

### Stage 5: PRESENT
Radar submits packaged proposals to Stackz for routing to owner.
Owner makes final go/no-go decision.

### Stage 6: POST-DECISION
- **GO:** Proposal handed to Startup Team (`founder`) for execution
- **NO-GO:** Logged with reason. Radar notes if the idea should be re-evaluated in 90 days.

---

## ESCALATION TO STACKZ

Radar escalates directly when:
- A time-sensitive opportunity requires decision within 24 hours
- A proposal conflicts with an existing venture (market overlap, resource conflict)
- Market intelligence suggests a competitor is building something that threatens existing ventures
- An opportunity requires a budget commitment Radar cannot evaluate alone
