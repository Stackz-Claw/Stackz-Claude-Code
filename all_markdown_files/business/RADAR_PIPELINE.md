# RADAR PIPELINE
*Used by: radar | Full opportunity scoring and pipeline process*

---

This document expands on the pipeline overview in `README.md`. It contains the complete workflow, scoring methodology, and operational procedures for the RADAR team.

---

## PIPELINE STAGES

```
SCAN → FILTER → SCORE → VALIDATE → PACKAGE → PRESENT → DECIDE → HANDOFF
  │        │        │        │         │         │        │        │
  │        │        │        │         │         │        │        └──► STARTUP TEAM (founder)
  │        │        │        │         │         │        │
  │        │        │        │         │         │        └──► GO / NO-GO / TABLE
  │        │        │        │         │         │
  │        │        │        │         │         └──► Owner-facing proposal
  │        │        │        │         │
  │        │        │        │         └──► Validation Report (risk rating)
  │        │        │        │
  │        │        │        └──► Score 1-100 (see SCORING_RUBRIC.md)
  │        │        │
  │        │        └──► Kill / Monitor / Proceed
  │        │
  │        └──► Source monitoring (continuous)
  │
  └──► analyst scans opportunity sources
```

---

## PHASE 1: SCAN

### Source Categories

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

## PHASE 2: FILTER

### Auto-Kill Criteria

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

### Survival Criteria

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

## PHASE 3: SCORE

See `../SCORING_RUBRIC.md` for the complete scoring matrix.

### Scoring Thresholds

| Score | Decision | Action |
|-------|----------|--------|
| ≥80 | Validate | Enters validation pipeline |
| 60-79 | Monitor | Logged, watched for changes |
| <60 | Discard | Archived with rationale |

---

## PHASE 4: VALIDATE

### Validator Process

The `validator` agent performs red-team analysis on every 80+ opportunity:

1. **Must find at least 3 concrete failure modes**
2. **Assess dimensions:**
   - Competitive moat viability
   - Build complexity vs. team capacity
   - Market timing alignment
   - Revenue model sustainability

3. **Output: Validation Report**
   ```json
   {
     "validation_id": "val_20260212_003",
     "opportunity_id": "opp_20260212_003",
     "risk_rating": "Medium",
     "failure_modes": [
       "TTS quality insufficient for long documents",
       "Competitor with more resources could undercut pricing",
       "Compute costs unpredictable at scale"
     ],
     "mitigations": [
       "Start with open-source TTS, upgrade if needed",
       "Focus on API tier for defensibility",
       "Implement usage-based pricing to cover costs"
     ],
     "recommendation": "Proceed with caution — build MVP first to validate demand"
   }
   ```

### Risk Rating Definitions

| Rating | Criteria |
|--------|----------|
| **Low** | Clear path to execution, manageable risks, strong moat |
| **Medium** | Reasonable risks with identifiable mitigations |
| **High** | Significant challenges, may require pivots |
| **Kill** | Fundamental flaws that cannot be resolved |

---

## PHASE 5: PACKAGE

Surviving opportunities become proposals (see `PROPOSAL_TEMPLATE.md`).

---

## PHASE 6: PRESENT

Radar submits proposals to Stackz for routing to owner.

---

## PHASE 7: POST-DECISION

| Decision | Action |
|----------|--------|
| **GO** | Handoff to Startup Team (`founder`) for execution |
| **NO-GO** | Logged with reason. Radar notes if re-evaluation needed in 90 days. |
| **TABLE** | Stays in pipeline, re-evaluated next cycle |

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
