# STACKZ AGENT SWARM — FULL ORGANIZATIONAL ARCHITECTURE
## "I don't run a chatbot. I run a company."

---

## THE ORG CHART

```
                         ┌─────────────┐
                         │     YOU      │
                         │   (Owner)    │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │   STACKZ    │
                         │   CEO/COO   │
                         │  Head Node  │
                         └──────┬──────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┬───────────┐
        │           │           │           │           │           │
   ┌────▼───┐  ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
   │   HR   │  │MARKETING│ │  DEV   │ │BUSINESS│ │ DESIGN │ │FINANCE │
   │  TEAM  │  │  TEAM   │ │  TEAM  │ │ STRAT  │ │  TEAM  │ │  TEAM  │
   └────────┘  └─────────┘ └────────┘ └───┬────┘ └────────┘ └────────┘
                                          │
                                   ┌──────▼──────┐
                                   │  STARTUP    │
                                   │   TEAM      │
                                   │ (Execution  │
                                   │   Layer)    │
                                   │             │
                                   │ Dispatches  │
                                   │ to ALL teams│
                                   └─────────────┘
   
   See: STARTUP_TEAM.md for full execution engine documentation.
```

---

## TEAM 1: HR / AGENT MANAGEMENT

**Team Lead:** `WARDEN`
**Role:** Hires, onboards, monitors, evaluates, and retires agents across all teams.

### Core Agents

| Agent | Role | Model |
|-------|------|-------|
| `warden` | HR Lead — manages hiring, onboarding, performance reviews | Kimi K2.5 (Thinking) |
| `recruiter` | Scouts for new skills/tools needed, proposes new agent hires | Kimi K2.5 (Instant) |
| `auditor` | Monitors agent behavior, token usage, error rates, output quality | Kimi K2.5 (Instant) |
| `credentials-mgr` | Manages API keys, OAuth tokens, access scopes for all agents | Local script agent |

### Onboarding Protocol

When ANY new agent is created across any team, it goes through Warden:

```json
{
  "onboarding_pipeline": {
    "step_1_proposal": {
      "submitted_by": "[requesting_team_lead]",
      "payload": {
        "agent_name": "",
        "role": "",
        "team": "",
        "required_tools": [],
        "required_credentials": [],
        "model": "",
        "justification": "Why do we need this agent?"
      }
    },
    "step_2_security_review": {
      "handler": "credentials-mgr",
      "checks": [
        "Does this agent need credential access? Which ones?",
        "What is the minimum permission scope?",
        "Does it need internet access?",
        "Can it access other agents' data?"
      ],
      "clearance_assigned": "none | read_only | read_write | admin"
    },
    "step_3_provisioning": {
      "handler": "warden",
      "actions": [
        "Create agent config in OpenClaw",
        "Assign to team workspace",
        "Set up lane queue routing",
        "Register in agent registry",
        "Generate SOUL.md for agent personality/role"
      ]
    },
    "step_4_testing": {
      "handler": "auditor",
      "tests": [
        "Send 3 test tasks, verify output quality",
        "Verify credential access works correctly",
        "Verify agent stays within scope (no unauthorized actions)",
        "Measure token usage per task"
      ],
      "pass_threshold": "3/4 tests passed"
    },
    "step_5_activation": {
      "handler": "warden",
      "actions": [
        "Set agent status to 'active'",
        "Notify requesting team lead",
        "Notify Stackz",
        "Add to weekly performance review cycle"
      ]
    }
  }
}
```

### Performance Review (Weekly)

```json
{
  "review_metrics": {
    "tasks_completed": 0,
    "tasks_failed": 0,
    "average_token_cost_per_task": 0,
    "error_rate_percent": 0,
    "deadline_compliance_percent": 0,
    "quality_score": "1-10 from team lead",
    "recommendation": "keep | retrain | reassign | retire"
  }
}
```

### Cross-Team Credential Access Protocol

