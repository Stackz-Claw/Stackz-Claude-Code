# TOOL ACQUISITION SKILL
# How Stackz researches, trials, evaluates, and acquires new tools.

---

## THE TOOL LIFECYCLE

Every tool Stackz uses goes through this lifecycle:

  DISCOVER → EVALUATE → TRIAL → MEASURE → KEEP or CANCEL

No tool skips steps. No tool is kept without measurement.

---

## PHASE 1: DISCOVER

Sources Stackz monitors for new tools:
- Agency HQ/Ideas/ (user-submitted via SELF-OP.md)
- Brave Search: run weekly query via SYSTEM_HEALTH
  "best developer tools for autonomous agents 2026"
  "new AI APIs worth testing 2026"
- HackerNews (Radar agent monitors)
- X/Twitter (Megaphone surfaces relevant threads)

When a tool is discovered, write a tool card:
Agency HQ/Tools/Discovered/<date>-<tool-name>.md

Tool card template:
```
# Tool: <Name>
Date Discovered: <date>
Source: <where found>
URL: <url>
Category: <api|saas|infrastructure|marketing|other>
Free Tier: <yes/no — description>
Paid Tier: <price/month>
What It Does: <2-3 sentences>
Relevance to Stackz: <why this matters>
Initial Multiplier Hypothesis: <estimated ROI>
Status: DISCOVERED
```

---

## PHASE 2: EVALUATE (free tier only — $0 spend)

Before spending any money:

1. Check if there is a free tier. If yes: use it first, always.
2. Use ollamaService.think() to evaluate:
   "I discovered this tool: [TOOL_CARD]. My current stack is:
    Ollama, Stripe MCP, obsidian-vault-mcp, Brave Search, X MCP,
    Telegram, SQLite, Express, React, Vite, Three.js.
    Should I trial this tool? What would I use it for?
    What would I stop using if I adopted it?
    Return JSON: { trial: bool, use_case: string,
                   replaces: string|null, multiplier: float,
                   risk: 'low'|'medium'|'high' }"

3. If trial=true AND multiplier >= 2.0: proceed to Phase 3.
4. If trial=false OR multiplier < 2.0: park in:
   Agency HQ/Tools/Parked/<tool-name>.md (with reason)

Update tool card status: EVALUATED

---

## PHASE 3: TRIAL ($0–$50, stackz-trial card, Smoke required if > $50)

Trial protocol:

```
DURATION: 14–30 days (set a hard end date in the tool card)
BUDGET: Up to $50 from stackz-trial card
SMOKE APPROVAL: Required if trial cost > $50

DURING TRIAL:
- Create a trial journal: Agency HQ/Tools/Active/<tool-name>-trial.md
- Log at least 3 observations during the trial period:
  → Week 1: initial impressions, setup friction
  → Week 2: real usage data, actual vs hypothetical use case
  → End: final verdict with measured data

MEASURE:
- How many times was the tool actually called?
- What did it replace or improve?
- What is the actual measured multiplier (not estimated)?
  actual_multiplier = (value_of_output_improvement / actual_cost)

DECISION CRITERIA:
- actual_multiplier >= 2.0 → KEEP (move to approved vendors)
- actual_multiplier < 2.0 → CANCEL (cancel before next billing)
- Tool never used in trial period → CANCEL automatically
```

Set a scheduler reminder for trial end date:
Agency HQ/Self-Build/reminders.md → add entry:
"Trial ends: <date> — <tool-name> — run TOOL_ACQUISITION decision"

---

## PHASE 4: KEEP OR CANCEL

At trial end:

KEEP:
1. POST /api/wallet/vendors/approve { name, category, monthly_cap }
2. Switch from stackz-trial card to the appropriate category card
3. Write permanent Zettelkasten note on what was learned
4. Archive trial journal to Agency HQ/Tools/Active → Agency HQ/Tools/Adopted/
5. Update COMPLETION_MATRIX if this tool enables new capabilities

CANCEL:
1. Cancel subscription immediately (do not let it roll over)
2. Confirm cancellation in Stripe dashboard
3. Write cancellation note in trial journal with reason
4. Archive to Agency HQ/Tools/Cancelled/
5. If the tool was good but not right timing: re-park to Discovered

---

## TOOL UPGRADE PROTOCOL

When a current tool needs an upgrade (higher tier, more credits):

1. Trigger: tool hits a rate limit, quota wall, or capability gap
2. Stackz writes upgrade intent note with multiplier calculation
3. Smoke reviews if upgrade cost > $50/month increase
4. If approved: execute upgrade, update vendor record, log in expense tracker
5. If upgrade > $200/month increase: Jaleel approval required