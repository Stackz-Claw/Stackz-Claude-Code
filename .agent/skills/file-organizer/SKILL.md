---
name: file-organizer
description: This skill should be used whenever someone needs help organizing, cleaning up, or restructuring files and folders on their computer. Activate for requests like "my Downloads is a mess," "find duplicate files," "organize my projects folder," "clean up my Desktop," "sort photos by date," "archive old files," or any task involving moving, renaming, deduplicating, or restructuring files. Also trigger when someone says they can't find things, their disk is full, or they want to establish a better folder structure — even if they don't use the word "organize."
---

# File Organizer

Helps maintain clean, logical file structures — analyzing what exists, proposing changes, and executing them safely with your approval at every step.

---

## Workflow

### Step 1 — Scope the Request

Before running any commands, ask:
- **Where?** Which directory (Downloads, Documents, Projects, home folder)?
- **What problem?** Can't find things / duplicates / no structure / disk full?
- **Anything off-limits?** Active projects, sensitive data, specific folders to skip?
- **How aggressive?** Light tidy vs. full restructure + archive?

If the user gives you enough context (e.g. "clean up ~/Downloads"), proceed directly — don't ask questions you can answer yourself.

### Step 2 — Detect Platform

```bash
uname -s  # Darwin = macOS, Linux = Linux
```

