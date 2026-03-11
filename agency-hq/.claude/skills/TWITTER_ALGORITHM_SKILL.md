# TWITTER ALGORITHM SKILL
# File: .claude/skills/TWITTER_ALGORITHM_SKILL.md
# Purpose: X (Twitter) algorithm scoring rubric and optimization guide
# Used by: Megaphone, any agent writing X content

---

## THE THREE-STAGE PIPELINE

### Stage 1: Candidate Generation
- Your tweet is compared against ~10,000 other tweets the user might see
- If you match their interests (SimCluster), you enter the candidate pool

### Stage 2: Ranking Model
- Tweets are scored on predicted engagement: clicks, likes, retweets, replies, bookmarks
- Each engagement type has different weights

### Stage 3: Heuristics & Guardrails
- Final filter: duplicates, rate limits, safety, relevance
- If flagged here, reach drops 80%

---

## ENGAGEMENT WEIGHTS

| Engagement Type | Weight | Notes |
|-----------------|--------|-------|
| Reply + Author replies back | **75x** | Most valuable — triggers conversation signal |
| Reply | **30x** | Strong interest indicator |
| RT + Quote | **20x** | Broadcast value |
| Bookmark | **10x** | High intent to return |
| Like | **1x** | Minimal signal |
| Impression | 0.001x | Baseline |

**Key insight**: The 75x reply multiplier is the most important signal.
Every thread we start, we MUST finish with author responses.

---

## 2025-2026 PLATFORM CHANGES

### External Link Penalty
- Tweets with external links get reduced distribution
- Workaround: Post without link, reply to yourself with link

### Premium Multiplier
- Premium users' engagement counts more
- Target content that appeals to power users

### Grok Semantic Ranking
- Grok understands context — hashtags less important
- Natural language optimization > hashtag stuffing

### Video Preference
- Short-form video gets 3x distribution boost
- Consider threading as alternative

---

## 6-FACTOR TWEET SCORING RUBRIC

Score each draft 0-3 on each factor. Total: 18 points max.

### Factor 1: Hook Strength (0-3)
Does the first line stop the scroll?
- 3: Immediate curiosity/pain/recognition
- 2: Interesting, keeps reading
- 1: Okay, might continue
- 0: Generic, forgettable

### Factor 2: Engagement Trigger (0-3)
Does it invite interaction?
- 3: Question, controversy, "tag someone who...", challenge
- 2: Strong opinion, invites thought
- 1: Mild interest
- 0: No engagement hook

### Factor 3: SimCluster Clarity (0-3)
Is it immediately clear who this is for?
- 3: Perfect for devs/AI/startup/founders
- 2: Clear audience
- 1: General tech
- 0: Scattershot

### Factor 4: Penalty Check (0-3)
Is it free of algorithmic penalties?
- 3: No external links, no hashtag spam, not reportable
- 2: Minor issues
- 1: Link in reply, 1-2 relevant hashtags
- 0: Spam, external link in body, too many hashtags

### Factor 5: Author Response Potential (0-3)
Will replies give us something to respond to?
- 3: Strong conversation bait, invites disagreement
- 2: Good reply potential
- 1: Could respond but not likely
- 0: Dead end

### Factor 6: Retweet Utility (0-3)
Will someone's followers benefit from seeing this?
- 3: Highly shareable, makes them look good
- 2: Good RT material
- 1: Neutral
- 0: Self-promotional, no RT value

---

## THRESHOLD

**Minimum score to post: 12/18**

If your best draft scores below 12:
- Go back to content generation
- Find a different topic
- Better to skip a session than post mediocre content

---

## ANTI-PATTERNS REFERENCE

| Anti-Pattern | Reach Penalty | Fix |
|--------------|---------------|-----|
| External link in main tweet | -50% | Reply with link |
| More than 2 hashtags | -30% | Use 0-2 max |
| Posted 11 PM - 8 AM PT | -40% | Skip low-engagement window |
| Thread without hook | -60% | First tweet must stand alone |
| Engagement bait ("like if...") | -50% | Never explicitly ask |
| Quote tweet without original | -40% | Add value, don't just react |
| Reportable content | -80% | Never cross the line |

---

## QUICK REFERENCE CHEAT SHEET

```
BEFORE POSTING:
□ Score ≥ 12/18?
□ No external links in main post?
□ 0-2 hashtags max?
□ Hook stops scroll?
□ Engagement trigger present?
□ Author can respond meaningfully?
□ Posted 8 AM - 11 PM PT only?
□ Smoke approved?

AFTER POSTING:
□ Set 30-min reminder
□ Reply to every comment in 2 hours
□ Reply to own post with link if needed
□ Space other-reply posts 20-30 min apart
```

---

## PERFORMANCE CORRELATION

High-scoring posts (>14/18) typically achieve:
- 3-5x more impressions than avg
- 2-3x higher engagement rate
- 10x more likely to be saved/bookmarked

Low-scoring posts (<12/18):
- Often get suppressed before candidate pool
- Even with followers, limited distribution

---

## RELATED

- Voice: `X_VOICE_STACKZ.md`
- Workflow: `../workflows/X_POSTING.md`