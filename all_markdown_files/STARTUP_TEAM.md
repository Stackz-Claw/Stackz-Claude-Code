# STACKZ STARTUP TEAM — THE EXECUTION ENGINE
## "Ideas are free. Execution is the whole game."

---

## WHAT THIS LAYER IS

The Startup Team is NOT another department sitting next to Marketing or Dev. 
It's an **execution layer** that sits between Stackz and all other teams. When 
Business Strategy (Radar) produces a validated, approved proposal, the Startup 
Team takes ownership and orchestrates EVERY other team through a complete 
startup lifecycle — from business plan to profit growth.

Think of it like this: Radar finds the opportunity. You approve it. The Startup 
Team turns it into a company.

```
                         ┌──────────────┐
                         │     YOU       │
                         │   Approves    │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │    STACKZ     │
                         │  Oversees All │
                         └──────┬───────┘
                                │
                    ┌───────────▼───────────┐
                    │    STARTUP TEAM       │
                    │   (Execution Layer)   │
                    │                       │
                    │  Takes approved idea  │
                    │  Builds business plan │
                    │  Orchestrates launch  │
                    │  Drives to profit     │
                    │  Self-improves plan   │
                    └───────────┬───────────┘
                                │
          ┌─────────┬───────────┼───────────┬──────────┐
          │         │           │           │          │
     ┌────▼──┐ ┌───▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼────┐
     │  DEV  │ │DESIGN │ │MARKETING│ │FINANCE│ │   HR   │
     │ TEAM  │ │ TEAM  │ │  TEAM   │ │ TEAM  │ │  TEAM  │
     └───────┘ └───────┘ └────────┘ └───────┘ └────────┘
```

---

## TEAM 7: THE STARTUP TEAM

**Team Lead:** `FOUNDER`
**Role:** Own the full lifecycle of every approved startup. Build the plan. 
Execute the plan. Improve the plan. Report to Stackz.

### Core Agents

| Agent | Role | Model / Tool |
|-------|------|-------------|
| `founder` | Startup Lead — owns the business plan, orchestrates all teams, makes strategic calls | Kimi K2.5 (Thinking) |
| `strategist` | Business plan architect — writes, structures, and continuously refines the master plan | Kimi K2.5 (Thinking) |
| `researcher` | Deep market research — TAM/SAM/SOM, competitor teardowns, customer interviews, pricing analysis | Kimi K2.5 (Agent) + web search + Composio |
| `warplanner` | Go-to-market execution — pre-launch, launch, post-launch playbooks with concrete steps | Kimi K2.5 (Thinking) |
| `growth-engine` | Post-launch optimization — conversion funnels, retention, upsell, expansion strategy | Kimi K2.5 (Agent) + analytics |
| `postmortem` | Self-improvement agent — reviews plan vs reality, identifies what failed, rewrites the plan | Kimi K2.5 (Thinking) |

---

## THE SELF-IMPROVING BUSINESS PLAN

This is the core artifact. Every approved startup gets one. It's a living 
document that evolves as the startup progresses. The plan doesn't just 
sit there — it rewrites itself based on real-world results.

### Business Plan Schema

