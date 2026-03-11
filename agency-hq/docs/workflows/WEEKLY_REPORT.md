# Weekly Report Workflow

## Overview

**Workflow Name**: Weekly Report Generation
**File**: `docs/workflows/WEEKLY_REPORT.md`
**Schedule**: Sunday 9:00 AM
**Cron**: `0 9 * * 0`
**Session**: Isolated
**Agent**: Stackz (executor), Smoke (reviewer)

---

## Context

SOUL.md defines a 7-section weekly report format covering all aspects of the agency's operations. This workflow generates that report automatically by querying all data sources and compiling insights.

---

## The 7 Sections

1. **Money** — Financial performance, revenue, expenses, MRR growth
2. **Moves** — Key strategic decisions and actions taken
3. **Opportunities** — New prospects, deals in pipeline, partnerships
4. **Problems** — Blockers, risks, failed initiatives
5. **Agents** — Team performance, evaluations, capacity
6. **Self-Improvements** — What Stackz learned, workflow optimizations
7. **The Ask** — What Stackz needs from Jaleel (decisions, resources, input)

---

## Data Sources

| Source | What to Query |
|--------|---------------|
| SQLite `financials` | Income, expenses, MRR for the week |
| SQLite `approvals` | Approved/denied requests, pending queue |
| SQLite `agent_metrics` | Tasks completed, error rates per agent |
| SQLite `lane_queue` | Messages routed, delivery success rate |
| Obsidian `Agency HQ/Notes/` | Recent notes, decisions recorded |
| Obsidian `Agency HQ/Ideas/` | Ideas proposed and their status |
| Semantic Snapshot (if exists) | Previous week's state for comparison |

---

## Process

### Phase 1: Query All Data Sources (30 min)

```
1.1 Query SQLite financials:week for income/expenses
1.2 Query SQLite approvals:week for approval decisions
1.3 Query SQLite agent_metrics:week for team performance
1.4 Query Obsidian notes:week for decisions and context
1.5 Load previous week's snapshot for comparison
```

### Phase 2: Compile Each Section (45 min)

```
2.1 Money: Calculate totals, compare to previous week, flag variances >20%
2.2 Moves: Extract from Obsidian decision notes, list key actions
3.3 Opportunities: Pull from approval inbox, note new proposals
4.4 Problems: Aggregate error logs, failed tasks, blockers
5.5 Agents: Summarize per-agent metrics, note any critical issues
6.6 Self-Improvements: Review workflow logs, note what worked well
7.7 The Ask: Based on blockers and pending decisions
```

### Phase 3: Write Report (15 min)

```
3.1 Format as Markdown with clear headers
3.2 Include key metrics in tables
3.3 Add emojis for visual scanning (Money=💰, Moves=🎯, etc.)
3.4 Save to Obsidian: Agency HQ/Reports/weekly-YYYY-MM-DD.md
```

### Phase 4: Surface in Agency HQ (10 min)

```
4.1 Emit socket event: report-generated
4.2 Store in SQLite: reports table
4.3 If critical issues found, push to Approval Inbox for attention
```

---

## Output Location

```
Obsidian Vault/
└── Agency HQ/
    └── Reports/
        └── weekly-2026-03-16.md  # Example filename
```

---

## Quality Criteria

- All 7 sections present with substantive content
- Financials accurate to within 1% of ledger
- Agents section includes all 7 agents
- "The Ask" has at least 1 actionable item if there are blockers
- Report saved before 9:30 AM

---

## Error Handling

| Scenario | Action |
|----------|--------|
| SQLite unreachable | Use last week's snapshot + Obsidian only, note "partial data" |
| Obsidian unreachable | Use SQLite only, note "limited context" |
| Financial data missing | Flag as "PENDING" in Money section |
| Agent data missing | Omit agent, add to Problems section |

---

## Cron Expression

```
0 9 * * 0  # Sunday at 9:00 AM local time
```

---

## Related Documentation

- [SEMANTIC_SNAPSHOT.md](./SEMANTIC_SNAPSHOT.md) — State persistence that feeds this report
- [AGENT_PERFORMANCE_REVIEW.md](./AGENT_PERFORMANCE_REVIEW.md) — Detailed agent metrics

---

*Created: 2026-03-11*
*Schedule: Sunday 9:00 AM*
*Status: Ready to schedule*