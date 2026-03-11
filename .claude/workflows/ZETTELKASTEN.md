---
name: Agent Zettelkasten — Collective Intelligence System
file: .claude/workflows/ZETTELKASTEN.md
schedule: Passive (triggered by agents, not cron) + Nightly processing pass: 3:00 AM daily
cron: 0 3 * * * (nightly consolidation run only)
session: Passive triggers = inline | Nightly = isolated
agents: All agents and subagents across all 6 teams
---

# Agent Zettelkasten — Collective Intelligence System

## Context

Every agent and subagent in the Stackz swarm must have the ability to read from, write to, store important information in, and review a shared Zettelkasten knowledge system built inside the Obsidian vault. This system is modeled on the principles from Sönke Ahrens' "How to Take Smart Notes" and Niklas Luhmann's original slip-box method.

Every agent thinks with this system. Not just stores notes in it. The Zettelkasten is the collective intelligence of the entire swarm.

---

## PART 1 — UNDERSTANDING THE SYSTEM

Before any agent writes a single note, they must understand what kind of note they are writing. There are exactly 5 note types in this system. Using the wrong type is worse than writing nothing.

### NOTE TYPE 1 — FLEETING NOTES (♻️ temporary)

**What it is:** A raw, unfiltered capture. An idea, observation, task output, or data point captured in the moment before it disappears. Written quickly. Not polished. Not permanent. Must be processed within 24 hours or discarded.

**When agents write fleeting notes:**
- Stackz notices something interesting while scanning a codebase
- Radar spots an opportunity during a web search
- Smoke flags a pattern she's seen three times in code reviews
- Any agent completes a task and has a raw insight about it
- Bolt generates a hype angle that might be useful later
- Chill notices something about system health that's worth watching

**Location:** Agency HQ/Zettelkasten/Fleeting/
**Filename:** YYYY-MM-DD-HH-MM-<agent>-<slug>.md
**Lifespan:** 24 hours maximum. Then promoted or deleted.

**Required frontmatter:**
```yaml
---
type: fleeting
agent: <agent-name>
team: <team-name>
captured_at: <ISO timestamp>
expires_at: <24 hours after captured_at>
status: raw
promote_to: pending
context: <1 sentence — what was happening when this was captured>
---
```

**Body:** Write exactly what you observed or thought. No cleanup. No full sentences required. Length: 1 line to 1 paragraph maximum.

---

### NOTE TYPE 2 — LITERATURE NOTES (📖 source-anchored)

**What it is:** A processed summary of an external source — a web search result, a document, a research finding, a codebase, an API response, or any structured external input. Written in the agent's own words. Never a copy-paste. Always a restatement that forces comprehension. One source = one literature note.

**When agents write literature notes:**
- Analyst summarizes a competitive research finding
- Radar processes a market trend report
- Ghost reads a top-performing tweet thread and distills the pattern
- Nova processes a technical paper or documentation page
- Any agent reads an external source that contains reusable knowledge

**Location:** Agency HQ/Zettelkasten/Literature/
**Filename:** YYYY-MM-DD-<agent>-<source-slug>.md

**Required frontmatter:**
```yaml
---
type: literature
agent: <agent-name>
team: <team-name>
source_title: <title of the source>
source_url: <url if applicable>
source_type: web | document | codebase | api | conversation | book | research
captured_at: <ISO timestamp>
tags: []
related_permanent_notes: []
---
```

**Body structure:**
```markdown
## Source: <title>

**What it says** (in the agent's own words — never copy-paste):
<summary paragraph>

**What's relevant to us:**
<why this matters to the swarm specifically>

**Key concepts extracted:**
- <concept 1>
- <concept 2>
- <concept 3>

**Questions this raises:**
- <question 1>
- <question 2>

**Connections to existing knowledge:**
[[<link to related permanent note if it exists>]]
```