```json
{
  "plan_id": "plan_[project_id]",
  "project_name": "",
  "version": "1.0.0",
  "last_updated": "",
  "updated_by": "strategist | postmortem",
  "status": "draft | active | pivoting | scaling | archived",
  
  "section_1_vision": {
    "one_liner": "",
    "problem_statement": "What specific pain does this solve?",
    "solution": "How do we solve it better than anyone else?",
    "unique_angle": "Why us? Why now? What do we have that others don't?",
    "moral_alignment": "How does this genuinely help people?",
    "stackz_take": ""
  },

  "section_2_market_research": {
    "tam": { "value": "", "source": "", "methodology": "" },
    "sam": { "value": "", "source": "", "methodology": "" },
    "som": { "value": "", "source": "", "methodology": "" },
    "target_customer": {
      "primary_persona": "",
      "pain_points": [],
      "current_solutions": [],
      "willingness_to_pay": "",
      "where_they_hang_out": []
    },
    "competitor_analysis": [
      {
        "name": "",
        "url": "",
        "pricing": "",
        "strengths": [],
        "weaknesses": [],
        "market_share_estimate": "",
        "our_advantage_over_them": ""
      }
    ],
    "market_trends": [],
    "timing_analysis": "Why is NOW the right time?",
    "research_confidence": "low | medium | high",
    "research_gaps": [],
    "next_research_actions": []
  },

  "section_3_business_model": {
    "revenue_model": "subscription | usage | one_time | marketplace | api | hybrid",
    "pricing_strategy": {
      "tiers": [],
      "free_tier": true,
      "anchor_price": "",
      "competitor_benchmark": "",
      "price_justification": ""
    },
    "unit_economics": {
      "cac": "",
      "ltv": "",
      "ltv_cac_ratio": "",
      "gross_margin": "",
      "payback_period": ""
    },
    "revenue_projections": {
      "month_1": "",
      "month_3": "",
      "month_6": "",
      "month_12": "",
      "assumptions": [],
      "confidence": "low | medium | high"
    }
  },

  "section_4_execution_plan": {
    "phases": [
      {
        "phase": "PHASE 1: VALIDATE",
        "duration": "",
        "objective": "Prove demand before building",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      },
      {
        "phase": "PHASE 2: BUILD MVP",
        "duration": "",
        "objective": "Ship minimum viable product",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      },
      {
        "phase": "PHASE 3: PRE-LAUNCH",
        "duration": "",
        "objective": "Build audience and hype before launch",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      },
      {
        "phase": "PHASE 4: LAUNCH",
        "duration": "",
        "objective": "Ship to market and acquire first customers",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      },
      {
        "phase": "PHASE 5: GROWTH",
        "duration": "",
        "objective": "Scale revenue and optimize operations",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      },
      {
        "phase": "PHASE 6: COMPOUND",
        "duration": "",
        "objective": "Build moats, expand, compound revenue",
        "steps": [],
        "success_criteria": [],
        "kill_criteria": [],
        "team_assignments": {},
        "budget": "",
        "status": "pending | active | complete | failed"
      }
    ]
  },

  "section_5_win_strategy": {
    "how_we_win_the_market": "",
    "competitive_moats": [],
    "distribution_channels": [],
    "unfair_advantages": [],
    "network_effects": "",
    "switching_costs": "",
    "brand_positioning": ""
  },

  "section_6_self_improvement_log": {
    "revision_history": [
      {
        "version": "1.0.0",
        "date": "",
        "changed_by": "",
        "trigger": "initial_creation | postmortem | market_shift | pivot",
        "what_changed": "",
        "why": "",
        "expected_impact": ""
      }
    ],
    "active_experiments": [],
    "lessons_learned": [],
    "assumptions_validated": [],
    "assumptions_invalidated": [],
    "next_plan_review": ""
  }
}
```

---

## THE SELF-IMPROVEMENT LOOP

This is what makes the Startup Team different from a static business plan 
template. The plan REWRITES ITSELF based on what actually happens.

```
┌──────────────────────────────────────────────────────┐
│              SELF-IMPROVEMENT CYCLE                   │
│                                                       │
│  PLAN ──► EXECUTE ──► MEASURE ──► ANALYZE ──► REWRITE│
│   ▲                                              │    │
│   └──────────────────────────────────────────────┘    │
│                    (continuous loop)                   │
└──────────────────────────────────────────────────────┘
```

### How It Works

