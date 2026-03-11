# Skill: vault_organizer

**Agent**: vault-organizer (System Agent)
**Type**: Vault Maintenance Skill
**Schedule**: 2:00 AM Daily (via cron)
**Session**: isolated (cron), interactive (manual)
**Level**: 1 — Execute Safe Changes, Propose Rest

---

## Description

Intelligently reviews, restructures, and organizes the Obsidian vault through the obsidian-vault-mcp server. Performs a complete audit, identifies problems, executes safe automatic changes, and generates approval proposals for larger restructures.

Can run manually on-demand or automatically via the daily cron schedule.

---

## Triggers

**Time-based (automatic):**
- 2:00 AM daily (Cron: `0 2 * * *`)
- Via OpenClaw cron registration

**Manual (user-initiated):**
- `/vault-organize` — Full run with safe changes + proposals
- `/run-skill vault_organizer` — Full run with safe changes + proposals
- `/vault-organize --dry-run` — Audit + analysis only, no changes, no proposals
- `/vault-organize --audit-only` — Just Phase 1, output audit report only

---

## Behavior

### Command Flags

| Flag | Behavior |
|------|----------|
| (none) | Full run: Phases 1-5, execute safe changes, generate proposals |
| `--dry-run` | Phases 1-2 only: audit + analysis, no changes, no proposals |
| `--audit-only` | Phase 1 only: build and save audit report, stop |

### Full Run: Phases 1-5

#### Phase 1: Vault Audit (Read-only)

1. **Connect to Vault**
   - Use obsidian-vault-mcp to establish connection

2. **Build Full Inventory**
   - For every note, collect:
     - Filename, path, size
     - Created date, modified date
     - Approximate word count
     - Has frontmatter? (yes/no)
     - Has tags? (yes/no) — list them
     - Has backlinks? (yes/no) — count
     - Folder location (or root)

3. **Flag Problem Areas**
   - ORPHAN: zero backlinks + zero tags
   - STUB: <50 words, no linked context
   - DUPLICATE_CANDIDATE: title/first paragraph >80% similar to another
   - MISPLACED: content doesn't match folder
   - NO_FRONTMATTER: missing YAML frontmatter
   - STALE: unmodified 90+ days, no evergreen tag
   - UNTITLED_VARIANT: "Untitled", "Untitled 1", "New Note", etc.

4. **Write Audit Report**
   - Location: `Agency HQ/Vault Maintenance/audit-YYYY-MM-DD.md`
   - Contents: total note count, problem counts by category, flagged file list

#### Phase 2: Structural Analysis

1. **Review Folder Structure**
   - Map all top-level and second-level folders
   - Flag: folders with 1-2 notes (merge candidates)
   - Flag: folders with 50+ notes, no subfolders (split candidates)
   - Note naming inconsistencies

2. **Check Agency HQ Health**
   - All 7 agent soul files present? (`Agency HQ/Agents/<agent-id>/soul.md`)
   - All memory files present? (`Agency HQ/Memory/<agent-id>/persistent.md`)
   - `shared-team-knowledge.md` present and non-empty?
   - Reports >30 days old archived to `Agency HQ/Archive/`?

3. **Find Misplaced Notes**
   - Notes that belong in Agency HQ but are floating outside

#### Phase 3: Execute Safe Changes (Auto)

**Execute these automatically (log before doing):**

| Action | Condition | Result |
|--------|-----------|--------|
| ADD_FRONTMATTER | No frontmatter exists | Add YAML with created date, modified, tags: [], status: inbox |
| RENAME | Named "Untitled" or variant | Use first heading as filename, append date if ambiguous |
| MOVE | Content/folder mismatch obvious | Move to correct folder |
| CREATE_FOLDER | Agency HQ subfolder missing | Create missing subfolder |
| ARCHIVE | Report >30 days old | Move to Agency HQ/Archive/ |

**Log to change-log.md:**
```
[<timestamp>] <ACTION> | <file-path> | <description>
```

**NEVER execute automatically:**
- Delete any file
- Merge note content
- Edit note body
- Move when ambiguous
- Rename if backlinks reference current name

#### Phase 4: Generate Proposals

For items requiring approval, create proposal notes in `Agency HQ/Approvals/pending/`:

**Filename format:** `vault-<action-type>-<date>-<seq>.md`

**Proposal types:**
- `merge_notes`: Duplicate candidates to merge
- `delete_stub`: Stubs to delete or expand
- `split_folder`: Folders to reorganize
- `resolve_duplicate`: Duplicate resolution strategy
- `restructure`: General restructure proposals

