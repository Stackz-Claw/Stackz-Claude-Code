---
name: x-bookmark-sync
description: >
  Fetches your saved X (Twitter) bookmarks and syncs them to the idea brainstorm
  workflow. Also actively searches X for signals, pain points, launches, and ideas.
  Extracts URLs from tweets, auto-tags based on content analysis, and adds them
  to your bookmark store. Use when asked to "sync X bookmarks", "search X for ideas",
  "hunt for signals", "find startup ideas on X", or set up recurring sync.
  Requires x-mcp-server. Reads from ~/.stackz/bookmarks/sync-state.json for incremental sync.
  Run manually or set up with /loop for automatic background syncing.
---

# X Bookmark Sync Skill

Syncs your X saved tweets into the idea brainstorm workflow as bookmarks.

---

## USAGE

### Manual Sync

When user says "sync X bookmarks", "fetch my saved tweets", or "sync bookmarks from X":

1. Call `get_bookmarks` with `maxResults: 25` and `includeMedia: true`
2. Process each tweet to extract:
   - URLs in the tweet (from `urls` array)
   - The tweet text itself
   - Author info if available
3. For each tweet with URLs, analyze content and auto-tag
4. Call `bookmark_add` for each new URL
5. Update sync state with latest tweet ID
6. Report summary

### Incremental Sync

The skill tracks the last synced tweet ID in `~/.stackz/bookmarks/sync-state.json`.
On each sync, it fetches bookmarks and only adds new ones (by comparing to last sync).

If no sync state exists, it does a full sync and creates the state file.

---

## AUTO-TAGGING LOGIC

Analyze tweet content to assign tags:

**Demand Signals** (tag: `signal`):
- "would pay for", "wish existed", "need a tool", "frustrated"
- "can't find", "no good option", "looking for"
- "just launched", "hit $X MRR", "revenue"

**Competitors** (tag: `competitor`):
- Product/company names in tweet
- "just released", "new tool", "launched"
- Comparison language: "vs", "better than", "alternative"

**Market Data** (tag: `market`):
- Numbers, stats, percentages
- "market size", "growth", "statistic"
- "report says", "study shows"

**Inspiration** (tag: `inspiration`):
- Ideas, concepts, "what if"
- "concept", "imagine", "would be cool"

**Founder Stories** (tag: `founder`):
- "built this because", "started", "founder"
- "build in public", "journey", "launch"

**Tools/APIs** (tag: `tool`):
- "released API", "new integration", "just added"
- Library names, service names

Default tag: `x-bookmark` (all synced items get this)

---

## PROCESSING STEPS

### Step 1: Fetch Bookmarks

Call `get_bookmarks` with:
```
maxResults: 25
includeMedia: true
```

### Step 2: Load Sync State

Read `~/.stackz/bookmarks/sync-state.json`:
```json
{
  "lastSyncTweetId": "123456789",
  "lastSyncTime": "2026-03-10T12:00:00Z"
}
```

### Step 3: Filter New Tweets

Compare fetched tweets against lastSyncTweetId. Only process new ones.

### Step 4: Extract URLs

For each new tweet, extract URLs from:
- `tweet.entities.urls` → expanded_url
- Any URLs in the text itself (regex match)

### Step 5: Auto-Tag Each URL

Analyze the tweet text to assign appropriate tags.

### Step 6: Add to Bookmark Store

For each URL, call `bookmark_add`:
```
url: [extracted URL]
notes: "[tweet text truncated to 200 chars] | Author: @username"
tags: [auto-tagged + "x-bookmark"]
```

### Step 7: Update Sync State

Write new lastSyncTweetId and timestamp to sync-state.json.

---

## OUTPUT FORMAT

```
X BOOKMARK SYNC
================
Fetched: [N] bookmarks
New since last sync: [N]
Added to bookmarks: [N]
Skipped (no URLs): [N]

Latest tweet ID: [id]
Sync time: [timestamp]

[If N > 0: List each added bookmark]
  - [URL]
    Tags: [tags]
    From tweet: "[tweet text preview...]"
```