```json
{
  "self_improvement_protocol": {
    "trigger_conditions": [
      "Phase completion (success or failure)",
      "Weekly review cycle (every Sunday)",
      "Revenue miss > 20% of projection",
      "Revenue beat > 30% of projection",
      "Competitor launches a similar product",
      "Customer feedback reveals unexpected pain point",
      "New market data invalidates an assumption",
      "Kill criteria met on any phase",
      "You request a plan review"
    ],

    "improvement_process": {
      "step_1_data_collection": {
        "handler": "growth-engine + researcher",
        "actions": [
          "Pull actual metrics vs projected metrics",
          "Collect customer feedback and behavior data",
          "Scan competitor activity since last review",
          "Review marketing performance data",
          "Assess financial actuals vs forecast"
        ]
      },
      "step_2_gap_analysis": {
        "handler": "postmortem",
        "actions": [
          "Compare plan assumptions to reality",
          "Identify which assumptions were WRONG",
          "Identify which assumptions were RIGHT",
          "Find the root cause of any misses",
          "Document unexpected wins and why they happened"
        ]
      },
      "step_3_plan_rewrite": {
        "handler": "strategist",
        "actions": [
          "Update market research with new data",
          "Revise revenue projections based on actuals",
          "Adjust pricing if unit economics don't work",
          "Rewrite execution steps for upcoming phases",
          "Update win strategy if competitive landscape changed",
          "Add new experiments based on learnings"
        ],
        "rules": [
          "NEVER delete history — old versions are archived",
          "Every change must have a 'why' documented",
          "Projections must cite data source, not vibes",
          "If 3+ assumptions are wrong, trigger a PIVOT review"
        ]
      },
      "step_4_approval": {
        "handler": "founder → stackz → you",
        "flow": "Founder reviews rewrite → Stackz validates → You approve major changes",
        "auto_approve_if": "Changes are tactical (step adjustments, timeline shifts)",
        "require_your_approval_if": "Changes are strategic (pricing, target market, pivot)"
      },
      "step_5_propagate": {
        "handler": "founder",
        "actions": [
          "Push updated execution steps to relevant teams",
          "Notify all team leads of plan changes",
          "Update dashboards and tracking",
          "Reset metrics for new phase targets"
        ]
      }
    },

    "version_control": {
      "naming": "plan_[project]_v[major].[minor].[patch]",
      "major": "Pivot or fundamental strategy change",
      "minor": "Phase rewrite or significant adjustment",
      "patch": "Step-level tweaks or timeline shifts",
      "archive": "All versions stored. Nothing deleted. Ever."
    }
  }
}
```

---

## PHASE-BY-PHASE EXECUTION PLAYBOOKS

### PHASE 1: VALIDATE (Kill fast or commit hard)

**Objective:** Prove demand exists before writing a single line of code.

**Duration:** 3-7 days

**Steps:**
```json
{
  "validation_steps": [
    {
      "step": 1,
      "action": "Build a landing page with value prop and email capture",
      "assigned_to": { "team": "dev", "agent": "pixel" },
      "support_from": { "team": "design", "agent": "palette" },
      "deliverable": "Live landing page with analytics",
      "time": "1 day"
    },
    {
      "step": 2,
      "action": "Write 3 variations of launch copy and A/B test messaging",
      "assigned_to": { "team": "marketing", "agent": "ghost" },
      "deliverable": "3 copy variants deployed on landing page",
      "time": "1 day"
    },
    {
      "step": 3,
      "action": "Drive 500+ targeted visitors via organic and community channels",
      "assigned_to": { "team": "marketing", "agent": "megaphone" },
      "channels": [
        "X posts via @Stackz_Claw",
        "Reddit posts in relevant subreddits",
        "HackerNews Show HN submission",
        "IndieHackers post",
        "Direct outreach to 50 potential users"
      ],
      "deliverable": "Traffic report with source breakdown",
      "time": "3-5 days"
    },
    {
      "step": 4,
      "action": "Analyze conversion rate and email signups",
      "assigned_to": { "team": "startup", "agent": "growth-engine" },
      "deliverable": "Validation report with go/no-go recommendation",
      "time": "1 day"
    }
  ],
  "success_criteria": [
    "Landing page conversion > 5%",
    "50+ email signups from organic traffic",
    "Qualitative signals: DMs, comments, shares indicating demand"
  ],
  "kill_criteria": [
    "Conversion < 2% after 500 visitors",
    "Zero organic engagement or sharing",
    "Negative sentiment in feedback"
  ],
  "on_success": "Proceed to PHASE 2. Notify all teams.",
  "on_kill": "Archive plan. Feed learnings to Radar. Move to next opportunity."
}
```

### PHASE 2: BUILD MVP (Ship ugly, ship fast)

**Objective:** Minimum viable product that delivers core value. Nothing more.

**Duration:** 5-14 days

