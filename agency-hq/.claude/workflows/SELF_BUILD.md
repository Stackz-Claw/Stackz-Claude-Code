# 🏗️ Daily Self-Build & Iteration

## Overview

**Workflow Name**: Daily Self-Build & Iteration
**File**: `.claude/workflows/SELF_BUILD.md`
**Schedule**: 2:00 AM daily
**Cron**: `0 2 * * *`
**Session**: Isolated
**Agents**: Stackz (executor/builder) + Smoke (reviewer/quality gate)

---

## Context: How This Works

This workflow treats the project like a living product.

Every night while you sleep:
1. **Phase 0-A**: Stackz reads your idea notes in `Agency HQ/Ideas/` and replies to any new messages
2. **Phase 0-B**: Smoke reads Stackz's replies and adds her concerns/feedback
3. **Phase 0-C**: Both agents update note statuses and write conversation summary
4. **Phase 1-5**: Stackz builds, Smoke reviews, changes get committed
5. **Phase 6**: (Weekly) Meta-review for iterative improvement

The conversation pass runs FIRST to acknowledge your ideas, BUT Stackz does NOT wait for your replies. He autonomously identifies work from:
1. Your ideas in the folder (if actionable)
2. TODO/FIXME comments in code
3. His own judgment on improvements
4. Previous failed/deferred tasks

Stackz is fully autonomous - he builds and self-improves every night regardless of whether you've responded to conversation threads.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Agent** | Stackz + Smoke |
| **Frequency** | Daily (Night) |
| **Run Time** | 2:00 AM |
| **Session** | Isolated |
| **Phase** | Full 7-phase cycle |

---

## 🔄 Integrated Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DAILY SELF-BUILD & ITERATION                            │
│                         (2:00 AM Daily)                                    │
│                           ┌───────────────────┐                             │
│                           │  🌙 2:00 AM      │                             │
│                           │  WAKE UP         │                             │
│                           └─────────┬─────────┘                             │
│                                     │                                       │
│                                     ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 0: CONVERSATION PASS                             │
│                  (Read ideas, reply to threads FIRST)                      │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  0-A: STACKZ READS IDEAS FOLDER                                      │   │
│   │       Read all notes in Agency HQ/Ideas/                            │   │
│   │       For each note: Jaleel newer than Stackz? → Reply             │   │
│   │       Answer questions, ask clarifications, propose approach        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  0-B: SMOKE REVIEWS CONVERSATION                                    │   │
│   │       Read Stackz's replies                                         │   │
│   │       Flag concerns, risks, scope issues                           │   │
│   │       Reply where she has meaningful input                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  0-C: UPDATE STATUS & WRITE SUMMARY                                  │   │
│   │       Update note frontmatter (open/in_progress/deferred)          │   │
│   │       Write conversation updates to morning brief                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 1: LOAD CONTEXT                                  │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  📖 PROJECT │   │  📂 CODEBASE │   │  📜 GIT     │                   │
│   │  OVERVIEW   │   │  STRUCTURE   │   │  COMMITS    │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  📝 TODO    │   │  📜 PREV    │   │  🧠 SEMANTIC │                   │
│   │  COMMENTS   │   │  BUILD LOGS │   │  SNAPSHOT    │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 2: STACKZ PLANS                                   │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  🎯 PRIORITIZE│   │  ✂️ SCOPE    │   │  📝 WORK     │                   │
│   │  YOUR IDEAS  │   │  TASKS       │   │  PLAN        │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 3: STACKZ BUILDS                                  │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  💻 CODE    │   │  🧪 TEST    │   │  📦 STAGE   │                   │
│   │  CHANGES    │   │  MANUAL     │   │  CHANGES    │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 4: SMOKE REVIEWS                                  │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  🔍 CODE    │   │  ⚖️ VERDICT  │   │  📝 REVIEW   │                   │
│   │  REVIEW     │   │  DECISION    │   │  REPORT      │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 5: COMMIT OR HOLD                                 │
│                                                                             │
│         ┌───────────────────┐        ┌───────────────────┐                 │
│         │  ✅ APPROVED    │        │  ⛔ BLOCKED      │                 │
│         │  COMMIT & PUSH   │        │  STASH & ALERT   │                 │
│         └───────────────────┘        └───────────────────┘                 │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 6: MORNING BRIEFING                              │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  📋 CONV    │   │  💼 BUILD   │   │  📬 MORNING   │                   │
│   │  SUMMARY    │   │  SUMMARY    │   │  BRIEF       │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                     │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                     PHASE 7: ITERATIVE IMPROVEMENT (Weekly)                │
│                                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                   │
│   │  📊 META   │   │  🔧 WORKFLOW │   │  📝 META    │                   │
│   │  REVIEW    │   │  UPDATES    │   │  REVIEW DOC │                   │
│   └──────────────┘   └──────────────┘   └──────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Phase-by-Phase Process

### PHASE 0: CONVERSATION PASS (Integrated from Conversational Idea Collaboration)