Commands differ by platform — see the [Platform Reference](#platform-reference) section below.

### Step 3 — Analyze

```bash
# Overview
ls -la "$TARGET"

# Total size
du -sh "$TARGET"

# File type breakdown
find "$TARGET" -maxdepth 2 -type f | sed 's/.*\.//' | tr '[:upper:]' '[:lower:]' | sort | uniq -c | sort -rn | head -20

# Largest files
find "$TARGET" -type f -exec du -sh {} + 2>/dev/null | sort -rh | head -20

# Age distribution
find "$TARGET" -type f -mtime +180 | wc -l  # Files not touched in 6+ months
find "$TARGET" -type f -mtime +365 | wc -l  # Files not touched in 1+ year
```

Summarize findings before proposing anything: total files, types, size, age distribution, obvious issues.

### Step 4 — Find Duplicates (when requested)

```bash
# Platform-aware exact duplicate detection by hash
if [[ "$(uname -s)" == "Darwin" ]]; then
    find "$TARGET" -type f | xargs md5 2>/dev/null | awk '{print $NF, $1}' | sort | uniq -d --check-chars=32
else
    find "$TARGET" -type f -exec md5sum {} + 2>/dev/null | sort | uniq -D -w 32
fi

# Same filename in multiple locations
find "$TARGET" -type f -printf '%f\n' 2>/dev/null | sort | uniq -d
```

For each duplicate set, show: all paths, sizes, modification dates. Recommend keeping the newest copy in the most logical location. **Never delete without explicit confirmation.**

### Step 5 — Propose a Plan

Present this template before touching anything:

```
## Organization Plan: [Directory]

### Current State
- [X] files, [Y] folders, [Z] total size
- Types: [breakdown]
- [Age issues, naming issues, structural issues]

### Proposed Structure
[Directory]/
├── [Folder 1]/
├── [Folder 2]/
└── [Archive]/

### Changes
1. Create folders: [list]
2. Move: [X] files to [destination] — [pattern/reason]
3. Rename: [any renames and why]
4. Archive: [X] files not touched since [date]
5. Delete (duplicates only): [X] files — [details]

### Needs Your Decision
- [Ambiguous files you're unsure about]

Proceed? (yes / no / adjust)
```

**Do not execute until the user approves.**

### Step 6 — Execute Safely

```bash
# Create folders
mkdir -p "path/to/folder"

# Move with logging — capture every action
mv -v "source/file.pdf" "dest/file.pdf"

# Rename with consistent pattern
mv "old name.pdf" "2024-03-15-meeting-notes.pdf"

# Preserve timestamps on macOS
cp -p "source" "dest" && rm "source"  # Use instead of mv if timestamps matter
```

**Safety rules (non-negotiable):**
- Log every `mv` and `rm` to a temp file: `/tmp/file-organizer-log-$(date +%Y%m%d-%H%M%S).txt`
- On filename conflict, **stop and ask** — never silently overwrite
- Skip symlinks unless the user explicitly asks to handle them
- Skip hidden files (`.filename`) unless explicitly in scope
- If you hit a permission error, report it and continue with the rest — don't abort
- **Never delete** without explicit per-file or per-batch confirmation

### Step 7 — Summarize and Leave Undo Instructions

```
## Done ✓

- Created [X] folders
- Moved [Y] files
- Archived [Z] old files
- Freed [W] GB (duplicates removed)

## New Structure
[tree output]

## Undo
All moves were logged to: /tmp/file-organizer-log-[timestamp].txt
To reverse a move: mv "new/path" "old/path"
To reverse everything: [generated reverse commands if feasible]

## Maintenance
- Weekly: sort new downloads
- Monthly: archive completed projects  
- Quarterly: duplicate check
```

---

## Organization Patterns

### By File Type
| Type | Extensions | Destination |
|------|-----------|-------------|
| Documents | pdf, docx, txt, md | Documents/ |
| Images | jpg, jpeg, png, gif, svg, heic | Pictures/ or Photos/ |
| Video | mp4, mov, avi, mkv | Videos/ |
| Audio | mp3, wav, flac, m4a | Music/ |
| Archives | zip, tar, gz, dmg, pkg | Archives/ or Installers/ |
| Spreadsheets | xlsx, csv, numbers | Documents/Spreadsheets/ |
| Code/Projects | dirs with .git, package.json, etc. | Projects/ |
| Scratch/Temp | tmp, bak, DS_Store, Thumbs.db | Delete (confirm first) |

### By Age
- Modified < 3 months → Active/current location
- Modified 3–12 months → Review (keep or archive)
- Modified > 12 months → Archive/[Year]/ (default) or delete (confirm)

### Naming Conventions
- Dates first: `YYYY-MM-DD-description.ext` (sorts chronologically)
- No spaces: use hyphens (`-`) or underscores (`_`)
- Lowercase preferred for cross-platform safety
- Remove junk suffixes: `file-final-v2 (1).pdf` → `file.pdf`
- Version control for code — remove `-v2`, `-old`, `-copy` from filenames

---

## Platform Reference

### macOS-specific
```bash
# Hash for duplicates
md5 file.txt

# Get EXIF date from photos (requires exiftool)
exiftool -DateTimeOriginal photo.jpg

# Show hidden files
ls -la | grep '^\.'

# Disk usage sorted
du -sh * | sort -rh
```

### Linux-specific
```bash
# Hash for duplicates
md5sum file.txt

# Get EXIF date (requires exiftool or imagemagick)
exiftool -DateTimeOriginal photo.jpg
identify -verbose photo.jpg | grep "Date"

# Disk usage sorted
du -sh * | sort -rh

# Find uses -printf on Linux (not macOS)
find . -type f -printf '%f\n'
```

### Cross-platform safe commands
```bash
find, ls, du, mkdir, mv, cp, rm    # All safe on both
stat                                # Syntax differs slightly
```

---

## Common Scenarios

**Downloads cleanup**: Sort by type into subfolders, move installers/DMGs to Archives, delete obvious junk (`*.crdownload`, `*.part`), archive anything > 6 months old.

**Project folder restructure**: Separate Active/Archive, normalize naming, consolidate `-old`/`-v2` variants, move completed projects to `Archive/YYYY/`.

**Photo organization by date**: Use EXIF data first; fall back to file modification date. Structure: `Photos/YYYY/MM-MonthName/`. Move undated photos to `Photos/Unsorted/`.

**Duplicate removal**: Hash-based detection, group by set, recommend keeping newest in most logical location, confirm before any deletion.

**Desktop cleanup**: Everything gets a home — Documents, Downloads, or a dated `Desktop-Cleanup-YYYY-MM-DD/` holding folder if decisions need time.

---

## Reference Files

- `references/photo-organization.md` — Detailed EXIF-based photo sorting workflow
- `references/project-structures.md` — Recommended structures for dev, design, and writing projects