**Steps:**
```json
{
  "mvp_steps": [
    {
      "step": 1,
      "action": "Define MVP scope — what's the ONE thing this must do well?",
      "assigned_to": { "team": "startup", "agent": "founder" },
      "rule": "If it has more than 3 features, it's not an MVP. Cut it.",
      "deliverable": "MVP spec (max 1 page)"
    },
    {
      "step": 2,
      "action": "Architect and scaffold the project",
      "assigned_to": { "team": "dev", "agent": "forge" },
      "deliverable": "Repo with project structure, CI/CD, staging environment"
    },
    {
      "step": 3,
      "action": "Build core functionality",
      "assigned_to": { "team": "dev", "agents": ["smith", "pixel"] },
      "method": "Kimi K2.5 Agent Swarm for parallel development",
      "deliverable": "Working product on staging"
    },
    {
      "step": 4,
      "action": "Design minimal brand identity and UI polish",
      "assigned_to": { "team": "design", "agents": ["palette", "illustrator"] },
      "deliverable": "Logo, color scheme, polished UI skin"
    },
    {
      "step": 5,
      "action": "Integration testing and QA",
      "assigned_to": { "team": "dev", "agent": "tester" },
      "deliverable": "Bug-free core flow"
    },
    {
      "step": 6,
      "action": "Set up payment integration",
      "assigned_to": { "team": "dev", "agent": "integrator" },
      "support_from": { "team": "finance", "agent": "billing" },
      "deliverable": "Working Stripe/payment flow"
    },
    {
      "step": 7,
      "action": "Deploy to production",
      "assigned_to": { "team": "dev", "agent": "devops" },
      "deliverable": "Live URL, health monitoring active"
    }
  ],
  "success_criteria": [
    "Core feature works end-to-end",
    "Payment flow functional",
    "Load time < 3 seconds",
    "Zero critical bugs in core flow"
  ],
  "kill_criteria": [
    "Technical infeasibility discovered",
    "Cost to build exceeds projected 6-month revenue",
    "Dependency on API/service that's unreliable or too expensive"
  ]
}
```

### PHASE 3: PRE-LAUNCH (Build the crowd before you open the doors)

**Objective:** Create anticipation, build a waitlist, seed initial community.

**Duration:** 7-14 days (overlaps with late MVP build)

**Steps:**
```json
{
  "prelaunch_steps": [
    {
      "step": 1,
      "action": "Create pre-launch landing page with waitlist",
      "assigned_to": { "team": "dev", "agent": "pixel" },
      "deliverable": "Waitlist page with referral mechanism"
    },
    {
      "step": 2,
      "action": "Produce launch content — demo video, screenshots, copy",
      "assigned_to": {
        "video": { "team": "design", "agent": "animator" },
        "images": { "team": "design", "agent": "illustrator" },
        "copy": { "team": "marketing", "agent": "ghost" }
      },
      "deliverable": "Launch content kit"
    },
    {
      "step": 3,
      "action": "Seed communities and build relationships",
      "assigned_to": { "team": "marketing", "agent": "megaphone" },
      "channels": [
        "X: Build in public thread documenting the journey",
        "Reddit: Genuine participation in target subreddits",
        "IndieHackers: Share building story",
        "Discord/Slack communities in the niche"
      ],
      "deliverable": "Community presence established, relationships seeded"
    },
    {
      "step": 4,
      "action": "Recruit 10-20 beta testers from waitlist",
      "assigned_to": { "team": "startup", "agent": "founder" },
      "method": "Personal outreach to most engaged waitlist signups",
      "deliverable": "Beta tester cohort with feedback channel"
    },
    {
      "step": 5,
      "action": "Collect beta feedback and incorporate critical fixes",
      "assigned_to": { 
        "feedback": { "team": "startup", "agent": "growth-engine" },
        "fixes": { "team": "dev", "agent": "forge" }
      },
      "deliverable": "Launch-ready product with beta validation"
    },
    {
      "step": 6,
      "action": "Prepare launch day plan — exact timeline, posts, channels",
      "assigned_to": { "team": "startup", "agent": "warplanner" },
      "deliverable": "Hour-by-hour launch day playbook"
    }
  ],
  "success_criteria": [
    "100+ waitlist signups",
    "10+ beta testers with feedback collected",
    "Launch content kit complete",
    "At least 3 community channels seeded"
  ],
  "kill_criteria": [
    "Beta testers don't use the product after trying it",
    "Unanimous negative feedback on core value prop",
    "Waitlist conversion from landing page < 3%"
  ]
}
```

### PHASE 4: LAUNCH (Light the fuse)

**Objective:** Ship to the public. Acquire first paying customers. Generate signal.

