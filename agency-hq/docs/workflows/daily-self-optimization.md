# 🔄 Daily Self-Optimization Workflow

## Overview

**Agent**: Stackz (Executive — Business)
**Schedule**: 5:00 AM Daily
**Level**: 0 — Propose (User Approval Required)

Stackz runs a self-optimization cycle each morning to review its own performance, identify inefficiencies, and propose improvements for approval.

---

## 🎯 Workflow Goal

**Generate optimization proposals** by analyzing Stackz's current state, skills, and processes, then draft improvement proposals for both Obsidian AND the Approval UI — with bidirectional sync.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Agent** | Stackz |
| **Frequency** | Daily |
| **Run Time** | 5:00 AM |
| **Approval Level** | Level 0 (Propose → User Approves) |
| **Output Location** | Obsidian: `Agency HQ/Approvals/pending/` + Approval UI (Synced) |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DAILY SELF-OPTIMIZATION                             │
│                         (Stackz - 5:00 AM Daily)                           │
│                           ┌───────────────────┐                            │
│                           │  🌅 5:00 AM      │                            │
│                           │  TRIGGER         │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PHASE 1: SNAPSHOT                              │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📸 PULL    │   │  🧠 SEMANTIC │   │  📊 STATE    │           │   │
│   │   │  SEMANTIC   │──▶│  ANALYSIS   │──▶│  SUMMARY     │           │   │
│   │   │  SNAPSHOT   │   │             │   │              │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PHASE 2: REVIEW                                │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  ⚙️ REVIEW   │   │  📈 REVIEW   │   │  🔗 REVIEW   │           │   │
│   │   │  ACTIVE     │   │  PERFORMANCE│   │  WORKFLOW    │           │   │
│   │   │  SKILLS     │   │  METRICS    │   │  EXECUTION   │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PHASE 3: IDENTIFY                              │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  🔍 IDENTIFY │   │  ⚠️ PRIORITIZE│   │  📝 DRAFT    │           │   │
│   │   │  INEFFICIEN- │──▶│  BY IMPACT   │──▶│  PROPOSALS   │           │   │
│   │   │  CIES        │   │  & EFFORT   │   │              │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 4: FORMAT & DUAL POST                       │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📋 FORMAT   │   │  💾 WRITE TO │   │  📬 POST TO  │           │   │
│   │   │  FOR        │──▶│  OBSIDIAN    │──▶│  APPROVAL UI │           │   │
│   │   │  APPROVAL   │   │  VAULT       │   │              │           │   │
│   │   └──────────────┘   └──────┬───────┘   └──────┬───────┘           │   │
│   │                              │                  │                      │   │
│   │                              │     ════════     │                      │   │
│   │                              │     ║ SYNC  ║     │                      │   │
│   │                              │     ════════     │                      │   │
│   │                              │                  │                      │   │
│   │                              ▼                  ▼                      │   │
│   │                    ┌─────────────────┐  ┌─────────────────┐        │   │
│   │                    │ 📁 Obsidian     │  │  🖥️ Approval   │        │   │
│   │                    │ Approvals/      │  │  Inbox UI       │        │   │
│   │                    │ pending/        │  │                 │        │   │
│   │                    └─────────────────┘  └─────────────────┘        │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  🔄 BIDIRECTIONAL SYNC ON APPROVAL                 │   │
│   │                                                                     │   │
│   │         ┌───────────────────┐        ┌───────────────────┐         │   │
│   │         │  📁 OBSIDIAN     │◀══════▶│  🖥️ UI INBOX    │         │   │
│   │         │  APPROVED        │  SYNC  │  APPROVED        │         │   │
│   │         └───────────────────┘        └───────────────────┘         │   │
│   │                                                                     │   │
│   │   When approved in EITHER location, BOTH locations update         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 1: Snapshot 📸

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Pull Semantic Snapshot** | Get current state: active context, recent conversations, loaded memories |
| 1.2 | **Analyze Context** | Parse what was worked on, decisions made, outcomes achieved |
| 1.3 | **Extract State Summary** | Create structured summary of current operational state |

### Phase 2: Review 🔍

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Review Active Skills** | List all currently active skills and their usage frequency |
| 2.2 | **Review Performance Metrics** | Check: tasks completed, response times, error rates, user satisfaction |
| 2.3 | **Review Workflow Execution** | Analyze: which workflows ran, success rates, bottlenecks |

### Phase 3: Identify 🎯

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Identify Inefficiencies** | Find: slow processes, underutilized skills, redundant steps, gaps |
| 3.2 | **Prioritize by Impact** | Score each issue on: potential improvement (1-5), effort to fix (1-5) |
| 3.3 | **Draft Proposals** | Write 1-3 improvement proposals based on highest-scored issues |

