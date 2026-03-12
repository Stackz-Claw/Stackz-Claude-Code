# CAMPAIGN SPEND SKILL
# How Stackz and Megaphone manage marketing and launch campaigns financially.

---

## THE CAMPAIGN FRAMEWORK

Every campaign has a budget, a hypothesis, a measured result.
No campaign is "awareness only." Every campaign has a funnel endpoint.

Campaign types:
- LAUNCH: new product or venture going to market
- GROWTH: scaling a working acquisition channel
- EXPERIMENT: testing a new channel or message hypothesis
- RETENTION: re-engaging existing users or leads

---

## CAMPAIGN AUTHORIZATION LEVELS

| Type | Budget | Authorized By | Pool |
|------|--------|--------------|------|
| EXPERIMENT | ≤ $100 | Stackz alone | Growth |
| EXPERIMENT | $100–500 | Stackz + Smoke | Growth |
| LAUNCH | ≤ $500 | Stackz + Smoke | Growth |
| LAUNCH | $500–$2,000 | Stackz + Smoke + Jaleel brief | Growth |
| LAUNCH | > $2,000 | Jaleel explicit approval | Growth |
| GROWTH (scaling) | Any | Jaleel explicit approval | Growth |

---

## CAMPAIGN CREATION PROTOCOL

Before any campaign spend:

```
1. WRITE CAMPAIGN BRIEF
   File: Agency HQ/Campaigns/<date>-<campaign-slug>/brief.md

   Required fields:
   - Hypothesis: "If we [action], we expect [result] because [reason]"
   - Target audience: who we're reaching
   - Channel: X Ads, Meta, Google, email, other
   - Budget: total and daily cap
   - Duration: start date → end date (hard cap)
   - Success metric: what number proves this worked
   - Minimum threshold: what result justifies the spend
   - Pool source: which pool, current balance, post-spend projected balance
   - Multiplier: projected return / campaign cost

2. SMOKE CO-SIGN (all campaigns, no exceptions)
   Pass brief.md to SMOKE_REVIEW.
   Smoke checks: multiplier, pool safety, vendor approval, pattern check.

3. IF JALEEL BRIEF REQUIRED (see table above):
   Write to Agency HQ/Briefings/pending-approval-<date>.md
   Wait for explicit approval before spending.

4. EXECUTE
   Megaphone sets up the campaign using X MCP or approved ad platform.
   Stackz funds the campaign using stackz-growth or stackz-launch card.

5. MONITOR (daily, automated)
   GET campaign metrics from platform API or Megaphone activity log.
   Log daily in: Agency HQ/Campaigns/<slug>/daily-log.md
   Check: is the campaign hitting the minimum threshold?
   If after 3 days: spend > 30% of budget AND conversions = 0 → PAUSE.
   Write Smoke review note. Wait for verdict before resuming.

6. CLOSE AND MEASURE
   At campaign end:
   - Calculate actual_multiplier = (revenue_attributed / total_spend)
   - Write campaign post-mortem: Agency HQ/Campaigns/<slug>/post-mortem.md
   - If actual_multiplier >= 2.0: mark channel as VALIDATED
   - If actual_multiplier < 1.0: mark hypothesis as DISPROVED
   - Archive learnings as Zettelkasten permanent note
   - Update COMPLETION_MATRIX campaign tracking row
```

---

## LAUNCH CAMPAIGN SEQUENCE (new product going to market)

This is the full sequence Stackz runs when a venture is ready to launch:

```
PRE-LAUNCH (T-7 days):
- Confirm Stripe payment link is live and tested
- Confirm landing page is live (or X profile is optimized)
- Smoke reviews the full launch brief
- Jaleel brief sent if budget > $500

SOFT LAUNCH (T-0, Day 1-3, 20% of budget):
- Megaphone posts launch thread on X (organic first)
- Monitor organic reach for 24h before paid amplification
- If organic engagement > baseline: proceed to paid
- If organic flat: pause and revise message before paying

PAID AMPLIFICATION (Day 4-14, 60% of budget):
- Boost best-performing organic content
- Run targeted ads to validated audience segments
- Daily monitoring: conversions, CPA, ROAS
- Pause any ad set with 0 conversions after $50 spend

SCALE OR KILL (Day 15, 20% of budget):
- If ROAS > 2.0: scale winning ad sets with remaining budget
- If ROAS < 1.0: kill campaign, write post-mortem
- If ROAS 1.0-2.0: optimize copy/creative, one more 7-day test

POST-LAUNCH:
- Cashflow logs all revenue in reconciliation
- Campaign post-mortem written
- Successful channels promoted to GROWTH tier
```