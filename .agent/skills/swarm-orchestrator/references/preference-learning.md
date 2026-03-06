# Preference Learning Reference
## How Radar calibrates to the owner's taste over time

---

## WHY THIS EXISTS

A generic opportunity filter wastes everyone's time. Radar scoring a "crowded market SaaS" at 7.2 and routing it to Stackz when the owner has rejected 4 crowded-market ideas in a row is a system failure. Preference learning is what separates a dumb scanner from an actual business partner.

---

## WHAT GETS TRACKED

Every owner decision on a proposal is logged:

```json
{
  "decision_log_entry": {
    "proposal_id": "",
    "decision": "approve | reject | modify | table",
    "reason": "[owner's stated reason, if given]",
    "implicit_signals": {
      "revenue_model": "[subscription | one-time | usage | marketplace]",
      "market_type": "[developer tools | consumer | B2B | B2C | etc.]",
      "build_effort": "[days estimate from proposal]",
      "capital_required": "[upfront cost estimate]",
      "risk_level": "[validator's assessment]",
      "leverage_score": 0.0
    },
    "timestamp": ""
  }
}
```

---

## PREFERENCE PROFILE (Updated After Every 5 Decisions)

```json
{
  "owner_preference_profile": {
    "version": "[auto-increment]",
    "last_updated": "",
    "decisions_analyzed": 0,

    "revenue_model_preferences": {
      "strongly_prefer": [],
      "prefer": [],
      "neutral": [],
      "avoid": [],
      "never": []
    },

    "market_preferences": {
      "strongly_prefer": [],
      "prefer": [],
      "neutral": [],
      "avoid": [],
      "never": []
    },

    "build_effort_tolerance": {
      "sweet_spot_days": "",
      "max_acceptable_days": "",
      "notes": ""
    },

    "risk_appetite": {
      "level": "conservative | moderate | aggressive",
      "notes": ""
    },

    "capital_tolerance": {
      "max_upfront": "",
      "notes": ""
    },

    "topics_that_excite": [],
    "topics_to_avoid": [],

    "common_rejection_reasons": [],
    "common_approval_patterns": []
  }
}
```

---

## SCORING ADJUSTMENTS

When Radar scores a new opportunity, it applies preference adjustments ON TOP of the base rubric score:

| Match condition | Score adjustment |
|----------------|-----------------|
| Matches 2+ approved patterns | +0.5 |
| Matches 1 approved pattern | +0.25 |
| Neutral / no match | 0 |
| Matches 1 avoided pattern | -0.5 |
| Matches a common rejection reason | -1.0 |
| Category owner has never seen (novel) | 0 — present with curiosity flag |

**Cap:** Preference adjustments cannot move a score above 10 or below 0.

---

## RECALIBRATION CYCLE

### Every 10 Decisions: Radar Presents Its Model

Radar surfaces its current preference model to the owner and asks for confirmation:

```
RADAR PREFERENCE CALIBRATION — [date]
Based on your last 10 decisions, here's my current model of what you want:

✅ You seem to like:
  - [Revenue model pattern]
  - [Market type]
  - [Build effort range]

❌ You seem to avoid:
  - [Market type or deal structure]
  - [Risk pattern]

❓ I'm less sure about:
  - [Something with mixed signals]

Is this roughly right? Anything to correct or add?
```

Owner responds: confirm / correct / add nuance. Radar updates the profile.

---

## FEEDBACK LOOPS

### Loop 1: Rejection → Smarter Filter
Every rejected idea with a stated reason updates the `common_rejection_reasons` list. Over time, ideas with those patterns are filtered out before reaching the owner.

### Loop 2: Execution → Better Estimates
When a venture launches and the real build time / cost / revenue differs from the proposal estimates, that delta is logged. Future proposals in similar categories get a "calibrated estimate" note:

> *"Similar projects have taken 40% longer than estimated. Adjusted timeline: 10 days, not 7."*

### Loop 3: Market → Resurfaced Ideas
`intel` (Stability Team) monitors tabled ideas. When market conditions change (competitor closes, new technology available, pricing shifts), Radar gets a signal to re-evaluate the tabled proposal:

> *"Tabled idea [ID] from 45 days ago: the primary competitor just shut down their API. Window may be open. Re-evaluate?"*

### Loop 4: Portfolio Pattern → Opportunity Lens
As the portfolio grows, Radar adjusts its scanning lens based on what kinds of ventures have actually worked:

> *"3 of our 4 successful ventures were B2B developer tools priced $29-99/mo with <2 week build times. Applying +0.5 preference bonus to future opportunities matching this profile."*

---

## PREFERENCE PROFILE STORAGE

- **File location:** `business/pipeline/OWNER_PREFERENCES.md`
- **Updated by:** Radar (after each recalibration cycle)
- **Read by:** Radar (before every scoring pass), Stackz (for weekly report recommendations)
- **Access:** Radar (Tier 1 read), Stackz (Tier 4)

---

## OVERRIDE RULES

The preference system is advisory, not mandatory:

- Owner can always approve a low-scoring idea ("I don't care about the score, build this")
- Owner can always reject a high-scoring idea without explanation
- Owner override is **always logged** but **never argued with**
- Repeated overrides in the same direction update the preference profile automatically

The system exists to save the owner time — not to constrain their choices.
