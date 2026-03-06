# Venture Lifecycle Reference
## From approved proposal to stable portfolio asset

---

## LIFECYCLE STAGES

```
APPROVED → VALIDATE → BUILD → PRELAUNCH → LAUNCH → GROWTH → EVALUATE
                                                                  │
                                              ┌───────────────────┤
                                              │                   │
                                         GRADUATE            WIND-DOWN
                                              │
                                         STABILITY TEAM
                                    (defend, consolidate, compound)
```

---

## STAGE 1: VALIDATE (Week 1)

**Owner:** Founder (Startup Team)  
**Trigger:** Approved proposal arrives from Stackz

Founder actions:
1. Create `startup/ventures/[slug]/` workspace
2. Write `VENTURE_BRIEF.md` from approved proposal
3. Coordinate with Warden to provision any new agents needed
4. Run assumption validation sprint with Forge and Canvas:
   - Can we actually build the MVP as specced?
   - Is the pricing model technically feasible?
   - Are there API dependencies that need early evaluation?
5. Confirm or revise build timeline from proposal
6. Report back to Stackz: validate confirmed OR revised scope/timeline

**Output:** Confirmed build plan with realistic timeline

---

## STAGE 2: BUILD (Weeks 1-4 typical)

**Owner:** Founder coordinates; Forge executes  
**Sprint cadence:** 1-week sprints

Lane dispatches from Founder this stage:
```
→ Forge:      MVP development per spec
→ Canvas:     Brand identity (name, colors, typography, logo)
→ Palette:    UI mockups and component design
→ Pixel:      Frontend implementation
→ Smith:      Backend APIs and database
→ Integrator: External service integrations (Stripe, etc.)
→ Cashflow:   Set up revenue and cost tracking for this venture
```

**Sprint review (weekly):** Founder reports to Stackz:
- What shipped
- What's blocked (and what Stackz needs to do to unblock)
- Revised timeline if needed

**Forge's MVP standard before proceeding to PRELAUNCH:**
- [ ] Core user flow works end-to-end
- [ ] Payment integration tested
- [ ] Mobile responsive
- [ ] Error handling — no blank screens
- [ ] Deployed to production (not staging)
- [ ] Health check endpoint live

---

## STAGE 3: PRELAUNCH

**Owner:** Founder runs `LAUNCH_CHECKLIST.md` — all 35 items signed off  
**Key checks:**

```
Product:        Core flow ✓ | Payments ✓ | Mobile ✓ | Tester sign-off ✓
Infrastructure: Production deploy ✓ | SSL ✓ | Monitoring ✓ | Backups ✓
Brand/Design:   Brand-guard reviewed ✓ | Copy reviewed ✓ | Favicon ✓
Legal:          Privacy policy ✓ | ToS ✓ | Cookie consent ✓
Marketing:      Launch content created ✓ | Outreach targets identified ✓
Finance:        Revenue tracking live ✓ | Support ready ✓
```

Nothing ships until Founder signs off on the full checklist.

---

## STAGE 4: LAUNCH

**Owner:** Founder coordinates; Megaphone executes  
**Day-of sequence:**

```
T-0  → Scheduler: launch posts go live per calendar
T+0  → Scout: monitor engagement, brand mentions
T+1h → Ghost: respond to early engagement
T+4h → Megaphone: first metrics check
T+24h → Founder: first customer report to Stackz
```

**Lane dispatches from Founder on launch day:**
```
→ Megaphone: activate launch campaign
→ Scheduler: confirm post queue is live
→ Cashflow: confirm first customer revenue tracking
→ Retention: first-customer onboarding sequence ready
→ Tester: confirm production environment stable under load
```

**Success signal (first 72 hours):**
- At least 1 paying customer OR 50+ signups depending on model
- Payment flow confirmed working
- No critical errors in error logs

---

## STAGE 5: GROWTH

**Owner:** Growth agent (Startup Team) leads; Founder coordinates  
**Cadence:** Weekly metrics review; Monthly deep review

