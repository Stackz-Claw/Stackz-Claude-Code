# 📋 The Briefing (Daily Activity Tracker & Briefing)

## Overview

**UI Name**: The Briefing
**Workflow Name**: Daily Activity Tracker & Briefing
**Agent**: Stackz (data collection + synthesis) + Smoke (editorial review)
**Schedule**: 6:00 AM daily (runs after SELF_BUILD finishes at ~2-4 AM)
**CRON**: `0 6 * * *`
**Session**: isolated
**Level**: 1 — Execute + Write to UI

---

## 🎯 Workflow Goal

Every morning at 6 AM, collect everything Stackz and Smoke did in the prior 24 hours, synthesize it into a human-readable briefing, write it to the Agency HQ Briefing page in the UI, and link every entry back to its source Obsidian note.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Agent** | Stackz + Smoke |
| **Frequency** | Daily |
| **Run Time** | 6:00 AM |
| **Session** | isolated |
| **Timezone** | America/Los_Angeles |
| **Level** | 1 (Execute + Write to UI) |

---

## 📝 Why This Exists

You should never have to dig through logs to know what your agents did.
Every morning at 6 AM, this workflow reads everything that happened
in the last 24 hours across both agents, all 6 teams, every Obsidian
note that was touched, every task that ran, every conversation thread
that was updated — and compresses it into one clean briefing on your
dashboard.

The briefing is live in the UI. Every item links back to the exact
Obsidian note where it originated. You tap a link, you're in the note.

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE BRIEFING                                          │
│                    (Daily Activity Tracker)                                 │
│                         6:00 AM Daily                                       │
│                           ┌───────────────────┐                            │
│                           │  ☀️ 6:00 AM      │                            │
│                           │  TRIGGER         │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │            PHASE 1: DATA COLLECTION & NORMALIZATION                 │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  📊 GIT      │   │  🗄️ SQLITE  │   │  📁 OBSIDIAN │           │   │
│   │   │  HISTORY     │   │  DATABASE   │   │  VAULT      │           │   │
│   │   │              │   │              │   │              │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  ⏰ CRON    │   │  📝 SELF_BUILD│   │  💬 IDEA    │           │   │
│   │   │  RUN LOGS   │   │  MORNING BRIEF│   │  THREADS    │           │   │
│   │   │              │   │              │   │              │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                              │                                    │   │
│   │                              ▼                                    │   │
│   │                    ┌─────────────────┐                           │   │
│   │                    │ 🔄 NORMALIZE    │                           │   │
│   │                    │ ALL RECORDS     │                           │   │
│   │                    │ (unified JSON)  │                           │   │
│   │                    └─────────────────┘                           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  PHASE 2: SMOKE EDITORIAL PASS                     │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │   │
│   │   │  ✅ ACCURACY│   │  🗣️ TONE    │   │  ⭐ SIGNI-   │           │   │
│   │   │  CHECK      │──▶│  REWRITE    │──▶│  FICANCE    │           │   │
│   │   │              │   │              │   │  SELECTION  │           │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘           │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐                            │   │
│   │   │  ⚠️ GAP     │   │  ⏳ PENDING   │                            │   │
│   │   │  DETECTION  │   │  ITEMS       │                            │   │
│   │   │              │   │              │                            │   │
│   │   └──────────────┘   └──────────────┘                            │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              PHASE 3: WRITE BRIEFING TO UI                         │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  📡 POST TO  │   │  📝 SQLITE   │   │  📡 SOCKET.IO│         │   │
│   │   │  /api/       │──▶│  STORE       │──▶│  EMIT        │         │   │
│   │   │  BRIEFINGS   │   │              │   │  UPDATE      │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │           PHASE 4: FRONTEND BRIEFING PAGE                          │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  🖥️ BUILD   │   │  🔌 SOCKET   │   │  🎨 LIVE    │         │   │
│   │   │  BRIEFING   │   │  LISTENERS   │──▶│  UPDATES     │         │   │
│   │   │  PAGE       │   │              │   │              │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │            PHASE 5: BACKEND API ROUTES                             │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  📥 POST    │   │  📤 GET      │   │  📜 HISTORY │         │   │
│   │   │  /briefings │   │  /briefings  │   │  /briefings │         │   │
│   │   │              │   │  /latest     │   │  /history   │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │            PHASE 6: WRITE OBSIDIAN MIRROR                          │   │
│   │                                                                     │   │
│   │   ┌──────────────┐                                                │   │
│   │   │  📁 Agency  │ ──▶ Agency HQ/Briefings/briefing-YYYY-MM-DD.md  │   │
│   │   │  HQ/        │                                                │   │
│   │   │  Briefings/ │                                                │   │
│   │   └──────────────┘                                                │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│                           ┌───────────────────┐                            │
│                           │  ✅ BRIEFING      │                            │
│                           │  COMPLETE         │                            │
│                           └───────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 1: Data Collection & Normalization

