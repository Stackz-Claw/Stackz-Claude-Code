# Stackz Self-Optimization Completion Matrix

Single source of truth for all buildable components.

---

## Executive Agents

| Component | Status | Priority | Owner | Blocking |
|-----------|--------|----------|-------|----------|
| Stackz soul file + review loop | IN PROGRESS | P0 | Stackz | All reviews |
| Stackz soul file final | IN PROGRESS | P0 | Stackz | SELF_BUILD |
| Smoke soul file + review loop | TODO | P0 | Smoke | All reviews |

## Team Agents

| Component | Status | Priority | Owner | Blocking |
|-----------|--------|----------|-------|----------|
| All 6 team agent soul files | TODO | P0 | Warden | Team ops |
| Subagent spawn protocol | TODO | P0 | Stackz | Team scaling |
| Lane queue wiring (all teams) | TODO | P0 | Forge | Agent comms |

## Core Systems

| Component | Status | Priority | Owner | Blocking |
|-----------|--------|----------|-------|----------|
| Approval inbox full loop | TODO | P1 | Smoke | Governance |
| Zettelkasten nightly consolidation | TODO | P1 | Stackz | Knowledge |
| Wallet reconciliation nightly | TODO | P1 | Cashflow | Finance |
| Megaphone X posting loop | TODO | P1 | Megaphone | Revenue |
| Live data frontend (all 6 pages) | PARTIAL | P1 | Stackz | Visibility |

## Advanced Features

| Component | Status | Priority | Owner | Blocking |
|-----------|--------|----------|-------|----------|
| Venture proposal → execution loop | TODO | P2 | Radar | Revenue |
| Skill eval system (all agents) | TODO | P2 | Radar | Quality |
| MCP server health monitoring | TODO | P2 | Warden | Reliability |
| SELF_BUILD test suite | TODO | P2 | Smoke | Confidence |
| Weekly report auto-generation | TODO | P2 | Smoke | Visibility |

## Autoresearch Integration

| Component | Status | Priority | Owner | Notes |
|-----------|--------|----------|-------|-------|
| TimeBudgetService | COMPLETE | P1 | Stackz | SELF-OP discipline |
| SystemScoreService + baseline | COMPLETE | P1 | Smoke | Experiment ratchet |
| systemChecks.js test suite | COMPLETE | P1 | Smoke | Metric-first eval |
| SELF-OP STRATEGY section | TODO | P1 | Stackz | program.md pattern |
| Experiment log | TODO | P2 | Stackz | Visibility |
| SELF_BUILD micro-experiment loop | TODO | P2 | Stackz | Overnight cadence |

## Infrastructure

| Component | Status | Priority | Owner | Blocking |
|-----------|--------|----------|-------|----------|
| Ollama service | COMPLETE | - | Stackz | All workflows |
| Completion matrix API | COMPLETE | P1 | Stackz | Visibility |
| Scheduler cron jobs | COMPLETE | P1 | Stackz | Automation |
| Smoke review service | COMPLETE | P0 | Smoke | Code quality |
| System health service | COMPLETE | P1 | Stackz | Diagnostics |
| Claude Code settings | COMPLETE | P0 | Stackz | Permissions |

## Autoresearch Integration

| Component | Status | Priority | Owner | Description |
|-----------|--------|----------|-------|-------------|
| TimeBudgetService | COMPLETE | P1 | Stackz | Fixed time budget per experiment |
| SystemScoreService + baseline | COMPLETE | P1 | Smoke | Experiment ratchet |
| systemChecks.js test suite | COMPLETE | P1 | Smoke | Metric-first evaluation |
| SELF-OP STRATEGY section | TODO | P1 | Stackz | program.md pattern |
| selfbuild_experiments table | TODO | P2 | Stackz | Experiment log DB |
| Experiment log UI widget | TODO | P2 | Stackz | Visibility |
| SELF_BUILD micro-experiment loop | TODO | P2 | Stackz | Overnight cadence |

---

## Status Legend

- `TODO` - Not started
- `IN PROGRESS` - Currently being worked on
- `PARTIAL` - Partially complete
- `COMPLETE` - Fully implemented and tested
- `BLOCKED` - Waiting on dependency

## Priority Legend

- `P0` - Critical path (must complete)
- `P1` - Important (should complete this week)
- `P2` - Nice to have (next sprint)
- `P3` - Backlog (when time permits)

---

*Last updated: 2026-03-11*
*Auto-maintained by SELF_BUILD workflow*