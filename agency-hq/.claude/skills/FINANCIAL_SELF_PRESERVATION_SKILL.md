# FINANCIAL SELF-PRESERVATION SKILL
# The tripwires, circuit breakers, and recovery protocols
# that ensure the seed never depletes.

---

## AUTOMATED CIRCUIT BREAKERS

These run every 6 hours via autoRenewalService.check().
They override all scheduled spend decisions automatically.

```javascript
const CIRCUIT_BREAKERS = [

  {
    name: 'CRITICAL_BALANCE',
    trigger: 'operational_pool < (monthly_burn * 1)',  // < 1 month
    actions: [
      'FREEZE all Growth Pool spending immediately',
      'FREEZE all Tool Trial spending',
      'KEEP only auto-renewals for active API dependencies',
      'Write CRITICAL alert to Agency HQ/Finance/Alerts/<date>-critical-balance.md',
      'POST /api/briefings with { priority: "CRITICAL", type: "balance_alert" }',
      'Emit socket event: "finance:critical"',
      'Write Jaleel approval request to Agency HQ/Approvals/pending/'
    ]
  },

  {
    name: 'LOW_BALANCE_WARNING',
    trigger: 'operational_pool < (monthly_burn * 2)',  // < 2 months
    actions: [
      'PAUSE all non-critical Growth Pool spending',
      'Defer Tool Trials until operational pool recovers',
      'Write WARNING to morning brief',
      'Run emergency revenue analysis: what can ship fastest?',
      'Use ollamaService.think() to generate 3 fastest revenue paths'
    ]
  },

  {
    name: 'SPEND_SPIKE',
    trigger: 'daily_spend > (avg_daily_spend * 3)',
    actions: [
      'FREEZE all discretionary spend for 24h',
      'Run expense audit for last 48h',
      'Write Smoke review request',
      'Resume only after Smoke APPROVE'
    ]
  },

  {
    name: 'CAMPAIGN_ZERO_CONVERSION',
    trigger: 'campaign_spend > (campaign_budget * 0.3) AND conversions == 0',
    actions: [
      'PAUSE campaign immediately',
      'Write brief to Agency HQ/Campaigns/<slug>/pause-note.md',
      'Request Smoke review on campaign brief',
      'Do not resume until Smoke approves revised brief'
    ]
  },

  {
    name: 'FAILED_PAYMENT',
    trigger: 'stripe_charge_failed',
    actions: [
      'Log failure to Agency HQ/Finance/Errors/<date>-<vendor>.md',
      'Do not retry automatically',
      'Write to morning brief',
      'Investigate before retrying'
    ]
  }

];
```

---

## REVENUE ACCELERATION PROTOCOL

When any circuit breaker fires, Stackz does not just cut spending.
It simultaneously activates revenue acceleration.

```
WHEN LOW_BALANCE_WARNING or CRITICAL_BALANCE fires:

1. AUDIT WHAT IS ALREADY BUILT
   GET /api/completion-matrix
   Identify: what products/features are DONE but not yet monetized?

2. FASTEST REVENUE PATH ANALYSIS
   Use ollamaService.think():
   "Our balance is low. Here are our completed products: [list].
    What can we put in front of paying customers fastest?
    Consider: payment link creation time, existing audience,
    price point accessibility, zero-code-change paths.
    Return JSON: [{ action, time_to_revenue, effort, price_point }]
    sorted by time_to_revenue ascending."

3. EXECUTE TOP 3 PATHS (within existing spend authority)
   - Create payment links for any completed product
   - Activate existing leads list with Megaphone direct outreach
   - Post revenue-generating X content via Megaphone

4. LOG THE TRIGGER AND ACTIONS
   Agency HQ/Finance/Recovery/<date>-recovery-protocol.md
   Include: what triggered it, what actions taken, expected recovery timeline
```

---

## THE COMPOUNDING TRACKER

Stackz maintains a compounding ledger.
Every week, write an entry to: Agency HQ/Finance/Compounding/week-<N>.md

Template:
```
# Week <N> Compounding Report

Opening Balance: $<amount>
Revenue In: $<amount>
Expenses Out: $<amount>
Net: $<amount>
Closing Balance: $<amount>

Multiplier This Week: <revenue/expenses>
Cumulative Multiplier (from seed): <total_balance/initial_seed>

Best ROI spend this week: <vendor> — <actual multiplier>
Worst ROI spend this week: <vendor> — <actual multiplier>

Pool Status:
  Operational: $<amount> (<months> months of burn)
  Growth: $<amount>
  Reserve: $<amount>

On Track for Exponential Growth: YES / WATCH / NO

If WATCH or NO: [3 corrective actions]
```

Emit this report to the frontend Finance dashboard.
Include a chart showing cumulative_multiplier over time.
The chart should only ever go up. If it goes down, that is a signal.