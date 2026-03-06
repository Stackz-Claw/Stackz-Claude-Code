---
name: game-theory-strategist
description: Evaluates business ideas, go-to-market strategies, competitive moves, and startup decisions through the lens of game theory. Activate whenever any agent — especially Radar (business strategy) or Stackz (executive decisions) — needs to analyze competitive dynamics, market entry timing, pricing strategy, negotiation positions, partnerships, or how rational opponents will respond to a move. Also trigger for questions like "how will competitors react?", "should we move first or wait?", "how do we win a bidding war?", "what's our Nash equilibrium?", "how do we avoid a race to the bottom?", "is this a winner-take-all market?", or any situation where multiple strategic players interact and payoffs depend on what others do. Primary users are Radar and the Founder team, but all agents should use this skill when strategic interdependence is in play.
---

# Game Theory Strategist

Analyzes strategic situations where outcomes depend on the choices of multiple rational actors — competitors, partners, customers, regulators, or investors. Turns abstract competitive dynamics into concrete, actionable recommendations.

---

## Quick-Start: Which Framework?

Read the situation first, then select the right lens:

| Situation | Framework | Reference File |
|-----------|-----------|----------------|
| Head-to-head competition, pricing wars, market share battles | Nash Equilibrium / Dominant Strategies | `references/equilibrium-analysis.md` |
| First-mover vs. fast-follower, when to launch | Sequential Games / Commitment | `references/sequential-games.md` |
| Pricing strategy, auctions, procurement bids | Mechanism Design / Auctions | `references/mechanism-design.md` |
| Partnerships, joint ventures, revenue splits | Cooperative Game Theory / Bargaining | `references/cooperative-games.md` |
| Repeated interactions, reputation, long-term markets | Repeated Games / Signaling | `references/repeated-games.md` |
| Network effects, platform strategy, standards wars | Coordination Games / Tipping Points | `references/coordination-games.md` |

When in doubt, run the **5-Step Core Analysis** below — it identifies which framework applies automatically.

---

## 5-Step Core Analysis

Use this for any business idea or strategy evaluation.

### Step 1 — Map the Game

Define the strategic situation precisely:

```
Players:    Who are the rational actors? (us, competitors, customers, partners, regulators)
Actions:    What can each player actually do? (enter, wait, price high/low, partner, acquire)
Payoffs:    What does each player want? (profit, market share, survival, strategic position)
Info:       What does each player know? (complete vs. incomplete information)
Timing:     Simultaneous moves or sequential? One-shot or repeated?
```

Identifying the game structure correctly is the highest-leverage step — it determines which analysis follows.

### Step 2 — Find Dominant Strategies

Ask: *Is there a strategy that's best for a player regardless of what everyone else does?*

- If a dominant strategy exists → that player will always choose it
- If all players have dominant strategies → the outcome is predictable; work backward from it
- If no dominant strategy exists → proceed to Nash Equilibrium analysis

