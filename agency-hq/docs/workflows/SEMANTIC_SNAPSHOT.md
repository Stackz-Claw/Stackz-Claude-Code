# Semantic Snapshot Workflow

## Overview

**Workflow Name**: Semantic Snapshot Update
**File**: `docs/workflows/SEMANTIC_SNAPSHOT.md`
**Schedule**: Nightly 9:00 PM
**Cron**: `0 21 * * *`
**Session**: Main session
**Agent**: Stackz (executor)

---

## Context

The Semantic Snapshot is Stackz's persistent memory — a JSON file that captures the current state of the entire agency. It enables continuity between sessions so Stackz can pick up where he left off without requiring full re-scanning of all data sources.

This workflow updates the snapshot nightly so it's always fresh for:
- Self-optimization analysis
- Weekly report generation
- Any agent that needs to query current state
- Dashboard live-updates

---

## Snapshot Schema

```json
{
  "last_updated": "2026-03-11T21:00:00Z",
  "active_projects": [
    {
      "id": "proj_001",
      "name": "Agency HQ v1.0",
      "status": "in_progress",
      "lead": "stackz",
      "started": "2026-02-15",
      "priority": "high"
    }
  ],
  "pending_approvals": [
    {
      "id": "appr_042",
      "type": "new_agent",
      "submitted_by": "jaleel",
      "submitted": "2026-03-10",
      "priority": "medium"
    }
  ],
  "active_lanes": [
    {
      "id": "lane_marketing",
      "team": "Marketing",
      "queue_depth": 12,
      "last_processed": "2026-03-11T20:45:00Z"
    }
  ],
  "team_health": {
    "smoke": "healthy",
    "stackz": "healthy",
    "nova": "healthy",
    "bolt": "healthy",
    "rex": "healthy",
    "zip": "healthy",
    "chill": "healthy"
  },
  "portfolio_mrr": 4250.00,
  "portfolio_clients": 8,
  "open_asks": [
    {
      "id": "ask_003",
      "to": "jaleel",
      "question": "Should we pursue the enterprise client proposal?",
      "submitted": "2026-03-09",
      "urgency": "medium"
    }
  ],
  "lessons_learned": [
    {
      "id": "lesson_012",
      "date": "2026-03-10",
      "context": "Obsidian sync failed twice",
      "lesson": "Add retry logic with exponential backoff",
      "source": "daily-self-optimization"
    }
  ]
}
```

---

## Data Sources to Query

| Source | What to Extract |
|--------|-----------------|
| SQLite `projects` | All active projects |
| SQLite `approvals` | Pending approvals |
| SQLite `lanes` | Active lane queues |
| SQLite `agents` | Last health check per agent |
| SQLite `financials` | Current MRR, client count |
| SQLite `asks` | Open questions to Jaleel |
| Obsidian `Agency HQ/Ops/lessons/` | Recent lessons learned |
| Previous snapshot | Compare for delta |

---

## Process

### Phase 1: Query All Data Sources (20 min)

```
1.1 Query SQLite: projects WHERE status != 'completed'
1.2 Query SQLite: approvals WHERE status = 'pending'
1.3 Query SQLite: lanes WHERE active = 1
1.4 Query SQLite: agents (latest health status)
1.5 Query SQLite: financials (latest MRR)
1.6 Query SQLite: asks WHERE answered = 0
1.7 Read Obsidian: lessons from last 7 days
1.8 Read previous snapshot for comparison
```

### Phase 2: Merge and Transform (15 min)

```
2.1 Merge all queries into snapshot schema
2.2 Calculate deltas from previous snapshot
2.3 Flag new items, resolved items
2.4 Update timestamps to current UTC
2.5 Validate JSON structure
```

### Phase 3: Persist Snapshot (10 min)

```
3.1 Write to: Agency HQ/State/semantic-snapshot.json
3.2 Backup previous: Agency HQ/State/snapshot-YYYY-MM-DD.json
3.3 Store in SQLite: snapshots table
3.4 Emit socket event: snapshot-updated
```

### Phase 4: Signal Subscribers (5 min)

```
4.1 Notify frontend dashboard to refresh
4.2 If critical changes, notify relevant agents
4.3 Log snapshot update to operations
```

---

## Output Locations

```
Obsidian Vault/
└── Agency HQ/
    └── State/
        ├── semantic-snapshot.json      # Current state
        └── snapshot-2026-03-11.json    # Backup

SQLite/
└── snapshots/
    └── (time-series storage for history)
```

---

## Quality Criteria

- Valid JSON matching schema exactly
- All 7 agents have health status
- MRR matches financials table
- No duplicate IDs in arrays
- Updated within 1 hour of scheduled time
- Socket event emitted successfully

---

## Error Handling

| Scenario | Action |
|----------|--------|
| SQLite unreachable | Skip SQLite sources, use Obsidian only |
| Obsidian unreachable | Skip lessons, use SQLite only |
| Previous snapshot missing | Create fresh, note "initial snapshot" |
| JSON validation fails | Log error, keep previous snapshot, alert |
| Socket emit fails | Retry 3x, then log and continue |
| Partial data failure | Mark affected section as "stale", keep other data |

---

## Partial Failure Protocol

If some data sources fail, the snapshot should still be written with known-good data:

```json
{
  "last_updated": "2026-03-11T21:00:00Z",
  "data_status": {
    "sqlite": "partial_failure",
    "obsidian": "ok",
    "note": "Projects and approvals unavailable"
  },
  // ... known data continues
}
```

---

## Cron Expression

```
0 21 * * *  # Nightly at 9:00 PM local time
```

---

## Integration Points

| Event | Action |
|-------|--------|
| New approval submitted | Update pending_approvals on next snapshot |
| Agent health changes | Immediate update to team_health |
| New lesson learned | Append to lessons_learned |
| Financial transaction | Update portfolio_mrr |

---

## Related Documentation

- [WEEKLY_REPORT.md](./WEEKLY_REPORT.md) — Uses snapshot for weekly compilation
- [DAILY_SELF_OPTIMIZATION.md](./daily-self-optimization.md) — Reads snapshot for analysis

---

*Created: 2026-03-11*
*Schedule: Nightly 9:00 PM*
*Status: Ready to schedule*