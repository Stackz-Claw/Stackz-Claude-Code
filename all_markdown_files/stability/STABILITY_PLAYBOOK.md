# STABILITY PLAYBOOK
*How Sentinel manages a mature venture from graduation to ongoing stability*

---

## VENTURE INTAKE

When a venture graduates from Startup Team:

1. **Receive** handoff from Founder
   - Final VENTURE_BRIEF.md
   - Current metrics
   - Known issues

2. **Create** portfolio folder
   ```
   stability/portfolio/[venture-slug]/
   ├── VENTURE_BRIEF.md
   ├── MOAT_STATUS.md
   ├── THREAT_REGISTER.md
   ├── METRICS.md
   └── STABILITY_LOG.md
   ```

3. **Assign** team resources
   - moat: Owns competitive defense
   - intel: Owns market intelligence
   - guardian: Owns risk monitoring

4. **Set** baseline metrics
   - Current MRR baseline
   - Churn baseline
   - Support baseline

---

## ONGOING OPERATIONS

### Weekly
- Guardian: Health pulse check
- Intel: Competitive landscape update
- Sentinel: Review alerts and metrics

### Monthly
- Moat: Moat progress report
- Sentinel: Full portfolio review → Stackz

### Quarterly
- Strategic threat assessment
- Moat strategy review
- Portfolio optimization

---

## STABILITY METRICS

A venture is stable when:

| Metric | Target | Alert if |
|--------|--------|----------|
| MRR growth | 2-8% MoM | < 0% or > 15% |
| Churn | < 5% monthly | > 8% |
| Gross margin | > 60% | < 40% |
| Support burden | < 2 hrs/week | > 8 hrs/week |
| Competitive threats | No existential | New well-funded entrant |

---

## RISK RESPONSE

### Warning Signs
- Churn spike > 2x baseline
- Revenue decline 2 weeks straight
- Integration dependency fails
- Support volume spike
- Traffic anomaly

### Response Protocol
1. Guardian detects → Alert sentinel
2. Sentinel assesses → Determine severity
3. If critical → Escalate to Stackz immediately
4. If manageable → Create action plan
5. Track until resolved

---

## ESCALATION DECISION TREE

```
Is venture below graduation thresholds for 2+ months?
  → YES: Escalate to Stackz (may need Startup Team re-engage)
  → NO: Continue monitoring

Is competitive threat existential?
  → YES: Escalate to Stackz immediately
  → NO: Continue monitoring

Is moat investment > $X?
  → YES: Escalate to Stackz for approval
  → NO: Proceed with moat building
```

---

## GRADUATION CRITERIA

Venture is ready for graduation when:
- MRR > $X for 3+ months
- Churn < 5% for 3+ months
- Has at least one strong moat
- No existential competitive threats

---

## WIND-DOWN CRITERIA

Consider wind-down when:
- MRR declining for 6+ months
- No viable path to profitability
- Competitive displacement inevitable
- Owner decides to exit

---

## HANDOFF BACK TO STARTUP

If a stable venture needs a growth sprint:
1. Sentinel recommends to Stackz
2. Stackz approves re-engagement
3. Founder takes over
4. Execute growth sprint
5. Return to stability when complete