**Data Sources to Collect From:**

| Source | Description | Query/Method |
|--------|-------------|---------------|
| **SOURCE 1** | Git History (last 24h) | `git log --since="24 hours ago" --format="%H\|%ai\|%s\|%b"` + `git diff HEAD~1..HEAD --stat` |
| **SOURCE 2** | SQLite Database | Query: approvals, lane_queue, agent_memory_entries, skill_eval_results, agent_sessions, notes, financials, health_metrics |
| **SOURCE 3** | Obsidian Vault | Scan modified files in Agency HQ/Self-Build/, Ideas/, Memory/, Agents/, Approvals/, Vault Maintenance/, Reports/, Ops/ |
| **SOURCE 4** | OpenClaw Cron Logs | Read `~/.openclaw/cron/runs/<jobId>.jsonl` for last 24h |
| **SOURCE 5** | SELF_BUILD Morning Brief | Read `Agency HQ/Self-Build/morning-brief-<today>.md` wholesale |
| **SOURCE 6** | Socket.io Event Log | Read backend socket logs for last 24h |
| **SOURCE 7** | Idea Thread Activity | For each note in Agency HQ/Ideas/ modified in last 24h: last speaker, message, status |
| **SOURCE 8** | X Daily Activity | Read: Agency HQ/X/daily/<YYYY-MM-DD>.md - posts, impressions, engagements, best tweet |
| **SOURCE 9** | X Post Logs | Read: Agency HQ/X/posts/<last 7 days>-*.md - recent tweet performance |

**Normalization Format:**

```json
{
  "id": "<uuid>",
  "timestamp": "<ISO 8601>",
  "agent": "stackz | smoke | system | jaleel",
  "category": "build | review | conversation | memory | approval | health | vault | cron | lane | financial | skill_eval | x_posting",
  "action": "built | reviewed | replied | wrote | approved | rejected | flagged | archived | committed | failed",
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

**Deduplication Rules:**
- Git commit hash = dedup key for build events
- Obsidian file path = dedup key for vault events

Sort all records chronologically: oldest first.

### Phase 2: Smoke Editorial Pass

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Accuracy Check** | Does the summary describe what actually happened? |
| 2.2 | **Tone Rewrite** | Replace jargon with plain English for non-technical morning read |
| 2.3 | **Significance Selection** | Flag top 3 events as HIGHLIGHTS |
| 2.4 | **Gap Detection** | Note 3+ hour gaps during working hours (2 AM - 8 AM) |
| 2.5 | **Pending Items** | Identify approvals >24h pending, questions for Jaleel |

**Significance Criteria:**
- First time a feature was shipped
- A BLOCKED or FAILED outcome
- A conversation thread where Jaleel replied
- A new memory entry that changes agent behavior
- Any financial event
- Any CRITICAL health alert

### Phase 3: Write Briefing to UI

**API Endpoint:**
```
POST /api/briefings
Content-Type: application/json
```

**Payload Structure:**
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
    "lines_removed": 0,
    "x_posts_published": 0,
    "x_total_impressions": 0,
    "x_total_engagements": 0,
    "x_best_engagement_rate": 0
  },
  "activity_feed": [],
  "by_agent": {
    "stackz": { "event_count": 0, "highlights": [], "activity": [] },
    "smoke": { "event_count": 0, "highlights": [], "activity": [] }
  },
  "by_category": {},
  "pending_for_jaleel": [],
  "idea_threads": [],
  "obsidian_notes_touched": [],
  "x_activity": {
    "posts_published": 0,
    "sessions_run": 0,
    "total_impressions": 0,
    "total_engagements": 0,
    "best_engagement_rate": 0,
    "best_tweet": null,
    "posts": []
  }
}
```

### Phase 4: Frontend Briefing Page

**Component Location:** `frontend/src/pages/Briefing.jsx`

**Layout Sections:**

