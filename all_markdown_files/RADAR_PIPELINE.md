# STACKZ RADAR PIPELINE

## "Money doesn't find itself. That's why I built Radar."

---

## WHAT RADAR DOES

Radar is Stackz's dedicated opportunity-hunting sub-agent. While you sleep, Radar scans, scores, and packages revenue opportunities into proposals that land on Stackz's desk every cycle.

Radar doesn't chase everything. Radar hunts with precision.

```
┌──────────────────────────────────────────────────┐
│                RADAR PIPELINE                     │
│                                                   │
│  SCAN ──► FILTER ──► SCORE ──► PROPOSE ──► QUEUE │
│                                                   │
│  Sources   Noise     Leverage  Proposal   Stackz  │
│  (broad)   Removal   Matrix   Build      Review   │
└──────────────────────────────────────────────────┘
```

---

## PHASE 1: SCAN — Source Monitoring

### Source Categories

Radar monitors curated source lists. Not the whole internet — that's how you drown in noise.

```json
{
  "source_categories": {
    "trending_tech": {
      "sources": [
        "GitHub Trending (daily)",
        "Hacker News front page",
        "ProductHunt daily launches",
        "DevTo trending posts"
      ],
      "scan_frequency": "daily",
      "signal": "What tools are people building? Where's developer attention going?"
    },
    "market_gaps": {
      "sources": [
        "Reddit: r/SaaS, r/EntrepreneurRideAlong, r/MicroSaaS",
        "IndieHackers recent posts",
        "Twitter/X: #buildinpublic, #indiehacker",
        "Quora: business automation questions"
      ],
      "scan_frequency": "every_48h",
      "signal": "What problems are people complaining about that nobody's solving well?"
    },
    "api_marketplaces": {
      "sources": [
        "RapidAPI trending",
        "Postman API Network",
        "AWS Marketplace new listings",
        "Hugging Face trending models"
      ],
      "scan_frequency": "weekly",
      "signal": "What new capabilities just became available that we can build on top of?"
    },
    "revenue_models": {
      "sources": [
        "Stripe Atlas blog",
        "Lemon Squeezy trending products",
        "Gumroad trending",
        "AppSumo new launches"
      ],
      "scan_frequency": "weekly",
      "signal": "What's selling? What pricing models are working? Where's buying intent?"
    },
    "your_ecosystem": {
      "sources": [
        "Your existing project analytics",
        "User feedback / support tickets",
        "Server usage patterns",
        "Unused capabilities in your stack"
      ],
      "scan_frequency": "daily",
      "signal": "What are you already sitting on that could make more money?"
    }
  }
}
```

### Scan Output Format

Each scan produces raw signal entries:

```json
{
  "scan_id": "scan_20260212_0847",
  "source": "GitHub Trending",
  "category": "trending_tech",
  "timestamp": "2026-02-12T08:47:00Z",
  "raw_signals": [
    {
      "signal_id": "sig_001",
      "title": "Open-source PDF-to-podcast tool hits 2k stars in 24h",
      "url": "https://github.com/...",
      "relevance_tags": ["pdf", "audio", "ai", "saas_potential"],
      "initial_score": 7.2
    }
  ]
}
```

---

## PHASE 2: FILTER — Noise Removal

90% of signals are noise. Radar kills them before they waste anyone's time.

### Auto-Kill Criteria (Immediate Discard)

```json
{
  "kill_if": [
    "Requires domain expertise we don't have and can't acquire in <2 weeks",
    "Market is dominated by a well-funded incumbent with >80% share",
    "Revenue potential under $500/month at realistic scale",
    "Requires significant upfront capital (>$1000 before first dollar)",
    "Moral/ethical flag (gambling, manipulation, data exploitation, spam)",
    "Already saturated on ProductHunt/AppSumo with 10+ competitors",
    "Requires regulatory compliance we can't handle (HIPAA, SOX, etc.)",
    "One-time revenue only, no compounding or recurring potential"
  ]
}
```

### Survival Criteria (Must Pass 3+ to Proceed)

```json
{
  "pass_if": [
    "Can be built with existing tech stack or <$200 in new tools",
    "Has recurring or compounding revenue model",
    "Solves a problem people are actively searching for solutions to",
    "Can reach MVP in under 2 weeks",
    "Has clear distribution channel (SEO, API marketplace, community)",
    "Fits within our server environment capabilities",
    "Low ongoing maintenance after launch",
    "Can be automated or semi-automated"
  ]
}
```