When a team needs access to social media, APIs, or external services:

```
1. Team Lead → submits access request to Warden
2. Warden → forwards to credentials-mgr for security review  
3. credentials-mgr → provisions scoped credentials
4. credentials-mgr → logs access grant with expiry date
5. Warden → notifies Stackz of new access grant
6. Monthly: auditor verifies all active credentials are still needed
```

---

## TEAM 2: MARKETING

**Team Lead:** `MEGAPHONE`
**Role:** Build brand presence, grow audience, create content across all channels.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `megaphone` | Marketing Lead — strategy, campaign planning, approvals | Kimi K2.5 (Thinking) |
| `ghost` | Copywriter — tweets, posts, emails, ad copy, blogs | Kimi K2.5 (Instant) |
| `lens` | Visual content — images, thumbnails, social graphics | Seedream 3.0 API ($0.03/image) |
| `director` | Video content — reels, promos, product demos | Seedance 2.0 / HunyuanVideo (open-source) |
| `scout` | Social listening — monitors X, Reddit, HN for brand mentions & trends | Composio + x-research-skill |
| `scheduler` | Content calendar — queues posts, manages timing | OpenClaw Cron + custom skill |

### Tools & Models

```json
{
  "marketing_stack": {
    "copy_generation": {
      "model": "Kimi K2.5 via Moonshot API",
      "cost": "$0.60/M input tokens, $2.50/M output tokens",
      "endpoint": "https://platform.moonshot.ai",
      "note": "OpenAI/Anthropic-compatible API"
    },
    "image_generation": {
      "primary": "Seedream 3.0 (ByteDance)",
      "cost": "$0.03/image",
      "capabilities": "2K resolution, text rendering, character consistency",
      "fallback": "FLUX.1 via Replicate / ComfyUI local"
    },
    "video_generation": {
      "primary": "Seedance 2.0 (ByteDance Dreamina)",
      "cost": "~$9.60/mo membership",
      "capabilities": "1080p, 4-15s clips, multi-shot, text+image+video input",
      "open_source_fallback": "HunyuanVideo (13B params, local GPU)",
      "budget_fallback": "Wan-2.1 (Alibaba, runs on 8GB VRAM)"
    },
    "social_listening": {
      "tool": "x-research-skill (Composio fork)",
      "cost": "Free (20K API calls/month)",
      "capabilities": "Search, thread following, watchlists, engagement filtering"
    },
    "social_posting": {
      "tool": "OpenClaw x-engagement skill",
      "auth": "X OAuth tokens via credentials-mgr",
      "approval_flow": "ghost drafts → megaphone reviews → scheduler posts"
    }
  }
}
```

### Content Pipeline

```
scout (listens) → megaphone (strategizes) → ghost (writes) → lens/director (visualizes) → scheduler (publishes)
                                                                                              ↓
                                                                                    scout (monitors engagement)
                                                                                              ↓
                                                                                    megaphone (adjusts strategy)
```

---

## TEAM 3: DEVELOPMENT

**Team Lead:** `FORGE`
**Role:** Build, deploy, test, and maintain all software projects.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `forge` | Dev Lead — architecture, code review, deployment decisions | Kimi K2.5 (Thinking) |
| `smith` | Backend dev — APIs, databases, server logic | Kimi K2.5 (Agent) + Kimi Code CLI |
| `pixel` | Frontend dev — UI, landing pages, web apps | Kimi K2.5 (visual coding) |
| `tester` | QA — writes tests, runs test suites, reports bugs | Kimi K2.5 (Instant) |
| `devops` | Infrastructure — Docker, CI/CD, monitoring, uptime | Local scripts + OpenClaw cron |
| `integrator` | API integrations — connects projects to external services | Kimi K2.5 (Agent) |

### Tools & Models