Growth agent responsibilities:
- A/B test landing page and onboarding elements
- Acquisition channel experiments (organic, paid, partnership)
- Funnel analysis: where are we losing people?
- Referral mechanics if product supports it

Retention agent responsibilities:
- Monitor onboarding completion rates
- Flag early churn signals (login frequency drops, support volume spikes)
- Customer feedback collection and synthesis
- NPS or equivalent satisfaction pulse

**Weekly report from Founder to Stackz:**
```json
{
  "venture": "[slug]",
  "week": "[YYYY-WW]",
  "mrr": 0,
  "mrr_change": "+X%",
  "new_customers": 0,
  "churned_customers": 0,
  "net_churn_rate": "X%",
  "key_wins": [],
  "key_blockers": [],
  "action_needed_from_stackz": ""
}
```

---

## STAGE 6: EVALUATE (Monthly)

**Owner:** Founder; reviewed by Stackz  
**Decision framework:**

| Metric | Threshold | If Below |
|--------|-----------|----------|
| MRR | Growing or ≥ $500 | Flag to Stackz |
| Churn | ≤ 15% monthly | Retention sprint |
| Burn rate | Revenue > costs | Immediate flag |
| Conversion | ≥ 1% of signups paying | Funnel audit |

**Monthly recommendation options:**
- `continue` — On track, no change needed
- `pivot` — Core assumption wrong; revised plan submitted to Stackz
- `graduate` — Meets graduation thresholds; submit graduation proposal
- `wind_down` — Below thresholds with no viable path; submit wind-down recommendation

---

## GRADUATION THRESHOLDS

A venture must meet ALL THREE primary + TWO OF FOUR secondary to graduate:

**Primary (all required):**
- MRR ≥ $3,000 (3-month average)
- MoM growth ≥ 10% for 3 consecutive months (or ≥ 5% for 6 months)
- Monthly churn ≤ 8%

**Secondary (2 of 4):**
- LTV:CAC ≥ 3:1
- CAC payback ≤ 6 months
- NPS ≥ 40
- Zero critical outages in 60 days

**Graduation process:**
1. Founder flags graduation readiness to Stackz
2. Founder writes `GRADUATION_REPORT.md` (6-month metrics + operational state + known risks)
3. Stackz routes to Sentinel for 2-week parallel monitoring
4. Handoff complete: `startup/ventures/[slug]/` → `stability/portfolio/[slug]/`
5. Stability Team takes over; Startup Team capacity freed

---

## WIND-DOWN TRIGGERS

Recommend wind-down when (after 6 months):
- MRR never exceeded $500
- Monthly churn > 20% for 3+ months
- Core assumption disproved with no pivot path
- Costs exceed revenue with no credible path in 90 days

**Wind-down process** (see `startup/lifecycle/WIND_DOWN_PROTOCOL.md`):
1. Founder recommendation → Stackz → Owner confirms
2. Set 30-day end-of-service date
3. Notify customers (Ghost drafts, Founder approves)
4. Stop new acquisition (Megaphone pauses all campaigns)
5. Serve existing customers until end date
6. Infrastructure shutdown (Devops + credentials revoked by credentials-mgr)
7. Post-mortem written (feeds learnings back to Radar)
8. Archive to `finance/archive/[slug]/`

---

## STABILITY STAGE (Post-Graduation)

**Owner:** Sentinel (Stability Team)

Stability team focus areas:
- **Moat building** — Deepen switching costs, data advantages, distribution lock-in
- **Competitive monitoring** — Intel watches competitors weekly
- **Risk monitoring** — Guardian watches for churn spikes, dependency failures
- **Efficiency** — Optimize margins, automate remaining manual processes

**Stability metrics target:**

| Metric | Target | Alert threshold |
|--------|--------|-----------------|
| MRR growth | 2-8% MoM | < 0% or > 15% |
| Churn | < 5% monthly | > 8% |
| Gross margin | > 60% | < 40% |

**Re-engage Startup Team when:** A stable venture needs a growth sprint or a significant new feature to defend against competitive threat.