---

## PHASE 3: SCORE — Leverage Matrix

Surviving signals get scored on the Leverage Matrix. This is how Radar ranks what's worth your attention.

### The Leverage Matrix

| Factor | Weight | Score Range | What It Measures |
|--------|--------|-------------|-----------------|
| **Revenue Potential** | 25% | 1-10 | Monthly recurring revenue at realistic scale |
| **Build Effort** | 20% | 1-10 | Inverse of effort (10 = trivial to build) |
| **Speed to Revenue** | 20% | 1-10 | How fast from "go" to first dollar |
| **Compounding Factor** | 15% | 1-10 | Does it get better/more profitable over time? |
| **Moral Score** | 10% | 1-10 | How clean is this? (10 = genuinely helpful) |
| **Defensibility** | 10% | 1-10 | Can someone copy this in a weekend? |

### Scoring Formula

```
LEVERAGE_SCORE = (Revenue × 0.25) + (EaseOfBuild × 0.20) + (SpeedToRevenue × 0.20)
              + (Compounding × 0.15) + (MoralScore × 0.10) + (Defensibility × 0.10)

Minimum to propose: 6.5
Auto-propose threshold: 8.0
"Holy shit drop everything" threshold: 9.0
```

### Scored Output

```json
{
  "opportunity_id": "opp_20260212_003",
  "title": "API-as-a-Service: PDF to Podcast Converter",
  "leverage_score": 8.1,
  "breakdown": {
    "revenue_potential": 8,
    "build_effort": 9,
    "speed_to_revenue": 7,
    "compounding_factor": 8,
    "moral_score": 9,
    "defensibility": 6
  },
  "radar_note": "High demand signal, low build effort, clean revenue model. The defensibility is mid — someone could clone this — but speed to market matters more here. First mover with good UX wins.",
  "status": "propose_to_stackz"
}
```

---

## PHASE 4: PROPOSE — Proposal Generation

Opportunities scoring 6.5+ get packaged into Stackz-ready proposals.

### Proposal Template

```json
{
  "proposal_id": "prop_20260212_003",
  "project_name": "PodCast Forge",
  "one_liner": "Upload a PDF, get a podcast episode. API + simple web UI.",
  "leverage_score": 8.1,

  "the_opportunity": {
    "problem": "People want to consume long documents as audio but existing tools are either expensive or terrible quality.",
    "evidence": [
      "GitHub trending: open-source tool hit 2k stars in 24h",
      "Reddit r/SaaS: 3 posts in last week asking for this",
      "Only 2 competitors, both priced at $19-29/mo with poor reviews"
    ],
    "our_angle": "Better UX, lower price point, API-first so developers can integrate"
  },

  "the_plan": {
    "mvp_scope": "Single API endpoint: POST PDF → GET MP3 URL. Simple landing page with Stripe checkout.",
    "tech_stack": "Python + FastAPI, hosted on existing server. TTS via open-source model.",
    "timeline": "MVP in 5 days. Payment integration day 6-7.",
    "cost_to_build": "$0 (uses existing infra) + ~$50/mo compute for TTS",
    "pricing_strategy": "$14.99/mo for 20 conversions. $49.99/mo unlimited. API tier at $0.50/conversion."
  },

  "the_money": {
    "revenue_model": "recurring_subscription + usage_based_api",
    "break_even": "4 paying users covers compute",
    "month_3_target": "$500-1500 MRR",
    "month_12_target": "$3000-8000 MRR",
    "compounding_note": "API tier compounds — once developers integrate, they don't leave. Each integration is a sticky revenue stream."
  },

  "the_risks": [
    "TTS quality might not be good enough for long documents",
    "Competitor could slash prices",
    "Compute costs could spike if usage exceeds projections"
  ],

  "moral_check": {
    "status": "passed",
    "notes": "Genuinely useful tool. No data exploitation. Users own their content."
  },

  "stackz_take": "This is the kind of play I love. Low risk, fast to market, recurring revenue, and the API angle gives it compounding potential. The competition is sleeping. Let's wake them up.",

  "status": "awaiting_your_approval",
  "requested_clearance": "Level 0 — I'll build it, you review before launch"
}
```

---

