# 🗃️ Daily Vault Organizer

## Overview

**Agent**: Vault-Organizer (System Agent)
**Schedule**: 2:00 AM Daily
**Session**: isolated
**Trigger Type**: OpenClaw cron — agentTurn
**CRON**: `0 2 * * *`
**Level**: 1 — Execute Safe Changes, Propose Rest

---

## 🎯 Workflow Goal

Intelligently review, restructure, and organize the Obsidian vault through the obsidian-vault-mcp server. Runs while user is asleep (2 AM) with no interruptions. Executes safe automatic changes and generates proposals for items requiring user approval.

---

## ⏰ Schedule

| Setting | Value |
|---------|-------|
| **Agent** | vault-organizer |
| **Frequency** | Daily |
| **Run Time** | 2:00 AM |
| **Session** | isolated |
| **Approval Level** | 1 (Execute Safe + Propose) |
| **Timezone** | America/Los_Angeles |

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DAILY VAULT ORGANIZER                                 │
│                        (2:00 AM Daily)                                     │
│                           ┌───────────────────┐                            │
│                           │  🌙 2:00 AM      │                            │
│                           │  TRIGGER         │                            │
│                           └─────────┬─────────┘                            │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              PHASE 1: VAULT AUDIT (Read-only scan)                 │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  🔌 CONNECT  │   │  📋 INVENTORY │   │  🚩 FLAG     │         │   │
│   │   │  TO VAULT    │──▶│  ALL FILES    │──▶│  PROBLEMS    │         │   │
│   │   │  (MCP)       │   │              │   │              │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                              │                                    │   │
│   │                              ▼                                    │   │
│   │                    ┌─────────────────┐                           │   │
│   │                    │ 📁 WRITE AUDIT │                           │   │
│   │                    │ REPORT         │                           │   │
│   │                    │ audit-YYYY-MM-DD.md                         │   │
│   │                    └─────────────────┘                           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                   PHASE 2: STRUCTURAL ANALYSIS                     │   │
│   │                                                                     │   │
│   │   ━━━━━━━━━━━━━━━┓   ━━━━━━━━━━━━━━━┓   ━━━━━━━━━━━━━━━┓          │   │
│   │   ┃ 📁 FOLDERS  ┃   ┃ 🏢 AGENCY HQ  ┃   ┃ 🚚 MISPLACED ┃          │   │
│   │   ┃ REVIEW      ┃──▶┃ HEALTH CHECK  ┃──▶┃ NOTES        ┃          │   │
│   │   ┃             ┃   ┃               ┃   ┃              │          │   │
│   │   ┗━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━┛   ┗━━━━━━━━━━━━━━┛          │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │           PHASE 3: EXECUTE SAFE CHANGES (Auto, No Approval)        │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  ➕ ADD      │   │  ✏️ RENAME   │   │  📁 MOVE    │         │   │
│   │   │  FRONTMATTER│   │  UNTITLED    │   │  MISPLACED  │         │   │
│   │   │              │   │              │   │              │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐                            │   │
│   │   │  📂 CREATE  │   │  📦 ARCHIVE  │                            │   │
│   │   │  MISSING   │   │  OLD REPORTS │                            │   │
│   │   │  SUBFOLDERS│   │              │                            │   │
│   │   └──────────────┘   └──────────────┘                            │   │
│   │                              │                                    │   │
│   │                              ▼                                    │   │
│   │                    ┌─────────────────┐                           │   │
│   │                    │ 📝 APPEND TO    │                           │   │
│   │                    │ CHANGE LOG      │                           │   │
│   │                    └─────────────────┘                           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │          PHASE 4: PROPOSALS (Requires User Approval)               │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  🔗 DUPLICATES│  │  📄 STUBS   │   │  📂 FOLDER   │         │   │
│   │   │  RESOLUTION │   │  (delete/    │   │  RESTRUCTURE │         │   │
│   │   │             │   │   expand)    │   │              │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐                            │   │
│   │   │  👻 ORPHANS  │   │  ⚠️ RENAME   │                            │   │
│   │   │  (best-fit)  │   │  (breaks     │                            │   │
│   │   │              │   │   backlinks) │                            │   │
│   │   └──────────────┘   └──────────────┘                            │   │
│   │                              │                                    │   │
│   │                              ▼                                    │   │
│   │                    ┌─────────────────┐                           │   │
│   │                    │ 📁 WRITE TO     │                           │   │
│   │                    │ Agency HQ/Approvals/pending/                 │   │
│   │                    └─────────────────┘                           │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                   PHASE 5: SUMMARY REPORT                          │   │
│   │                                                                     │   │
│   │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │   │
│   │   │  📊 STATS   │   │  📈 TRENDS   │   │  💾 SAVE    │         │   │
│   │   │  & HEALTH   │   │  VS YESTERDAY│──▶│  SUMMARY    │         │   │
│   │   │  SCORE      │   │              │   │  REPORT     │         │   │
│   │   └──────────────┘   └──────────────┘   └──────────────┘         │   │
│   │                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                       │
│                                     ▼                                       │
│                           ┌───────────────────┐                            │
│                           │  ✅ WORKFLOW      │                            │
│                           │  COMPLETE         │                            │
│                           └───────────────────┘                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Process

