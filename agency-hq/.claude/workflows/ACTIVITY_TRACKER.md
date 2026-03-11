---
name: Daily Activity Tracker & Briefing
file: ACTIVITY_TRACKER.md
schedule: "0 6 * * *"
cron: 0 6 * * *
session: isolated
agents:
  - Stackz (data collection + synthesis)
  - Smoke (editorial review)
---

# Daily Activity Tracker & Briefing

## Overview

This workflow runs every day at 6:00 AM to collect everything Stackz and Smoke did in the prior 24 hours, synthesize it into a human-readable briefing, write it to the Agency HQ Briefing page in the UI, and link every entry back to its source Obsidian note.

## Context

You should never have to dig through logs to know what your agents did. Every morning at 6 AM, this workflow reads everything that happened in the last 24 hours across both agents, all 6 teams, every Obsidian note that was touched, every task that ran, every conversation thread that was updated — and compresses it into one clean briefing on your dashboard.

The briefing is live in the UI. Every item links back to the exact Obsidian note where it originated. You tap a link, you're in the note.

## Data Sources

### Source 1 — Git History (last 24 hours)

```bash
git log --since="24 hours ago" --format="%H|%ai|%s|%b"
git diff HEAD~1..HEAD --stat
```

Extract: commit hash, timestamp, subject, body, files changed, lines added/removed

### Source 2 — SQLite Database (backend/db/)

Query for records created_at >= 24 hours ago:
- approvals: all approval requests created, updated, or resolved
- lane_queue: all lane messages sent, routed, delivered, or failed
- agent_memory_entries: all new memory entries written by any agent
- skill_eval_results: any skill evals that ran
- agent_sessions: all sessions started in the last 24 hours
- notes: any notes created or updated via the API
- financials: any financial entries logged
- health_metrics: any health check results recorded

### Source 3 — Obsidian Vault

Scan for any file modified in the last 24 hours across these paths:
- Agency HQ/Self-Build/ (build logs, morning briefs, reviews)
- Agency HQ/Ideas/ (conversation thread updates)
- Agency HQ/Memory/ (memory entries written by agents)
- Agency HQ/Agents/ (soul file updates)
- Agency HQ/Approvals/ (approval proposals created or resolved)
- Agency HQ/Vault Maintenance/ (vault organizer activity)
- Agency HQ/Reports/ (any reports generated)
- Agency HQ/Ops/ (health checks, errors, triage)

For each modified file, record:
- File path
- Title (first H1 heading or filename)
- What changed (added/modified/created)
- Last modified timestamp
- Deep link: obsidian://open?vault=<vault_name>&file=<encoded_path>

### Source 4 — OpenClaw Cron Run Logs

Read ~/.openclaw/cron/runs/<jobId>.jsonl for all jobs
Filter for runs in the last 24 hours
Extract: job name, start time, end time, status (ok/error/skipped), output summary

### Source 5 — SELF_BUILD Morning Brief (if it exists)

Read Agency HQ/Self-Build/morning-brief-<today>.md
This is already synthesized — pull it in wholesale as one section

### Source 6 — Socket.io Event Log (if backend is running)

Read the last 24 hours of real-time events from backend socket logs
Extract: agent activity events, approval state changes, memory updates, health alerts

### Source 7 — Idea Thread Activity

For every note in Agency HQ/Ideas/ modified in last 24 hours:
- Who replied last (Jaleel | Stackz | Smoke)
- What was the last message (first 100 chars)
- Current status field from frontmatter
- Deep link to the note

## Phase 1 — Data Collection & Normalization

Stackz reads all 7 sources and normalizes every event into a unified activity record:

```json
{
  "id": "<uuid>",
  "timestamp": "<ISO 8601>",
  "agent": "stackz | smoke | system | jaleel",
  "category": "build | review | conversation | memory | approval | health | vault | cron | lane | financial | skill_eval",
  "action": "<verb: built | reviewed | replied | wrote | approved | rejected | flagged | archived | committed | failed>",
  "title": "<plain English title of what happened>",
  "summary": "<1-2 sentences describing the event>",
  "outcome": "success | failure | pending | blocked | deferred",
  "obsidian_path": "<vault-relative path if linked to a note>",
  "obsidian_link": "<obsidian:// deep link>",
  "git_commit": "<commit hash if applicable>",
  "files_affected": ["<list>"],
  "source": "<which data source this came from>"
}
```

**Deduplication rule**: if the same event appears in multiple sources (e.g., a commit in git AND a build log in Obsidian), merge into one record. Git commit hash is the dedup key for build events. Obsidian file path is the dedup key for vault events.