If no new bookmarks:
```
X BOOKMARK SYNC
================
No new bookmarks since last sync.
Latest bookmark: [tweet ID from N days ago]
```

---

## SETTING UP RECURRING SYNC

To auto-sync every N minutes:

1. User runs `/loop Xm /x-bookmark-sync` (e.g., `/loop 15m /x-bookmark-sync`)
2. The loop will run the sync on the specified interval
3. Each run only adds new bookmarks (incremental)

Recommended: 15-30 minutes to avoid rate limiting while staying fresh.

---

## ERROR HANDLING

- **No X MCP server**: "X MCP server not available. Make sure x-mcp-server is running."
- **No bookmarks MCP server**: "Bookmarks MCP server not available."
- **API rate limited**: "Rate limited. Will retry on next interval."
- **No bookmarks to sync**: "Your X bookmarks are empty or all synced."

---

## ACTIVE SIGNAL SEARCH

When user says "search X for [topic]", "find ideas on X", "hunt for signals", or "search X for pain points":

1. Use `x_signal_search` tool with the query
2. The tool searches X for tweets matching the query
3. Filters for tweets with URLs
4. Auto-tags each based on content analysis
5. Adds to bookmark store automatically
6. Returns summary of signals found

Example queries to search for:
- "I would pay for a tool that" — demand signals
- "wish existed" — unmet needs
- "frustrated with software" — pain points
- "just launched a tool" — competitor launches
- "hit $X MRR" — revenue signals
- "no good option for" — market gaps

### Signal Search Usage

Call `x_signal_search`:
```
query: "AI developers frustrated"
maxResults: 25
autoAdd: true
minEngagement: 0
```

---

## IDEA HUNT SWEEP

When user says "run idea hunt", "hunt for startup ideas", or "sweep X for ideas":

1. Use `x_idea_hunt` tool
2. Provide topics to hunt (e.g., ["AI", "SaaS", "developer tools", "automation"])
3. The tool runs multiple signal queries for each topic:
   - "[topic] I would pay for a tool that"
   - "[topic] wish existed"
   - "[topic] frustrated with"
   - "[topic] just launched"
   - "[topic] no good option for"
   - "[topic] looking for a tool"
   - "[topic] built this because nothing existed"
   - "[topic] need a way to"
   - "[topic] AI workflow automation"
   - "[topic] hit $"
4. Extracts all URLs from results
5. Auto-tags and adds to bookmark store
6. Returns comprehensive results

### Idea Hunt Usage

Call `x_idea_hunt`:
```
topics: ["AI", "SaaS", "developer tools"]
autoAdd: true
```

This runs 30 searches (10 queries × 3 topics) and adds all valuable URLs to bookmarks.

---

## ACTIVE VS PASSIVE MODES

**Passive (Bookmark Sync)**:
- Syncs what you've already saved on X
- Good for curated content you bookmarked
- Set up with `/loop 15m /x-bookmark-sync`

**Active (Signal Search/Idea Hunt)**:
- Searches X for new signals in real-time
- Good for hunting ideas on specific topics
- Run on demand: "search X for AI pain points"
- Or set up recurring: `/loop 30m /x-idea-hunt`

---

## OPERATING RULES

1. Always track sync state — never re-add the same bookmark
2. Only add tweets that contain URLs (bookmarks without links aren't useful for research)
3. Truncate notes to 200 chars to keep bookmarks manageable
4. Add `x-bookmark` tag to synced bookmarks, `x-signal` to search results, `x-idea-hunt` to hunt results
5. Be quiet about it — no notification unless user asks for sync status
6. On /loop, run silently without printing summary (unless errors)
7. Use `x_idea_hunt` sparingly — it makes many API calls and may hit rate limits
8. After active search/hunt, bookmarks are immediately available in `/idea-brainstorm`