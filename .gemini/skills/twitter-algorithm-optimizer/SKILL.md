---
name: twitter-algorithm-optimizer
description: This skill should be used when optimizing tweets or X posts for maximum algorithmic reach and engagement. Activate when asked to rewrite, improve, score, or analyze tweets; debug underperforming content; build a content strategy for X/Twitter; or explain why a post did or didn't perform. Also activate for thread structure advice, posting time guidance, or any request to "make this tweet go viral" or "get more impressions."
license: AGPL-3.0 (referencing Twitter's open-source algorithm)
---

# X (Twitter) Algorithm Optimizer

## What This Skill Does

1. **Scores and audits** existing tweets against current algorithm signals
2. **Rewrites tweets** to maximize confirmed engagement weights
3. **Diagnoses underperformance** with specific, fixable causes
4. **Applies the exact engagement weights** from X's open-sourced ranking code
5. **Structures threads** for algorithmic amplification
6. **Flags penalties** before they kill a post's reach

---

## Algorithm Architecture (Current as of 2026)

### The Three-Stage Pipeline

**Stage 1 — Candidate Retrieval (~1,500 posts)**
The algorithm fetches approximately 1,500 candidate tweets:
- ~50% from accounts you follow (in-network, via UTEG graph)
- ~50% from accounts you don't follow (out-of-network discovery)

To appear in the out-of-network half, a tweet needs both strong early engagement **and** topical relevance to the viewer. This is how smaller accounts go viral — strong early signal + SimCluster match unlocks non-follower distribution.

**Stage 2 — Ranking (Neural Network / Grok Model)**
A transformer model (Grok-powered since January 2026, replacing the original 48M-parameter neural net) reads the **semantic content** of every tweet and predicts engagement probability across 10 labels. It no longer just counts signals — it understands what a tweet is about and matches it to users whose interest profiles align.

> **Key implication**: Stuffing keywords won't work. Grok understands context. A tweet about "bootstrapping a SaaS" reaches SaaS-interested users even if zero of your followers are in that space.

**Stage 3 — Heuristics, Filters, and Diversity**
- Removes content from blocked/muted accounts
- Applies NSFW/policy filters
- Prevents any single account from dominating a feed
- Deprioritizes already-seen content
- Applies time decay (half-life ~6 hours)

---

## Confirmed Engagement Weights (from Open-Sourced Code)

These are the actual multipliers from X's published ranking model. **This is the most important table in this skill:**

| Engagement Type | Weight | Notes |
|---|---|---|
| Reply + author replies back | **+75x** | Highest possible signal. Conversation started AND author engaged. |
| Direct reply to tweet | **+13.5x** | Responding requires effort — high quality signal |
| Profile click → then like/reply | **+12x** | Signals strong interest in the author |
| Click into conversation → stay 2+ min | **+10x** | Deep engagement / dwell time |
| Bookmark | **~10x** | The "silent engagement" — users saving for later |
| Retweet | **+1x–20x** | Sources vary; conservative estimate 1x, high-end 20x |
| Like | **+0.5–1x** | The baseline — weakest positive signal |
| Video watch 50%+ | **+0.005x** | Low per-action weight, but volume can compensate |

**The critical insight**: A single reply chain where *you respond back* is worth ~150x a like. One retweet is worth 20 likes. This means a tweet with 5 replies (with author responses) algorithmically outperforms a tweet with 100 likes.

### Negative Signals (Heavily Penalized)

| Signal | Effect |
|---|---|
| Block / Report | Catastrophic — permanently damages TweepCred and suppresses future reach |
| "Show less often" / Mute | Significant downrank for current and future posts |
| Quick scroll-past (no engagement) | Weak but cumulative — hurts engagement rate metric |
| Offensive content flag | **80% reach reduction** (X's documented penalty) |

---

## Critical 2025–2026 Platform Changes

### 1. External Links Are Now Severely Penalized

**This is the single biggest change non-subscribers need to know.**

- Open-sourced code confirms **30–50% reach reduction** for posts with external links
- Buffer research found **near-zero median engagement** for link posts from free accounts (March 2025+)
- A/B tests have shown up to **1,700% reach increase** when removing a link from an identical tweet
- X Premium subscribers are somewhat insulated but still penalized compared to link-free posts

**Workaround**: Post the link in the **first reply** to your tweet, not in the main post. Write the main tweet as a compelling standalone, then reply immediately with the URL. This is now standard practice for any post that needs to include a link.

### 2. X Premium Changes the Game (Significantly)

X Premium (formerly Twitter Blue) is no longer just a vanity badge:

- **2–4x reach multiplier** for Premium subscribers vs. free accounts — same content, more impressions
- Premium replies appear **algorithmically prioritized at the top** of conversation threads
- TweepCred score gets a **+4 to +16 point boost** (relevant for the 0.65 threshold — see below)
- Non-Premium accounts with external links receive near-zero organic distribution

**Bottom line**: If you tweet 10+ times/month and attention translates to any business value, the math almost always favors subscribing.

### 3. Grok-Powered Semantic Understanding (January 2026)

The legacy rule-based ranking system was replaced with a transformer model that:
- Reads the actual text of every post semantically
- Watches video content
- Matches content to user interest profiles based on **meaning**, not keywords
- Enables out-of-network distribution to relevant users even with a small follower base

This makes **topical clarity more important than keyword stuffing**. Grok knows what your tweet is about. Write for humans; the algorithm will find the right audience.

### 4. The "Following" Feed Is No Longer Chronological

Since November 2025, X began using Grok to sort the Following feed by predicted engagement (not just recency). The algorithmic feed is now the default experience for virtually everyone.

### 5. Video Gets Disproportionate Reach

- Native video receives **~10x more engagement** than text-only posts in current tests
- Optimal length: 15–60 seconds for highest completion rates
- Watch time >10 seconds gets an additional algorithmic boost
- Key: upload natively to X — links to YouTube or other platforms are penalized

### 6. Hashtags: Less Is More (Or None)

- Using more than 2 hashtags **reduces reach by ~40%**
- Generic/popular hashtags get drowned out — the niche benefit is gone
- 1–2 highly targeted hashtags can increase engagement by ~21%
- Often, zero hashtags outperforms 3+ hashtags
- Write for Grok's semantic understanding instead — the topic will be inferred

---

## Core Ranking Models (What They Actually Do)

**Real-graph**: Predicts interaction likelihood between two specific users based on past behavior. The strongest signal for in-network content. Strategy: Make content your *existing followers* will engage with first — they prime the pump for broader distribution.

**SimClusters**: Community detection via sparse embeddings. Identifies clusters of users with shared interests. Grok now powers this with semantic understanding. Strategy: Be consistently in one niche. The algorithm needs to know which cluster you belong to before it can show you to that cluster's members.

**TwHIN**: Knowledge graph mapping users to content topics. Establishes your topical identity on the platform. Strategy: Consistency over time. Multiple tweets on the same topic strengthen your TwHIN positioning. Sudden topic pivots confuse the system.

**TweepCred (PageRank-style Authority Score)**
- Scored 0–100 using a weighted PageRank approach
- Calculated from: account age, follower/following ratio, engagement quality, interaction patterns with high-credibility accounts, suspension history, original content ratio
- **Critical threshold: 0.65 (65/100)** — below this, only 3 of your tweets are considered for broad distribution. Above it, all tweets are eligible.
- Premium subscribers get a +4 to +16 point boost to this score
- Build it by: consistently engaging with high-quality accounts, maintaining a healthy follower ratio, avoiding blocks/reports, and creating original content

---

## The First 2 Hours Are Everything

The algorithm makes critical distribution decisions based on **early engagement velocity**, not total lifetime engagement.

> A tweet that gets 5 engagements in the first 10 minutes will reach 10–100x more people than an identical tweet with 5 engagements spread over 24 hours.

**What happens in the first 2 hours:**
1. Tweet enters the pool with a baseline score
2. Algorithm shows it to a small initial sample of followers
3. If engagement rate exceeds ~3% of impressions: broader distribution unlocked
4. Strong early performance → algorithm shows to non-followers in SimCluster
5. Retweets from followers expose tweet to their networks → compound reach
6. After ~6 hours: time decay cuts potential visibility in half

**Operational implication**: Post when your most engaged followers are online. Respond to every reply within the first 2 hours. Engaging with early replies is one of the highest-ROI actions you can take after posting.

---

## Engagement Score Formula (Open-Sourced)

```
Score = (Likes × 0.5) + (Retweets × 20) + (Replies × 13.5)
      + (Profile Clicks × 12) + (Link Clicks × 11) + (Bookmarks × 10)
```

**Practical implications:**
- Optimize primarily for **retweets** — 1 retweet = 20 likes algorithmically
- Optimize secondarily for **replies** and **conversation depth**
- Likes are the weakest positive signal — don't optimize for them specifically
- Bookmarks are the underrated signal — "save for later" content (tutorials, data, how-tos) punches above its weight

---

## Optimization Framework: The 4-Step Audit

### Step 1: Identify Core Message and Audience
- What is the single most valuable thing this tweet communicates?
- Which SimCluster community should care about this? (Be specific: "senior SWEs who care about Rust," not "developers")
- What engagement action do you want? (reply, retweet, bookmark — pick one primary)

### Step 2: Check for Immediate Penalties
- ❌ External link in main post → move to first reply
- ❌ More than 2 hashtags → cut to 1 or 0
- ❌ "Offensive" framing → rephrase (80% reach penalty is not worth it)
- ❌ Engagement bait ("RT if you agree") → replace with genuine question
- ❌ Passive/generic statement → add a clear position or question

### Step 3: Maximize Engagement Signals

**To trigger replies** (highest ROI action):
- Ask a direct question at the end
- Take a clear, debatable position ("Hot take:...")
- Leave something intentionally incomplete that invites completion
- Request opinions or experiences ("What's your experience with X?")

**To trigger retweets** (20x multiplier):
- Provide information people want to share with others
- Be the first to surface something useful or surprising
- Write something that "speaks for" a group of people (they'll share because it represents them)
- Provide a framework or insight that makes someone look smart for sharing

**To trigger bookmarks** (10x multiplier, underrated):
- Tutorials and step-by-step guides
- Data, statistics, or research people will reference later
- Templates or frameworks they'll want to use again
- Insights worth revisiting

**To trigger conversation depth** (reply-to-reply = 75x):
- Respond to **every reply** in the first 2 hours
- Ask a follow-up question in your reply
- Each author response multiplies the tweet's algorithmic score

### Step 4: Apply Platform Format Rules
- External link → first reply
- Video: upload natively, aim for 15–60 seconds
- Images: use, but secondary to the text/question hook
- Hashtags: 0–2 maximum
- Thread: front-load the hook; each post in a thread compounds engagement
- Optimal length: punchy (under 280) for standalone tweets; detailed for threads

---

## Content Strategy by Goal

**Goal: Maximum Retweets**
Write information people want to share. The tweet should make the sharer look smart, informed, or culturally aware. News, insights, useful data, frameworks, surprising facts. Avoid personal anecdotes (no one shares "I did X today").

**Goal: Maximum Replies**
Ask questions. Take clear positions. Create gentle controversy within your niche. The goal is to make NOT replying feel like leaving something unsaid. "What's your take?" at the end of a strong opinion almost always outperforms a standalone statement.

**Goal: Maximum Bookmarks**
Make content that's *useful later*, not just interesting now. Tutorials, lists, checklists, formulas, data sets, templates. These get bookmarked even when the person doesn't have time to engage fully.

**Goal: Audience Growth (TweepCred + SimCluster)**
Consistency in one topic over time. Engage authentically with accounts in your target community. Respond to comments from high-TweepCred accounts — those interactions lift your score. Build reply relationships before you need them.

---

## Tweet Scoring Rubric

Use this when auditing a tweet before posting:

| Factor | Score 0–3 | Key Question |
|--------|-----------|-------------|
| Hook strength | 0–3 | Would someone stop scrolling for this? |
| Engagement trigger | 0–3 | Does it invite reply, retweet, or bookmark? |
| SimCluster clarity | 0–3 | Is it immediately clear what community this is for? |
| Penalty check | 0–3 | Any links in main post? Too many hashtags? Offensive framing? |
| Author response potential | 0–3 | Will replies give you something worth responding to? |
| Retweet utility | 0–3 | Will someone's followers benefit from seeing this? |

**Total /18:**
- 15–18: Strong — post it
- 10–14: Optimize before posting — identify the weakest factor
- Under 10: Rewrite from scratch with a clearer goal

---

## Worked Optimizations

### Example 1: The Vague Statement

**Original:**
> "I fixed a bug today"

**Audit:** No audience, no engagement trigger, no SimCluster signal, no retweet value. Score: 2/18.

**Optimized:**
> "2 hours debugging a production issue.
>
> The culprit: I was comparing a string to an integer and Python silently returned False.
>
> Lesson: type-check at the boundary, not mid-logic.
>
> What's the dumbest bug that ever cost you real time? 👇"

**Why it works:**
- SimCluster: Python/engineering community
- Engagement trigger: Direct question invites replies
- Retweet value: "Lesson:" structure makes it shareable wisdom
- Bookmark potential: Debugging tip people want to save
- Author response opportunity: Easy to engage with every reply

---

### Example 2: The Link Post

**Original:**
> "We launched PDF export today. Check it out: [link]"

**Audit:** External link kills 30–50% of reach immediately. Passive CTA. No engagement trigger. Score: 4/18.

**Optimized (main post — no link):**
> "Our most-requested feature for 18 months finally shipped.
>
> PDF export with custom branding, 10x faster than the workaround everyone was using.
>
> What report format should we build next?"

**First reply (posted immediately after):**
> "Full details + walkthrough here: [link]"

**Why it works:**
- Main post has no link → full algorithmic distribution
- Question drives replies → real-graph engagement
- "Most-requested for 18 months" signals community responsiveness → retweet value
- Link buried in first reply → still accessible, doesn't kill the post

---

### Example 3: The Opinion Tweet

**Original:**
> "Remote work is better than office work"

**Audit:** No position (statement not argument), no SimCluster target, no engagement trigger. Score: 5/18.

**Optimized:**
> "Hot take: async-first companies aren't actually remote.
>
> They're just offices without commutes. Same sync culture, same 9-5, same interruptions.
>
> True remote = async by default, sync by exception.
>
> Founders: which camp are you building?"

**Why it works:**
- Clear, arguable position → invites replies from both camps
- "Founders:" SimCluster targeting — reaches startup/leadership cluster
- Distinction between "remote" and "async-first" → retweet value (people want to share this distinction)
- Question at end → direct engagement trigger
- Takes a real stance → author has something to reply to in discussion

---

## Anti-Patterns Reference

| Pattern | Why It Fails | Fix |
|---------|-------------|-----|
| "Check out my [link]" | External link penalty + passive CTA | Compelling standalone post, link in first reply |
| "Like if you agree" | Engagement bait damages TweepCred over time | Genuine question that earns replies |
| 5+ hashtags | 40% reach reduction | 0–2 max, or none |
| Generic statement (no hook) | No reason to stop scrolling | Lead with the surprising/useful/debatable thing |
| Posting then disappearing | No author replies = missed 75x multiplier | Block 30 min after posting to respond to early replies |
| Topic-hopping | Confuses SimCluster + TwHIN identity | Stay in your lane; build topical authority |
| Vague "I think X is interesting" | No engagement trigger, no position | Take a real stance or ask a real question |
| "RT and follow for a chance to..." | Looks automated; likely engagement-bait detection | Don't. Build real credibility instead. |
| Scheduling without timing research | Misses the 2-hour engagement window | Post when your specific audience is most active |

---

## Quick-Reference Cheat Sheet

**Always do:**
- Put links in the first reply, not the main post
- Respond to every reply within 2 hours (75x multiplier)
- End opinions with a question
- Front-load the most interesting thing (Grok evaluates full content, but humans need a hook)
- Upload video natively

**Never do:**
- External links in main post
- More than 2 hashtags
- "RETWEET IF..." or "Like if you agree" 
- Post controversial content that will get reported (80% reach reduction is permanent damage)
- Post-and-ghost (disappearing after posting kills the reply-chain multiplier)

**Engagement priority order:**
1. Trigger reply → respond back (75x)
2. Trigger retweet (20x)
3. Trigger bookmark (10x)
4. Trigger profile click (12x)
5. Trigger like (1x — weakest, don't optimize specifically for this)

---

## When to Use This Skill vs. Not

**Use this skill when:**
- You've drafted a tweet and want to maximize reach before posting
- A tweet underperformed and you want a diagnostic explanation
- You're launching something important and want algorithmic advantage
- You're building topical authority in a specific niche
- You want to understand *why* the algorithm behaves as it does
- You're auditing a content strategy for X

**Skip this skill when:**
- Writing casual personal tweets where reach doesn't matter
- Fixing grammar or tone unrelated to algorithmic performance
- Creating content for LinkedIn, Medium, or other platforms
- The goal is authentic self-expression with no reach expectations
