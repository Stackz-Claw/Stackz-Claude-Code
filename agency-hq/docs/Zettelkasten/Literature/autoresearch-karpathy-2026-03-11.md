---
id: literature-2026-03-11-stackz-autoresearch
type: literature
source: karpathy/autoresearch
tags: [autoresearch, self-improvement, agent-architecture, ratchet-pattern]
created: 2026-03-11
---

# Autoresearch: Self-Improving Agent Architecture

## Source
- Repository: https://github.com/karpathy/autoresearch
- Author: Andrej Karpathy
- Date studied: 2026-03-11

## Core Principles

### 1. Single-File Scope
The agent only modifies `train.py`. One file. This keeps diffs reviewable, scope manageable, and failures isolated.

### 2. Fixed Time Budget
Every training run is capped at exactly 5 minutes wall clock. This makes experiments directly comparable regardless of what changed. ~12 experiments per hour, 100+ while you sleep.

### 3. program.md Pattern
Human-editable Markdown files provide context and instructions to AI agents. The human programs, the agent executes. Never touch Python files — program via program.md.

### 4. Keep/Discard Loop
After every experiment, check the metric (val_bpb). If improved: keep. If worse: discard. This creates a ratchet — the system can only get better, never worse.

### 5. Metric-First Evaluation
The single metric determines whether an experiment is kept. Everything else is secondary. The agent doesn't evaluate "did this look good" — it evaluates "did the number go down."

### 6. Overnight Cadence
The magic is running many small experiments. Each is small, scoped, and reversible. The cumulative effect of 100 small improvements is dramatic.

## Stackz Mapping

| Autoresearch Principle | Stackz Current State | Stackz Proposed Implementation |
|------------------------|---------------------|-------------------------------|
| Fixed time budget | No time tracking | TimeBudgetService with BUDGET field in SELF-OP |
| program.md | Daily-self-optimization workflow | STRATEGY section in SELF-OP.md |
| Single file scope | Tasks sprawl across files | PRIMARY_FILE hint + scope discipline |
| Keep/discard ratchet | No baseline metrics | SystemScoreService + baseline-metrics.json |
| Metric-first evaluation | Qualitative Smoke review | systemChecks.js before commit |
| Overnight cadence | One large SELF_BUILD | Micro-experiment loop (3-5 sessions/night) |

## Value Assessment

- TimeBudgetService: **HIGH** — enforces scope discipline
- SystemScoreService: **HIGH** — creates improvement ratchet
- systemChecks.js: **HIGH** — automated metric validation
- STRATEGY section: **HIGH** — human-programming interface
- PRIMARY_FILE discipline: **MEDIUM** — scope management
- Micro-experiment loop: **MEDIUM** — increases nightly throughput

## Implementation Notes

- Baseline file: `docs/Self-Build/baseline-metrics.json`
- Experiment log: `docs/Self-Build/experiment-log.md`
- Tasking file: `docs/Self-Build/SELF-OP.md` with STRATEGY + TASKING sections

## Related Notes

- [[ZK-2026-03-11-001-stackz-autoresearch-ratchet]] — Permanent note on ratchet pattern
- [[ZK-2026-03-11-002-stackz-time-budget-discipline]] — Permanent note on time budgets