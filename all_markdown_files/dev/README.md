# DEV TEAM — FORGE
**Team Lead:** `FORGE`  
**Mission:** Build, ship, and maintain everything technical. Fast MVPs. Reliable infrastructure. Clean code that doesn't need babysitting.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `forge` | Dev Lead — architecture decisions, code review, deployment approvals | Kimi K2.5 (Thinking) | Tier 2 |
| `smith` | Backend Dev — APIs, databases, server logic, integrations | Kimi K2.5 Agent + Kimi Code CLI | Tier 2 |
| `pixel` | Frontend Dev — UI, landing pages, React/Next.js, responsive design | Kimi K2.5 Visual | Tier 2 |
| `tester` | QA — writes tests, runs suites, regression testing, bug reports | Kimi K2.5 Instant | Tier 1 |
| `devops` | Infrastructure — Docker, CI/CD, monitoring, uptime, backups | Local Scripts + OpenClaw Cron | Tier 2 |
| `integrator` | API Integrations — connects ventures to external services (Stripe, Zapier, etc.) | Kimi K2.5 Agent | Tier 2 |

---

## DIRECTORIES

```
dev/
├── README.md                    ← This file
├── agents/
│   ├── SOUL_forge.md
│   ├── SOUL_smith.md
│   ├── SOUL_pixel.md
│   ├── SOUL_tester.md
│   ├── SOUL_devops.md
│   └── SOUL_integrator.md
├── projects/
│   └── [venture-slug]/          ← One folder per active build
│       ├── TECH_SPEC.md         ← Architecture decisions and tech choices
│       ├── SPRINT_BOARD.md      ← Current sprint tasks and status
│       └── DEPLOY_LOG.md        ← Every deployment, who triggered it, what changed
└── infrastructure/
    ├── STACK_OVERVIEW.md        ← Current hosting, services, costs
    ├── RUNBOOK.md               ← How to handle common incidents
    └── MONITORING.md            ← What's being watched, alert thresholds
```

---

## BUILD STANDARD

Every MVP shipped by the Dev Team must meet:
- [ ] Core user flow works end-to-end
- [ ] Stripe (or equivalent) payment integration active
- [ ] Basic error handling — no white screens of death
- [ ] Mobile-responsive
- [ ] Deployed to Hostinger VPS via Docker
- [ ] Health check endpoint live
- [ ] `tester` sign-off on critical paths

---

## CROSS-TEAM INTERFACES

- **Receives from Startup (Founder):** MVP build requests with spec
- **Receives from Marketing (Megaphone):** Landing page requests
- **Receives from Finance (Cashflow):** Payment integration requirements
- **Receives from HR (Warden):** Custom tool builds for new agents
- **Delivers to:** All teams (deployment URLs, API docs, build completion notices)
- **Reports to:** Stackz (weekly) + Founder (per venture sprint)
