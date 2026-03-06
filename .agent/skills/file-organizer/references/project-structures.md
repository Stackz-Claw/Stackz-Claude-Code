# Recommended Project Folder Structures

## Top-Level Projects Organization

```
~/Projects/
├── active/          ← Current work; in-progress
├── archive/
│   ├── 2022/
│   ├── 2023/
│   └── 2024/
└── templates/       ← Starter structures you reuse
```

**When to archive**: Not touched in 6+ months, or project is complete. Archive by year of last activity.

---

## Software / Development Project

```
project-name/
├── src/             ← Source code
├── tests/
├── docs/
├── scripts/         ← Build, deploy, utility scripts
├── .github/         ← CI/CD workflows (if using GitHub)
├── README.md
├── .gitignore
└── package.json / pyproject.toml / Cargo.toml (etc.)
```

**Cleanup signals**:
- Remove `node_modules/`, `__pycache__/`, `*.pyc`, `dist/`, `build/` before archiving
- Consolidate `-old`, `-v2`, `-backup` variants (keep newest, delete or commit the rest)
- Make sure `.gitignore` covers generated files before any final commit

---

## Design / Creative Project

```
project-name/
├── assets/
│   ├── raw/         ← Original source files (PSD, AI, Figma exports)
│   ├── exports/     ← Final exported versions (PNG, SVG, PDF)
│   └── fonts/
├── deliverables/    ← What was actually sent to client/published
├── feedback/        ← Client feedback, revision notes
├── references/      ← Inspiration, moodboards, specs
└── README.md        ← Project brief, client, dates
```

---

## Writing / Research Project

```
project-name/
├── drafts/
│   ├── v1-YYYY-MM-DD.md
│   └── v2-YYYY-MM-DD.md
├── final/           ← Published/submitted version only
├── research/
│   ├── sources/     ← PDFs, web clips
│   └── notes/
└── assets/          ← Images, charts used in the piece
```

**Note on versions**: Keep dated drafts in `drafts/`; `final/` should have only the submitted version. If you're iterating heavily, consider git instead of manual versioning.

---

## Client Work Structure

```
clients/
├── client-name/
│   ├── contracts/
│   ├── projects/
│   │   ├── project-name-YYYY/
│   │   └── ...
│   ├── invoices/
│   └── correspondence/
```

---

## Naming Conventions Quick Reference

| Pattern | Example | Use for |
|---------|---------|---------|
| `YYYY-MM-DD-description` | `2024-03-15-meeting-notes.md` | Dated documents |
| `client-project-descriptor` | `acme-website-redesign` | Project folders |
| `NN-phase-name` | `01-research`, `02-design` | Ordered stages |
| `type-descriptor` | `invoice-2024-q1.pdf` | Categorized files |

**Avoid**: spaces in names (use `-` or `_`), trailing numbers without context (`file2.pdf`), `final`, `new`, `latest` without dates.

---

## Consolidating Duplicated Project Folders

When you find `project/`, `project-old/`, `project-v2/`, `project-backup/`:

1. Identify newest/canonical version (usually highest version number or most recent mtime)
2. `diff -r project/ project-v2/` to find differences
3. Merge any unique newer content into the canonical version
4. Archive or delete the others (confirm before deleting)
5. Rename canonical to clean name without version suffix
