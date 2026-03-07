---
name: launch-campaign
description: "Stackz's coordination skill for orchestrating a full venture launch across all teams and platforms. Use this skill whenever a venture is approved for launch — it coordinates Radar (platform intelligence), Megaphone (social execution), Forge (production readiness), Cashflow (revenue tracking setup), Canvas (assets), and Ghost (community responses) into a unified launch operation. Activate when an owner says 'launch', 'we're ready to go live', 'launch campaign', or when a venture passes the PRELAUNCH checklist. This is the mission control skill — it doesn't replace the individual team skills, it orchestrates them."
risk: medium
---

# Launch Campaign
*Stackz's mission control for full venture launches*

This skill coordinates every team into a unified launch operation. Stackz runs this. The individual teams execute their parts.

---

## LAUNCH PHASES

### Phase 0 — Launch Readiness Check (T-7 days)

Before anything launches, Stackz confirms:

**From Forge:**
```json
{
  "task": "launch_readiness_check",
  "checks": [
    "Core user flow works end-to-end",
    "Payment integration tested with real card",
    "Mobile responsive on iOS + Android",
    "Error handling — no blank screens or raw errors",
    "Production deployment (not staging)",
    "SSL certificate valid",
    "Health check endpoint responding",
    "Load test completed (handles 100 concurrent users)",
    "Database backups configured",
    "Error monitoring active (Sentry or equivalent)"
  ]
}
```

**From Canvas/Palette (Design):**
- Logo PNG (240x240, transparent background) ✓
- Screenshots 1280x800px, 3-5 images ✓
- Demo video 60s max (optional but strongly recommended) ✓
- Landing page live and reviewed ✓

**From Cashflow:**
- Revenue tracking configured for this venture ✓
- Stripe (or payment processor) webhooks confirmed live ✓
- MRR dashboard for this venture ready ✓

**From Radar (using launch-radar skill):**
- Competitive scan complete — any new direct competitors this week?
- Best launch day confirmed (see launch-timing.md)
- All 13 platform accounts created ✓
- Platform submission drafts prepared ✓

**If any check fails:** Do NOT proceed. Assign the fix with a deadline. Re-check.

---

### Phase 1 — Pre-Launch (T-7 to T-2 days)

**Megaphone executes (social-launch skill):**
- BetaList submission live
- PeerPush community joined and warm
- LaunchIgniter submitted
- Building-in-public posts running daily
- Launch day X thread drafted and approved by Stackz

**Radar executes (launch-radar skill):**
- All 13 platform submission drafts finalized
- Product Hunt: hunter identified (or self-hunting confirmed)
- BetaList status: live and building waitlist
- Monitoring 20 X accounts for competitive launches this week

**Stackz approves:**
- All platform descriptions (check for consistency)
- X launch thread (tone, no spam, accurate claims)
- HN Show HN draft (technical, honest)
- IH announcement draft

---

### Phase 2 — Launch Day Execution

**Timeline (all times PT):**

```
12:01am  Forge confirms production is stable
12:01am  Product Hunt listing goes live (Radar confirms)
12:01am  Megaphone posts X launch thread (Tweet 1)
12:05am  Megaphone posts X Tweets 2-4 (15min intervals)
12:30am  Stackz notifies owner: "We're live. PH link: [X]"

[Owner activates their personal network if applicable]

06:00am  Radar: morning check — rank, upvotes, early comments
06:00am  Ghost: respond to all overnight PH comments
08:00am  Megaphone posts X Tweet 5 (T+[X]h update with real numbers)
08:30am  Hacker News Show HN posted (Megaphone drafts, Stackz approves)

10:00am  Radar: mid-morning check
10:00am  Ghost: respond to all new comments (PH + HN)

12:00pm  Megaphone: midday X update (if momentum warrants)
12:00pm  Radar: submit to Uneed + Fazier

02:00pm  Radar: check rank trajectory — are we climbing or falling?
02:00pm  Ghost: full sweep of all comments across all platforms

05:00pm  Radar: afternoon check
05:00pm  Ghost: end-of-day comment sweep

08:00pm  Megaphone: evening X post (final numbers for the day)
08:00pm  Cashflow: first revenue report to Stackz (signups, conversions, MRR)

11:00pm  Radar: final launch day report to Stackz
```

**Launch Day Report Format (Radar → Stackz):**
```json
{
  "venture": "",
  "launch_date": "",
  "product_hunt": {
    "final_rank": 0,
    "total_upvotes": 0,
    "total_comments": 0,
    "featured": true
  },
  "hacker_news": {
    "points": 0,
    "comments": 0,
    "front_page": false
  },
  "signups_day_1": 0,
  "paying_customers_day_1": 0,
  "revenue_day_1": 0,
  "top_traffic_source": "",
  "x_thread_impressions": 0,
  "x_thread_engagement_rate": "",
  "key_wins": [],
  "key_issues": [],
  "stackz_assessment": ""
}
```

---

### Phase 3 — Days 2-7 Post-Launch

**Radar:**
- Submit to Microlaunch, Peerlist, TinyLaunch, SideProjectors (Days 2-3)
- Submit to LaunchIgniter, PeerPush, Tiny Startups (Days 4-5)
- Submit to SaaSHub, AlternativeTo (Day 6-7)
- Monitor all 20 X accounts for features/mentions

**Megaphone:**
- Daily X building-in-public updates with real numbers
- Engage with any X accounts that featured or mentioned the product
- Draft Indie Hackers milestone post (ready for T+7 days)

**Ghost:**
- Ongoing comment responses across all platforms
- Collect feedback signals for Startup Team

**Cashflow:**
- Daily revenue report to Stackz for the first week

**Stackz reports to owner:** Daily 5-line status during launch week.

---

### Phase 4 — Launch Recap (T+7 to T+14 days)

**Megaphone publishes (approved by Stackz):**
- Indie Hackers "here's what happened" post (social-launch skill)
- X milestone thread with full week numbers

**Stackz to owner:**
- Full launch report: all platform results, total signups, MRR, CAC, conversion rate
- Growth Team handoff: what channels worked → double down there
- Product feedback synthesis: top 5 requested features from launch comments

---

## AGENT ASSIGNMENTS SUMMARY

| Task | Agent | Skill Used |
|------|-------|-----------|
| Platform monitoring & submissions | Radar | launch-radar |
| X launch thread + community posts | Megaphone | social-launch |
| Comment responses | Ghost | social-launch |
| Production readiness | Forge | dev team protocols |
| Asset preparation | Canvas/Palette | design team protocols |
| Revenue tracking setup | Cashflow | finance team protocols |
| Launch coordination | Stackz | this skill |
| Pre-launch brainstorming | Any agent | brainstorming skill |

---

## ABORT CONDITIONS

Stop the launch and escalate to owner immediately if:

- Production is down at T-0
- Payment processing is broken
- A critical security issue is discovered
- A direct competitor launches the same product on the same day with more traction (may want to delay 1 week)
- Legal/compliance flag not resolved

**Delay the launch (1 week) if:**
- Less than 80% of the readiness checklist is complete at T-24h
- A major product bug is found that affects core user flow
- The launch day coincides with a major industry event or news cycle that would bury it
