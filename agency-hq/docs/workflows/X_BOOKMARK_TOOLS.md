# X Bookmark MCP Tools Reference

**MCP Server:** x-mcp-server

---

## Available Tools

### 1. get_bookmarks
Fetch your saved tweets from X for research and idea generation.

```
Input: maxResults (1-100, default: 25)
Output: Array of bookmarked tweets with text, author, metrics
```

**Use in Brainstorm:** Pull saved tweets to find product ideas, pain points, competitor signals

---

### 2. sync_x_bookmarks
Sync new X bookmarks to your local bookmark store.

```
Input:
- maxResults: Maximum bookmarks to check (default: 25)
- accountId: Optional account index

Output: Sync results with added bookmarks
```

**Use:** Keep bookmarks up-to-date before brainstorming sessions

---

### 3. search_x_signals (Idea Mining)
Search X for specific signals and auto-add valuable findings to bookmarks.

**Signal Types:**
- `pain_points` — Complaints, frustrations, problems
- `wishlist` — "I wish", "would be nice if", feature requests
- `launches` — New products, features, announcements
- `revenue` — Pricing, paying for, costs
- `frustrations` — Annoyances, workarounds, complaints

```
Input:
- query: Search term
- signalType: The type of signal to search for
- autoAdd: Automatically add URLs to bookmarks (default: true)

Output: Search results + added bookmarks
```

**Use:** Actively discover ideas by searching what people are complaining about or wanting

---

### 4. idea_hunt
Run a pre-configured sweep across multiple signal queries.

```
Input:
- queries: Array of custom queries (optional)
- autoAdd: Add to bookmarks (default: true)

Default searches:
- pain points
- wishlist features
- product launches
- revenue signals
- frustrations
```

**Use:** Quick idea discovery sweep — runs multiple searches and saves results

---

## Workflow Integration

### Morning Brainstorm Workflow
1. **Start of Stage 1:** Call `get_bookmarks(25)` to pull saved tweets
2. **During Stage 1:** Analyze bookmarks for business signals
3. **Optional:** Call `idea_hunt()` to discover new signals

### Self-Optimization Workflow
1. **Stage 1 (Context):** Call `get_bookmarks(10)` to see industry trends
2. **Stage 3 (Identify):** Use `search_x_signals` to find similar problems being discussed

---

## Quick Commands

```bash
# Get recent bookmarks
call get_bookmarks(maxResults=25)

# Run idea hunt sweep
call idea_hunt(autoAdd=true)

# Search for pain points
call search_x_signals(query="AI agents", signalType="pain_points", autoAdd=true)
```

---

*Last Updated: 2026-03-11*
*MCP: x-mcp-server*