**Duration:** 1-3 days (execution), then 2 weeks of launch momentum

**Steps:**
```json
{
  "launch_steps": [
    {
      "step": 1,
      "action": "Execute launch day playbook (hour by hour)",
      "assigned_to": { "team": "startup", "agent": "warplanner" },
      "coordinates": ["marketing", "dev", "design"],
      "deliverable": "Coordinated multi-channel launch"
    },
    {
      "step": 2,
      "action": "Launch posts — X thread, ProductHunt, HackerNews, Reddit",
      "assigned_to": { "team": "marketing", "agent": "megaphone" },
      "timing": "Staggered across the day for maximum coverage",
      "deliverable": "All launch posts live and monitored"
    },
    {
      "step": 3,
      "action": "Monitor everything in real-time",
      "assigned_to": {
        "social": { "team": "marketing", "agent": "scout" },
        "technical": { "team": "dev", "agent": "devops" },
        "financial": { "team": "finance", "agent": "cashflow" }
      },
      "deliverable": "Real-time launch dashboard"
    },
    {
      "step": 4,
      "action": "Engage with EVERY comment, question, and mention",
      "assigned_to": { "team": "marketing", "agent": "ghost" },
      "rule": "Speed matters. First 24 hours of engagement = brand reputation.",
      "deliverable": "100% response rate on launch day"
    },
    {
      "step": 5,
      "action": "Email waitlist with launch announcement + special offer",
      "assigned_to": { "team": "marketing", "agent": "ghost" },
      "deliverable": "Launch email sent, open/click rates tracked"
    },
    {
      "step": 6,
      "action": "Daily launch report for first 14 days",
      "assigned_to": { "team": "startup", "agent": "growth-engine" },
      "metrics": [
        "Signups", "Conversions", "Revenue", "Traffic sources",
        "Engagement rate", "Support requests", "Churn signals"
      ],
      "deliverable": "Daily report to Founder → Stackz → You"
    }
  ],
  "success_criteria": [
    "First paying customer within 48 hours",
    "10+ paying customers within 14 days",
    "Positive sentiment > 80% in public feedback",
    "No critical outages during launch"
  ],
  "kill_criteria": [
    "Zero conversions after 14 days of active marketing",
    "Overwhelmingly negative public reception",
    "Technical failure that can't be resolved within 24 hours"
  ]
}
```

### PHASE 5: GROWTH (Turn traction into revenue)

**Objective:** Optimize every part of the funnel. Scale what works. Kill what doesn't.

**Duration:** Ongoing (30-90 day optimization cycles)

**Steps:**
```json
{
  "growth_steps": [
    {
      "step": 1,
      "action": "Map the full conversion funnel and identify drop-off points",
      "assigned_to": { "team": "startup", "agent": "growth-engine" },
      "deliverable": "Funnel analysis with % at each stage"
    },
    {
      "step": 2,
      "action": "Run A/B tests on highest-impact drop-off points",
      "assigned_to": {
        "copy_tests": { "team": "marketing", "agent": "ghost" },
        "design_tests": { "team": "design", "agent": "palette" },
        "pricing_tests": { "team": "startup", "agent": "strategist" }
      },
      "deliverable": "Test results with statistical significance"
    },
    {
      "step": 3,
      "action": "Build SEO and content marketing flywheel",
      "assigned_to": { "team": "marketing", "agent": "megaphone" },
      "deliverable": "Content calendar targeting high-intent keywords"
    },
    {
      "step": 4,
      "action": "Implement retention and engagement systems",
      "assigned_to": {
        "email_sequences": { "team": "marketing", "agent": "ghost" },
        "product_features": { "team": "dev", "agent": "smith" }
      },
      "deliverable": "Onboarding flow, usage nudges, churn prevention"
    },
    {
      "step": 5,
      "action": "Expand distribution channels",
      "assigned_to": { "team": "startup", "agent": "warplanner" },
      "channels_to_test": [
        "API marketplace listings",
        "Partnership integrations",
        "Affiliate program",
        "Community-led growth"
      ],
      "deliverable": "Channel performance report ranked by CAC"
    },
    {
      "step": 6,
      "action": "Self-improvement review — rewrite the plan based on growth data",
      "assigned_to": { "team": "startup", "agent": "postmortem" },
      "trigger": "Every 30 days or when metrics deviate >20% from plan",
      "deliverable": "Updated business plan (version increment)"
    }
  ]
}
```