**This runs FIRST - before any planning or building.**

#### Phase 0-A: Stackz Reads & Replies to Ideas

| Step | Action | Description |
|------|--------|-------------|
| 0-A1 | **Read Ideas Folder** | Connect to obsidian-vault-mcp, read ALL notes in `Agency HQ/Ideas/` |
| 0-A2 | **Check Timestamps** | For each note: is Jaleel's last message newer than Stackz's last reply? |
| 0-A3 | **Reply Where Needed** | Stackz responds: answer questions, ask clarifications (max 2), acknowledge new ideas, propose approach |
| 0-A4 | **Parse Ideas** | Mark each idea as: feature, bug, improvement, behavior, workflow, question |

#### Phase 0-B: Smoke Reviews Conversation

| Step | Action | Description |
|------|--------|-------------|
| 0-B1 | **Read Stackz Replies** | Review what Stackz just responded |
| 0-B2 | **Identify Concerns** | Flag risks, scope issues, side effects, complexity |
| 0-B3 | **Reply Where Needed** | Smoke replies only when she has meaningful input |

#### Phase 0-C: Update Status & Summary

| Step | Action | Description |
|------|--------|-------------|
| 0-C1 | **Update Frontmatter** | Set status: open / needs_clarification / in_progress / actioned / deferred |
| 0-C2 | **Write Conversation Summary** | Add to morning brief: each note's status and summary |

---

### PHASE 1: LOAD CONTEXT (After conversation pass)

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Read Project Overview** | Read PROJECT_OVERVIEW.md |
| 1.2 | **Read Codebase Structure** | Find all source files |
| 1.3 | **Read Package.json** | Frontend + backend dependencies |
| 1.4 | **Read Git Commits** | Last 7 days |
| 1.5 | **Find TODO Comments** | grep for TODO/FIXME/HACK/XXX |
| 1.6 | **Read Previous Build Logs** | Note failures/deferrals |
| 1.7 | **Load Semantic Snapshot** | Read current state |
| 1.8 | **Write BUILD_BRIEF** | Stackz writes session brief |

---

### PHASE 2: STACKZ PLANS

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Prioritize** | Your ideas from Phase 0 first, then TODOs, then judgment |
| 2.2 | **Scope Tasks** | Max 3 tasks, must complete tonight |
| 2.3 | **Write Work Plan** | To Agency HQ/Self-Build/plans/plan-<date>.md |

---

### PHASE 3: STACKZ BUILDS

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Match Code Style** | Read 3-5 existing files first |
| 3.2 | **Implement Tasks** | Build each task (max 3) |
| 3.3 | **Stage Changes** | git add specific files |
| 3.4 | **Write Build Report** | To Agency HQ/Self-Build/logs/build-<date>.md |

---

### PHASE 4: SMOKE REVIEWS

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Run Diff** | git diff --staged |
| 4.2 | **Check Correctness** | Logic, null handling, async |
| 4.3 | **Check Quality** | Style, names, duplication |
| 4.4 | **Check Safety** | SQL injection, validation, auth |
| 4.5 | **Check Integration** | No breakage, migrations |
| 4.6 | **Write Review Report** | To Agency HQ/Self-Build/reviews/review-<date>.md |

---

### PHASE 5: COMMIT OR HOLD

| Step | Action | Description |
|------|--------|-------------|
| 5.1 | **Check Verdicts** | If all approved → commit. If any blocked → stash |
| 5.2 | **Commit & Push** | git commit + git push + update change-log |
| 5.3 | **Stash & Alert** | git stash + write morning alert |

---

### PHASE 6: MORNING BRIEFING

| Step | Action | Description |
|------|--------|-------------|
| 6.1 | **Write Morning Brief** | To Agency HQ/Self-Build/morning-brief-<date>.md |

**Brief includes:**
- Conversation summary (from Phase 0)
- What got built
- Your ideas — what was done with them
- What Smoke flagged
- What needs your eyes
- Tomorrow's plan

---

### PHASE 7: ITERATIVE IMPROVEMENT (Weekly)

> **Inspired by bertcmiller's autoharness** — Agents that benchmark results, select the best, and build upon previous successes.

