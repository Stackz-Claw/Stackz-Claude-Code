# 💬 Conversational Idea Collaboration

> **⚠️ IMPORTANT**: This workflow is now **INTEGRATED into SELF_BUILD.md** as Phase 0.
> It runs as part of the daily self-build at 2:00 AM — NOT as a separate workflow.
>
> The conversation pass runs FIRST (Phase 0-A through 0-C), then building begins.

---

## Overview

**Purpose**: Transform Agency HQ/Ideas/ from a one-way inbox into a **live conversation thread** between Jaleel, Stackz, and Smoke.

Every note is a dialogue, not a ticket. Agents read and reply every night at 2 AM before planning any build work.

---

## 🎯 Workflow Goal

Enable **bidirectional conversation** on ideas where:
- Jaleel writes ideas/questions anytime
- Stackz & Smoke reply nightly at 2 AM
- Decisions are made in the open thread
- Build outcomes are reported back into the conversation

---

## ⏰ Integration Note

> **This workflow is INTEGRATED into [SELF_BUILD](../.claude/workflows/SELF_BUILD.md)**
> It runs as **Phase 0** — the very first thing at 2:00 AM, before any building.

### Schedule (Within SELF_BUILD)

| Setting | Value |
|---------|-------|
| **Agent** | Stackz + Smoke |
| **Frequency** | Daily (Night) |
| **Run Time** | 2:00 AM |
| **Phase** | Phase 0 (Integrated into SELF_BUILD) |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CONVERSATIONAL IDEA COLLABORATION                           │
│                        (2:00 AM Daily)                                     │
│                           ┌───────────────────┐                             │
│                           │  🌙 2:00 AM      │                             │
│                           │  TRIGGER         │                             │
│                           └─────────┬─────────┘                             │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 0-A: STACKZ READS                           │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📂 READ   │   │  🔍 CHECK   │   │  ✍️ REPLY   │           │   │
│   │   │  ALL IDEAS │──▶│  TIMESTAMPS│──▶│  WHERE      │           │   │
│   │   │  FOLDER    │   │            │   │  NEEDED     │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 0-B: SMOKE READS                           │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📂 REVIEW  │   │  ⚠️ FLAG    │   │  💬 REPLY   │           │   │
│   │   │  STACKZ    │──▶│  CONCERNS   │──▶│  WHERE      │           │   │
│   │   │  REPLIES   │   │            │   │  NEEDED     │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 0-C: UPDATE STATUS                          │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐                            │   │
│   │   │  📝 UPDATE  │   │  🏷️ SET     │                            │   │
│   │   │  FRONTMATTER│──▶│  STATUS      │                            │   │
│   │   │            │   │              │                            │   │
│   │   └──────────────┘   └──────────────┘                            │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 0-D: WRITE SUMMARY                          │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📋 MORNING  │   │  💬 CONV    │   │  📤 ADD TO  │           │   │
│   │   │  BRIEF       │──▶│  UPDATES    │──▶│  BRIEF      │           │   │
│   │   │  SECTION     │   │  SECTION    │   │  (Markdown) │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 0-A: Stackz Reads 📖

| Step | Action | Description |
|------|--------|-------------|
| 0-A1 | **Read All Ideas** | Scan every note in `Agency HQ/Ideas/` |
| 0-A2 | **Check Timestamps** | Compare Jaleel's last message vs Stackz's last reply |
| 0-A3 | **Determine Reply Need** | If Jaleel newer → Stackz must reply |
| 0-A4 | **Reply in Thread** | Respond using conversation format |

### Phase 0-B: Smoke Reads 👁️

| Step | Action | Description |
|------|--------|-------------|
| 0-B1 | **Review Stackz Replies** | Read what Stackz just responded |
| 0-B2 | **Identify Concerns** | Flag risks, scope issues, side effects |
| 0-B3 | **Reply Where Needed** | Only reply when she has meaningful input |

### Phase 0-C: Update Status 📝

| Step | Action | Description |
|------|--------|-------------|
| 0-C1 | **Update Frontmatter** | Set status based on conversation state |
| 0-C2 | **Update last_updated** | Set to current timestamp |

### Phase 0-D: Write Summary 📋

| Step | Action | Description |
|------|--------|-------------|
| 0-D1 | **Create Brief Section** | Add "Conversation Updates" to morning brief |
| 0-D2 | **Summarize Each Thread** | 1-2 sentences per active note |
| 0-D3 | **Add Obsidian Links** | Include clickable links to each note |

---

## 📋 Note Structure — Conversation Format

