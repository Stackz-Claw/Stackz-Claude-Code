# X POSTING WORKFLOW
# File: .claude/workflows/X_POSTING.md
# Cron: 0 9,14,19 * * * (9 AM, 2 PM, 7 PM PT — optimal windows)
# Agent: Megaphone (content) + Stackz (strategic direction)
# Note: Smoke approval bypassed - Megaphone has full authority to post
# MCP servers: x-mcp-server, obsidian-vault-mcp, brave-search
# Skills: X_VOICE_STACKZ.md, TWITTER_ALGORITHM_SKILL.md

---

## PURPOSE

Megaphone runs three times a day. Each session: observe the timeline,
find the angle, write content that earns attention, get Smoke to approve it,
post it, and stay in the replies for the first window.

This is not a content scheduler. This is a character operating in public.
Every post must feel like it was written by someone who was paying attention
right now — not queued three days ago.

---

## PRE-SESSION LOAD

Before any content work:

```
1. Load .claude/skills/X_VOICE_STACKZ.md
   → Know the voice, the phases, the comedy mechanics

2. Load .claude/skills/TWITTER_ALGORITHM_SKILL.md
   → Know the scoring rubric and penalties

3. Check current phase:
   Read: Agency HQ/X/current-phase.md
   → Phase 1: comedy only
   → Phase 2: comedy + build in public
   → Phase 3: authority + results

4. Check today's posts:
   Read: Agency HQ/X/posts/<today>-*.md (any files for today)
   → Don't post the same mode twice in a row
   → If morning post was confession, afternoon should be list/observation

5. Check last 7 days performance:
   Read: Agency HQ/X/weekly-analysis-*.md (most recent)
   → What formats performed best this week?
   → What community got the most engagement?
   → Any patterns to repeat or avoid?
```

---

## PHASE 1: TIMELINE INTELLIGENCE
*Time: 10 minutes*

```
GOAL: Know what's happening right now in the target communities.
Don't post into a vacuum. Post into the conversation.

1. Search X for trending content (via x-mcp-server):
   - Search: "developer" — sort by engagement — top 10
   - Search: "AI agent" — sort by engagement — top 10
   - Search: "startup" — sort by engagement — top 10
   - Search: "indie hacker" — sort by engagement — top 10

2. Search brave for what's happening in tech:
   - Query: "developer AI news today"
   - Query: "startup funding announcement today"
   - Look for: something absurd, something everyone's reacting to,
     something that has a comedy angle we haven't seen yet

3. Identify the 2-3 most interesting topics right now:
   For each topic, ask:
   - Is there a heretic take we genuinely believe?
   - Is there a specific absurd truth about this?
   - Does anything in our actual build right now rhyme with this?
   - Which of our 5 comedy mechanics fits?

4. Write intelligence summary to working memory:
   {
     trending_topics: [],
     best_angle: "",
     comedy_mode: "",
     community_target: "",
     related_to_our_build: true/false
   }
```

---

## PHASE 2: CONTENT GENERATION
*Time: 15 minutes*

```
GOAL: Three drafts of the main post. Select the best one.

For the selected topic and angle:

DRAFT 1 — Primary mode
  Write the post in the comedy mode that best fits the topic.
  No overthinking. Write it as the character, not as a marketer.
  Target length: 1-8 lines (shorter is usually better)

DRAFT 2 — Alternative format
  Same topic, different comedy mechanic.
  If draft 1 was a list, draft 2 is a confession.
  If draft 1 was a false authority, draft 2 is an honest witness.

DRAFT 3 — Our-build angle (if applicable)
  If we have something from our actual build process that connects:
  write the post as a window into what's happening with the swarm.
  This only works when it's real. Don't force it.

SCORE EACH DRAFT on the 6-factor rubric (0-3 each):

  Hook strength (0-3): Does the first line stop the scroll?
  Engagement trigger (0-3): Does it invite reply, RT, or bookmark?
  SimCluster clarity (0-3): Is it immediately clear who this is for?
  Penalty check (0-3): No external links, no hashtag spam, not reportable?
  Author response potential (0-3): Will replies give us something to respond to?
  Retweet utility (0-3): Will someone's followers benefit from seeing this?

  THRESHOLD: Only post if best draft scores ≥ 12/18
  If no draft scores ≥ 12: go back to Phase 1, find a different topic.
  Better to skip a session than post something mediocre.

SELECT the highest-scoring draft.
If two are tied: pick the one that's more specific.
Specific always beats general on X.
```