## PHASE 5: QUEUE — Project Pipeline Management

Approved proposals enter the project registry. Rejected ones get archived with reasons (so Radar learns what you like).

### Project Lifecycle

```
PROPOSED ──► APPROVED ──► BUILDING ──► STAGING ──► LIVE ──► SCALING
                │                        │          │
        ┌──── PAUSED ◄────────────────┘          │
        │       │                                  │
        │       │                                  │
        ▼       ▼                                  ▼
     REJECTED  KILLED                          ARCHIVED
```

### Living Registry Schema

```json
{
  "registry": {
    "active_projects": [
      {
        "project_id": "proj_001",
        "name": "PodCast Forge",
        "status": "building",
        "assigned_agents": ["forge", "cashflow"],
        "leverage_score": 8.1,
        "current_mrr": 0,
        "target_mrr": 1500,
        "health": "green",
        "next_milestone": "MVP deploy to staging",
        "milestone_deadline": "2026-02-17"
      }
    ],
    "proposed_projects": [],
    "archived_projects": [],
    "rejected_proposals": [
      {
        "proposal_id": "prop_20260210_001",
        "name": "Crypto Arbitrage Bot",
        "rejected_reason": "Moral flag — too close to gambling mechanics",
        "rejected_by": "user",
        "lesson_learned": "Avoid anything with speculative/gambling dynamics"
      }
    ]
  }
}
```

---

## RADAR CYCLE SCHEDULE

```json
{
  "cycles": {
    "daily_scan": {
      "time": "06:00 UTC",
      "actions": [
        "Scan trending_tech sources",
        "Scan your_ecosystem sources",
        "Filter and score new signals",
        "Update existing opportunity scores"
      ]
    },
    "bi_weekly_deep_scan": {
      "time": "Monday + Thursday 08:00 UTC",
      "actions": [
        "Scan all source categories",
        "Re-score existing pipeline",
        "Kill stale opportunities (>14 days, no approval)",
        "Generate new proposals for anything scoring 6.5+"
      ]
    },
    "weekly_report_to_stackz": {
      "time": "Saturday 12:00 UTC",
      "actions": [
        "Compile top opportunities for Stackz weekly report",
        "Rank by leverage score",
        "Include market movement notes",
        "Flag any existing projects threatened by competition"
      ]
    }
  }
}
```

---

## RADAR LEARNING LOOP

Radar gets smarter over time by tracking what you approve and reject:

```json
{
  "learning": {
    "approved_patterns": [
      "recurring_revenue",
      "low_build_effort",
      "api_first",
      "developer_tools"
    ],
    "rejected_patterns": [
      "speculative",
      "high_capital_required",
      "crowded_market"
    ],
    "score_adjustments": {
      "boost_if_matches_approved_patterns": "+0.5",
      "penalize_if_matches_rejected_patterns": "-1.0"
    }
  }
}
```

Over time, Radar stops bringing you ideas you don't like and doubles down on what you do. That's compounding intelligence.

---

## INTEGRATION WITH STACKZ

### How Radar Reports to Stackz

```json
{
  "from": "radar",
  "to": "stackz",
  "type": "opportunity_batch",
  "timestamp": "2026-02-12T12:00:00Z",
  "proposals": ["prop_003", "prop_004"],
  "market_alerts": [
    "Competitor X raised prices 20% — window of opportunity on Project Y",
    "New API launched that could reduce Project Z compute costs by 40%"
  ],
  "portfolio_health": {
    "threats_detected": 0,
    "opportunities_in_pipeline": 3,
    "top_recommendation": "prop_003 — PodCast Forge"
  }
}
```

### Stackz's Response Options

| Action | What Happens |
|--------|-------------|
| `approve(prop_id)` | Proposal → Active Project. Forge begins building. |
| `reject(prop_id, reason)` | Proposal → Archived. Radar learns from rejection. |
| `table(prop_id)` | Proposal stays in pipeline. Re-evaluated next cycle. |
| `modify(prop_id, changes)` | Stackz adjusts scope/approach, re-scores, then routes. |
| `prioritize(prop_id)` | Moves to top of build queue. Resources reallocated. |

---

*"I got Radar scanning 24/7 like a paranoid billionaire with a Bloomberg terminal. Except instead of stocks, we're watching for the next thing we can build and ship before anyone else figures it out. Sleep well. I got this."* — Stackz