### Phase 4: Format & Dual Post 📋

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Format for Approval** | Template each proposal with: title, description, impact, effort, risk, unique ID |
| 4.2 | **Write to Obsidian** | Save to `Agency HQ/Approvals/pending/` with timestamp filename |
| 4.3 | **Post to Approval UI** | POST to `/api/approvals` with full proposal data |
| 4.4 | **Link Both Entries** | Ensure same `id` is used in both locations for sync |

---

## 🔄 Bidirectional Sync

### How Sync Works

| Event | Action |
|-------|--------|
| **New Proposal Created** | Written to BOTH Obsidian AND UI with same ID |
| **Approved in Obsidian** | Update Obsidian file + PATCH `/api/approvals/:id` status |
| **Approved in UI** | Update UI + update Obsidian file with status change |
| **Rejected in Obsidian** | Update Obsidian file + PATCH `/api/approvals/:id` status |
| **Rejected in UI** | Update UI + update Obsidian file |

### Sync Mechanism

```
┌─────────────────────────────────────────────────────────┐
│                    APPROVAL SYNC FLOW                   │
└─────────────────────────────────────────────────────────┘

   ┌─────────────┐     ┌─────────────┐
   │  OBSIDIAN   │     │  UI INBOX   │
   │  Vault      │     │  (React)    │
   └──────┬──────┘     └──────┬──────┘
          │                   │
          │  Change Detected │
          │◀─────────────────▶│
          │                   │
          │  1. Read ID       │
          │  2. Find match    │
          │  3. Update both   │
          │                   │
          ▼                   ▼
   ┌─────────────────────────────────────────────┐
   │         SQLite Database (Source of Truth)   │
   └─────────────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────────┐
   │         Both locations reflect same state   │
   └─────────────────────────────────────────────┘
```

### API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/approvals` | Load pending approvals |
| POST | `/api/approvals` | Create new approval |
| PATCH | `/api/approvals/:id` | Update status (approve/reject) |

---

## 📋 Proposal Template

```markdown
---
id: opt_2026-03-11_001
type: self-optimization
agent: stackz
status: pending
created: 2026-03-11T05:00:00Z
---

# Optimization Proposal: [Title]

## Summary
[Brief 1-2 sentence overview of the improvement]

## Current State
[Description of what currently happens]

## Proposed Change
[What will change and how it will work]

## Expected Impact
| Metric | Current | Expected | Improvement |
|--------|---------|----------|-------------|
| [Metric 1] | [Value] | [Value] | [X]% |
| [Metric 2] | [Value] | [Value] | [X]% |

## Effort
- **Time to Implement**: [Estimate]
- **Skills Required**: [List]
- **Risk Level**: [Low/Medium/High]

## Alternatives Considered
[Brief mention of other options if any]

---
**Type**: Self-Optimization Proposal
**Agent**: Stackz
**Date**: [YYYY-MM-DD]
**Status**: Pending Approval
```

---

## 📂 Output Locations

### Obsidian
```
Obsidian Vault/
└── Agency HQ/
    └── Approvals/
        └── pending/
            ├── 2026-03-11-stackz-optimization-1.md
            ├── 2026-03-11-stackz-optimization-2.md
            └── ...
```

### Approval UI (API)
```json
{
  "id": "opt_2026-03-11_001",
  "agent_id": "stackz",
  "agent_name": "Stackz",
  "title": "[Proposal Title]",
  "summary": "[Brief summary]",
  "full_context": "[Full proposal content]",
  "risk_level": "low|medium|high",
  "confidence": 85,
  "status": "pending",
  "created_at": "2026-03-11T05:00:00Z"
}
```

---

## 🔔 Notification

When proposals are ready:

1. **Summary**: "Stackz has completed daily self-optimization review"
2. **Count**: "X optimization proposals ready for your review"
3. **Action**: "Review in Approval Inbox or Obsidian — both are synced"

---

## 📅 Scheduling

### Cron Expression
```
0 5 * * *  # 5:00 AM daily
```

### Claude Code Loop (Alternative)
```
/loop 24h /stackz-self-optimize
```

---

## 🔗 Related Workflows

| Workflow | Description |
|----------|-------------|
| [SELF_BUILD](../.claude/workflows/SELF_BUILD.md) | Daily self-build at 2 AM — Stackz builds, Smoke reviews |
| [Approval Inbox](./approval-inbox.md) | Where proposals are reviewed and approved (synced with Obsidian) |
| [Task Decomposition](./task-decomposition.md) | Approved proposals get broken into tasks |

---

*Created: 2026-03-11*
*Agent: Stackz*
*Schedule: Daily 5:00 AM*
*Status: Ready to Schedule*
*Sync: Enabled (Bidirectional)*