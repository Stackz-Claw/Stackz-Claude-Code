---
name: bookmark
description: >
  Save a URL or article as a bookmark with notes and tags for later use in 
  the idea brainstorm workflow. Use when the user says "bookmark this", 
  "save this article", "remember this link", "add this to my research", 
  or pastes a URL and says anything like "keep this" or "add to radar".
  Also lists, searches, and manages existing bookmarks.
---

# Bookmark Skill

Saves URLs with context so the brainstorm workflow can use them as seeds.

---

## SAVING A BOOKMARK

When the user wants to save something, extract from their message:
- **url** — the URL (required)
- **title** — article title or description if provided
- **notes** — the user's comment about why it's relevant
- **tags** — infer from context:
  - `signal` — demand or pain point evidence
  - `competitor` — a competing product or company
  - `market` — market size or trend data
  - `inspiration` — an idea or concept worth exploring
  - `founder` — a founder story or build-in-public thread
  - `tool` — a useful API, library, or service
- **source** — `"web"` / `"x"` / `"manual"`

Call `bookmark_save` with the extracted data.

On success, confirm:
```
✓ Bookmarked: [title or URL]
  Tags: [tags]
  Notes: "[notes]"
  ID: [id]

Use /idea-brainstorm to incorporate your saved bookmarks into the next session.
```

On duplicate, say:
```
Already saved: [title or URL] (saved [date])
Want me to update the notes or tags?
```

---

## LISTING BOOKMARKS

When user says "show my bookmarks", "what have I saved", "list bookmarks":

Call `bookmark_list` with `limit: 20`.

Display as a clean list:
```
YOUR BOOKMARKS ([count] total)
================================
[#] [title or URL truncated to 60 chars]
    Tags: [tags]  |  Saved: [date]  |  [unread indicator: ● unread / ○ used]
    Notes: [notes if any]
    ID: [id]
```

If 0 results: "No bookmarks saved yet. Paste a URL and I'll save it."

---

## SEARCHING BOOKMARKS

When user says "find bookmarks about X" or "show my competitor bookmarks":

Call `bookmark_list` with appropriate `tag` or `query` filter.

---

## DELETING A BOOKMARK

When user says "delete bookmark [id]" or "remove [url]":

Call `bookmark_delete`. Confirm: "✓ Removed [title]"

---

## SHOWING UNREAD BOOKMARKS

When user says "what haven't I used yet" or "unread bookmarks":

Call `bookmark_list` with `unread: true`.

These are the bookmarks that haven't been consumed by a brainstorm session yet.

---

## OPERATING RULES

1. Always infer tags — don't ask the user to tag manually unless ambiguous
2. Notes should capture the user's intent ("why is this relevant?"), not just the URL
3. A bookmark without notes or tags is half-useful — if the user doesn't provide context, ask once: "Quick note on why this is relevant?"
4. Never save the same URL twice — check for duplicates first