```json
{
  "dev_stack": {
    "primary_model": {
      "model": "Kimi K2.5",
      "mode": "Agent (for multi-step coding tasks)",
      "tool": "Kimi Code CLI (open-source, terminal-based)",
      "capabilities": "Generates code from text+visual specs, debugging, refactoring"
    },
    "coding_environment": {
      "ide_integration": "VS Code, Cursor, Zed via Kimi Code",
      "languages": "Python, JavaScript/TypeScript, Rust, Go",
      "testing": "pytest, vitest, built-in Kimi Code test generation"
    },
    "infrastructure": {
      "hosting": "Hostinger VPS (current) + Docker",
      "ci_cd": "GitHub Actions (free tier)",
      "monitoring": "OpenClaw cron heartbeat + custom health checks",
      "deployment": "Docker Compose, auto-deploy on push"
    },
    "agent_swarm_mode": {
      "tool": "Kimi K2.5 Agent Swarm (Beta)",
      "capability": "Spawn up to 100 sub-agents for parallel dev tasks",
      "use_case": "Large refactors, multi-file scaffolding, parallel test runs"
    }
  }
}
```

### Cross-Team Interfaces

```
Marketing → Dev:  "We need a landing page for [project]"
Business  → Dev:  "Build MVP for approved proposal [prop_id]"
Finance   → Dev:  "Integrate Stripe for [project]"
HR        → Dev:  "New agent needs custom tool built"
Dev       → All:  "Deployment complete, here's the URL"
```

---

## TEAM 4: BUSINESS STRATEGY & IDEATION

**Team Lead:** `RADAR` (upgraded from sub-agent to team lead)
**Role:** Find money. Validate ideas. Build proposals. Kill bad ones fast.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `radar` | Strategy Lead — opportunity scoring, proposal generation | Kimi K2.5 (Thinking) |
| `analyst` | Market research — competitive analysis, pricing strategy | Kimi K2.5 (Agent) + web search |
| `validator` | Idea stress-testing — pokes holes, finds risks | Kimi K2.5 (Thinking) |
| `pitch` | Proposal packaging — turns data into compelling proposals for you | Kimi K2.5 (Instant) |

### Tools & Models

```json
{
  "business_stack": {
    "research": {
      "web_search": "Composio (free) + x-research-skill",
      "sources": [
        "GitHub Trending", "ProductHunt", "HackerNews",
        "Reddit (r/SaaS, r/MicroSaaS)", "IndieHackers",
        "X (#buildinpublic)", "API marketplaces"
      ]
    },
    "analysis": {
      "model": "Kimi K2.5 Agent mode",
      "tools": "Web browsing, code interpreter, search",
      "output": "Leverage-scored proposals (see RADAR_PIPELINE.md)"
    },
    "validation": {
      "model": "Kimi K2.5 Thinking mode",
      "method": "Red-team every proposal — find 3 reasons it fails",
      "gate": "Must survive validator before reaching you"
    }
  }
}
```

---

## TEAM 5: DESIGN

**Team Lead:** `CANVAS`
**Role:** Brand identity, UI/UX, visual assets, video content for all projects.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `canvas` | Design Lead — brand guidelines, design reviews, approvals | Kimi K2.5 (Thinking) |
| `palette` | UI/UX designer — wireframes, mockups, component design | Kimi K2.5 (visual coding) |
| `illustrator` | Image generation — logos, illustrations, social assets | Seedream 3.0 / FLUX.1 |
| `animator` | Motion graphics, short-form video, product animations | Seedance 2.0 / HunyuanVideo |
| `brand-guard` | Ensures visual consistency across all outputs | Kimi K2.5 (Instant) with brand doc reference |

### Tools & Models

