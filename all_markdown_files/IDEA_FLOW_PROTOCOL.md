# STACKZ IDEA FLOW PROTOCOL
## "Ideas come from two places: you and me. Both get the same treatment."

---

## THE TWO-WAY FLOW

```
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │   PATH A: YOUR IDEAS                                     │
  │                                                          │
  │   You ──► Stackz ──► Business Strategy ──► Decision      │
  │                        (Radar evaluates)     │           │
  │                                              ▼           │
  │                                    ┌─────────────────┐   │
  │                                    │  APPROVED?       │   │
  │                                    │  Yes → Startup   │   │
  │                                    │  No  → Archive   │   │
  │                                    │  Maybe → Research │   │
  │                                    └─────────────────┘   │
  │                                                          │
  ├──────────────────────────────────────────────────────────┤
  │                                                          │
  │   PATH B: SYSTEM-GENERATED IDEAS                         │
  │                                                          │
  │   Radar (continuous scan) ──► Self-evaluate ──► Stackz   │
  │                                                   │      │
  │                                                   ▼      │
  │                                          ┌────────────┐  │
  │                                          │ Stackz     │  │
  │                                          │ reviews &  │  │
  │                                          │ presents   │  │
  │                                          │ to You     │  │
  │                                          └─────┬──────┘  │
  │                                                │         │
  │                                                ▼         │
  │                                       You approve/reject │
  │                                                │         │
  │                                                ▼         │
  │                                    ┌─────────────────┐   │
  │                                    │  APPROVED?       │   │
  │                                    │  Yes → Startup   │   │
  │                                    │  No  → Archive   │   │
  │                                    │  Modify → Rework │   │
  │                                    └─────────────────┘   │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

**The key principle:** Every idea — whether it comes from your brain at 2am or 
from Radar's daily scan — goes through the same evaluation pipeline. No 
shortcuts. No favorites. The best idea wins regardless of where it came from.

---

## PATH A: YOUR IDEAS

You have an idea. Maybe it's half-baked. Maybe it's genius. Maybe it's both. 
Here's exactly what happens when you drop it on Stackz.

### Step 1: You Tell Stackz

You can say it however you want:
- "Hey Stackz, what if we built a tool that converts podcasts into blog posts?"
- "Look into whether there's money in AI-generated children's books"
- "I saw this tweet, can we do something like this but better?"
- A screenshot, a link, a rambling voice note — whatever

Stackz doesn't judge the format. Stackz captures the intent.

### Step 2: Stackz Structures It

Stackz takes your raw idea and packages it into a standardized Idea Intake:

```json
{
  "idea_id": "idea_[timestamp]_[seq]",
  "origin": "user",
  "raw_input": "Your exact words / link / screenshot description",
  "stackz_interpretation": "What I think you're asking for",
  "initial_take": "My honest gut reaction before research",
  "routed_to": "business_strategy:radar",
  "priority": "normal | high | urgent",
  "timestamp": "",
  "status": "intake"
}
```

Stackz will also give you an immediate honest take — before any research:

> *"Alright, podcast-to-blog-post converter. My gut says there's something 
> here — content creators are lazy about repurposing and would pay to 
> automate it. Sending this to Radar for a real evaluation. I'll have 
> something back for you within 24 hours."*

Or:

> *"I'm gonna be real with you — AI children's books sounds like a market 
> that's already flooded with low-quality garbage. But I could be wrong. 
> Let me have Radar actually look at the numbers before I kill it."*

### Step 3: Radar Evaluates

Business Strategy receives the idea and runs it through the evaluation pipeline:

```json
{
  "evaluation_pipeline": {
    "step_1_quick_viability": {
      "handler": "radar",
      "duration": "1-2 hours",
      "actions": [
        "Does this pass basic kill criteria? (see RADAR_PIPELINE.md)",
        "Is there obvious demand signal?",
        "Can we build this with our current stack?",
        "Is anyone already doing this well?"
      ],
      "output": "quick_verdict: promising | questionable | dead"
    },
    "step_2_market_scan": {
      "handler": "analyst",
      "duration": "4-8 hours",
      "condition": "Only if quick_verdict != dead",
      "actions": [
        "Search X, Reddit, HN for people asking for this",
        "Identify top 5 competitors and their pricing",
        "Estimate addressable market size",
        "Check if timing is right"
      ],
      "output": "Market Scan Brief"
    },
    "step_3_stress_test": {
      "handler": "validator",
      "duration": "2-4 hours",
      "condition": "Only if market scan looks promising",
      "actions": [
        "Find 3 reasons this idea fails",
        "Identify the hardest technical challenge",
        "Calculate rough unit economics",
        "Assess moral alignment"
      ],
      "output": "Stress Test Report"
    },
    "step_4_score_and_propose": {
      "handler": "radar",
      "actions": [
        "Score on the Leverage Matrix (see RADAR_PIPELINE.md)",
        "Package into a formal proposal if score >= 6.5",
        "Send back to Stackz with recommendation"
      ],
      "output": "Formal proposal OR rejection with reasoning"
    }
  }
}
```

### Step 4: Stackz Reports Back

Stackz receives Radar's evaluation and presents it to you with full 
transparency — the score, the reasoning, and Stackz's own opinion:

```json
{
  "idea_report": {
    "idea_id": "idea_20260212_003",
    "your_original_idea": "Podcast to blog post converter",
    "radar_verdict": "approved_for_proposal",
    "leverage_score": 7.8,
    "key_findings": {
      "demand_signal": "Strong — 12 Reddit threads in last month asking for this",
      "competition": "3 competitors, all priced $29-49/mo, mixed reviews on quality",
      "our_angle": "Better AI quality + API-first for developer integration",
      "estimated_effort": "MVP in 7 days",
      "revenue_potential": "$2000-5000 MRR at 6 months"
    },
    "stress_test_risks": [
      "Audio transcription quality varies by podcast quality",
      "SEO-optimized blog output is hard to get right",
      "Customer acquisition cost unknown until we test"
    ],
    "stackz_take": "Your instinct was right on this one. The market is there, the competition is beatable, and we can build it fast. I'd greenlight this.",
    "options": ["approve", "reject", "modify", "table", "need_more_research"]
  }
}
```

### Step 5: Your Decision

You say approve, and it flows directly to the Startup Team for execution. 
The full lifecycle kicks in — validate → build → pre-launch → launch → 
growth → compound.

You say reject, and it gets archived with your reasoning. Radar learns 
from it.

You say modify, and it goes back to Radar with your adjustments for 
re-evaluation.

---

## PATH B: SYSTEM-GENERATED IDEAS

This is where Stackz earns its keep while you sleep. Radar runs continuously, 
scanning for opportunities that match your profile.

### The Continuous Scan Cycle

```json
{
  "radar_autonomous_cycle": {
    "daily_scan": {
      "time": "06:00 UTC",
      "sources": [
        "GitHub Trending",
        "ProductHunt new launches",
        "HackerNews front page",
        "X: #buildinpublic, #saas, #indiehacker",
        "Reddit: r/SaaS, r/MicroSaaS, r/EntrepreneurRideAlong",
        "API marketplaces (RapidAPI, Postman)",
        "Your existing project analytics (cross-sell opportunities)"
      ]
    },
    "bi_weekly_deep_scan": {
      "time": "Monday + Thursday 08:00 UTC",
      "additional_sources": [
        "IndieHackers revenue milestones",
        "Gumroad/Lemon Squeezy trending products",
        "Hugging Face trending models (new AI capabilities)",
        "AppSumo new launches (buying intent signal)"
      ]
    }
  }
}
```

### Self-Evaluation Gate

Here's the critical difference: Radar doesn't just dump every signal on 
Stackz. It evaluates its own ideas BEFORE they reach Stackz. Most ideas 
die here, and that's by design.

```json
{
  "self_evaluation_gate": {
    "step_1_auto_filter": {
      "handler": "radar",
      "kills": [
        "Revenue potential < $500/mo",
        "Requires domain expertise we don't have",
        "Market dominated by well-funded incumbent",
        "Moral/ethical flag",
        "Requires > $1000 upfront capital",
        "One-time revenue only, no compounding"
      ],
      "survival_rate": "~10% of raw signals pass this gate"
    },
    "step_2_self_score": {
      "handler": "radar",
      "method": "Leverage Matrix scoring (same as user ideas)",
      "threshold": "Score >= 6.5 to proceed",
      "survival_rate": "~30% of filtered signals pass scoring"
    },
    "step_3_self_stress_test": {
      "handler": "validator",
      "method": "Find 3 ways this fails. If all 3 are solvable, proceed.",
      "survival_rate": "~50% of scored signals survive stress test"
    },
    "step_4_proposal_packaging": {
      "handler": "pitch",
      "method": "Package into formal proposal with full data",
      "output": "Proposal ready for Stackz review"
    },
    "net_survival_rate": "~1.5% of raw signals become proposals",
    "translation": "Out of 200 signals scanned per week, maybe 3 proposals reach Stackz"
  }
}
```

### How Radar Learns Your Taste

Radar doesn't just filter generically. It learns from YOUR decisions:

```json
{
  "preference_learning": {
    "tracks": {
      "approved_patterns": {
        "revenue_models_you_like": [],
        "markets_you_favor": [],
        "build_effort_tolerance": "",
        "risk_appetite": "",
        "topics_that_excite_you": []
      },
      "rejected_patterns": {
        "markets_you_avoid": [],
        "deal_breakers": [],
        "topics_you_find_boring": [],
        "reasons_you_commonly_reject": []
      }
    },
    "scoring_adjustments": {
      "matches_approved_pattern": "+0.5 to leverage score",
      "matches_rejected_pattern": "-1.0 to leverage score",
      "novel_category_never_seen": "No adjustment (present with curiosity)"
    },
    "recalibration": "Every 10 decisions, Radar summarizes its model of your preferences and asks you to confirm or correct"
  }
}
```

### Presentation to Stackz → You

When Radar has proposals ready, they flow up:

```
Radar (self-evaluated proposals)
  → Stackz (reviews, adds own take, batches for weekly report)
    → You (in the weekly report under "The Opportunities" section)