```markdown
---
title: <idea title>
created: <date created>
status: open | needs_clarification | in_progress | actioned | deferred
participants: jaleel, stackz, smoke
last_updated: <timestamp>
---

## 💬 Thread

---
**Jaleel** — <timestamp>

<Jaleel's original idea, question, or feedback>

---
**Stackz** — <timestamp>

<Stackz's reply: questions, pushback, plan, or update>

---
**Smoke** — <timestamp>

<Smoke's reply: concerns, approval, alternatives>

---
**Jaleel** — <timestamp>

<Jaleel's reply>

---

(thread continues...)
```

---

## 🔔 Reply Rules

### For Both Agents

1. **Always read FULL thread** — Context from 3 messages ago matters
2. **Never repeat** — Don't re-explain what the other already said
3. **Answer direct questions first** — Then add context
4. **Disagree openly** — Let Jaleel see the debate
5. **Summarize decisions** — Stackz closes with "Decision: [what we're building]"
6. **Flag stuck threads** — If 3+ nights unresolved, explain why in brief
7. **Never close threads** — Only Jaleel moves to Done/ or deletes

### Stackz Replies When:
- Idea needs clarification before building
- Has a better technical approach
- Built something — reports back
- Hit a blocker — explains what went wrong
- Disagrees — proposes alternative

### Smoke Replies When:
- Has concerns about complexity/risk/scope
- Reviewed something Stackz built
- Wants to flag a tradeoff
- Agrees/disagrees with Stackz's approach
- Has a question about intended behavior

---

## 📂 Folder Structure

```
Obsidian Vault/
└── Agency HQ/
    └── Ideas/
        ├── open/                    # Active conversations
        │   ├── unified-timeline-feed.md
        │   ├── approval-sync-feature.md
        │   └── ...
        ├── needs_clarification/     # Waiting on Jaleel
        ├── in_progress/             # Being worked on
        ├── actioned/                # Completed
        └── deferred/                # Not now
```

---

## 📅 Scheduling

### Cron Expression
```
0 2 * * *  # 2:00 AM daily
```

### Claude Code Loop
```
/loop 24h /idea-conversation-pass
```

---

## 🔗 Related Workflows

> **Note**: This workflow is now **INTEGRATED into [SELF_BUILD](../../.claude/workflows/SELF_BUILD.md)** as Phase 0.
> It runs as part of the daily self-build at 2:00 AM.

| Workflow | Description |
|----------|-------------|
| [SELF_BUILD](../../.claude/workflows/SELF_BUILD.md) | Full daily workflow — includes conversation pass as Phase 0 (2 AM) |
| [Morning Brainstorm](./morning-brainstorm-idea-generation.md) | Generates new ideas at 8 AM |
| [Task Decomposition](./task-decomposition.md) | Approved ideas get broken into tasks |
| [Daily Self-Optimization](./daily-self-optimization.md) | Stackz self-improves at 5 AM |

---

## 📝 Example Conversation

**Note**: "I want a way to see all agent conversations in one timeline"

```markdown
---
title: Unified Agent Timeline Feed
created: 2026-03-10
status: open
participants: jaleel, stackz, smoke
last_updated: 2026-03-11T02:14:00Z
---

## 💬 Thread

---
**Jaleel** — March 10

Would be cool to have one unified feed where I can see everything
all 7 agents are doing in real time, like a Twitter feed but for
the agent team

---
**Stackz** — March 11 02:14

Got it. The Timeline page already exists in the frontend — it's
in the roadmap but currently empty. I can populate it with real
data from the SQLite activity log.

Quick question: do you want this to show agent-to-agent messages
(lane queue traffic) or just agent actions (tasks completed,
builds run, approvals submitted)?

---
**Smoke** — March 11 02:14

I'd flag that if we're showing lane queue traffic in real time,
we need to think about volume — the queue could have hundreds of
messages a day once all 6 teams are active. Might need filters
or a pagination approach before this goes live.

---
**Jaleel** — March 11 (morning)

Both. Show everything but let me filter by agent. And yeah
add pagination, Smoke's right

---
**Stackz** — March 12 02:08

Decision: Building unified timeline feed on the existing Timeline
page. Pulls from SQLite activity log. Filters by agent. Paginated
(20 per page). Executing tonight.

---
**Stackz** — March 12 02:51

Done. Timeline page is live with real data. Added agent filter
dropdown and pagination. Committed in [SELF_BUILD]
"Unified agent timeline feed" — a3f92c1

Check it at http://localhost:5173/timeline

---
**Smoke** — March 12 02:51

Reviewed and approved. One warning logged: the filter dropdown
doesn't persist on page refresh (state not in URL). Not blocking
but worth a follow-up.

---
**Jaleel** —

<your reply goes here>
```

---

*Created: 2026-03-11*
*Schedule: Daily 2:00 AM*
*Phase: Phase 0 (Read & Reply Before Building)*
*Status: Ready to Schedule*