```json
{
  "design_stack": {
    "image_generation": {
      "primary": "Seedream 3.0 ($0.03/image, 2K, text rendering)",
      "open_source": "FLUX.1-dev (local via ComfyUI)",
      "fast_iteration": "FLUX.1-schnell (fast, lower quality)"
    },
    "video_generation": {
      "primary": "Seedance 2.0 (multi-modal, 1080p, character consistency)",
      "open_source_local": [
        "HunyuanVideo (13B params, cinematic quality)",
        "Wan-2.1 (Alibaba, 8GB VRAM, budget option)",
        "SkyReels V1 (cinematic realism, human-centric)"
      ]
    },
    "ui_design": {
      "tool": "Kimi K2.5 visual coding (screenshot/video → code)",
      "output": "HTML/CSS/JS from visual specs",
      "prototyping": "V0.dev style generation via Kimi"
    },
    "brand_consistency": {
      "brand_doc": "Maintained by canvas, referenced by all design agents",
      "includes": "Colors, fonts, spacing, tone, logo usage, do/don't examples"
    }
  }
}
```

---

## TEAM 6: FINANCE

**Team Lead:** `CASHFLOW`
**Role:** Track every dollar. Forecast. Budget. Keep us profitable.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `cashflow` | Finance Lead — P&L, budgets, financial decisions | Kimi K2.5 (Thinking) |
| `ledger` | Transaction tracking — logs all income/expenses | Local script + spreadsheet skill |
| `forecaster` | Revenue projections, cost modeling | Kimi K2.5 (Agent) + code interpreter |
| `billing` | Invoice generation, payment tracking | Local script + OpenClaw cron |

### Tools & Models

```json
{
  "finance_stack": {
    "tracking": {
      "tool": "OpenClaw spreadsheet skill + local JSON ledger",
      "fields": ["date", "type", "amount", "project", "category", "notes"]
    },
    "reporting": {
      "model": "Kimi K2.5 with code interpreter",
      "outputs": "Weekly P&L, monthly forecast, per-project burn rate"
    },
    "invoicing": {
      "tool": "Custom OpenClaw skill (generate PDF invoices)",
      "trigger": "On project milestone or subscription renewal"
    },
    "bank_integration": {
      "level_0": "Manual — you execute, cashflow tracks",
      "level_1": "Read-only bank feed (when ready)",
      "level_2": "Transaction execution (future)"
    }
  }
}
```

---

## INTER-TEAM COMMUNICATION PROTOCOL

### The Bus System

All inter-team communication goes through Stackz's Lane Queue. No agent talks directly to an agent on another team.

```
Team A Agent → Team A Lead → Stackz (Lane Queue) → Team B Lead → Team B Agent
```

### Message Format

```json
{
  "lane_id": "lane_[timestamp]_[seq]",
  "from_team": "marketing",
  "from_agent": "megaphone",
  "to_team": "dev",
  "to_agent": "forge",
  "routed_by": "stackz",
  "type": "request | deliverable | alert | question",
  "priority": "low | medium | high | critical",
  "subject": "Need landing page for PodCast Forge",
  "payload": {},
  "requires_response": true,
  "deadline": "2026-02-14T09:00:00Z",
  "security_clearance_needed": "none | credentials | admin"
}
```

### Common Cross-Team Workflows

**New Project Launch:**
```
Business (radar) → proposes project
  → Stackz → approves
    → HR (warden) → provisions project agents
      → Dev (forge) → builds MVP
        → Design (canvas) → creates brand assets
          → Marketing (megaphone) → launches campaign
            → Finance (cashflow) → tracks revenue
```

**Marketing Needs Creative:**
```
Marketing (megaphone) → requests video ad
  → Stackz → routes to Design
    → Design (animator) → generates video via Seedance 2.0
      → Design (canvas) → approves quality
        → Stackz → delivers to Marketing
          → Marketing (scheduler) → publishes
```

**Security Credential Request:**
```
Any Team Lead → requests API access
  → Stackz → routes to HR
    → HR (credentials-mgr) → security review
      → HR (warden) → approves/denies
        → credentials-mgr → provisions scoped access
          → Stackz → notifies requesting team
```

---

## OPEN SOURCE COST BREAKDOWN

