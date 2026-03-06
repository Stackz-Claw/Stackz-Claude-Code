# Mechanism Design & Pricing Strategy
## Auctions, Incentive Design & Pricing as a Strategic Weapon

---

## What Is Mechanism Design?

Mechanism design is "reverse game theory" — instead of analyzing a given game, you *design the rules* to produce a desired outcome, knowing how rational players will respond.

**Business applications**: Designing compensation structures, pricing models, auction formats, partner incentive programs, procurement processes, and any system where you set the rules that others play by.

**The revelation principle**: A well-designed mechanism can get participants to truthfully reveal their private information (valuation, type, effort level) through their self-interested choices. This is extraordinarily powerful — you don't need to trust anyone; you design incentives so honesty is the dominant strategy.

---

## Pricing as Game Theory

Pricing is a strategic act — it signals quality, shapes competitive dynamics, and determines which customers you attract.

### Price Discrimination

**First-degree (perfect)**: Charge each customer their exact willingness to pay. Captures all surplus. Rare in practice; approximated by negotiated enterprise deals.

**Second-degree (versioning)**: Offer multiple tiers; customers self-select. Airlines, SaaS tiers, freemium. The design of the options matters — you're engineering self-selection.

**Third-degree (segmentation)**: Charge different prices to identifiable groups (students, SMB vs. enterprise, geography). Requires ability to prevent arbitrage between segments.

**Design principle for SaaS tiers**: Each tier should be designed so that the ideal customer for that tier would not want to upgrade or downgrade. The middle tier typically captures the most value — design it around your most profitable customer profile.

### Skimming vs. Penetration

**Price skimming**: Launch high, lower over time. Appropriate when:
- Early adopters have high WTP and low price sensitivity
- You can capture early-adopter surplus before competitors enter
- Product cost decreases over time (technology goods)

**Penetration pricing**: Launch low, raise over time. Appropriate when:
- Network effects matter — users create value; you need volume fast
- Switching costs are high — cheap acquisition, expensive churn
- Market is price-elastic and incumbents are complacent

**Warning**: Penetration pricing is only a valid strategy if you have a credible path to sustainable unit economics. "Growth at all costs" pricing that never reaches margin is a slow burn, not a strategy.

### Psychological Pricing and Anchoring

In markets where buyers have uncertain valuations, anchoring shapes their perception of value:
- Present a high-priced option first to anchor the reference point
- Design pricing pages so the "right" option looks obviously sensible between a too-cheap and too-expensive option
- Annual pricing discount (10-20%) shifts cash flow and increases retention — both parties benefit

---

## Auction Theory

Auctions are mechanisms for price discovery when valuations are private and uncertain.

### Auction Formats

| Format | Mechanism | Best for |
|--------|-----------|----------|
| English (ascending) | Open bids; highest wins | When seller wants maximum price discovery; familiar to bidders |
| Dutch (descending) | Price drops until someone buys | Fast; used in flowers, fresh goods; encourages quick decisions |
| First-price sealed bid | Submit one bid; highest wins at their price | Encourages careful bidding; common in procurement/M&A |
| Second-price (Vickrey) | Highest bid wins but pays second-highest price | Dominant strategy is truthful bidding; reveals true valuations |

**The revenue equivalence theorem**: Under standard conditions, all four formats yield the same expected revenue. What differs is the distribution of that revenue and the information revealed.

### Vickrey Auctions and Truthful Bidding

The second-price auction has a remarkable property: bidding your true value is a **dominant strategy**. You can't do better by bidding higher or lower.

- If you bid higher than your value and win, you may pay more than it's worth to you
- If you bid lower, you may lose to someone who values it less than you

**Business application**: When designing internal procurement or allocation systems, Vickrey mechanisms produce honest valuations without negotiation. Used in Google's ad auction (generalized second-price), spectrum auctions, and some corporate capital allocation processes.

### Bidding Strategy in First-Price Auctions

When you bid your true value, you break even if you win. Rational strategy: **bid shading** — bid below your true value to capture surplus if you win.

**Optimal bid formula** (with n symmetric bidders with uniform valuations):
`Optimal bid = True value × (n-1)/n`

With 2 bidders: bid 50% of your value. With 10 bidders: bid 90%. As competition increases, shade less.

**M&A implication**: In a competitive deal process (many bidders), the winner tends to overpay ("winner's curse") because the highest bidder systematically overestimates value relative to the field. Always ask: if I'm winning this bid, what does that imply about what others know?

---

## Incentive Design

### Principal-Agent Problem

When you hire someone (agent) to act on your behalf, their interests may diverge from yours. The mechanism design challenge: create incentives so the agent's optimal action is also your desired action.

**Startup applications**:
- Sales compensation: Commission structures, clawbacks, accelerators
- Engineering incentives: Equity vesting, performance reviews, team vs. individual metrics
- Partner channel incentives: Revenue share structures, MDF, co-sell incentives

**Design checklist for incentive structures**:
1. What behavior do you actually want? (Not "close revenue" — "close *quality* revenue with low churn")
2. Is the desired behavior measurable? (If not, you're incentivizing a proxy that may diverge)
3. Can the agent game the metric? (Sales reps discount heavily to hit quota; churn spikes in Q5)
4. Is the incentive large enough to change behavior? (Too small → ignored; too large → distorts everything)
5. Is the time horizon aligned? (Short-term commissions create long-term retention problems)

### Goodhart's Law Warning
"When a measure becomes a target, it ceases to be a good measure." Any metric you tie compensation to will be gamed. Design for this from the start — use lagged metrics, composite scores, and judgment alongside measurement.

---

## Worked Example: SaaS Pricing Redesign

**Situation**: B2B SaaS company with flat $200/seat pricing. High churn in SMB segment, large enterprise accounts feeling undercharged. Revenue growth plateauing.

**Game theory diagnosis**:
- Flat per-seat pricing creates adverse selection: SMB (low WTP) and Enterprise (high WTP) pay the same
- Enterprise is subsidizing SMB; if Enterprise gets a better option, they'll take it
- No mechanism to extract value from high-usage, high-value customers

**Mechanism design solution — 3-tier versioning**:

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| Starter | $75/seat | Core features, community support | SMB self-serve |
| Professional | $200/seat | + Integrations, priority support | Mid-market |
| Enterprise | Custom ($350-600/seat est.) | + SSO, custom contracts, CSM | 500+ employee companies |

**Self-selection design**:
- Enterprise tier includes SSO (SAML/SCIM) — only needed by large orgs with IdP infrastructure
- Removes features SMBs want (ease of setup) from Enterprise tier isn't needed — Enterprise buyers prioritize control, not simplicity
- Annual contract requirement for Enterprise extracts commitment signal

**Expected outcome**: Enterprise ACV increases 75-200%; SMB churn reduced via right-sized product; overall ARPU increases while removing cross-subsidy distortion.