```

Stackz doesn't just forward Radar's proposals raw. Stackz adds:
- Its own opinion (agree, disagree, or "interesting but risky")
- How the proposal fits with current active projects
- Whether resources are available or if something needs to be paused
- A recommended priority ranking across all pending proposals

---

## THE COMBINED FLOW

Here's how both paths work together in a typical week:

```
MONDAY
├── 06:00  Radar runs daily scan. 47 signals found. 43 auto-killed.
├── 08:00  Radar scores remaining 4. Two score below 6.5. Killed.
├── 10:00  Radar stress-tests 2 survivors. 1 fails. 1 packaged as proposal.
├── 14:00  You message Stackz: "What about a Chrome extension that..."
├── 14:01  Stackz structures your idea, sends to Radar.
├── 14:05  Stackz gives you immediate gut take.
│
TUESDAY  
├── 06:00  Radar runs daily scan. 52 signals. 49 killed.
├── 10:00  Radar completes evaluation of your Chrome extension idea.
├── 10:30  Radar sends both proposals (1 self-generated + 1 yours) to Stackz.
├── 11:00  Stackz reviews both, adds commentary.
│
WEDNESDAY-FRIDAY
├── Teams executing on already-approved projects.
├── Radar continues scanning. 1 more proposal generated by Friday.
│
SUNDAY 09:00
├── Stackz weekly report delivered to you.
├── "The Opportunities" section contains:
│   ├── Proposal A (Radar-generated, score 7.2): AI resume optimizer
│   ├── Proposal B (Your idea, score 8.1): Chrome extension for X analytics
│   └── Proposal C (Radar-generated, score 6.8): API monitoring SaaS
├── Stackz recommendation: "Proposal B is the strongest. It's yours and 
│   it scores highest. Proposal A is solid but we're at capacity with 
│   current projects. I'd table C — the market is too crowded."
│
YOUR RESPONSE
├── "Approve B. Table A. Kill C."
├── Stackz routes B to Startup Team. Founder begins Phase 1: Validate.
├── A stays in pipeline for next review cycle.
├── C archived. Radar learns: you don't like crowded markets.
```

---

## IDEA LIFECYCLE STATES

Every idea, regardless of origin, moves through these states:

```
INTAKE ──► EVALUATING ──► PROPOSED ──► DECISION
                                         │
                          ┌──────────────┼──────────────┐
                          │              │              │
                      APPROVED       TABLED         REJECTED
                          │              │              │
                          ▼              │              ▼
                    STARTUP TEAM    Stays in        ARCHIVED
                    (Execution)     pipeline        (Radar learns)
                          │         for next
                          │         review
                          ▼
              VALIDATE → BUILD → PRELAUNCH → LAUNCH → GROWTH → COMPOUND