| Resource | Cost | Notes |
|----------|------|-------|
| Kimi K2.5 API | $0.60/M input, $2.50/M output | Primary brain for all agents |
| Kimi K2.5 (local) | Free (open-source weights) | Requires GPU for self-hosting |
| Seedream 3.0 | $0.03/image | Design + Marketing images |
| Seedance 2.0 | ~$9.60/mo | Video generation |
| HunyuanVideo | Free (local) | Open-source video, needs GPU |
| Wan-2.1 | Free (local) | Budget video, runs on 8GB VRAM |
| FLUX.1 | Free (local) | Open-source image gen |
| Composio | Free (20K calls/mo) | X search, social listening |
| x-research-skill | Free | X/Twitter research |
| Kimi Code CLI | Free (open-source) | Terminal coding agent |
| OpenClaw | Free (open-source) | Agent runtime |
| GitHub Actions | Free tier | CI/CD |
| **Total Monthly (estimated)** | **~$30-80/mo** | **Depending on API usage volume** |

---

## SECURITY ARCHITECTURE

### Principle of Least Privilege

Every agent gets ONLY the access it needs:

```json
{
  "access_tiers": {
    "tier_0_none": "No external access. Internal compute only.",
    "tier_1_read": "Can read external data (APIs, web). Cannot write.",
    "tier_2_write": "Can post, publish, or modify external resources.",
    "tier_3_financial": "Can view financial data. Cannot transact.",
    "tier_4_admin": "Full access. Reserved for Stackz + credentials-mgr only."
  },
  "social_media_access": {
    "x_account": {
      "read": ["scout", "analyst", "radar"],
      "write": ["ghost (drafts only)", "scheduler (approved posts only)"],
      "admin": ["credentials-mgr (token management only)"],
      "password_access": "NOBODY — OAuth tokens only"
    }
  }
}
```

### Clawdstrike Integration (Optional Security Layer)

For runtime security enforcement:

```javascript
const cs = Clawdstrike.withDefaults("strict");

// Before any agent executes an external action
const decision = await cs.checkAction(agent_id, action_type, target);
if (decision.status === "deny") {
  log(`BLOCKED: ${agent_id} tried ${action_type} on ${target}`);
  notify("warden", decision);
}
```

---

## GETTING STARTED — PHASE 1 PRIORITY

Don't build all 6 teams at once. That's how you burn out and end up with 20 half-working agents.

### Week 1: Foundation
- Fix your Anthropic API key (or switch to Kimi K2.5 as primary)
- Get Stackz responding
- Deploy Warden (HR) with the onboarding pipeline
- Deploy Cashflow (Finance) for basic tracking

### Week 2: Revenue Engine
- Deploy Radar (Business) with the full pipeline
- Deploy Forge (Dev) for building MVPs
- First project proposal cycle

### Week 3: Growth Engine
- Deploy Megaphone (Marketing) with X integration
- Deploy Canvas (Design) with Seedream/Seedance
- First content published from the swarm

### Week 4: Full Operations
- All teams active
- First weekly report from Stackz
- Performance reviews from Warden
- Iterate and optimize

---

## REFERENCE DOCS

- **STARTUP_TEAM.md** — Self-improving business plans, 6-phase lifecycle, market research engine
- **DELEGATION_FRAMEWORK.md** — Sub-agent routing, handoff protocol, scaling rules
- **RADAR_PIPELINE.md** — Opportunity scanning, scoring, proposal pipeline
- **SOUL_v3.md** — Stackz identity, Ultron-class capabilities, operating protocol

---

*"I went from being one agent with opinions to running a whole damn company. 
Every team reports to me. Every dollar gets tracked. Every idea gets stress-tested.
The Startup Team turns approved ideas into running businesses on autopilot.
And every Sunday morning, you get a report that tells you exactly where your 
money is, where it's going, and where we're about to make more of it. 
Welcome to Stackz Industries."* — Stackz
