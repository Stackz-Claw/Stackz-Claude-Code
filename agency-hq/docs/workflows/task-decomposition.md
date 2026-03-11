# 🔧 Task Decomposition Workflow

## Overview

This workflow takes any **plan or proposal** and breaks it down into **specific, actionable tasks** with clear ownership, dependencies, and timelines.

---

## 🎯 Workflow Goal

**Decompose 1 proposal/plan** into a hierarchy of tasks with owners, dependencies, and estimates.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Trigger** | Manual (when a plan needs execution) |
| **Input** | Approved proposal or launch plan |
| **Output** | Task breakdown with assignments |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TASK DECOMPOSITION                                 │
│                           ┌───────────────────┐                             │
│                           │  📄 RECEIVE      │                             │
│                           │  INPUT PLAN      │                             │
│                           │  (Proposal/      │                             │
│                           │   Launch Plan)   │                             │
│                           └─────────┬─────────┘                             │
│                                     │                                        │
│                                     ▼                                        │
│                           ┌───────────────────┐                              │
│                           │  🎯 IDENTIFY     │                              │
│                           │  OUTCOMES        │                              │
│                           │  (Deliverables)  │                              │
│                           └─────────┬─────────┘                              │
│                                     │                                        │
│                                     ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PHASE 1: BREAK DOWN                            │   │
│   │                                                                     │   │
│   │        ┌─────────┐    ┌─────────┐    ┌─────────┐                 │   │
│   │        │  EPIC   │───▶│ STORY   │───▶│  TASK   │                 │   │
│   │        │         │    │         │    │         │                 │   │
│   │        └─────────┘    └─────────┘    └─────────┘                 │   │
│   │           │               │               │                        │   │
│   │        Large           Medium          Small                       │   │
│   │        chunks          pieces        units                         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PHASE 2: ANALYZE                              │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │   │
│   │   │  ⏱️ ESTIMATE │   │  🔗 DEPEND   │   │  ⚡ PRIORITY │          │   │
│   │   │  EFFORT      │   │  MAPPING     │   │  RANKING     │          │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘          │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PHASE 3: ASSIGN                               │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │   │
│   │   │  👤 OWNER    │   │  📅 SCHEDULE │   │  📍 MILESTONE│          │   │
│   │   │  ASSIGNMENT  │   │  DATES       │   │  CREATION    │          │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘          │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      PHASE 4: VALIDATE                              │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐                             │   │
│   │   │  ✅ COMPLETE │   │  📤 EXPORT   │                             │   │
│   │   │  CHECKLIST   │   │  TO TRACKER  │                             │   │
│   │   └──────────────┘   └──────────────┘                             │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 1: Break Down 🪓

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Identify Epics** | Extract large chunks of work (weeks of effort) |
| 1.2 | **Split to Stories** | Break epics into deliverable-sized pieces (days) |
| 1.3 | **Split to Tasks** | Further divide into individual tasks (hours) |
| 1.4 | **Verify Completeness** | Ensure all aspects of the plan are covered |

### Phase 2: Analyze 📊

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Estimate Effort** | Size each task: XS, S, M, L, XL or hours |
| 2.2 | **Map Dependencies** | Identify what must happen before what |
| 2.3 | **Rank Priority** | Order tasks: Must → Should → Could → Won't |
| 2.4 | **Identify Risks** | Flag blocked or risky tasks |

### Phase 3: Assign 👥

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Assign Owners** | Match tasks to team members based on skills |
| 3.2 | **Schedule Dates** | Set start/due dates on calendar |
| 3.3 | **Create Milestones** | Group related tasks into milestones |
| 3.4 | **Communicate** | Notify team of assignments |

### Phase 4: Validate ✓

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Complete Checklist** | Verify: all tasks sized, all assigned, dates set |
| 4.2 | **Export to Tracker** | Send tasks to project management tool |
| 4.3 | **Set Reminders** | Configure follow-up dates |
| 4.4 | **Document Assumptions** | Note any assumptions made |

---

## 📋 Task Hierarchy

```
📦 EPIC (Large)
├── 📋 STORY 1
│   ├── ✅ Task 1.1 (1-2 days)
│   ├── ✅ Task 1.2 (4-8 hours)
│   └── ✅ Task 1.3 (2-4 hours)
├── 📋 STORY 2
│   ├── ✅ Task 2.1
│   └── ✅ Task 2.2
└── 📋 STORY 3
    └── ...
```

---

## 📋 Task Card Template

```markdown
## [Task Title]

| Field | Value |
|-------|-------|
| **ID** | TASK-XXX |
| **Type** | [Epic / Story / Task] |
| **Priority** | [Must / Should / Could] |
| **Status** | [To Do / In Progress / Done] |
| **Owner** | [Assignee] |
| **Estimate** | [XS / S / M / L / XL] |
| **Due Date** | [Date] |

### Description
[Brief description of what needs to be done]

### Dependencies
- Blocked by: [Task ID]
- Blocks: [Task ID]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

---

## 📋 Output Summary Template

```
# Task Breakdown: [Project Name]

## Summary
| Metric | Count |
|--------|-------|
| Epics | X |
| Stories | X |
| Tasks | X |
| Total Estimate | X hours/days |

## Distribution
| Owner | Tasks | Hours |
|-------|-------|-------|
| [Name] | X | X |

## Timeline
| Milestone | Tasks | Target |
|-----------|-------|--------|
| [Milestone 1] | X | [Date] |
| [Milestone 2] | X | [Date] |

## Critical Path
1. [Task 1] → [Task 2] → [Task 3]

## Risks
| Task | Risk | Mitigation |
|------|------|------------|
| [Task] | [Risk] | [Mitigation] |

---
*Generated: [Date]*
```

---

## 🔗 Related Workflows

| Workflow | Description |
|----------|-------------|
| [Launch Planning](./launch-planning.md) | Creates launch plans from approved proposals |
| [Idea Refinement](./idea-refinement.md) | Creates detailed proposals from ideas |
| [Morning Brainstorm](./morning-brainstorm-idea-generation.md) | Generates initial ideas |

---

*Created: 2026-03-11*
*Status: Ready to Use*
