---
id: ZK-2026-03-11-002-stackz-time-budget-discipline
type: permanent
title: Fixed time budgets as the discipline that makes autonomous experimentation safe and comparable
tags: [time-budget, scope-discipline, autonomous-agents, experimentation]
created: 2026-03-11
---

# Fixed Time Budgets as Safety Discipline

## Core Insight

In autoresearch, every training run is capped at exactly **5 minutes**. This is not a limit — it's a feature. The 5-minute budget:

1. **Makes experiments comparable** — same wall-clock time means comparable resource usage
2. **Enforces scope discipline** — can't let a task balloon indefinitely
3. **Enables overnight operation** — 5 min × 12/hr × 8hr = ~100 experiments while you sleep
4. **Limits failure blast radius** — worst case, only 5 minutes of work is wasted

## Transferable Principle

> **Every task needs a declared time budget. Check the budget before every subtask. If exceeded, commit partial work and move on.**

Without time budgets:
- A single task can consume an entire night
- Partial work is lost when time runs out
- No predictability in what gets done each cycle

With time budgets:
- Each night produces multiple experiments, not one
- Partial work is always committed
- The system becomes throughput-oriented

## Stackz Implementation

### Budget Format
```markdown
Fix the wallet page runway calculation.
BUDGET: 20min
PRIMARY_FILE: frontend/src/pages/Wallet.jsx
---
```

### TimeBudgetService API
```javascript
const timer = new TimeBudgetService(20, 'wallet-fix');

timer.checkpointOrAbort('subtask-name');
// Throws TIME_BUDGET_EXCEEDED if deadline passed

if (timer.isExpired()) {
  // Commit partial work, queue remainder
  commitPartial();
  updateMatrix(item, 'PARTIAL');
}
```

### Default Budgets
- SELF-OP items: 30 minutes default (user can override)
- SELF_BUILD experiments: 30 minutes per micro-experiment
- SELF_BUILD night: 180 minutes total (3 hours)

## Why This Matters for Stackz

Currently, SELF_BUILD does ONE large task per night. This means:
- If the task is complex, it goes partial and needs resumption
- Only one experiment per night = slow feedback loop
- Hard to measure improvement rate

With time budgets:
- SELF_BUILD runs 3-5 micro-experiments per night
- Each gets 30 minutes, bounded scope
- Multiple experiments = multiple chances to improve = faster learning

## Partial Commit Protocol

When time budget is exceeded mid-task:

1. **Commit with [PARTIAL] prefix**: `[PARTIAL] Wallet runway calc — 80% complete`
2. **Update SELF-OP**: Move item back to TASKING with `RESUMED:` prefix
3. **Log elapsed time**: Track for future budget estimation

This ensures NO work is ever lost and the system always makes forward progress.

## Related Notes

- [[literature-2026-03-11-stackz-autoresearch]] — Source literature note
- [[ZK-2026-03-11-001-stackz-autoresearch-ratchet]] — Ratchet pattern
- [[docs/Self-Build/SELF-OP.md]] — Stackz's program.md with budget field
- [[backend/services/timeBudgetService.js]] — Implementation