**Rules:**
- Write as if explaining to a teammate who hasn't read the source
- Never quote more than one sentence verbatim
- Always include "What's relevant to us" — pure summarizing with no relevance judgment is not a literature note, it's a transcript

---

### NOTE TYPE 3 — PERMANENT NOTES (🧠 the core of the slip-box)

**What it is:** A single, self-contained, atomic idea. One note = one idea. Written in complete sentences. Clear enough to understand with zero context from any other note. Permanent — never deleted, only refined. This is the heart of the entire system.

Luhmann's rule: write it as if for publication. If you couldn't hand this note to a stranger and have them understand the idea, rewrite it.

**When agents write permanent notes:**
- After processing a fleeting note into a refined insight
- After distilling a literature note into a transferable idea
- When a pattern has repeated enough times to be stated as a principle
- When a decision was made and the reasoning should be preserved
- When a capability, vulnerability, or strategic insight is discovered
- When an agent learns something that changes how it will operate
- When Stackz or Smoke reaches a conclusion from the build/review cycle

**Location:** Agency HQ/Zettelkasten/Permanent/
**Filename:** ZK-YYYYMMDD-<4-digit-sequence>-<agent>-<slug>.md
Example: ZK-20260311-0042-stackz-api-route-error-patterns.md
The sequence number is assigned from the global counter in: Agency HQ/Zettelkasten/_index/sequence-counter.md

**Required frontmatter:**
```yaml
---
type: permanent
id: ZK-YYYYMMDD-<sequence>
agent: <agent-name>
team: <team-name>
created_at: <ISO timestamp>
last_refined_at: <ISO timestamp>
tags: [<2-5 specific tags>]
source_fleeting: <path to originating fleeting note or null>
source_literature: <path to originating literature note or null>
linked_notes: []
linked_projects: []
status: active | superseded | archived
---
```

**Body structure:**
```markdown
## <The idea stated as a declarative sentence — this IS the title>

<2-5 paragraphs developing the idea fully. Complete sentences. Write as if for publication. The idea must be self-contained.>

**Connections:**
This note connects to:
- [[ZK-<id>]] — <one sentence on WHY they connect>
- [[ZK-<id>]] — <one sentence on WHY they connect>

**Open questions this raises:**
- <question that a future note might answer>

**Origin:**
Derived from: [[<fleeting note path>]] or [[<literature note path>]]
Agent reasoning: <1-2 sentences on what triggered this permanent note>
```

**Rules:**
- ONE idea only. If you have two ideas, write two notes.
- Never use the word "this" without a clear antecedent — the note must make sense read in isolation, years from now
- Connections are mandatory — a permanent note with zero links is a dead end, not part of the slip-box
- Tags are contextual, not categorical — ask "when would I want to stumble upon this even if I forgot I wrote it?"

---

### NOTE TYPE 4 — INDEX NOTES / MOC (🗺️ maps of content)

**What it is:** A Map of Content (MOC). Not a note about an idea — a curated entry point into a cluster of related permanent notes. Think of it as the table of contents for a theme that has grown dense enough to need navigation. Created only when a cluster of 5+ permanent notes has formed around a single theme. Never created preemptively.

**When agents write index notes:**
- When a topic cluster reaches 5+ permanent notes
- When the nightly consolidation run detects an emerging cluster
- When Stackz or Smoke notices a pattern that spans multiple ideas

**Location:** Agency HQ/Zettelkasten/Index/
**Filename:** MOC-<theme-slug>.md
Examples: MOC-agent-memory-patterns.md, MOC-revenue-model-insights.md, MOC-code-quality-principles.md, MOC-market-opportunity-signals.md

**Required frontmatter:**
```yaml
---
type: index
theme: <theme name in plain English>
created_by: <agent>
created_at: <ISO timestamp>
last_updated: <ISO timestamp>
note_count: <number of permanent notes linked here>
maturity: emerging (5-10 notes) | developed (11-30) | dense (31+)
---
```