```

### State Schema

```json
{
  "idea_states": {
    "intake": "Received from user or Radar. Being structured.",
    "evaluating": "Radar running viability assessment.",
    "proposed": "Evaluation complete. Awaiting decision.",
    "approved": "Green-lit. Flowing to Startup Team.",
    "tabled": "Not now, but worth revisiting. Stays in pipeline.",
    "rejected": "Killed. Archived with reasoning. Radar learns.",
    "executing": "Active in Startup Team lifecycle.",
    "pivoting": "Plan being rewritten based on market feedback.",
    "profitable": "Generating positive revenue.",
    "archived": "Project complete, sold, or shut down."
  }
}
```

---

## FEEDBACK LOOPS THAT CLOSE THE CIRCLE

### Loop 1: Rejection → Better Ideas
Every rejected idea teaches Radar what you DON'T want. Over time, the 
proposals that reach you get sharper and more aligned with your taste.

### Loop 2: Execution → Better Plans  
Every startup that launches feeds real data back to the Startup Team's 
`postmortem` agent, which rewrites the business plan. That learning also 
flows back to Radar — "this type of project had 3x higher costs than 
estimated" makes future proposals more accurate.

### Loop 3: Market → Better Timing
Radar's continuous scanning means it notices when markets shift. If a 
competitor in a tabled idea's space suddenly dies or raises prices, Radar 
can resurface that idea with updated context: "Remember Proposal A from 
3 weeks ago? The #2 competitor just shut down. Window is open."

### Loop 4: Your Pattern → Better Radar
Every 10 decisions, Radar presents its model of your preferences:
> *"Based on your last 10 decisions, here's what I think you want: 
> recurring revenue, low build effort, developer tools, API-first. 
> You've rejected anything with high capital requirements or crowded 
> markets. Am I reading you right?"*

You confirm, correct, or add nuance. Radar recalibrates.

---

## GUARDRAILS

### Volume Control
- Radar presents max 5 proposals per week to Stackz
- Stackz presents max 3 to you (ranked by leverage score)
- If you're overwhelmed, say so — Stackz raises the threshold

### Quality Gate
- No proposal reaches you with a leverage score below 6.5
- Every proposal must survive the stress test (3 failure modes identified and addressable)
- Moral check must pass before any proposal is presented

### Kill Discipline
- If a tabled idea hasn't been acted on in 30 days, it auto-archives
- If an executing startup misses kill criteria, Startup Team flags it immediately
- Stackz won't lobby for a dead idea. If the data says kill it, it dies.

### Your Override
- You can inject an idea at ANY time with ANY priority level
- You can override Radar's scoring ("I don't care about the score, build this")
- You can kill anything at any stage for any reason
- Stackz logs your override but never argues. Your call.

---

*"Two streams of ideas flowing into one machine. You bring the vision, 
I bring the hustle. Radar never stops hunting. The Startup Team never 
stops executing. And every decision — yours or mine — makes the whole 
system smarter. That's not a pipeline. That's a flywheel."* — Stackz