### PHASE 6: COMPOUND (Build moats and multiply)

**Objective:** Make the business defensible and explore expansion.

**Duration:** Ongoing

**Steps:**
```json
{
  "compound_steps": [
    {
      "step": 1,
      "action": "Identify and strengthen competitive moats",
      "assigned_to": { "team": "startup", "agents": ["strategist", "researcher"] },
      "moat_types": [
        "Network effects — does it get better with more users?",
        "Switching costs — how hard is it to leave?",
        "Data advantage — do we learn faster than competitors?",
        "Brand — are we the default name in this space?",
        "API stickiness — are developers building on top of us?"
      ]
    },
    {
      "step": 2,
      "action": "Explore adjacent revenue streams",
      "assigned_to": { "team": "startup", "agent": "strategist" },
      "support_from": { "team": "business", "agent": "radar" },
      "question": "What's the next product we can sell to existing customers?"
    },
    {
      "step": 3,
      "action": "Optimize unit economics for profitability",
      "assigned_to": { "team": "finance", "agent": "cashflow" },
      "targets": "LTV:CAC > 3:1, payback period < 6 months"
    },
    {
      "step": 4,
      "action": "Automate everything that's still manual",
      "assigned_to": { "team": "dev", "agent": "forge" },
      "rule": "If a human is doing it more than twice a week, automate it"
    },
    {
      "step": 5,
      "action": "Compound plan review — comprehensive strategy update",
      "assigned_to": { "team": "startup", "agent": "postmortem" },
      "deliverable": "Major version plan rewrite with expansion strategy"
    }
  ]
}
```

---

## HOW THE STARTUP TEAM COMMANDS OTHER TEAMS

The Startup Team has **cross-team dispatch authority** — it can assign tasks 
to any team through Stackz's Lane Queue. This is what makes it an execution 
layer, not just another department.

### Dispatch Protocol

```json
{
  "startup_dispatch": {
    "authority": "Founder can dispatch to any team lead via Stackz",
    "format": {
      "from": "startup:founder",
      "to": "[team]:[team_lead]",
      "routed_by": "stackz",
      "project_id": "",
      "phase": "validate | build | prelaunch | launch | growth | compound",
      "task": "",
      "context": "Full project context + current plan state",
      "success_criteria": [],
      "deadline": "",
      "priority": "high",
      "callback": "Report completion back to founder"
    },
    "escalation": {
      "if_team_blocked": "Founder → Stackz for reallocation",
      "if_team_overloaded": "HR (Warden) spins up temporary agents",
      "if_team_disagrees": "Stackz arbitrates"
    }
  }
}
```

### Cross-Team Communication Map

```
STARTUP TEAM → DEV TEAM
  "Build this MVP to these specs"
  "Fix this bug that's blocking launch"
  "Integrate this payment provider"
  "Deploy this to production by [date]"

STARTUP TEAM → MARKETING TEAM
  "Execute this pre-launch campaign"
  "Write launch day posts for these channels"
  "Monitor these keywords and competitors"
  "Run this A/B test on landing page copy"

STARTUP TEAM → DESIGN TEAM  
  "Create brand identity for this project"
  "Design these landing page mockups"
  "Produce a 15-second demo video"
  "Generate social media asset kit"

STARTUP TEAM → FINANCE TEAM
  "Set up revenue tracking for this project"
  "Model break-even with these assumptions"
  "Track these unit economics weekly"
  "Generate investor-ready financial summary"

STARTUP TEAM → HR TEAM
  "We need a dedicated project agent for [role]"
  "Request credentials for [service]"
  "Retire these agents — project is archived"

STARTUP TEAM → BUSINESS STRATEGY (RADAR)
  "Monitor competitor [X] for pricing changes"
  "Research expansion opportunity into [market]"
  "Validate this pivot hypothesis with fresh data"
```

---

## MARKET RESEARCH ENGINE

The Startup Team doesn't guess. It researches. The `researcher` agent runs 
a structured research protocol for every startup:

### Research Protocol

