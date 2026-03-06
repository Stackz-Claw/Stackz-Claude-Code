# Equilibrium Analysis
## Nash Equilibrium, Dominant Strategies & Mixed Strategies

---

## Core Concepts

### Dominant Strategy
A strategy is **strictly dominant** if it yields a higher payoff than any other strategy, regardless of what opponents do. When it exists, analysis is simple: rational players always choose it.

A strategy is **weakly dominant** if it yields payoffs at least as good as alternatives, and strictly better in at least one case. Still likely to be chosen.

**Startup application**: If you have a feature that improves your product regardless of what competitors ship, build it. Don't wait to see what they do.

### Nash Equilibrium
A set of strategies — one per player — where no player can improve their payoff by unilaterally changing their strategy. Each player is playing a best response to everyone else.

**Key insight**: Nash Equilibria are stable, but not necessarily good. A market stuck in a price war is a Nash Equilibrium — everyone is responding rationally, but everyone is worse off.

### How to Find Nash Equilibria (Normal Form Games)

For a 2-player game, construct the payoff matrix:

```
                    Competitor
                   High Price  |  Low Price
            High:  (8, 8)      |  (2, 10)
Us          Low:   (10, 2)     |  (4, 4)
```

To find Nash Equilibria:
1. For each column (competitor's choice), find our best response (underline our highest payoff)
2. For each row (our choice), find competitor's best response (underline their highest payoff)  
3. Any cell where BOTH payoffs are underlined is a Nash Equilibrium

In the example above: (Low, Low) → (4,4) is the Nash Equilibrium. Both play Low Price even though (High, High) → (8,8) is better for everyone. This is the Prisoner's Dilemma.

---

## Prisoner's Dilemma in Startup Markets

**When you're in one**: Low Price is dominant for both players. Rational choice lands everyone at (4,4) when (8,8) was available.

**Recognition signals**:
- Margins compressing industry-wide despite growing market
- Feature releases trigger immediate competitive responses
- CAC rising as both sides bid up the same acquisition channels
- "We have to match their pricing" is heard frequently in strategy meetings

**Exit strategies** (ranked by reliability):

1. **Differentiation** — Exit the identical-product assumption. If payoff matrices diverge because products are different, the Prisoner's Dilemma dissolves. This is why brand and product differentiation have such high ROI in commoditizing markets.

2. **Repeated interaction** — One-shot PD has no cooperative equilibrium. Repeated PD with indefinite horizon can sustain cooperation via "Grim Trigger" or "Tit for Tat" strategies. Build long-term market presence; short-term entrants can't credibly commit to cooperation.

3. **Coordination mechanisms** — Industry associations, standards bodies, regulatory frameworks can shift the payoff structure. Often takes years.

4. **Consolidation** — M&A converts two-player competition into a single player. Eliminates the dilemma but introduces regulatory risk.

---

## Mixed Strategy Equilibria

When no pure Nash Equilibrium exists, players randomize. The equilibrium is the mix probabilities that make the opponent indifferent.

**Business relevance**: Security, fraud detection, auditing, and promotional pricing often involve mixed strategies. If you always promote on Tuesdays, competitors adapt. Randomization maintains unpredictability.

**Example**: Platform security audits
- If you always audit the same vendors → vendors game it; only behave when audited
- Mixed strategy (random audits with probability p) → vendors must behave even when not audited
- Set p so that the expected cost of misbehaving exceeds the expected cost of complying

---

## Worked Example: SaaS Pricing War

**Situation**: Two B2B SaaS companies (us vs. Apex) serving the same mid-market segment. We're considering dropping pricing from $500/seat to $350/seat to accelerate growth.

**Players**: Us, Apex  
**Actions**: Maintain price ($500) or cut price ($350)  
**Payoffs** (estimated monthly revenue, $M):

```
                    Apex
                   $500/seat  |  $350/seat
         $500/seat: (2.0, 1.8)|  (0.9, 2.4)
Us       $350/seat: (2.6, 0.7)|  (1.2, 1.0)
```

**Analysis**:
- Our dominant strategy: $350 (2.6 > 2.0 when Apex holds; 1.2 > 0.9 when Apex cuts)
- Apex's dominant strategy: $350 (2.4 > 1.8 when we hold; 1.0 > 0.7 when we cut)
- Nash Equilibrium: Both at $350 → (1.2, 1.0) — both worse than (2.0, 1.8)

**Recommendation**: Do NOT initiate the price cut. The equilibrium outcome destroys $0.8M/month for us and $0.8M/month for Apex. The only winning moves are:
1. Differentiate enough that the payoff matrix changes (Apex can no longer match on value)
2. Find a segment where Apex won't follow (different buyer persona, different use case)
3. Use the price cut as a bluff only if you have reason to believe Apex cannot operationally match it

---

## Iterated Elimination of Dominated Strategies (IEDS)

When no single dominant strategy exists, eliminate strategies that are dominated step by step. What remains narrows the likely equilibrium.

**Process**:
1. Remove strictly dominated strategies for all players
2. Given remaining strategies, repeat — new strategies may now be dominated
3. Continue until stable

**Startup use**: Competitive forecasting. Before launching a product feature, map out all responses competitors could plausibly make. Eliminate the ones that are clearly not in their interest. The remaining responses are what you need to plan for.
