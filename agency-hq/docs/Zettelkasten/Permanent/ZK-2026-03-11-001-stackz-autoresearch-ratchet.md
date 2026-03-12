---
id: ZK-2026-03-11-001-stackz-autoresearch-ratchet
type: permanent
title: Autoresearch's ratchet pattern: metric-gated commit loops as the foundation of self-improving agent systems
tags: [self-improvement, ratchet-pattern, agent-architecture, metric-first]
created: 2026-03-11
---

# Autoresearch's Ratchet Pattern

## Core Insight

The fundamental innovation of Andrej Karpathy's autoresearch is not the specific ML experiments — it's the **ratchet mechanism**. After every experiment, the system asks: "Did the metric improve?" If yes: commit and update baseline. If no: discard and move on.

This simple question — with a binary answer and automatic action — is what makes self-improvement possible. Without a ratchet, an agent can make changes that regress the system. With a ratchet, the system can only move forward.

## Transferable Principle

> **Metric-gated commits**: Every change is evaluated against a measurable baseline. Only improvements are committed. Regressions are discarded automatically before they compound.

This pattern transfers to any codebase improvement system:

1. **Define your metric** — what does "better" look like?
   - Autoresearch: val_bpb (validation bits per byte)
   - Stackz: build_pass_rate, selfop_completion_rate, cycle_time

2. **Measure before and after** — collect current state before starting work

3. **Compare and decide** — if improvement: commit; if not: flag for review

4. **Update baseline** — the new "normal" becomes the comparison point

## Stackz Implementation

- SystemScoreService reads baseline from `baseline-metrics.json`
- After each SELF_BUILD/SELF-OP session, calls `scoreAndDecide()`
- If improved: writes new baseline, logs "KEPT"
- If not improved: logs "FLAGGED", Smoke reviews

The experiment log at `docs/Self-Build/experiment-log.md` serves the same purpose as autoresearch's results.tsv — a historical record of whether the system is getting better.

## Why This Matters

Without a ratchet, Stackz can:
- Add features that increase complexity without improving capability
- Accumulate technical debt from partial implementations
- Lose sight of whether work is actually improving the system

With a ratchet, every session has to justify its existence through metrics. The system becomes genuinely self-optimizing, not just busy.

## Related Notes

- [[literature-2026-03-11-stackz-autoresearch]] — Source literature note
- [[ZK-2026-03-11-002-stackz-time-budget-discipline]] — Fixed time budgets
- [[docs/Self-Build/SELF-OP.md]] — Stackz's program.md equivalent