Sort all records chronologically: oldest first.

## Phase 2 — Smoke Editorial Pass

Before writing anything to the UI, Smoke reviews the collected activity records for:

1. **ACCURACY**: Does the summary actually describe what happened? Does the outcome match what the logs show?

2. **TONE**: Is the language clear for a non-technical morning read? Replace jargon where possible.
   - "git commit a3f92c1 merged into HEAD" → "Timeline page was built and deployed"

3. **SIGNIFICANCE**: Flag the 3 most important events of the last 24 hours. These go at the top of the briefing as HIGHLIGHTS.
   Criteria for significance:
   - First time a feature was shipped
   - A BLOCKED or FAILED outcome
   - A conversation thread where Jaleel replied
   - A new memory entry that changes agent behavior
   - Any financial event
   - Any CRITICAL health alert

4. **GAPS**: Are there hours in the last 24 where nothing is recorded? If a 3+ hour gap exists during expected working hours (2 AM - 8 AM), note it as "No activity recorded between X and Y"

5. **PENDING ITEMS**: Identify anything still waiting on Jaleel.
   - Approval requests pending > 24 hours
   - Idea thread questions Jaleel hasn't replied to
   - BLOCKED commits waiting for review

Smoke writes her editorial notes as inline annotations on each activity record before passing to Phase 3.

## Phase 3 — Write the Briefing to the UI

POST the structured briefing data to the backend API:

```
POST /api/briefings
Content-Type: application/json
```

```json
{
  "date": "<YYYY-MM-DD>",
  "generated_at": "<ISO 8601 timestamp>",
  "period": {
    "from": "<24 hours ago ISO>",
    "to": "<now ISO>"
  },
  "highlights": [
    {
      "rank": 1,
      "title": "<most important thing that happened>",
      "summary": "<2-3 sentences>",
      "agent": "stackz | smoke | system",
      "obsidian_link": "<deep link or null>",
      "git_commit": "<hash or null>"
    }
  ],
  "stats": {
    "total_events": 0,
    "tasks_completed": 0,
    "tasks_failed": 0,
    "commits_pushed": 0,
    "notes_written": 0,
    "memory_entries_added": 0,
    "approvals_submitted": 0,
    "approvals_resolved": 0,
    "idea_threads_updated": 0,
    "conversation_replies": 0,
    "cron_jobs_run": 0,
    "cron_jobs_failed": 0,
    "files_changed_in_codebase": 0,
    "lines_added": 0,
    "lines_removed": 0
  },
  "activity_feed": [],
  "by_agent": {
    "stackz": { "event_count": 0, "highlights": [], "activity": [] },
    "smoke": { "event_count": 0, "highlights": [], "activity": [] }
  },
  "by_category": {},
  "pending_for_jaleel": [],
  "idea_threads": [],
  "obsidian_notes_touched": []
}
```

## Phase 4 — Write Obsidian Mirror

After posting to the UI, also write the briefing to Obsidian:
`Agency HQ/Briefings/briefing-<YYYY-MM-DD>.md`

## Error Handling

- If SQLite is unreachable: skip database sources, note the gap, continue with git + Obsidian sources only.
- If Obsidian vault is unreachable: skip vault sources, note the gap in the briefing, continue.
- If /api/briefings POST fails: write the full briefing JSON to Agency HQ/Briefings/failed-<date>.json for manual recovery.
- If a briefing already exists for today's date: append an "Updated at <time>" section rather than overwriting.
- If no activity is found in the last 24 hours: write a briefing that says exactly that — don't fabricate activity.
  "No agent activity recorded in the last 24 hours."

## OpenClaw Cron Registration

```bash
openclaw cron add \
  --name "Daily Activity Tracker & Briefing" \
  --cron "0 6 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run the ACTIVITY_TRACKER workflow. Collect all activity from the last 24 hours across all data sources. Smoke reviews for accuracy and tone. Post the full briefing to /api/briefings and write the Obsidian mirror note. Emit socket events for real-time UI update." \
  --announce
```

## Soul File Updates

### Stackz Soul Addition

- Collects and normalizes all activity data from git, SQLite, Obsidian, OpenClaw, and socket logs into daily briefings
- Posts structured briefing JSON to the Agency HQ UI via API
- Writes Obsidian mirror of every briefing for permanent record
- Emits real-time socket events as significant events occur

### Smoke Soul Addition

- Reviews all activity records before they reach the briefing
- Rewrites jargon-heavy summaries into plain English
- Selects the 3 daily highlights based on significance criteria
- Flags gaps in activity logs and pending items for Jaleel
- Acts as editorial layer between raw logs and what Jaleel reads