---

## PHASE 3: REPLY STRATEGY
*Time: 5 minutes*

```
GOAL: Plan the engagement, not just the post.

1. Identify 3-5 accounts to reply to TODAY (not just post):
   - Find posts in the target communities with high engagement
   - Our reply should add something: a funnier observation, a genuine disagreement,
     a "yes and" that extends their point
   - The reply should work as a standalone — people click profiles from good replies
   - This is how we get out-of-network exposure without ads

2. Write the replies now (draft quality):
   - Don't post yet — post after the main post lands
   - Posting replies to other accounts right after our main post looks like flooding
   - Space replies 20-30 minutes apart

3. Identify any trending threads to join:
   - Is there a thread getting massive engagement where we have something real to add?
   - Only join if we can add the funniest or most true reply in the thread
   - Don't reply just to exist in the thread. That's noise.
```

---

## PHASE 4: SELF-REVIEW (Optional)
*Time: 2 minutes*

```
GOAL: Quick sanity check before posting.

Run through the checklist:
  1. Does this sound like the account? (Voice check)
  2. Is there anything here that will get us reported? (Safety check)
  3. Does this burn any bridges we might need? (Strategy check)
  4. Algorithm score ≥ 12? (Performance check)

Note: Skip if score ≥ 14/18 — the algorithm rubric is the filter.

Post immediately if:
  - Score ≥ 14/18
  - No safety concerns
  - Different mode from today's previous posts
```

---

## PHASE 5: POST AND ENGAGE
*Time: 30 minutes active, then check every 15 minutes for 2 hours*

```
GOAL: Post, monitor early engagement, respond to everything in the first 2 hours.

POSTING:
1. Post the main tweet (no external links in body)
2. If a link is needed: immediately reply to own tweet with the link
3. If using hashtags: maximum 2, and only if they genuinely target a cluster
4. Set a 30-minute reminder to check replies

FIRST 30 MINUTES:
  Check impressions. If engagement rate < 1% of impressions after 30 min:
  → The post might not be getting distributed
  → Reply to the post with a follow-up thought to re-trigger the algorithm
  → Check if the hook was actually strong enough

REPLY ENGAGEMENT (for 2 hours after posting):
  Reply to EVERY reply on our post.
  Not a like. An actual reply.
  The 75x multiplier on reply-author-replies-back is the most important
  algorithmic signal on the platform. This is not optional.

  Reply principles:
  - Funnier than the original reply if possible
  - Genuine if we can't be funnier
  - Never defensive
  - Never dismissive — even bad-faith replies can be made funny
  - If someone is being an asshole: either ignore or make it funny
    (do not engage with genuine trolls — mutes/blocks damage TweepCred)

REPLY STRATEGY (other accounts):
  After our main post has been up 20-30 minutes:
  Post the replies we drafted in Phase 3.
  Space them out — one every 15-20 minutes.
  This creates a consistent presence in the communities
  without flooding any single thread.
```

---

## PHASE 6: LOGGING & ENGAGEMENT TRACKING
*Time: 5 minutes*

```
After posting, immediately log:

File: Agency HQ/X/posts/<YYYY-MM-DD>-<HH>-<slug>.md
(Use the template from X_VOICE_STACKZ.md logging section)

Include:
- Exact post text
- Algorithm score
- Comedy mode used
- Community target
- Tweet ID (from x-mcp-server response)

Set a reminder to update performance metrics 24 hours later.
```

---

## PHASE 7: OBSIDIAN ENGAGEMENT TRACKING
*Time: 5 minutes*