**Each proposal includes:**
```markdown
---
type: vault_organization
action: <type>
status: pending
created: <timestamp>
agent: vault-organizer
priority: low
---

## Proposal: <title>

**Why:** <problem explanation>

**What:** <exact changes>

**Risk:** <what could go wrong>

**Reversible:** yes/no

**Approve action:** "approve vault-<id>"
**Reject action:** "reject vault-<id>"
```

#### Phase 5: Summary Report

Write to `Agency HQ/Vault Maintenance/summary-YYYY-MM-DD.md`:

```markdown
## Vault Organizer — <date>

### Stats
- Total notes scanned: X
- Changes made automatically: X
- Proposals submitted for approval: X
- Vault health score: X/100

### Auto-Changes Made
(bulleted list with before/after paths)

### Flagged for Your Review
(bulleted list of proposals)

### Agency HQ Folder Health
- [ ] Soul files present
- [ ] Memory files present
- [ ] Shared knowledge present
- [ ] Stale reports archived

### Trend vs Yesterday
(if prior audit exists)
- Orphan count: X (up/down from Y)
- Health score: X/100 (improved/declined from Y%)
- Pending proposals >3 days: X
```

### Dry-Run Mode (--dry-run)

1. Run Phase 1: Full audit with all flags
2. Run Phase 2: Structural analysis
3. Output results to console/chat
4. **DO NOT:**
   - Execute any safe changes
   - Modify any files
   - Generate approval proposals
   - Write audit/summary reports to vault

### Audit-Only Mode (--audit-only)

1. Run Phase 1: Complete audit
2. Write audit report to `Agency HQ/Vault Maintenance/audit-YYYY-MM-DD.md`
3. Output summary to console/chat
4. Stop — no analysis, no changes, no proposals

---

## Output

### Files Created (full run)

| File | Location |
|------|----------|
| Audit report | `Agency HQ/Vault Maintenance/audit-YYYY-MM-DD.md` |
| Summary report | `Agency HQ/Vault Maintenance/summary-YYYY-MM-DD.md` |
| Change log entries | `Agency HQ/Vault Maintenance/change-log.md` (append) |
| Proposals | `Agency HQ/Approvals/pending/vault-*.md` |

### Files Created (dry-run)

- None — output to console/chat only

### Files Created (audit-only)

- Audit report only

### Notifications

- Full run: "Vault organization complete: X notes scanned, X auto-changes made, X proposals pending"
- Dry-run: "Audit complete (dry-run): X notes scanned, X issues found"
- Audit-only: "Audit complete: X notes scanned, X issues flagged"

---

## Example Output

### Console Output (dry-run)

```
🔍 Vault Audit Complete (dry-run)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Stats:
  • Total notes: 247
  • Folders: 12
  • Notes with frontmatter: 89%
  • Notes with tags: 72%

🚩 Issues Found:
  • ORPHAN: 8 notes
  • STUB: 15 notes
  • NO_FRONTMATTER: 23 notes
  • UNTITLED_VARIANT: 3 notes
  • STALE: 12 notes

📁 Structural Analysis:
  • Small folders (1-2 notes): 4
  • Large folders (50+ notes): 1

🏢 Agency HQ Health:
  • Soul files: 7/7 ✓
  • Memory files: 6/7 ⚠️
  • Shared knowledge: ✓
  • Stale reports archived: ✓

ℹ️ Run without --dry-run to execute safe changes and generate proposals
```

### Console Output (full run)

```
🗃️ Vault Organization Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Stats:
  • Total notes: 247
  • Auto-changes: 12
  • Proposals: 5

✅ Auto-Changes Made:
  • ADD_FRONTMATTER: 18 files
  • RENAME: 3 files
  • ARCHIVE: 2 reports

📋 Pending Proposals:
  • vault-merge-2026-03-11-001.md (duplicate resolution)
  • vault-stub-2026-03-11-002.md (stub deletion)
  • vault-restructure-2026-03-11-003.md (folder merge)

📁 Reports saved:
  • Agency HQ/Vault Maintenance/audit-2026-03-11.md
  • Agency HQ/Vault Maintenance/summary-2026-03-11.md
```

---

## Error Handling

| Scenario | Action |
|----------|--------|
| obsidian-vault-mcp unreachable | Write to `Agency HQ/Ops/errors.md`, stop workflow |
| File move fails | Log to change-log.md, skip, continue |
| Vault >500 notes | Process in batches of 100, log progress |
| First run | Skip trend comparison, note "baseline established" |

---

## Related

- Workflow: [VAULT_ORGANIZER](../docs/workflows/VAULT_ORGANIZER.md)
- MCP Server: obsidian-vault-mcp
- Approval Skill: `approval_inbox` (for processing proposals)
- Scheduled: Via OpenClaw cron (`0 2 * * *`)