### Phase 1: Vault Audit (Read-only scan, no changes yet)

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | **Connect to Vault** | Use obsidian-vault-mcp to connect to the vault |
| 1.2 | **Build Full Inventory** | For every note, collect: filename, path, size, created date, modified date |
| 1.3 | **Analyze Content** | Calculate approximate word count, check for frontmatter, tags, backlinks |
| 1.4 | **Flag Problem Areas** | Identify notes matching: ORPHAN, STUB, DUPLICATE_CANDIDATE, MISPLACED, NO_FRONTMATTER, STALE, UNTITLED_VARIANT |
| 1.5 | **Write Audit Report** | Save to `Agency HQ/Vault Maintenance/audit-YYYY-MM-DD.md` |

**Flagged Conditions:**

| Flag | Definition |
|------|-------------|
| ORPHAN | Note with zero backlinks AND zero tags |
| STUB | Note under 50 words with no linked context |
| DUPLICATE_CANDIDATE | Title or first paragraph >80% similar to another note |
| MISPLACED | Content doesn't match folder (e.g., finance note in /Health/) |
| NO_FRONTMATTER | Note missing YAML frontmatter entirely |
| STALE | Not modified in 90+ days, no evergreen tag |
| UNTITLED_VARIANT | Named "Untitled", "Untitled 1", "New Note", etc. |

### Phase 2: Structural Analysis

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | **Review Folder Structure** | Map top-level and second-level folders |
| 2.2 | **Identify Merge Candidates** | Folders with only 1-2 notes |
| 2.3 | **Identify Split Candidates** | Folders with 50+ notes, no subfolders |
| 2.4 | **Check Agency HQ Health** | Verify all 7 agent soul files, memory files, shared knowledge |
| 2.5 | **Find Misplaced Notes** | Agency HQ workflow notes floating outside Agency HQ/ folder |

### Phase 3: Execute Safe Changes (Auto, no approval needed)

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | **Add Missing Frontmatter** | Add YAML to notes without it |
| 3.2 | **Rename Untitled Files** | Use first heading or sentence as new name |
| 3.3 | **Move Clearly Misplaced** | High-confidence folder mismatches only |
| 3.4 | **Create Missing Subfolders** | Agency HQ subfolders that should exist |
| 3.5 | **Archive Old Reports** | Move Agency HQ reports >30 days to Archive/ |
| 3.6 | **Log Every Action** | Append to change-log.md before executing |

**SAFE Changes (Auto-execute):**
- Add YAML frontmatter (template below)
- Rename "Untitled" variants
- Move clearly misplaced notes (content/folder mismatch is obvious)
- Create missing Agency HQ subfolders
- Archive reports >30 days old

**NEVER Auto-execute:**
- Delete any file
- Merge note content
- Rewrite or edit note body
- Move when folder assignment is ambiguous
- Rename when backlinks reference current name

**Frontmatter Template:**
```yaml
---
created: <file creation date>
modified: <today>
tags: []
status: inbox
---
```

### Phase 4: Proposals (Requires Approval)

For everything NOT in the safe auto-change list, generate proposals.

