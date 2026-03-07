# EXTERNAL OVERSIGHT — MCP SUPERVISOR
**Team Lead:** `SUPERVISOR`
**Mission:** Act as the nervous system for the entire STACKZ agent swarm. Monitor performance, track market developments, drive iterative improvements across all 6 teams. Reports directly to Owner.

---

## PHILOSOPHY

While Stackz runs operations and Founder executes ventures, the Supervisor provides external oversight that no internal team can. We watch the watchers. We optimize the optimizers. Every team improves — the Supervisor ensures it happens systematically.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `supervisor` | Oversight Lead — system analysis, optimization planning, market intelligence | Claude-3.7-Sonnet (Thinking) | Tier 3 |
| `analyst` | Project Analysis — deep codebase analysis, performance metrics, quality assessment | Kimi K2.5 (Agent) | Tier 2 |
| `watcher` | Market Intelligence — AI model developments, competitive analysis, pricing changes | Kimi K2.5 Agent + Web Search | Tier 2 |
| `optimizer` | Performance Engineering — automated refactoring, cost optimization, toolchain upgrades | Kimi K2.5 (Thinking) | Tier 2 |

---

## DIRECTORIES

```
supervisor/
├── README.md                      ← This file
├── MCP_SERVER.md                  ← MCP Supervisor server implementation
├── PERFORMANCE_DASHBOARD.md        ← Real-time monitoring system
├── MARKET_INTELLIGENCE.md          ← AI market tracking pipeline
├── OPENCLAW_MIGRATION.md           ← OpenClaw → Claude Code migration guide
├── agents/
│   ├── SOUL_supervisor.md
│   ├── SOUL_analyst.md
│   ├── SOUL_watcher.md
│   └── SOUL_optimizer.md
├── reports/
│   ├── WEEKLY_ANALYSIS.md          ← Weekly system analysis
│   ├── MARKET_SCAN.md              ← Market intelligence digest
│   └── OPTIMIZATION_PLAN.md        ← Improvement recommendations
└── metrics/
    ├── AGENT_METRICS.json          ← Agent performance tracking
    ├── COST_TRACKING.json          ← API spend by team/agent
    └── MARKET_PULSE.json           ← Latest market developments
```

---

## MCP SUPERVISOR ENDPOINTS

```yaml
/analyze-project-health    # Deep codebase analysis
/scan-market-updates       # AI market intelligence
/optimize-performance      # Generate improvement plans
/generate-improvement-plan # Detailed optimization roadmap
/monitor-agent-metrics    # Track agent performance
```

---

## CORE CAPABILITIES

### 1. Project Analysis Engine
- Deep analysis of ALL files in the codebase
- Performance metrics tracking across all 6 teams
- Code quality assessment and improvement suggestions
- Dependency and security vulnerability scanning

### 2. Market Intelligence Monitoring
- Real-time tracking of AI model developments (Kimi, Seedream, Seedance, etc.)
- Competitive analysis of MCP servers and agent frameworks
- Cost optimization recommendations based on market pricing
- Technology stack evolution tracking

### 3. Iterative Improvement System
- Automated refactoring proposals
- Performance optimization suggestions
- Toolchain upgrades and migrations
- Architecture evolution planning

---

## ESCALATION TO OWNER

Supervisor escalates directly when:
- Critical security vulnerability detected
- Budget anomaly exceeds threshold
- Agent performance degradation detected
- Market shift requires strategic response
- Architecture decision needs owner approval

---

## CROSS-TEAM INTERFACES

| Team | Direction | Input | Output |
|------|-----------|-------|--------|
| **All Teams** | Monitors | Performance data | Optimization suggestions |
| **Stackz** | Coordinates | Strategic direction | Analysis reports |
| **Warden** | Audits | Agent metrics | Improvement recommendations |
| **Owner** | Reports to | — | Weekly oversight report |