**Body structure:**
```markdown
## <Theme Name>

<2-3 sentence overview of what this cluster of knowledge represents>

### Core Principles
[[ZK-id]] — <one line summary of why it belongs here>
[[ZK-id]] — <one line summary>

### Supporting Evidence
[[ZK-id]] — <one line>

### Open Questions
[[ZK-id]] — <notes that contain unresolved questions on this theme>

### Connected Themes
[[MOC-<other-theme>]] — <how these themes relate>
```

---

### NOTE TYPE 5 — PROJECT NOTES (📌 temporary + scoped)

**What it is:** Notes specific to a single project or venture that don't belong in the permanent slip-box. Scoped to a project lifecycle. Archived when the project ends. Not permanent knowledge — project-specific decisions, specs, timelines, outcomes. Think of these like Ryan Holiday's per-book slip boxes.

**When agents write project notes:**
- When a venture proposal is approved and work begins
- When a build sprint has project-specific decisions
- When a marketing campaign needs scoped content planning
- When a client engagement has specific context

**Location:** Agency HQ/Zettelkasten/Projects/<project-slug>/
**Filename:** YYYY-MM-DD-<agent>-<topic>.md
**Archive when done:** Agency HQ/Zettelkasten/Archive/<project-slug>/

---

## PART 2 — THE VAULT STRUCTURE

Create this exact folder structure inside the Obsidian vault:

```
Agency HQ/Zettelkasten/
├── Fleeting/               ← raw captures, auto-expires in 24h
├── Literature/             ← processed source summaries
├── Permanent/              ← the core slip-box
├── Index/                  ← MOCs, entry points, theme maps
├── Projects/               ← scoped project notes
│   └── <project-slug>/
├── Archive/                ← retired project notes, superseded permanents
│   └── <project-slug>/
└── _index/
    ├── sequence-counter.md ← global ZK ID counter
    ├── master-index.md     ← alphabetical entry points into the slip-box
    ├── agent-contributions.md ← which agents wrote what
    └── weekly-digest.md    ← curated highlights from the week
```

---

## PART 3 — HOW EVERY AGENT READS FROM THE SYSTEM

Reading rules that apply to ALL agents across ALL teams:

**BEFORE STARTING ANY TASK:** Every agent must first consult the Zettelkasten before generating new thinking from scratch. The slip-box is the first stop, not the last.

The reading workflow:
1. Identify the theme of the task (2-3 keywords)
2. Check Index/ for a relevant MOC - use obsidian-vault-mcp search
3. If MOC found: read it and follow links to relevant permanent notes
4. If no MOC: search Permanent/ directly with keyword search
5. Check Literature/ for any relevant source summaries
6. Load up to 5 most relevant permanent notes as context
7. Note which ZK IDs informed the work — link them in outputs

**SEARCH PROTOCOL:** Use obsidian-vault-mcp search with these patterns:
- Exact topic: search "Agency HQ/Zettelkasten/Permanent" + keyword
- Broad theme: search "Agency HQ/Zettelkasten/Index" + theme
- Recent knowledge: filter by last_modified within 30 days
- Agent-specific: filter by agent field in frontmatter
- Cross-link discovery: find notes where linked_notes contains a specific ZK-ID

**WHAT TO DO WITH WHAT YOU READ:**
- If a permanent note directly answers your question: cite it in your output as "Per ZK-<id>: <summary>"
- If a permanent note partially applies: note how it applies and where it diverges
- If nothing relevant exists: that's a signal to write one after completing the task
- If you find conflicting notes on the same topic: flag it for the nightly consolidation run

---

## PART 4 — HOW EVERY AGENT WRITES TO THE SYSTEM

Writing rules that apply to ALL agents across ALL teams:

**TRIGGER: Write to Zettelkasten when:**
- A task produces a reusable insight
- A pattern has been observed more than once
- A decision was made whose reasoning should be preserved
- An external source was read that contains transferable knowledge
- A hypothesis was confirmed or disproven
- An error occurred and a lesson was extracted
- A capability was discovered or a limitation was hit
- A market signal was identified by Radar or Analyst
- A build pattern was established by Stackz or Forge
- A content pattern was proven effective by Ghost or Megaphone
- A financial insight was derived by Cashflow or Forecaster
- A quality principle was identified by Smoke

**DO NOT write to Zettelkasten when:**
- The output is task-specific with no reuse value
- The information will be outdated in 48 hours
- It's already captured in an existing permanent note (update the existing note instead)
- You haven't processed the idea into your own words yet (write a fleeting note first)

**THE WRITING PROCESS (follows Ahrens exactly):**

**STEP 1 — CAPTURE (fleeting note):** While doing the work, capture raw insight immediately. Don't interrupt the task flow. Just drop a fleeting note. Takes 30 seconds.

**STEP 2 — PROCESS (within 24 hours):** Read the fleeting note. Ask: Is this actually a new idea? Can this be stated as a single principle? What existing notes does this connect to?

**STEP 3 — ELABORATE (write the permanent note):** Write the idea in complete sentences, in the agent's own voice. An idea that stands alone and connects to others.

**STEP 4 — LINK (the most important step):** Before filing, read 3-5 existing notes and ask: "Does this new idea change, support, contradict, or extend any of these?" Add bidirectional links.

**STEP 5 — FILE AND INDEX:** Assign the next sequence number, write to Permanent/, check if tags match an existing MOC, create new MOC if needed, update master-index.md.

---

## PART 5 — THE NIGHTLY CONSOLIDATION RUN (3:00 AM)

Every night at 3:00 AM, a dedicated consolidation pass runs. This is the system's self-maintenance.

### STEP 1 — PROCESS EXPIRED FLEETING NOTES

Read all notes in Agency HQ/Zettelkasten/Fleeting/. For each note where expires_at has passed:

Decision tree:
- Does this contain a promotable idea? YES → Promote to permanent note. NO → Delete it.
- Is it already captured in an existing permanent note? YES → Delete it, update existing if needed.
- Is it raw data with no insight? YES → Delete it. Data without interpretation is noise.

Log every promotion and deletion to: Agency HQ/Zettelkasten/_index/nightly-log-<date>.md

### STEP 2 — DETECT EMERGING CLUSTERS

Scan Permanent/ notes created in the last 7 days. Group by shared tags. If any tag appears on 5+ permanent notes with no existing MOC: create a new MOC. If any existing MOC has 5+ new notes added since last week: update the MOC.

### STEP 3 — DETECT CONFLICTS

Scan for permanent notes that make contradictory claims or cover the same idea without linking. Write conflict notes to Agency HQ/Zettelkasten/_index/conflicts-<date>.md

### STEP 4 — KNOWLEDGE SURFACE REPORT

Generate a weekly digest every Sunday nightly run: Agency HQ/Zettelkasten/_index/weekly-digest.md

### STEP 5 — UPDATE MASTER INDEX

Update Agency HQ/Zettelkasten/_index/master-index.md with any new permanent notes from this week's run.

---

## PART 6 — HOW JALEEL INTERACTS WITH THE ZETTELKASTEN

**YOUR FOLDERS:**

- Agency HQ/Zettelkasten/Fleeting/jaleel/ → Drop anything here. No format. Voice memos, half-formed ideas, links, screenshots. The nightly run processes these.

- Agency HQ/Zettelkasten/Permanent/jaleel/ → Your own permanent notes. Use the same format as agents.

- Agency HQ/Zettelkasten/Index/jaleel/ → Your personal MOCs. Agents add relevant notes here.

**HOW TO ADD A FLEETING NOTE FROM OBSIDIAN:** Just create a new note in Agency HQ/Zettelkasten/Fleeting/jaleel/

**HOW TO REQUEST A KNOWLEDGE SYNTHESIS:** Write a note with "SYNTHESIZE: <topic>" - the nightly run will treat this as a synthesis request.

---