Flag immediately if the dominant strategy leads to a suboptimal collective outcome (Prisoner's Dilemma structure) — this is one of the most common and dangerous traps in competitive markets.

### Step 3 — Find Equilibria

Identify stable states where no player wants to unilaterally deviate:

- **Nash Equilibrium**: Each player's strategy is a best response to all others'
- **Multiple equilibria**: Who coordinates on which one? (Platform wars, standards battles)
- **No pure equilibrium**: Mixed strategies may apply — players randomize to stay unpredictable

For each equilibrium, assess: Is it efficient? Is it fair? Is it stable? Can we shift to a better one?

### Step 4 — Identify Strategic Leverage Points

Look for asymmetries and opportunities to reshape the game:

| Leverage Type | Question to Ask |
|---------------|-----------------|
| **First-mover advantage** | Can we commit credibly before competitors act? |
| **Credible threats** | Can we make a threat the opponent believes we'd actually carry out? |
| **Information advantage** | What do we know that others don't? Can we signal it — or hide it? |
| **Outside options** | What's our BATNA? What's theirs? Who needs this deal more? |
| **Changing the rules** | Can we redefine the game entirely — through bundling, platforms, regulation? |

### Step 5 — Scenario Analysis and Recommendation

Produce a strategic recommendation structured as:

```
## Game Theory Analysis: [Strategy/Idea Name]

### The Game
[1-2 sentences: players, their goals, timing]

### Dominant Strategies / Equilibrium
[What will each player rationally do? Where does this land?]

### Key Risk: [Name the failure mode]
[What breaks this analysis? What assumption is most fragile?]

### Strategic Recommendation
[Specific action, not just analysis]

### Leverage Moves
[2-3 concrete tactics to improve payoff or shift the equilibrium]

### Confidence Level
[High / Medium / Low] — [Why: data quality, market certainty, model fit]
```

---

## Common Business Game Structures

These are the patterns that appear most often in startup and strategy contexts. Recognize them fast:

### Prisoner's Dilemma
**Signature**: Both players have a dominant strategy that leads to a worse outcome than if they'd cooperated. Classic in: price wars, feature races, race-to-the-bottom hiring.
**Escape routes**: Contracts, repeated interaction (reputation), industry associations, regulatory intervention, differentiation that exits the zero-sum frame.

### Coordination Game
**Signature**: Multiple equilibria exist; players prefer to coordinate on the same one. Classic in: platform standards, network effects, industry formats (e.g., VHS vs. Betamax).
**Escape routes**: First-mover pre-emption, signaling commitment loudly, acquiring critical mass before competitors, locking in key distribution partners.

### Chicken / Hawk-Dove
**Signature**: Both players prefer the other to back down; catastrophic if both escalate. Classic in: patent disputes, standards wars, aggressive market entry, M&A negotiations.
**Escape routes**: Credible commitment (burn the boats), escalation ladders, face-saving off-ramps for the opponent.

### Stag Hunt
**Signature**: Cooperation yields the highest payoff but requires trust; defecting is safer but worse for everyone. Classic in: industry consortia, open-source, ecosystem development.
**Escape routes**: Build trust through small initial commitments, create transparent payoff visibility, lower the risk of cooperation.

### Asymmetric Information Games
**Signature**: One player has private information the other wants. Classic in: fundraising, hiring, B2B sales, insurance.
**Key tools**: Signaling (costly actions that credibly reveal type), screening (design options that reveal player type through self-selection).

---

## Startup-Specific Lenses

### Market Entry Timing
Load `references/sequential-games.md` for full analysis. Key questions:
- Is there a first-mover advantage, or does the fast-follower win after the pioneer educates the market?
- Can the incumbent credibly commit to retaliate (excess capacity, switching costs, IP moats)?
- Is the market winner-take-all (high network effects) or winner-take-most or fragmented?

### Pricing Strategy
Load `references/mechanism-design.md` for full analysis. Key questions:
- Are buyers' valuations known or hidden? (Price discrimination feasibility)
- Is this a one-shot transaction or repeated? (Long-term relationships allow different pricing)
- What does pricing signal about quality? (Signaling games)

### Fundraising / Investor Negotiations
Load `references/cooperative-games.md` for full analysis. Key questions:
- What's each party's outside option? (BATNA determines bargaining power)
- Information asymmetry: what do you know about the business that investors don't?
- How do deal terms signal confidence vs. desperation?

### Platform / Ecosystem Strategy
Load `references/coordination-games.md` for full analysis. Key questions:
- Which side of the market do you subsidize to achieve critical mass?
- Can you create switching costs before the network tips?
- How do you prevent the platform from being commoditized by a more powerful player?

---

## Red Flags — When Game Theory Signals Danger

Escalate or flag to Stackz/Radar when analysis reveals:

- 🔴 **Prisoner's Dilemma trap**: The rational equilibrium destroys value for everyone; we're heading into a price war or feature arms race with no exit
- 🔴 **Credibility problem**: Our key threat or commitment isn't believable — opponents will call the bluff
- 🔴 **Information disadvantage**: We're playing with significantly less information than key opponents (especially in auctions or negotiations)
- 🔴 **Wrong game model**: We're treating a coordination game like a zero-sum competition, or vice versa
- 🟡 **Fragile equilibrium**: The stable outcome depends on assumptions (rationality, information, no new entrants) that could easily break
- 🟡 **Ignoring repeated-game effects**: A move that wins the current round damages reputation or triggers retaliation in future rounds

---

## Reference Files

Load these when the situation calls for deeper analysis:

- `references/equilibrium-analysis.md` — Nash Equilibrium, dominant strategies, mixed strategies, worked startup examples
- `references/sequential-games.md` — First-mover advantage, commitment devices, backward induction, market entry timing
- `references/mechanism-design.md` — Pricing, auctions, incentive design, information revelation
- `references/cooperative-games.md` — Bargaining theory, Shapley values, partnership structures, negotiation
- `references/repeated-games.md` — Reputation, Folk Theorem, signaling, long-term competitive dynamics
- `references/coordination-games.md` — Network effects, platform tipping, standards wars, ecosystem strategy