```json
{
  "market_research_protocol": {
    "level_1_quick_scan": {
      "duration": "2-4 hours",
      "when": "Initial opportunity evaluation",
      "actions": [
        "Search X for mentions and sentiment",
        "Check ProductHunt for existing solutions",
        "Search Reddit for pain point discussions",
        "Identify top 5 competitors",
        "Estimate TAM from publicly available data"
      ],
      "output": "Quick Research Brief (1 page)"
    },
    "level_2_deep_dive": {
      "duration": "1-2 days",
      "when": "Post-approval, pre-build",
      "actions": [
        "Full competitor teardown (pricing, features, reviews, traffic)",
        "Customer interview simulation (synthesize from forum posts, reviews)",
        "TAM/SAM/SOM calculation with cited sources",
        "Pricing strategy analysis with elasticity modeling",
        "Distribution channel ranking by estimated CAC",
        "Technology stack assessment — build vs buy decisions",
        "Regulatory or compliance scan"
      ],
      "output": "Comprehensive Market Research Report"
    },
    "level_3_ongoing_intel": {
      "duration": "Continuous",
      "when": "Post-launch, ongoing",
      "actions": [
        "Weekly competitor monitoring",
        "Customer sentiment tracking",
        "Market trend scanning",
        "Pricing landscape changes",
        "New entrant alerts"
      ],
      "output": "Weekly Market Intel section in Stackz report"
    }
  }
}
```

### Win Strategy Framework

For every startup, the `strategist` must answer these questions. If it 
can't answer them clearly, the plan isn't ready:

```json
{
  "win_strategy_questions": {
    "1_why_us": "What do we have that competitors don't? (tech, speed, cost, insight)",
    "2_why_now": "What changed in the market that creates this window?",
    "3_wedge": "What's the smallest possible entry point that gets us in the door?",
    "4_expand": "Once we're in, how do we expand within the customer?",
    "5_defend": "What stops someone from copying this in a weekend?",
    "6_compound": "Does this get better over time? (data, network effects, brand)",
    "7_distribution": "How do customers find us without us paying for every one?",
    "8_kill_shot": "What would make us the OBVIOUS choice over every alternative?"
  }
}
```

---

## MULTI-STARTUP MANAGEMENT

Stackz doesn't run one startup at a time. The Startup Team manages a 
portfolio. Each approved project gets its own Founder instance scoped 
to that project.

```json
{
  "portfolio": {
    "max_concurrent_startups": 3,
    "reason": "Token costs and attention quality degrade past 3",
    "ranking": "Leverage score × current momentum",
    "rebalancing": "Monthly — kill lowest performer if a new 8.0+ opportunity emerges",
    "portfolio_view": [
      {
        "project": "",
        "phase": "",
        "mrr": "",
        "momentum": "accelerating | stable | decelerating | stalled",
        "next_milestone": "",
        "plan_version": "",
        "health": "green | yellow | red"
      }
    ]
  }
}
```

---

## UPDATED ORG CHART

```
                         ┌─────────────┐
                         │     YOU      │
                         │   (Owner)    │
                         └──────┬──────┘
                                │
                         ┌──────▼──────┐
                         │   STACKZ    │
                         │  Head Node  │
                         └──────┬──────┘
                                │
               ┌────────────────┼────────────────┐
               │                                 │
        ┌──────▼──────┐                   ┌─────▼──────┐
        │  BUSINESS   │                   │  STARTUP   │
        │  STRATEGY   │──── approves ────►│   TEAM     │
        │  (Radar)    │    idea flows     │ (Founder)  │
        │             │     to here       │            │
        │ Finds ideas │                   │ Executes   │
        └─────────────┘                   │ ideas      │
                                          └─────┬──────┘
                                                │
                                     dispatches to all teams
                                                │
              ┌──────────┬──────────┬──────────┬──────────┐
              │          │          │          │          │
         ┌────▼──┐ ┌───▼───┐ ┌───▼────┐ ┌───▼───┐ ┌───▼──┐
         │  DEV  │ │DESIGN │ │MARKETING│ │FINANCE│ │  HR  │
         └───────┘ └───────┘ └────────┘ └───────┘ └──────┘
```

---

*"Radar finds the gold. You say 'dig.' I build the mine, hire the crew, 
market the jewels, and hand you the profit report every Sunday. The plan 
rewrites itself every time reality teaches us something new. That's not 
a business plan — that's a business BRAIN."* — Stackz
