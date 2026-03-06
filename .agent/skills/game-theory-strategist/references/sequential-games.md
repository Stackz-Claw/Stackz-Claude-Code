# Sequential Games
## First-Mover Advantage, Commitment Devices & Market Entry Timing

---

## Sequential vs. Simultaneous Games

**Simultaneous**: Players choose without knowing what others will do (normal form / payoff matrix).  
**Sequential**: Players move in order; later players observe earlier moves (extensive form / game tree).

Most real competitive situations are sequential. The order of moves matters enormously — and changing who moves first can completely reverse who wins.

---

## Backward Induction

The core tool for sequential games. Start from the end of the game tree and work backward to determine rational behavior.

**Process**:
1. Draw the full game tree (players, decision nodes, outcomes)
2. At the final decision nodes, identify what each player would rationally choose
3. Replace those terminal nodes with their expected payoffs
4. Work back one level; repeat until you reach the root

**Key insight**: Rational players anticipate how the game will end before making their first move. They won't make a move that looks good now if it leads to a bad equilibrium later.

**Startup application**: Before announcing a product launch, trace out competitor responses fully. If your move triggers a retaliation that lands you in a worse position than you started, the move is a mistake — even if the immediate response seems positive.

---

## First-Mover Advantage: When It's Real and When It's a Myth

First-mover advantage is **real** when:
- **Switching costs are high**: Customers who adopt first face costs to switch later (data migration, retraining, integrations)
- **Network effects are strong**: Value grows with users; early adopters attract later adopters
- **Learning curves are steep**: Cost advantages from scale and experience are durable
- **Key resources can be locked up**: Distribution partnerships, talent, IP, physical locations
- **Standards can be set**: Whoever sets the technical standard wins (see `coordination-games.md`)

First-mover advantage is **a myth** when:
- The market is not yet ready and the pioneer has to educate it at high cost (fast-follower wins)
- The technology is still evolving and early commitment to an architecture becomes a liability
- Customer acquisition cost is high and retention is low — second movers free-ride on market education
- The incumbent can observe and copy quickly (low imitation cost)

**Test**: Ask whether being second, with full information about what the first mover did wrong, is a disadvantage or an advantage. If it's an advantage → wait and improve.

---

## Commitment Devices

A commitment device is an action that restricts your own future choices in a way that makes your threats or promises credible.

**Why commitments matter**: In sequential games, a threat is only credible if carrying it out is rational at the time you'd have to act. Empty threats are ignored by rational opponents.

**Classic example**: Hernán Cortés burning his ships. By eliminating retreat, he committed his army to fighting — making the commitment to battle credible.

**Business commitment devices**:

| Device | Mechanism | Example |
|--------|-----------|---------|
| Capacity investment | Sunk costs signal you'll serve the market regardless | Building a large factory before competitors can react |
| Exclusive contracts | Lock out competitors from key distribution | Signing exclusive deals with major distributors |
| Public announcements | Reputational cost to backing down | Announcing a product at a specific price point publicly |
| Financial commitments | Raising capital earmarked for a specific battle | "We raised $50M specifically for international expansion" |
| R&D investment | Signals long-term commitment to a technology path | Multi-year research programs with published papers |
| Pricing guarantees | Commit to price floors or price matching | "We'll match any competitor's price" |

**Warning**: Commitments only work if they're **irreversible** (or at least costly to reverse). A commitment you can walk away from is not credible.

---

## Market Entry Timing Framework

Use this decision tree when deciding whether to enter a market, when, and how:

```
Is there a first-mover advantage in this market?
│
├── YES → Can we actually be first?
│         ├── YES → Can we sustain the advantage? (switching costs, network effects)
│         │         ├── YES → Enter aggressively; invest in lock-in mechanisms
│         │         └── NO  → Enter, but prioritize speed to second-mover position or pivot
│         └── NO  → Is the pioneer making market-defining mistakes?
│                   ├── YES → Fast-follow; learn from their errors; enter with improvements
│                   └── NO  → Differentiate or wait for market structure to clarify
│
└── NO  → Is there a late-mover advantage? (market education done, technology mature)
          ├── YES → Wait; enter when customer willingness-to-pay is proven
          └── NO  → Compete on execution; timing is not the key variable
```

---

## Incumbent Response Modeling

Before entering a market, model how incumbents will rationally respond. Use the Judo Economics framework:

**When will incumbents fight hard?**
- The market is core to their revenue
- They have excess capacity and low marginal cost to respond
- Failure to respond would signal weakness to other potential entrants
- The entrant threatens their most profitable customer segment

**When will incumbents accommodate entry?**
- Responding would require cannibalizing their own high-margin product
- The entrant is targeting a low-margin segment the incumbent doesn't want
- Fighting is expensive and the market is growing (expand the pie rather than defend share)
- The entrant's success validates the market and helps their narrative

**Strategic implication**: Enter in segments the incumbent is least motivated to defend. Gillette couldn't easily fight Dollar Shave Club at $1/month without destroying their own premium margin. This is Judo Economics — use the incumbent's strength against them.

---

## Worked Example: Startup Entering a Market with One Dominant Player

**Situation**: EdTech startup considering entering corporate learning market dominated by Cornerstone OnDemand.

**Sequential game tree** (simplified):
```
Startup: Enter / Don't Enter
  └── Enter → Cornerstone: Fight / Accommodate
        ├── Fight: Startup (−$2M loss), Cornerstone (−$5M defense cost)
        └── Accommodate: Startup (+$8M), Cornerstone (−$3M share loss)
```

**Backward induction**:
- If startup enters, Cornerstone compares: Fight (−$5M) vs. Accommodate (−$3M) → Rational choice: Accommodate
- Knowing Cornerstone will accommodate, startup compares: Enter (+$8M) vs. Don't Enter ($0) → Enter

**But**: This analysis assumes Cornerstone plays rationally in isolation. In reality, Cornerstone may fight unprofitably to deter the *next* entrant (reputation effects — see `repeated-games.md`). The startup should assess whether Cornerstone has a history of deterrence behavior.

**Recommendation**: Enter, targeting SMB customers Cornerstone ignores. Position below the threshold where Cornerstone's retaliation would be economically rational. Grow until the cost of fighting exceeds the cost of accepting you.