| Section | Description |
|---------|-------------|
| **HEADER** | Good morning message, date, refresh button |
| **HIGHLIGHTS** | 3 cards max, ranked by significance, color-coded by outcome |
| **STATS ROW** | Metric cards: Tasks Completed/Failed, Commits, Notes, Memory, Approvals, Threads, Cron, **X Posts** |
| **X ACTIVITY** | Megaphone's posts, impressions, engagements, best tweet of the day (link to X) |
| **PENDING FOR YOU** | Yellow banner with items needing Jaleel's attention |
| **IDEA THREADS** | Active conversations with status, last speaker, preview |
| **ACTIVITY FEED** | Full chronological feed with filters (agent, category, outcome, date, search) |
| **OBSIDIAN NOTES** | Collapsible table of notes touched |
| **AGENT TABS** | Stackz / Smoke / Megaphone (X) individual views |

### Phase 5: Backend API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/briefings` | Store new briefing |
| GET | `/api/briefings/latest` | Get most recent briefing |
| GET | `/api/briefings/:date` | Get briefing for specific date |
| GET | `/api/briefings/history` | List all available briefing dates |

**SQLite Schema:**
```sql
CREATE TABLE briefings (
  id INTEGER PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  generated_at TEXT NOT NULL,
  period_from TEXT NOT NULL,
  period_to TEXT NOT NULL,
  payload TEXT NOT NULL,
  highlights_count INTEGER,
  events_count INTEGER,
  pending_count INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 6: Write Obsidian Mirror

**Location:** `Agency HQ/Briefings/briefing-<YYYY-MM-DD>.md`

---

## 📂 Output Locations

### UI API
```
POST /api/briefings → SQLite briefings table → GET /api/briefings/latest
```

### Obsidian Mirror
```
Agency HQ/Briefings/briefing-YYYY-MM-DD.md
```

### Failed Recovery
```
Agency HQ/Briefings/failed-YYYY-MM-DD.json
```

---

## 📡 Real-Time Socket Updates

**Socket Event:** `briefing:event`

**Emitted when:**
- New approval submitted or resolved
- Git commit pushed
- New memory entry written
- Idea thread receives reply
- Cron job completes or fails
- SELF_BUILD completes
- VAULT_ORGANIZER completes
- Agent health status changes

**Frontend Handler:**
- Listen for `briefing:event`
- Prepend new event to Activity Feed
- Pulse animation on stat counters
- Toast notification for high/critical urgency
- Animate thread card if reply needed

---

## 📅 Scheduling

### OpenClaw Cron Registration
```bash
openclaw cron add \
  --name "Daily Activity Tracker & Briefing" \
  --cron "0 6 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run the ACTIVITY_TRACKER workflow. Collect all activity
  from the last 24 hours across all data sources. Smoke reviews for
  accuracy and tone. Post the full briefing to /api/briefings and
  write the Obsidian mirror note. Emit socket events for real-time
  UI update." \
  --announce
```

### Cron Expression
```
0 6 * * *  # 6:00 AM daily (America/Los_Angeles)
```

---

## ⚠️ Error Handling

| Scenario | Action |
|----------|--------|
| SQLite unreachable | Skip database sources, note gap, continue with git + Obsidian |
| obsidian-vault-mcp unreachable | Skip vault sources, note gap, continue |
| POST /api/briefings fails | Write to `Agency HQ/Briefings/failed-<date>.json` |
| Briefing already exists | Append "Updated at <time>" rather than overwriting |
| No activity found | Write "No agent activity recorded in the last 24 hours." |

---

## 👤 Soul File Additions

### Stackz (Agency HQ/Agents/stackz/soul.md)
- Collects and normalizes all activity data from git, SQLite, Obsidian, OpenClaw, and socket logs into daily briefings
- Posts structured briefing JSON to the Agency HQ UI via API
- Writes Obsidian mirror of every briefing for permanent record
- Emits real-time socket events as significant events occur

### Smoke (Agency HQ/Agents/smoke/soul.md)
- Reviews all activity records before they reach the briefing
- Rewrites jargon-heavy summaries into plain English
- Selects the 3 daily highlights based on significance criteria
- Flags gaps in activity logs and pending items for Jaleel
- Acts as editorial layer between raw logs and what Jaleel reads

---

## 🔗 Related

| Item | Path |
|------|------|
| Frontend Page | `frontend/src/pages/Briefing.jsx` |
| Backend Routes | `backend/routes/briefings.js` |
| SQLite Schema | See Phase 5 |
| Obsidian Mirror | `Agency HQ/Briefings/briefing-YYYY-MM-DD.md` |

---

*Created: 2026-03-11*
*UI Name: The Briefing*
*Agent: Stackz + Smoke*
*Schedule: Daily 6:00 AM*
*Session: isolated*
*Status: Ready to Schedule*
*Level: 1 — Execute + Write to UI*