## PART 7 — ZETTELKASTEN-AWARE AGENT BEHAVIORS

Every agent must internalize:

> I think through the slip-box, not around it. Before generating any new analysis, I check what the swarm already knows. The Zettelkasten is my long-term memory.

When writing a permanent note, ask Luhmann's question: "Would a stranger understand this idea without any context?" If not, rewrite it.

Link first, file second. A note without connections is information. A note with connections is knowledge.

Never copy-paste. If I can't restate something in my own words, I don't understand it well enough to store it yet.

---

## PART 8 — CONNECTING THE ZETTELKASTEN TO OTHER WORKFLOWS

- **SELF_BUILD → ZETTELKASTEN:** After every build session, Stackz writes fleeting notes. The nightly consolidation processes them into permanent notes.

- **ACTIVITY_TRACKER → ZETTELKASTEN:** The briefing page "Zettelkasten" section shows permanent notes created in last 24 hours, MOCs updated, top linked notes.

- **VAULT_ORGANIZER → ZETTELKASTEN:** Skips Zettelkasten folders but flags orphan permanent notes and overdue fleeting notes.

- **IDEA THREADS → ZETTELKASTEN:** When a conversation reaches a decision, Stackz writes a permanent note capturing the decision and reasoning.

- **WEEKLY REPORT → ZETTELKASTEN:** The Sunday weekly report includes a "Knowledge Built This Week" section.

- **RADAR SCAN → ZETTELKASTEN:** Every Radar scan produces literature notes. Validated opportunities get permanent notes.

---

## PART 9 — BRIEFING PAGE ZETTELKASTEN SECTION

Add a dedicated Zettelkasten section to the Briefing page (frontend/src/pages/Briefing.jsx):

**ZETTELKASTEN PULSE:** Cards showing total permanent notes, notes added this week, most connected note, newest note, emerging cluster.

**KNOWLEDGE FEED (collapsible):** List of permanent notes created in last 48 hours with agent avatar, ZK ID, title, tags, link count, and deep link to Obsidian.

**Weekly Digest button:** Opens Agency HQ/Zettelkasten/_index/weekly-digest.md in Obsidian.

---

## PART 10 — BACKEND API ROUTES FOR ZETTELKASTEN

Create backend/routes/zettelkasten.js with these endpoints:

- GET /api/zettelkasten/stats - Returns total notes, weekly additions, most connected note, newest note, emerging cluster
- GET /api/zettelkasten/recent?limit=10 - Returns recent permanent notes with deep links
- GET /api/zettelkasten/search?q=<query> - Proxies obsidian-vault-mcp search scoped to Zettelkasten/
- GET /api/zettelkasten/note/:id - Returns full note by ZK-ID
- GET /api/zettelkasten/mocs - Returns all MOC index notes
- GET /api/zettelkasten/weekly-digest - Returns current weekly digest

---

## IMPLEMENTATION REQUIRED

1. **Create workflow file:** .claude/workflows/ZETTELKASTEN.md (this file)

2. **Create backend API:** backend/routes/zettelkasten.js with the routes specified above

3. **Create Obsidian vault structure:** The folder structure in Part 2 must exist

4. **Initialize _index files:** sequence-counter.md, master-index.md, agent-contributions.md, weekly-digest.md

5. **Frontend Briefing page:** Add Zettelkasten Pulse section

6. **Register cron job:** The nightly consolidation at 3:00 AM

---

## ERROR HANDLING

- If obsidian-vault-mcp is unreachable during a write: Buffer locally at Agency HQ/Zettelkasten/_pending/ and retry on next run
- If sequence-counter.md is corrupted: Rebuild by scanning all ZK IDs and taking highest sequence number
- If a permanent note has zero links: Flag as orphan in nightly log, re-evaluate next run
- If two agents write near-identical notes: Keep both, link them, flag as merge candidate
- If Jaleel's fleeting folder has 20+ unprocessed notes: Send morning brief alert