| Step | Action | Description |
|------|--------|-------------|
| 4.1 | **Generate Duplicate Proposals** | Show both filenames and % similarity |
| 4.2 | **Generate Stub Proposals** | Show title, word count, suggest expand/delete |
| 4.3 | **Generate Folder Proposals** | Show current → proposed tree diff |
| 4.4 | **Generate Orphan Proposals** | Suggest best-fit folder |
| 4.5 | **Generate Rename Proposals** | List files where renaming breaks backlinks |
| 4.6 | **Write to Approval Inbox** | Save to `Agency HQ/Approvals/pending/vault-<type>-<date>-<seq>.md` |

**Proposal Template:**
```markdown
---
type: vault_organization
action: <merge_notes|split_folder|delete_stub|resolve_duplicate|restructure>
status: pending
created: <timestamp>
agent: vault-organizer
priority: low
---

## Proposal: <plain English title>

**Why:** <1-2 sentences explaining the problem>

**What:** <exactly what will change — paths, names, moves>

**Risk:** <what could go wrong>

**Reversible:** yes/no

**Approve action:** "approve vault-<id>"
**Reject action:** "reject vault-<id>"
```

### Phase 5: Summary Report

| Step | Action | Description |
|------|--------|-------------|
| 5.1 | **Calculate Stats** | Total notes, auto-changes, proposals, health score |
| 5.2 | **Compute Health Score** | % notes with frontmatter + tags + ≥1 backlink, averaged |
| 5.3 | **Compare Trends** | vs. yesterday/last 7 days if prior audit exists |
| 5.4 | **Write Summary** | Save to `Agency HQ/Vault Maintenance/summary-YYYY-MM-DD.md` |

---

## 📂 Output Locations

### Audit Reports
```
Obsidian Vault/
└── Agency HQ/
    └── Vault Maintenance/
        └── audit-YYYY-MM-DD.md
```

### Change Log
```
Obsidian Vault/
└── Agency HQ/
    └── Vault Maintenance/
        └── change-log.md (append mode)
```

### Proposals
```
Obsidian Vault/
└── Agency HQ/
    └── Approvals/
        └── pending/
            ├── vault-merge-2026-03-11-001.md
            ├── vault-stub-2026-03-11-002.md
            └── ...
```

### Summary Reports
```
Obsidian Vault/
└── Agency HQ/
    └── Vault Maintenance/
        └── summary-YYYY-MM-DD.md
```

### Error Log
```
Obsidian Vault/
└── Agency HQ/
    └── Ops/
        └── errors.md
```

---

## 📋 Change Log Format

Append to `Agency HQ/Vault Maintenance/change-log.md`:

```
[<timestamp>] <ACTION> | <file-path> | <description>

[2026-03-11 02:14:33] ADD_FRONTMATTER | /Personal/workout-notes.md | Added missing YAML frontmatter
[2026-03-11 02:14:41] RENAME | /Untitled 3.md → /Book Notes - Atomic Habits.md | Used first heading as filename
[2026-03-11 02:15:02] ARCHIVE | /Agency HQ/Reports/weekly-2026-02-09.md → /Agency HQ/Archive/ | Report >30 days old
```

---

## ⚠️ Error Handling

| Scenario | Action |
|----------|--------|
| **obsidian-vault-mcp unreachable** | Write error to `Agency HQ/Ops/errors.md`, stop workflow |
| **File move fails** | Log failure to change-log.md, skip file, continue |
| **Vault >500 notes** | Process in batches of 100, log batch progress |
| **First run (no prior audit)** | Skip trend comparison, note "baseline established" |

---

## 📅 Scheduling

### OpenClaw Cron Registration
```bash
openclaw cron add \
  --name "Daily Vault Organizer" \
  --cron "0 2 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run the VAULT_ORGANIZER workflow. Connect to obsidian-vault-mcp, execute all 5 phases in sequence, and deliver the summary report when complete." \
  --announce
```

### Cron Expression
```
0 2 * * *  # 2:00 AM daily (America/Los_Angeles)
```

---

## 🔗 Related

| Item | Path |
|------|------|
| Companion Skill | `../skills/vault-organizer/SKILL.md` |
| Obsidian MCP | obsidian-vault-mcp server |
| Approval Workflow | `approval-inbox.md` |

---

*Created: 2026-03-11*
*Agent: vault-organizer*
*Schedule: Daily 2:00 AM*
*Session: isolated*
*Status: Ready to Schedule*