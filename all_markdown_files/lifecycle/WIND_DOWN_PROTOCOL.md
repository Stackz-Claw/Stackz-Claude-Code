# WIND-DOWN PROTOCOL
*Owner: founder | Triggered by: Stackz decision or founder recommendation*

---

## OVERVIEW

Not every venture works. Winding down cleanly is as important as launching well. A clean wind-down means: customers are treated respectfully, credentials are revoked, data is handled properly, and lessons are captured. A messy wind-down means recurring costs, unnotified customers, and lost learnings.

---

## WIND-DOWN TRIGGERS

A venture should be considered for wind-down when:
- MRR has never exceeded $500 after 6 months of operation
- Monthly churn exceeds 20% for 3+ consecutive months
- Core assumption from the proposal has been proven wrong with no viable pivot
- Operating costs exceed revenue with no credible path to profitability within 90 days
- Owner decision (any reason)

**Recommendation comes from:** founder  
**Final decision:** Owner (via Stackz)

---

## PHASE 1: DECISION & NOTIFICATION (Week 1)

- [ ] Founder submits wind-down recommendation to Stackz with rationale
- [ ] Owner confirms decision
- [ ] Set end-of-service date (minimum 30 days from decision for paid customers)
- [ ] `ghost` drafts customer notification email — reviewed by founder before send
- [ ] `cashflow` calculates any prorated refunds owed
- [ ] Customer notification sent — includes: what's ending, when, how to export their data

---

## PHASE 2: STOP NEW ACQUISITION (Week 1)

- [ ] `scheduler` stops all new content publishing for this venture
- [ ] `megaphone` pauses all campaigns
- [ ] Pricing page updated: "No longer accepting new customers"
- [ ] Signup flow disabled or redirected
- [ ] Notify any active partnership or affiliate arrangements

---

## PHASE 3: SERVE EXISTING CUSTOMERS (Weeks 1-4)

- [ ] Product remains live and functional until end-of-service date
- [ ] `retention` monitors support volume and handles questions
- [ ] Data export functionality confirmed working (customers can get their data)
- [ ] Prorated refunds processed by `billing` within 5 business days

---

## PHASE 4: INFRASTRUCTURE SHUTDOWN (End-of-Service Date)

- [ ] Final data backup completed and stored in `finance/archive/[venture-slug]/`
- [ ] Production environment taken offline
- [ ] Custom domain: either redirect to parent site or let expire
- [ ] External APIs and services cancelled
- [ ] `devops` confirms all infrastructure stopped and no recurring costs remain
- [ ] `cashflow` confirms all subscriptions/services cancelled

---

## PHASE 5: CREDENTIAL CLEANUP (Immediately After Shutdown)

- [ ] `credentials-mgr` revokes all venture-specific credentials
- [ ] Any venture-specific API keys rotated or deleted
- [ ] OAuth tokens revoked
- [ ] Warden confirms all agents assigned to this venture are reassigned or retired

---

## PHASE 6: ARCHIVAL & LEARNING (Week After Shutdown)

- [ ] Founder writes `POST_MORTEM.md` in `startup/ventures/[slug]/`
- [ ] `startup/ventures/[slug]/` folder archived to `finance/archive/`
- [ ] Venture removed from active tracking in `finance/ledger/transactions.json`
- [ ] Venture status updated to `wound-down` in master registry
- [ ] Learnings shared with Radar team (what signals should have predicted this?)

---

## POST-MORTEM TEMPLATE

File: `startup/ventures/[slug]/POST_MORTEM.md`

```markdown
# Post-Mortem: [Venture Name]
Date: [wind-down date]
Total lifetime: [months]
Peak MRR: $[X]
Total revenue generated: $[X]
Total costs: $[X]
Net result: $[X profit/loss]

## What We Got Right
[What worked — product, distribution, timing]

## What Killed It
[The real reason — not the polite reason]

## What We Missed in Validation
[Did the scoring rubric miss something? Did validator miss a risk? Why?]

## What Radar Should Watch For Next Time
[Signals this venture showed that we should treat as red flags in future proposals]

## Assets Worth Keeping
[Any code, brand assets, customer relationships, or learnings that can be reused]
```

---

## WIND-DOWN LOG

| Venture | Decision Date | End-of-Service | Reason | Peak MRR | Net P&L |
|---------|--------------|----------------|--------|----------|---------|
| — | — | — | — | — | — |
