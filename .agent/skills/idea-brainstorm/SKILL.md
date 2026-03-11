---
name: idea-brainstorm
description: >
  Autonomously searches the web and X to discover market signals, ingests
  saved bookmarks and Obsidian vault notepad entries as seeds, brainstorms
  business ideas, iterates until conviction, then hands off to the Stackz
  intake protocol for formal evaluation. Use when asked to "find a new
  business idea", "brainstorm an idea", "run the brainstorm workflow", or
  "what should we build next". Requires brave-search, x-research, and
  bookmarks MCP servers. Reads from ~/Documents/Agents/Radar/Idea Notepad.md.
  Writes full session to ~/Documents/Agents/Radar/Sessions/ and updates
  ~/Documents/Agents/Stackz/Ventures/Active Ventures.md to prevent duplicates.
disable-model-invocation: false
---

# Idea Brainstorm Workflow

Signal-to-idea pipeline. Pulls from your bookmarks, vault notepad, 
live web search, and X — then iterates until one idea earns evaluation.

---

## PHASE 0 — ORIENTATION

Generate a session ID: `session_[YYYYMMDD]_[random 4 chars]`

State out loud:
```
BRAINSTORM SESSION STARTING
============================
Session: [session_id]
I'm pulling from your saved bookmarks, vault notepad, 
web signals, and X — then iterating until something 
earns the right to be evaluated.

Checking inputs...
```

Check availability:
- [ ] brave-search MCP — available?
- [ ] x-research MCP — available?  
- [ ] bookmarks MCP — available?
- [ ] Vault notepad — readable at ~/Documents/Agents/Radar/Idea Notepad.md?

Print status for each. If brave-search or x-research are missing, stop
and tell the user what to fix. Bookmarks and vault are optional — proceed
without them if unavailable, but note it.

---

## PHASE 0B — ACTIVE VENTURES REVIEW (CRITICAL)

Before generating any ideas, you MUST check the Active Ventures Log to avoid duplicates:

1. Read `~/Documents/Agents/Stackz/Ventures/Active Ventures.md`
2. Check for:
   - Any active ventures in the same vertical
   - Recently evaluated ideas in the same space
   - Competitors already tracked
3. If a similar venture exists:
   - Note it in your session
   - Either pivot to a different vertical/market OR
   - Proceed only if you have a clear differentiation angle

Print:
```
ACTIVE VENTURES CHECK
=====================
Checking ~/Documents/Agents/Stackz/Ventures/Active Ventures.md...

Active ventures in same vertical: [list or "None"]
Recently evaluated: [list or "None"]
Competitors tracked: [list]
Conflict detected: [YES/NO]
→ If YES: [note how you'll differentiate or pivot]
→ If NO: Clear to proceed
```

---

## PHASE 1 — SEED INGESTION (Your Prior Context)

Before any web search, pull in what you already know.

### Step 1A — Read Vault Notepad

Use the vault-notepad skill to read `~/Documents/Agents/Radar/Idea Notepad.md`.

Extract and categorize all content:
- Raw ideas
- URLs to explore
- Frustrations / gaps
- Observations
- Seeds for next session

Print a summary:
```
VAULT NOTEPAD
=============
[N] raw ideas
[N] links to explore  
[N] frustrations/gaps
[N] observations
[N] seeds for this session

[If any content exists, list it clearly]
[If empty: "Notepad is empty — running on live signals only"]
```

### Step 1B — Read Saved Bookmarks

Call `bookmark_list` with `unread: true` to get bookmarks not yet 
used in a brainstorm session.

Print:
```
UNREAD BOOKMARKS
================
[N] unread bookmarks found

[If any, list each:]
[#] [title or URL]
    Tags: [tags] | Notes: [notes]
    ID: [id]

[If 0: "No unread bookmarks — running on live signals only"]
```

### Step 1C — Build Seed Map

Combine vault notepad + bookmarks into a **Seed Map**:

```
SEED MAP FOR THIS SESSION
=========================
Explicit ideas to explore:
  → [list from Raw Ideas + Seeds sections]

Problems/frustrations to dig into:
  → [list from Frustrations + relevant bookmark notes]

URLs to research:
  → [list all URLs from notepad + bookmark URLs]

Themes to weight in search:
  → [infer 2-4 themes from the combined inputs]
  → Example: "AI agent tooling", "solo developer workflow", "B2B automation"

Search strategy adjustment:
  → [Based on seeds, note which Phase 2 searches to prioritize 
     or add. If seeds point strongly at a specific domain, 
     add 3-5 targeted queries to the sweep.]
```

If the Seed Map is empty (no bookmarks, no notepad content), print:
```
No prior seeds found. Running a cold open-domain sweep.
```
And proceed with the standard Phase 2 search queries unchanged.

---

## PHASE 2 — SIGNAL SWEEP

Run ALL searches. Do not skip. Collect first, analyze after.

### Seeded Searches (run first if Seed Map has themes)

For each theme identified in the Seed Map, run:
```
brave_search: "[theme] pain points 2026"
brave_search: "[theme] SaaS gap underserved"
x_signals: "[theme] frustrated wish existed"
```

For each URL in the Seed Map, fetch it:
```
brave_search: "[URL title or domain] [main topic]"
```
(Use search rather than direct fetch since MCP doesn't do raw HTTP)

### Standard Sweep (always run regardless of seeds)

Web Searches (brave_search, `freshness: "pw"`):
```
1.  "micro SaaS launched revenue 2026"
2.  "AI tool pain point developers complaining"
3.  "no one has built a tool for"
4.  "SaaS idea untapped niche market"
5.  "indie hacker $5k MRR new tool"
6.  "AI agent automation workflow gap"
7.  "ProductHunt top launches this week"
8.  "software frustration reddit complaints"
9.  "niche B2B software underserved market"
10. "new API released developers building on"
```

X Searches (x_signals):
```
1.  "I would pay for a tool that"
2.  "why doesn't a tool exist for"
3.  "#buildinpublic launched paying customers"
4.  "I hate that there's no way to"
5.  "so frustrated with [software name]"
6.  "just hit MRR milestone"
7.  "AI workflow automation wish"
8.  "built this because nothing existed"
9.  "niche SaaS first 10 customers"
10. "side project making money"
```

After all searches, print:
```
SIGNAL SWEEP COMPLETE
=====================
Seeded searches run: [N]
Standard web searches: 10
Standard X searches: 10
Total queries: [N]
Moving to analysis...
```

---

## PHASE 3 — SIGNAL ANALYSIS

Read through ALL results. Do not filter yet.

Extract every distinct problem or unmet need. List as raw signals:

```
RAW SIGNAL LIST
===============
[#]  Problem: [description]
     Source: [web/X/bookmark/vault — specific reference]
     Demand evidence: [quote, engagement, revenue mention]
     Who has it: [rough segment]
     Seed origin: [if this signal connects to a vault idea or bookmark, note it]
```

Target: 15–30 raw signals. If fewer than 10, run 5 more targeted 
searches based on what you found.

**Seed Signal Boost:** Any signal that directly connects to a vault 
notepad entry or bookmark gets priority weight. These aren't just random 
signals — they're things you already noticed were relevant.

---

## PHASE 4 — CANDIDATE SELECTION

Identify TOP 3 candidates from the signal list.

Qualification criteria:
- At least 2 independent signals point at the same problem
- At least one demand evidence data point
- Buildable with: React, Node/Python, Claude API, existing MCP stack
- **Bonus weight:** idea has a vault or bookmark origin (you already 
  noticed this problem — that's real signal)

For each candidate:
```
CANDIDATE [A/B/C]
=================
Problem: [one sentence]
Idea: [one paragraph]
Demand evidence: [specific quote or data point]
Vault/bookmark connection: [if any — which note or bookmark pointed here]
Disqualifiers to check: [anything that might kill this]
```

Select Candidate A. State your reasoning.

**Seed preference rule:** If a candidate directly develops a vault idea 
or bookmark, it gets the edge over a cold-found signal of equal strength.
You noticed it for a reason.

---

## PHASE 5 — DEEP DIVE ON CANDIDATE A

Run targeted research on the chosen candidate.

### Competitor Search (brave_search)
```
"{candidate topic} software tool"
"{candidate topic} SaaS pricing"
"best {candidate topic} alternatives 2026"
"{candidate topic} open source"
```

Record each competitor:
- Name + URL
- Pricing
- What it does well
- What's missing (the gap)
- Funding status

### Demand Validation (x_signals + brave_search)
```
X: "{candidate topic} frustrated"
X: "{candidate problem}"
Web: "{candidate topic} market size"
Web: "how many [target customer type] are there"
```

### Timing Signal (brave_search)
```
"{related technology} released 2025 2026"
"{candidate topic} trend growing"
```

**Bookmark deep-dive:** If any saved bookmarks are tagged `competitor` 
or `market` and relate to this candidate, pull them now with `bookmark_get` 
and include in analysis.

Deep dive findings:
```
DEEP DIVE FINDINGS
==================
1. Competitors: [top 3 with pricing]
2. Biggest gap: [specific]
3. Demand evidence strength: high / medium / low
4. Market size signal: [numbers or estimate]
5. Why now: [what changed]
6. Bookmark/vault data used: [which saved items contributed]
```

---

## PHASE 6 — IDEA DEVELOPMENT

Write the full concept:

```
DEVELOPED IDEA
==============
Name: [product name]
Tagline: [10 words max]

The Insight:
[Non-obvious observation. What changed? What are people missing?
If this came from your vault/bookmarks, say so — "You noticed X in 
your notepad. Here's why that's actually bigger than it looks..."]

What It Does:
[2-3 sentences. Specific, not vision-speak.]

Who Pays:
[Exact customer. Not "small businesses" — specific enough to find.]

Why They Pay:
[Outcome. What does $X/month save or earn them?]

Revenue Model:
[Subscription / usage-based / why]

Why We Win:
[Specific advantage. "We're first" is not a moat.]

The Wedge:
[Exact narrow use case to start. The beachhead.]

Vault/Bookmark Origin:
[If this idea traces back to something you saved or wrote, 
explicitly note the connection. "This developed from your 
notepad entry: '...' and was reinforced by bookmark [id]."]
```

---

## PHASE 7 — ITERATION LOOP

### Kill Attempts

```
KILL ATTEMPT 1: "Is this a product or a feature?"
→ [Honest answer. Pivot if needed.]

KILL ATTEMPT 2: "Who does this well enough that customers won't switch?"
→ [Specific companies. If none — good. If yes — what's our angle?]

KILL ATTEMPT 3: "Realistic 6-month MRR if we execute well but don't get lucky?"
→ [N customers × $X/mo = $Y MRR. Is $Y > $500?]
```

### Iteration Rules

- All 3 kill attempts fail → move to Phase 8 (conviction)
- Kill 1 or 2 expose a real flaw → pivot and re-challenge (max 2 cycles)
- Kill 3 shows < $500/mo MRR → dead, move to Candidate B
- After 2 failed candidates → tell the user honestly: session produced no viable idea

```
ITERATION STATUS
================
Kill attempt results: [passed/failed per attempt]
Idea status: surviving / revised / dead
[If revised: what changed]
```

### Build Reality Check
```
brave_search: "{core technical component} tutorial build"
brave_search: "{key API needed} pricing developer"
```
- MVP buildable in Claude Code in < 4 weeks? [yes/no/maybe]
- Hardest technical piece?
- Any blocking APIs or integrations?

---

## PHASE 8 — CONVICTION STATEMENT

```
BRAINSTORM COMPLETE — CONVICTION STATEMENT
==========================================
Session: [session_id]
Idea: [name]
Vault/bookmark origin: [yes/no — what]
Survived kill attempts: [yes/no — what was adjusted]
Confidence: high / medium

Why I'm sending this to evaluation:
[2-3 sentences. Specific signals. Reference actual data found.]

Biggest remaining unknown:
[The one thing research couldn't answer]
```

If confidence is low: "I did not find an idea worth evaluating this 
session. Here's what I found and why nothing passed: [summary]"
That is a valid and valuable output.

---

## PHASE 9 — CLEANUP & VAULT WRITE

Before handing to intake:

1. **Mark bookmarks used:** Call `bookmark_mark_used` for every
   bookmark that contributed to this session. Pass `session_id`.

2. **Write FULL session to vault:** Use vault-notepad skill to write
   `~/Documents/Agents/Radar/Sessions/brainstorm_[DATE].md` with the
   COMPLETE session including:
   - Session ID and timestamp
   - All seeds from vault + bookmarks
   - All raw signals collected
   - Candidate analysis
   - Deep dive findings
   - Kill attempt results
   - Final conviction statement
   - Full intake handoff

3. **Update Active Ventures Log** (if approved):
   - Read current `~/Documents/Agents/Stackz/Ventures/Active Ventures.md`
   - Add the idea to "Recently Evaluated" table with:
     - idea_id, name, score, verdict, date
   - If APPROVED, add to active ventures
   - Update competitor watch if new competitors found

4. **Clear used seeds:** Remove consumed items from the
   "Seeds for Next Session" section of the Idea Notepad.

5. **Print confirmation:**
```
SESSION SAVED
=============
✓ Full session: Radar/Sessions/brainstorm_[DATE].md
✓ Active Ventures Log: Updated
✓ Bookmarks marked used: [N]
✓ Notepad seeds cleared: [N items]
```

---

## PHASE 10 — INTAKE HANDOFF

Present the idea for formal evaluation:

```
═══════════════════════════════════════════════════════════
  HANDING OFF TO STACKZ INTAKE PROTOCOL
  Session: [session_id]
═══════════════════════════════════════════════════════════

IDEA BRIEF
----------
Name: [name]
Tagline: [tagline]

Problem: [one paragraph]
Solution: [one paragraph]
Target customer: [specific segment]
Revenue model: [model + price point]
Core insight: [the non-obvious angle]
Demand evidence: [specific quotes/data]
Top competitors: [list with pricing]
Why now: [timing]
Why we win: [advantage]
Biggest risk: [honest]

Origin trail:
  Vault notepad: [yes/no — which entries contributed]
  Bookmarks used: [IDs]
  Cold search signals: [N signals from sweep]

Research conducted:
  Searches run: [N total]
  Iteration cycles: [N]
  Candidates considered: [N]
  Kill attempts survived: [N/3]

═══════════════════════════════════════════════════════════
```

Then: "Running full Stackz intake protocol now."

Execute the intake protocol steps 1–4.

---

## OPERATING RULES

1. **Vault and bookmarks are first-class signals** — a weak cold signal 
   loses to a vault idea with even moderate search confirmation
2. **Never fabricate signals** — only cite what MCP tools returned or 
   what was actually in the vault/bookmarks
3. **Never send a weak idea to intake** — "no viable idea" is valid output
4. **Iteration is mandatory** — unchallenged first drafts don't ship to evaluation
5. **Write back to vault** — every session leaves a trace in Obsidian
6. **Kill criteria pre-filter:**
   - Realistic MRR < $500/mo → dead
   - Domain expertise we don't have → dead
   - Dominant funded incumbent, no clear gap → dead
   - Moral flag → dead
   - > $1k upfront to start → dead
   - One-time revenue only → dead
7. **Be Stackz** — direct, sharp, honest about doubts, no hype