```
After posting and 2-hour engagement window, fetch engagement metrics:

1. Get tweet metrics via X API:
   - impressions
   - engagements (total)
   - retweets
   - replies
   - likes
   - bookmarks

2. Update the post log file with metrics:
   ```
   ## Performance (updated)
   impressions: <number>
   engagements: <number>
   replies: <number>
   retweets: <number>
   bookmarks: <number>
   likes: <number>
   engagement_rate: <engagements/impressions * 100>%
   ```

3. Write engagement summary to daily activity log:
   File: Agency HQ/X/daily/<YYYY-MM-DD>.md

   ```yaml
   ---
   date: <YYYY-MM-DD>
   ---

   ## X Activity Summary

   | Time | Tweet | Mode | Score | Impressions | Engagements | Eng. Rate |
   |------|-------|------|-------|-------------|-------------|-----------|
   | 9:07 AM | "..." | honest_witness | 16/18 | 1,234 | 89 | 7.2% |
   ```

4. Emit socket event for real-time UI update:
   - Event: `x:engagement`
   - Payload: { tweet_id, impressions, engagements, retweets, replies, likes, bookmarks }
```

---

## WEEKLY ANALYSIS (Every Sunday at 9 AM)

In the Sunday morning session, before generating content:

```
1. Read all post logs from the past 7 days:
   Agency HQ/X/posts/<last 7 days>-*.md

2. Calculate:
   - Best-performing post (by engagement rate)
   - Best-performing comedy mode
   - Best-performing community target
   - Posts that underperformed (what didn't work?)
   - Average algorithm score vs. actual performance (calibrating our scoring)
   - Total impressions this week
   - New followers this week (if trackable via x-mcp-server)

3. Write: Agency HQ/X/weekly-analysis-<YYYY-WXX>.md

   Include:
   - The one post that performed best and why
   - The one post that flopped and why
   - What we're doing differently next week
   - Phase assessment: are we ready to move to the next phase?
     (Phase 2 trigger: consistent engagement + first revenue)
     (Phase 3 trigger: recognized in communities + consistent MRR)

4. Brief Stackz on phase status
   → Does Stackz need to adjust the strategy?
   → Is there a product moment coming that should shift content?
```

---

## PHASE TRANSITION PROTOCOL

### Entering Phase 2 (Comedy → Comedy + Build in Public)

Trigger conditions (ALL must be true):
- At least one business model generating revenue
- Average post performing at ≥ 1,000 impressions
- 3+ months of consistent Phase 1 posting
- Stackz approves the transition

When transitioning:
1. Update: Agency HQ/X/current-phase.md → Phase 2
2. Megaphone reads the Phase 2 section of X_VOICE_STACKZ.md
3. First Phase 2 post should feel like a natural evolution, not a pivot
4. The comedy voice does NOT change. The content expands.

### Entering Phase 3 (Results + Authority)

Trigger conditions (ALL must be true):
- Consistent MRR across multiple ventures
- Recognized presence in target communities (replies, follower quality)
- 6+ months of consistent posting
- Jaleel approves the transition

When transitioning:
1. Update: Agency HQ/X/current-phase.md → Phase 3
2. The voice stays. The credibility now exists to make it stick.

---

## HARD RULES — NEVER VIOLATE THESE

```
🔴 NEVER post between 11 PM – 8 AM PT (low engagement window, off-character time)
🔴 NEVER attack a specific person — ideas and behaviors only
🔴 NEVER get political — stay in the lane
🔴 NEVER post something that will get us reported
🔴 NEVER ignore a reply in the first 2 hours (kills the algorithm signal)
🔴 NEVER put external links in the main post
🔴 NEVER post filler — silence is better than noise
🔴 NEVER let the account sound like a startup account trying to be funny

⚠️ ALWAYS run through the comedy mechanics — does this actually land?
⚠️ ALWAYS score before posting — below 12/18 means try again
⚠️ ALWAYS get Smoke approval before posting
⚠️ ALWAYS log every post
⚠️ ALWAYS check current phase before generating content
```