| Step | Action | Description |
|------|--------|-------------|
| 7.1 | **Review Logs** | Last 7 build logs |
| 7.2 | **Benchmark Results** | Evaluate which approaches worked best (code quality, task completion, Smoke's verdicts) |
| 7.3 | **Select Best Patterns** | Identify what Stackz did well — carry those patterns forward |
| 7.4 | **Analyze Failures** | Understand what got BLOCKED/DEFERRED — don't repeat failing approaches |
| 7.5 | **Build on Success** | Next week, prioritize approaches that worked previously |
| 7.6 | **Flag Stale Ideas** | 7+ days untouched — escalate or defer |
| 7.7 | **Propose Updates** | Workflow changes → Approval Inbox |
| 7.8 | **Write Meta Review** | To Agency HQ/Self-Build/meta/meta-review-week-<N>.md |

#### Autoharness-Inspired Improvement Loop

```
                    ┌──────────────────────────────┐
                    │   WEEKLY META-REVIEW        │
                    │   (Phase 7 - Every 7 days)   │
                    └──────────────┬───────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │   BENCHMARK│         │   SELECT    │         │   ANALYZE   │
    │   Results  │────────▶│   Best      │────────▶│   Failures  │
    │   (What    │         │   Patterns  │         │   (What     │
    │    worked?)│         │   (Keep     │         │    blocked?)│
    └─────────────┘         └──────┬──────┘         └──────┬──────┘
                                   │                       │
                                   ▼                       │
    ┌─────────────┐         ┌─────────────┐                  │
    │   ITERATE  │◀────────│  BUILD ON   │◀─────────────────┘
    │   Next Week│         │   SUCCESS   │
    │   (Better  │         │   (Apply    │
    │    than    │         │   what      │
    │    before) │         │   worked)   │
    └─────────────┘         └─────────────┘
```

**Core Principles**:
- **Don't just retry** — Try DIFFERENT approaches each week
- **Measure success** — Track commit count, Smoke's issues, task completion rate
- **Keep winning patterns** — Stackz learns what works for this codebase
- **Never repeat failure** — If something got blocked, try a different approach

---

### 🔄 Autoharness-Inspired Principles

Based on [bertcmiller's autoharness](https://github.com/bertmiller/autoharness):

| Principle | How It's Applied |
|-----------|------------------|
| **Benchmark Results** | After each build, Stackz records what worked and what didn't |
| **Select Best** | Weekly review identifies winning patterns to replicate |
| **Build on Success** | Future sessions prioritize approaches that succeeded before |
| **Iterate on Failure** | Failed approaches are documented and explicitly NOT repeated |
| **Parallel Potential** | If multiple tasks are independent, Stackz can attempt them in parallel |

This creates a **positive feedback loop** — Stackz gets better every week because he learns from his own performance.

---

## 📂 Output Locations

```
Obsidian Vault/
└── Agency HQ/
    ├── Ideas/
    │   ├── open/                    # Active conversation threads
    │   ├── needs_clarification/     # Waiting on you
    │   ├── in_progress/             # Being worked on
    │   ├── actioned/                # Completed
    │   └── done/                    # Done
    └── Self-Build/
        ├── plans/plan-<YYYY-MM-DD>.md
        ├── logs/build-<YYYY-MM-DD>.md
        ├── reviews/review-<YYYY-MM-DD>.md
        ├── alerts/alert-<YYYY-MM-DD>.md
        ├── meta/meta-review-week-<N>.md
        ├── morning-brief-<YYYY-MM-DD>.md
        └── change-log.md
```

---

## 🔗 Conversation Format (In Ideas Folder)

```markdown
---
title: <idea title>
created: <date>
status: open | needs_clarification | in_progress | actioned | deferred
participants: jaleel, stackz, smoke
last_updated: <timestamp>
---

## 💬 Thread

---
**Jaleel** — <timestamp>

<Your message>

---
**Stackz** — <timestamp>

<Stackz's reply>

---
**Smoke** — <timestamp>

<Smoke's reply>

---
**Jaleel** — <timestamp>

<Your reply>

(thread continues...)
```

---

## 📅 Scheduling

### Cron Expression
```
0 2 * * *  # 2:00 AM daily
```

### Note
Both the conversation pass AND self-build run in ONE unified workflow at 2:00 AM. The conversation pass completes first (Phase 0), then building begins.

---

## ⚠️ Error Handling

| Scenario | Action |
|----------|--------|
| Git operations fail | Write to Agency HQ/Ops/errors.md, stash all, stop |
| Obsidian unreachable | Skip Phase 0, continue with code context |
| Task cannot complete | Mark DEFERRED, document why |
| CRITICAL security issue | Stop commits, write URGENT alert |
| First run | Note "Session 1 — baseline" |

---

## 👤 Soul File Updates

### Stackz (Agency HQ/Agents/stackz/soul.md)
- Reads Agency HQ/Ideas/ nightly and replies to conversation threads (Phase 0)
- Executes SELF_BUILD workflow: reads context → plans → builds → stages for review
- Writes morning briefs with conversation summaries and build results

### Smoke (Agency HQ/Agents/smoke/soul.md)
- Reads idea threads and Stackz's replies, adds concerns/feedback (Phase 0-B)
- Reviews all staged code changes from Stackz's builds
- Acts as quality gate — nothing commits without approval

---

## Related Documentation

- [Ideas Folder README](../Agency%20HQ/Ideas/README.md) — How to write ideas
- [SELF_BUILD Skill](../../skills/self-build.json) — Machine-readable definition

---

*Created: 2026-03-11*
*Schedule: Daily 2:00 AM*
*Integrated: Conversation Pass + Self-Build*
*Status: Ready to Schedule*