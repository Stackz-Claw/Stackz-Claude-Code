# PIPELINE STAGE DEFINITIONS
*Used by: radar, analyst, validator, pitch | Defines each stage of the opportunity pipeline*

---

## STAGE OVERVIEW

```
SCAN → FILTER → SCORE → VALIDATE → PACKAGE → PRESENT → DECIDE → HANDOFF
```

---

## STAGE 1: SCAN

**Owner:** `analyst`

**Description:** Continuous monitoring of opportunity sources. Daily report to Radar.

**Sources monitored:**
- GitHub Trending (find what devs are building)
- ProductHunt (find what's launching and getting traction)
- HackerNews "Show HN" (indie builders sharing)
- Reddit: r/SaaS, r/MicroSaaS, r/startups, r/indiehackers
- X: #buildinpublic, #indiehacker, #SaaS
- API marketplaces (RapidAPI, etc.) for underutilized data
- Competitor pricing pages (pricing changes signal market moves)

**Output:** Raw signal entries with initial scoring

---

## STAGE 2: FILTER

**Owner:** `analyst`

**Description:** Remove noise. 90% of signals are worthless.

**Auto-Kill Criteria:**
- Requires domain expertise we don't have
- Market dominated by well-funded incumbent
- Revenue potential under $500/month
- Requires significant upfront capital
- Moral/ethical flags
- Already saturated
- Requires regulatory compliance
- One-time revenue only

**Survival Criteria (must pass 3+):**
- Buildable with existing stack
- Recurring/compounding revenue
- Active demand signal
- MVP in <2 weeks
- Clear distribution channel
- Fits server capabilities
- Low maintenance
- Automatable

**Output:** Filtered signals ready for scoring

---

## STAGE 3: SCORE

**Owner:** `radar`

**Description:** Every opportunity gets a score 1-100.

**Scoring Dimensions:**
| Dimension | Weight |
|-----------|--------|
| Revenue Potential | 25 points |
| Build Complexity | 20 points |
| Competitive Moat | 20 points |
| Market Timing | 20 points |
| Operational Fit | 15 points |

**Thresholds:**
| Score | Decision |
|-------|----------|
| ≥80 | Validate |
| 60-79 | Monitor |
| <60 | Discard |

**Output:** Scored opportunities

---

## STAGE 4: VALIDATE

**Owner:** `validator`

**Description:** Red-team every 80+ opportunity.

**Requirements:**
- Find at least 3 concrete failure modes
- Assess: competitive moat, build complexity, market timing, revenue model

**Risk Ratings:**
| Rating | Meaning |
|--------|---------|
| Low | Clear path, manageable risks |
| Medium | Reasonable risks with mitigations |
| High | Significant challenges |
| Kill | Fundamental flaws |

**Output:** Validation Report with risk rating

---

## STAGE 5: PACKAGE

**Owner:** `pitch`

**Description:** Turn validated opportunities into owner-facing proposals.

**Required Sections:**
- Executive summary (one-liner, why now, why us)
- Revenue model with 3 scenarios
- Build requirements (for Forge)
- Launch requirements (for Megaphone)
- Risk register from validator
- Go/no-go recommendation

**Output:** Complete proposal document

---

## STAGE 6: PRESENT

**Owner:** `radar`

**Description:** Submit packaged proposals to Stackz for routing to owner.

**Format:** Weekly report with ranked opportunities

---

## STAGE 7: DECIDE

**Owner:** Stackz / Owner

**Description:** Final go/no-go decision.

**Options:**
| Decision | Action |
|----------|--------|
| GO | Handoff to Startup Team |
| NO-GO | Log with reason, potential re-evaluation |
| TABLE | Stay in pipeline |

---

## STAGE 8: HANDOFF

**Owner:** `radar`

**Description:** Approved proposals move to Startup Team (`founder`) for execution.

**Process:**
1. Create project entry in Startup Team registry
2. Notify Forge of build requirements
3. Notify Megaphone of launch requirements
4. Set milestone checkpoints
5. Track progress in OPPORTUNITY_LOG.md
