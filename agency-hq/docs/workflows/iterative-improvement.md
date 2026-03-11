# 🔄 Iterative Improvement Workflow

## Overview

**Agent**: Stackz (Executive — Business)
**Trigger**: When approved improvement from Self-Optimization is ready to implement
**Level**: 1 — Execute (No Approval Required)

This workflow implements approved improvements incrementally, testing each change before full deployment. It runs continuously until the improvement is fully deployed or rolled back.

**MCP Servers:**
- brave-search (for researching solutions, best practices, tool comparisons)
- x-mcp-server (for community feedback on changes)

---

## 🎯 Workflow Goal

**Implement approved improvements incrementally** with built-in testing, validation, and rollback capability.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Trigger** | When improvement approved in Self-Optimization |
| **Type** | Iterative (loops until complete or rolled back) |
| **Approver** | Level 1 — Auto-executes after approval |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ITERATIVE IMPROVEMENT                                  │
│                  (Stackz - On Approval Trigger)                           │
│                           ┌───────────────────┐                            │
│                           │  📥 RECEIVE       │                            │
│                           │  APPROVED         │                            │
│                           │  IMPROVEMENT      │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                       │
│                                     ▼                                       │
│                          ╔═════════════════════╗                            │
│                          ║   🔄 ITERATION      ║                            │
│                          ║      START          ║                            │
│                          ╚═════════╤═══════════╝                            │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PHASE 1: SPLIT                                 │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  ✂️ BREAK    │   │  📦 CREATE   │   │  🧪 DEFINE   │           │   │
│   │   │  INTO SMALL  │──▶│  MINIMAL      │──▶│  SUCCESS    │           │   │
│   │   │  CHUNKS     │   │  CHANGE      │   │  CRITERIA   │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     PHASE 2: IMPLEMENT & TEST                       │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  ⚙️ APPLY   │   │  ✅ VALIDATE  │   │  📊 MEASURE  │           │   │
│   │   │  CHANGE     │──▶│  AGAINST      │──▶│  PERFORMANCE│           │   │
│   │   │              │   │  CRITERIA     │   │  DELTA       │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│                          ╔═════════════════════╗                            │
│                          ║   ❓ PASSED?       ║                            │
│                          ║                     ║                            │
│                          ║  YES → ✅ CONTINUE ║                            │
│                          ║  NO  → 🔄 ROLLBACK║                            │
│                          ╚═════════╤═══════════╝                            │
│                                    │                                         │
│                    ┌──────────────┴──────────────┐                        │
│                    ▼                              ▼                        │
│          ┌──────────────────┐          ┌──────────────────┐              │
│          │    ✅ MERGE &    │          │    ↩️ ROLLBACK   │              │
│          │    NEXT CHUNK   │          │    TO PREVIOUS   │              │
│          │                  │          │    STATE         │              │
│          └──────────────────┘          └──────────────────┘              │
│                    │                              │                         │
│                    └──────────────┬───────────────┘                        │
│                                   ▼                                          │
│                          ╔═════════════════════╗                            │
│                          ║   ❓ MORE CHUNKS?  ║                            │
│                          ║                     ║                            │
│                          ║  YES → 🔄 LOOP     ║                            │
│                          ║  NO  → ✅ COMPLETE ║                            │
│                          ╚═════════════════════╝                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 1: Split

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Break Into Chunks** | Split improvement into smallest testable units |
| 1.2 | **Create Minimal Change** | Isolate the first deployable piece |
| 1.3 | **Define Success Criteria** | What metrics must improve? What's the threshold? |

### Phase 2: Implement & Test

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Apply Change** | Implement the minimal change in isolation |
| 2.2 | **Validate** | Run tests against success criteria |
| 2.3 | **Measure** | Compare before/after performance metrics |

### Phase 3: Decision

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Evaluate** | Did metrics improve beyond threshold? |
| 3.2 | **Merge or Rollback** | If passed: merge to main, continue to next chunk. If failed: rollback, alert. |

### Phase 4: Complete

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **All Chunks Done?** | If yes, mark complete. If no, loop to next chunk. |
| 4.2 | **Log Results** | Record: changes made, metrics delta, lessons learned |
| 4.3 | **Update Skills** | If this revealed a new best practice, update relevant skill |

---

## 📋 Execution Checklist

- [ ] Receive approved improvement from Self-Optimization
- [ ] Break improvement into testable chunks
- [ ] Define success criteria for each chunk
- [ ] Implement first chunk
- [ ] Validate against success criteria
- [ ] If passed: merge and continue
- [ ] If failed: rollback and alert
- [ ] Repeat until all chunks complete
- [ ] Log results and update skills if needed

---

## 🎯 Success Criteria

| Metric | Target |
|--------|--------|
| Changes per Iteration | 1 (minimal) |
| Success Rate | > 80% |
| Rollback Time | < 5 min |
| Improvement Validation | Measurable metrics improved |

---

## 🔔 Post-Run Actions

1. **Metrics Report** — Show before/after delta for all measured metrics
2. **Skill Update** — If new pattern discovered, update relevant skill document
3. **Notify Self-Optimization** — Feedback loop: what worked, what didn't

---

## 🔗 Related Workflows

| Workflow | Description |
|----------|-------------|
| [Daily Self-Optimization](./daily-self-optimization.md) | Generates the improvements to implement |
| [Idea Refinement](./idea-refinement.md) | Refines business ideas from Brainstorm |

---

*Created: 2026-03-11*
*Status: Ready to Use*
*Triggered by: Self-Optimization approval*