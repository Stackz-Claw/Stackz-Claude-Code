---
name: launch-radar
description: "Radar's web intelligence skill for startup launch platforms. Use this skill whenever Stackz needs to: monitor launch platforms for trending products, scout competitor launches, identify the best window to submit a venture for launch, track submission status across platforms, or analyze what's getting traction on Product Hunt, BetaList, Indie Hackers, Hacker News, and the full launch ecosystem. Also activates when Radar needs to research an opportunity by checking what's already been built and launched. If the word 'launch', 'submit', 'ProductHunt', 'trending', 'competitors', or any of the 13 platform names appears — use this skill."
risk: low
---

# Launch Radar
*Radar's intelligence layer for the startup launch ecosystem*

This skill gives Stackz and Radar full situational awareness of the launch landscape — what's trending, who's launching what, where to submit, and when to strike.

---

## QUICK-START: What Are You Doing?

| Situation | Go to |
|-----------|-------|
| Daily automated scan of all platforms | [Daily Scan Protocol](#daily-scan-protocol) |
| Researching a specific platform before submitting | `references/platforms.md` |
| Timing a launch — when to submit | `references/launch-timing.md` |
| Monitoring a live launch | [Live Launch Monitoring](#live-launch-monitoring) |
| Competitive intelligence on a specific idea | [Competitive Scan](#competitive-scan) |
| X/Twitter launch account monitoring | `references/x-accounts.md` |

---

## THE 13 LAUNCH PLATFORMS

Full profiles, submission requirements, and tactics in `references/platforms.md`.

**Tier 1 — Highest ROI (submit to all)**
1. **Product Hunt** — producthunt.com | Daily launches, huge audience, maker community
2. **Hacker News** — news.ycombinator.com | Show HN posts, technical credibility
3. **Indie Hackers** — indiehackers.com | Revenue-focused community, founder audience
4. **BetaList** — betalist.com | Pre-launch email list building

**Tier 2 — High Value (submit to most)**
5. **Uneed** — uneed.be | Curation-focused, strong conversion
6. **Fazier** — fazier.com | Growing community, less saturated
7. **Microlaunch** — microlaunch.net | Micro-SaaS specific
8. **Peerlist** — peerlist.io | Professional network, developer audience
9. **TinyLaunch** — tinylau.nch | Small product community

**Tier 3 — Supplemental**
10. **SideProjectors** — sideprojectors.com | Side project marketplace
11. **LaunchIgniter** — launchigniter.com | Launch support community
12. **PeerPush** — peerpush.net | Peer-to-peer launch support
13. **Tiny Startups** — tinystartups.com | Small startup community

---

## DAILY SCAN PROTOCOL

Run every morning at 06:00 UTC via heartbeat. Stackz receives the digest.

### Scan Sequence

**Step 1 — Product Hunt (highest signal)**
```
Navigate to: https://www.producthunt.com
Extract today's top launches:
- Product name, tagline, category
- Current upvote count and rank
- Maker names (note if indie/solo)
- Launch date/time
- Comment sentiment (positive/mixed/negative)

Flag if: A product in our active venture categories is in top 10
Flag if: A product solves the same problem as any of our ventures
```

**Step 2 — Hacker News Show HN**
```
Navigate to: https://news.ycombinator.com/show
OR use HN Algolia API: https://hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=created_at_i>86400

Extract posts from last 24h:
- Title, points, comment count
- Age of post
- Top comments (first 3)

Flag if: Points > 100 (strong signal)
Flag if: Directly competitive with our ventures
```

**Step 3 — Indie Hackers**
```
Navigate to: https://www.indiehackers.com/products (newest)
AND: https://www.indiehackers.com/post (recent milestones)

Extract:
- New product listings from last 48h
- Revenue milestones posted ($500 MRR, $1K, $5K)
- Discussion threads with 10+ comments

Flag if: Revenue milestone in our target category
```

**Step 4 — BetaList**
```
Navigate to: https://betalist.com
Extract today's featured startups:
- Name, description, category
- Waitlist size if visible
- Launch date

Flag if: Directly overlaps with any venture in pipeline
```

**Step 5 — Uneed + Fazier + Microlaunch (batch)**
```
Uneed: https://www.uneed.be
Fazier: https://fazier.com
Microlaunch: https://microlaunch.net

For each: extract top 3-5 products of the day
Note categories and any that compete with our ventures
```

### Scan Output Format

```json
{
  "scan_date": "[ISO date]",
  "scan_agent": "radar",
  "platforms_scanned": [],
  "competitive_flags": [
    {
      "platform": "",
      "product_name": "",
      "tagline": "",
      "threat_level": "high | medium | low",
      "our_venture_affected": "",
      "why_relevant": "",
      "url": ""
    }
  ],
  "trending_categories": [],
  "opportunity_signals": [
    {
      "signal": "",
      "source": "",
      "why_interesting": "",
      "recommended_action": ""
    }
  ],
  "top_launches_today": [],
  "stackz_digest": "[2-3 sentence summary for Stackz]"
}
```

---

## LIVE LAUNCH MONITORING

Activate when a Stackz venture goes live on any platform.

### Monitoring Cadence

| Time | Action |
|------|--------|
| T+0 (launch live) | Confirm listing is live, screenshot, share URL to Stackz |
| T+1h | Check rank, upvotes, comments — report to Stackz |
| T+3h | Same + flag any negative comments needing response |
| T+6h | Mid-day check — are we in top 10? |
| T+12h | Evening check — trajectory assessment |
| T+24h | Final report — total upvotes, rank, traffic, signups |

### Live Launch Report Format

```json
{
  "venture": "",
  "platform": "",
  "launch_url": "",
  "check_time": "[ISO]",
  "rank": 0,
  "upvotes": 0,
  "comments": 0,
  "comment_sentiment": "positive | mixed | negative",
  "flags": [],
  "trajectory": "climbing | stable | falling",
  "recommended_action": ""
}
```

---

## COMPETITIVE SCAN

Use when evaluating a new venture idea or checking market saturation.

### Process

1. Search each Tier 1 platform for the product category
2. Search Product Hunt with relevant keywords (use PH search)
3. Search HN for "Show HN: [category]" posts last 12 months
4. Check Indie Hackers product listings for same category
5. Note: pricing, user counts, review sentiment, last update date

### Output

For each competitor found:
```json
{
  "name": "",
  "platform_found": "",
  "url": "",
  "launched": "",
  "pricing": "",
  "upvotes_or_engagement": "",
  "sentiment": "",
  "last_active": "",
  "our_differentiation": ""
}
```

---

## SUBMISSION PREPARATION

When a venture is ready to launch, prepare submissions for all relevant platforms.

See `references/platforms.md` for per-platform requirements.

**Universal requirements to prepare:**
- Product name (50 chars max for most platforms)
- Tagline (60-80 chars — punchy, no jargon)
- Short description (150 chars)
- Long description (300-500 words)
- Logo (240x240px PNG, transparent background)
- Screenshots (1280x800px, 3-5 images)
- Demo URL or video (60s max for video)
- Maker/founder name and bio
- Twitter/X handle
- Pricing (be specific — "Free / $X/mo")
- Categories (2-3 max)

**Submission order matters.** See `references/launch-timing.md` for sequencing.

---

## REFERENCE FILES

- `references/platforms.md` — Full profiles for all 13 platforms: submission URLs, requirements, audience size, best practices, gotchas
- `references/launch-timing.md` — When to launch on each platform, day-of-week data, sequencing strategy across platforms
- `references/x-accounts.md` — The 20 X accounts to monitor and engage with, each account's focus, posting patterns, engagement tactics
