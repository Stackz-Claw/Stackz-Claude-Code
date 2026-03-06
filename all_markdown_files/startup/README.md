# STARTUP EXECUTION TEAM — FOUNDER
**Team Lead:** `FOUNDER`  
**Mission:** Take an approved proposal and turn it into a live, revenue-generating business. Owns the venture from approval to graduation. Coordinates ALL other teams during the build and launch phases.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `founder` | Execution Lead — venture coordination, sprint planning, milestone tracking | Kimi K2.5 (Thinking) | Tier 2 |
| `sprint` | Sprint Manager — breaks work into tasks, assigns to teams, tracks completion | Kimi K2.5 (Instant) | Tier 2 |
| `growth` | Growth Hacker — acquisition experiments, funnel optimization, retention tactics | Kimi K2.5 (Agent) | Tier 2 |
| `retention` | Customer Success — onboarding quality, churn signals, customer feedback loop | Kimi K2.5 (Instant) | Tier 1 |

---

## DIRECTORIES

```
startup/
├── README.md                     ← This file
├── EXECUTION_PLAYBOOK.md         ← How Founder runs a venture from 0 to launch
├── GRADUATION_CRITERIA.md        ← When a venture graduates to Stability Team
├── agents/
│   ├── SOUL_founder.md
│   ├── SOUL_sprint.md
│   ├── SOUL_growth.md
│   └── SOUL_retention.md
├── ventures/
│   └── [venture-slug]/           ← One folder per live venture
│       ├── VENTURE_BRIEF.md      ← Single source of truth for the venture
│       ├── SPRINT_LOG.md         ← All sprints, what shipped, what didn't
│       ├── METRICS.md            ← Live metrics dashboard (updated weekly)
│       ├── DECISIONS.md          ← Key decisions made and why
│       └── STATUS.md             ← Current status: building/launched/growing/graduating
└── lifecycle/
    ├── VENTURE_INTAKE.md         ← How a new venture gets set up
    ├── LAUNCH_CHECKLIST.md       ← Pre-launch verification checklist
    └── WIND_DOWN_PROTOCOL.md     ← How to cleanly shut down a failed venture
```

---

## VENTURE LIFECYCLE

### Stage 1: INTAKE (Week 1)
When an owner-approved proposal arrives, Founder:
1. Creates `startup/ventures/[venture-slug]/` workspace
2. Writes `VENTURE_BRIEF.md` from the approved proposal
3. Coordinates with Warden to provision any additional agents needed
4. Kicks off discovery sprint with Forge and Canvas

### Stage 2: BUILD (Weeks 1-4 typical)
`sprint` manages task breakdown and assignment:
- Forge: MVP development
- Canvas + Palette: Brand identity and landing page design
- Pixel: Frontend implementation
- Cashflow: Revenue tracking setup

`founder` runs weekly sprint reviews. Unblocks cross-team dependencies.

### Stage 3: LAUNCH
Before launch, `sprint` runs `LAUNCH_CHECKLIST.md` — nothing ships until all items are checked.

Launch day coordination:
- Megaphone + Ghost: launch content and outreach
- Scheduler: posts go live on schedule
- Cashflow: payment tracking active
- Retention: first customer onboarding protocol ready

### Stage 4: GROW
Post-launch, `growth` takes the lead:
- A/B tests on landing page and onboarding
- Acquisition channel experiments (organic, paid, partnership)
- Funnel analysis: where are we losing customers?

`retention` monitors:
- Onboarding completion rates
- Early churn signals (login frequency drops, support tickets)
- Customer feedback collection

### Stage 5: EVALUATE (Monthly)
`founder` submits monthly venture report to Stackz:
- Revenue and MoM growth
- Burn rate and runway
- Customer count and churn
- Key metrics vs. proposal projections
- Recommendation: continue / pivot / graduate / wind down

### Stage 6: GRADUATION
If `GRADUATION_CRITERIA.md` thresholds are met, Founder submits graduation proposal to Stackz.
Venture moves to `stability/portfolio/[venture-slug]/`.
Stability Team's `sentinel` takes over.

---

## CROSS-TEAM COORDINATION

Founder is the only Startup Team member who routes tasks to other teams. All requests go through Stackz Lane Queue.

| Need | Goes to | Typical SLA |
|------|---------|-------------|
| MVP development | Dev Team (Forge) | Per sprint agreement |
| Brand / visual assets | Design Team (Canvas) | 3-5 days |
| Launch content | Marketing Team (Megaphone) | 1 week before launch |
| Revenue setup | Finance Team (Cashflow) | Before first customer |
| New agent needed | HR Team (Warden) | Per onboarding pipeline |

---

## ESCALATION TO STACKZ

Founder escalates when:
- A venture is 2+ weeks behind planned milestones without recovery path
- A critical dependency is blocked (another team not delivering)
- Monthly metrics show venture is not viable (below minimum threshold)
- A pivot decision is needed that changes the original proposal scope
- A venture is ready to graduate
