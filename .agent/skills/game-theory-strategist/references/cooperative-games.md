# Cooperative Games & Bargaining Theory
## Partnerships, Negotiations, Revenue Splits & Fundraising

---

## When Cooperation Is Possible

Cooperative game theory applies when players can form binding agreements and the question is: **how will the surplus be divided?**

Key departure from non-cooperative theory: we're no longer asking "will they cooperate?" — we assume they can. We're asking "on what terms?" and "who has leverage?"

**Startup applications**:
- Investor term sheet negotiations
- Co-founder equity splits
- Revenue share agreements with distribution partners
- Licensing deals and IP negotiations
- M&A negotiations and earnout structures
- Joint venture terms

---

## The Nash Bargaining Solution

For two-party negotiations, the Nash Bargaining Solution predicts the outcome that maximizes the product of both parties' gains over their outside options (BATNA).

**Formula**: Maximize `(Value_A − BATNA_A) × (Value_B − BATNA_B)`

**Implication**: The party with the better outside option has more leverage. Improving your BATNA is often more valuable than improving your negotiation tactics.

**Practical application**:
1. Identify your BATNA clearly before any negotiation
2. Identify their BATNA (often estimable with research)
3. The zone of agreement is: any split where both parties are better off than their BATNA
4. The bargaining power determines where in that zone you land

**Example — Series A term sheet**:
- Startup BATNA: keep bootstrapping (slow growth, team risk)
- VC BATNA: invest in a comparable deal at similar terms
- If startup has 3 competing term sheets, BATNA improves dramatically — negotiate from strength
- If startup has no other options, BATNA is weak — terms will reflect this

---

## Shapley Value: Fair Division of Collaborative Surplus

When multiple parties contribute to a collective outcome, the Shapley Value provides a theoretically fair way to attribute value to each contributor.

**Concept**: Each party's fair share equals their average marginal contribution across all possible coalition orderings.

**Business use**: Co-founder equity splits, multi-party JV economics, attribution in sales where multiple teams (SDR, AE, partnerships) close a deal.

**Calculation approach** (simplified for 3 players A, B, C):
1. List all possible orderings of the players
2. For each ordering, calculate each player's marginal contribution when they "join"
3. Average each player's marginal contribution across all orderings
4. That average is their Shapley Value (fair share)

**Example — 3-way partnership**:
- Player A (tech platform) alone: $1M value
- Player B (distribution) alone: $0.5M value  
- Player C (brand) alone: $0.3M value
- A + B: $3M (distribution unlocks tech's value)
- A + C: $1.5M
- B + C: $0.6M
- A + B + C: $5M

Run through all orderings → Shapley Values will typically assign largest share to the most complementary contributor (often B here, since they provide the biggest marginal lift to A).

**Practical takeaway**: When a partnership deal feels unfair, map out marginal contributions. The party whose removal most reduces total value deserves the largest share.

---

## Threat Points and Leverage

In any negotiation, the outcome depends critically on what happens if talks break down.

**Improving your threat point** (BATNA enhancement):
- Develop alternative partners or suppliers before negotiating
- Raise venture capital before you need it — negotiating from strength
- Build in public before announcing partnerships — creates outside validation
- Time negotiations to coincide with your strongest metrics period

**Weakening their threat point**:
- Create switching costs before renegotiation windows (deep integrations, data lock-in)
- Build relationships at multiple levels of their organization (not just one champion)
- Become a revenue dependency — their BATNA worsens if they lose you
- Time your contract renewals to coincide with their budget cycles

---

## Signaling in Fundraising

Fundraising is an asymmetric information game: founders know more about the business than investors. Signals are costly actions that credibly reveal quality.

**Credible signals** (costly to fake):
- Team quality — experienced founders with track records (hard to fabricate)
- Existing investors — reputable lead investor signals quality to follow-on
- Customer traction — real revenue; hard to fake at scale
- Rejection of bad terms — willingness to walk away signals confidence in alternatives

**Warning signs for investors** (negative signals):
- Over-engineered financial projections (compensating for weak fundamentals)
- Overly complex deal structures (may be hiding something)
- Urgency without explanation ("we need to close by Friday")
- Reluctance to provide references

**Founder strategy**: Invest in signals that are genuinely costly — they're credible precisely because they're expensive to produce. Cheap signals (decks, pitch rehearsal) are necessary but not differentiating.

---

## Partnership Structure Pitfalls

Common game-theoretic traps in business partnerships:

### Hold-Up Problem
One party makes a relationship-specific investment; the other gains leverage post-investment and renegotiates terms.

**Example**: You build a deep integration with a major platform's API. After 18 months, they change pricing — you're locked in (high switching cost).

**Mitigations**: Contracts with renegotiation clauses, diversified integration across multiple platforms, own the customer relationship so the platform needs you.

### Adverse Selection
When you can't observe partner quality before committing, you attract the worst partners (those who know they need you most).

**Example**: Revenue share partnership where you can't audit the partner's effort. Partners who expect to contribute little self-select in.

**Mitigations**: Screening mechanisms (minimum volume commitments), pilot programs before full partnership, performance-based escalating terms.

### Double Marginalization
When two monopolists in a supply chain each add a markup, total price exceeds what a vertically integrated entity would charge — reducing market size and both parties' profits.

**Mitigation**: Revenue share or profit share arrangements align incentives; avoid fixed-margin wholesale structures where both parties independently optimize.

---

## Worked Example: Co-Founder Equity Split

**Situation**: Three co-founders starting a SaaS company. A (CEO, idea originator), B (CTO, will build MVP), C (CMO, has key distribution relationships).

**Marginal contribution analysis**:
- Without A: no founding vision, but concept can be recreated — medium loss
- Without B: no product, company cannot launch — high loss
- Without C: no early distribution, but GTM can be rebuilt — medium-high loss

**Shapley Value estimate**: B has highest marginal contribution at founding (critical path dependency). A and C are comparable, with C slightly ahead given distribution is the hardest thing to rebuild.

**Suggested range**: B: 38-42%, C: 30-33%, A: 25-30%

**Practical recommendation**: Don't split equally (50/50 or 33/33/33) if contributions are unequal — resentment builds when actual contributions diverge from expected. Use a vesting cliff (1 year) and standard 4-year vest to protect against early departure. Revisit allocations if founding assumptions change significantly in year 1.
