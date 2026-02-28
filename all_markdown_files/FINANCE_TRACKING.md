# FINANCE TRACKING SYSTEM — CASHFLOW

**Owner:** CASHFLOW (Finance Team Lead)  
**Purpose:** Track every dollar, forecast burn, keep Stackz Industries profitable.

---

## SYSTEM COMPONENTS

### 1. **ledger.json** — Transaction Log
Master record of all income and expenses. Append-only structure.

#### Transaction Schema
```json
{
  "transaction_id": "txn_[timestamp]_[seq]",
  "timestamp": "2026-02-13T05:50:00Z",
  "type": "expense | revenue",
  "category": "api_cost | media_gen | infrastructure | subscription | product_sale | service_revenue",
  "subcategory": "kimi_k2.5 | seedream | seedance | hosting | misc",
  "amount": 0.00,
  "currency": "USD",
  "team": "hr | marketing | dev | business | design | finance | shared",
  "project": "project_id or 'operational'",
  "agent": "agent_name (optional)",
  "description": "Human-readable description",
  "metadata": {
    "tokens_input": 0,
    "tokens_output": 0,
    "images_generated": 0,
    "videos_generated": 0,
    "api_endpoint": "",
    "invoice_id": "",
    "customer_id": ""
  }
}
```

### 2. **P&L_TEMPLATE.md** — Weekly Report Format
Template for Sunday reports. Populated from ledger.json data.

### 3. **FINANCE_TRACKING.md** (This File)
Documentation for the finance system.

---

## LOGGING TRANSACTIONS

### For API Costs (Kimi K2.5)
Every agent task that uses the API should log:

```json
{
  "transaction_id": "txn_1707808200_001",
  "timestamp": "2026-02-13T10:30:00Z",
  "type": "expense",
  "category": "api_cost",
  "subcategory": "kimi_k2.5",
  "amount": 0.055,
  "currency": "USD",
  "team": "marketing",
  "project": "operational",
  "agent": "ghost",
  "description": "Generated 3 tweet drafts for #buildinpublic campaign",
  "metadata": {
    "tokens_input": 50000,
    "tokens_output": 10000,
    "api_endpoint": "https://platform.moonshot.ai/v1/chat/completions"
  }
}
```

**Calculation:**
```
Input cost: (50,000 / 1,000,000) × $0.60 = $0.03
Output cost: (10,000 / 1,000,000) × $2.50 = $0.025
Total: $0.055
```

### For Media Generation (Seedream 3.0)
```json
{
  "transaction_id": "txn_1707808500_002",
  "timestamp": "2026-02-13T10:35:00Z",
  "type": "expense",
  "category": "media_gen",
  "subcategory": "seedream",
  "amount": 0.09,
  "currency": "USD",
  "team": "design",
  "project": "project_podcast_forge",
  "agent": "illustrator",
  "description": "Generated 3 social media graphics for PodCast Forge launch",
  "metadata": {
    "images_generated": 3
  }
}
```

### For Subscriptions (Seedance 2.0)
```json
{
  "transaction_id": "txn_1707800000_003",
  "timestamp": "2026-02-13T08:00:00Z",
  "type": "expense",
  "category": "subscription",
  "subcategory": "seedance",
  "amount": 9.60,
  "currency": "USD",
  "team": "shared",
  "project": "operational",
  "agent": null,
  "description": "Seedance 2.0 monthly membership for video generation",
  "metadata": {}
}
```

### For Revenue
```json
{
  "transaction_id": "txn_1707820000_004",
  "timestamp": "2026-02-13T14:00:00Z",
  "type": "revenue",
  "category": "product_sale",
  "subcategory": "saas_subscription",
  "amount": 29.00,
  "currency": "USD",
  "team": "dev",
  "project": "project_podcast_forge",
  "agent": null,
  "description": "PodCast Forge Pro subscription - user_abc123",
  "metadata": {
    "customer_id": "user_abc123",
    "plan": "pro_monthly",
    "invoice_id": "inv_001"
  }
}
```

---

## AUTOMATED TRACKING (Phase 2)

### Middleware Integration
Once we have stable API usage patterns, implement:

1. **API Call Logger** — Intercept all Kimi K2.5 API calls, log tokens automatically
2. **Media Gen Hooks** — Seedream/Seedance wrappers that auto-log on generation
3. **Cron Job** — Daily rollup at 23:59 to aggregate costs
4. **Sunday Report Generator** — Auto-populate P&L template from ledger.json

### Token Budget Enforcement
Each team gets a weekly token budget. When approaching limit, trigger alerts:

```json
{
  "team_budgets": {
    "hr": { "weekly_limit_usd": 15, "current_spend": 0, "remaining": 15 },
    "marketing": { "weekly_limit_usd": 25, "current_spend": 0, "remaining": 25 },
    "dev": { "weekly_limit_usd": 30, "current_spend": 0, "remaining": 30 },
    "business": { "weekly_limit_usd": 20, "current_spend": 0, "remaining": 20 },
    "design": { "weekly_limit_usd": 20, "current_spend": 0, "remaining": 20 },
    "finance": { "weekly_limit_usd": 10, "current_spend": 0, "remaining": 10 }
  }
}
```

Alert thresholds:
- 70% spent → notify team lead
- 90% spent → notify Stackz
- 100% spent → require approval for additional spend

---

## REPORTING CADENCE

### Weekly (Every Sunday)
**P&L Report** — Full revenue/expense breakdown, sent to Owner + Stackz

Contents:
- Executive summary (total revenue, expenses, net)
- Revenue breakdown by project
- Expense breakdown by team and category
- Cost efficiency metrics
- Burn rate analysis
- Forecasts for next 30 days
- Alerts and recommendations

### Monthly (First Sunday)
**Deep Dive Financial Review**

Additional contents:
- Month-over-month trend analysis
- Project ROI calculations
- Team budget utilization review
- Revised 90-day forecasts
- Strategic financial recommendations

### Ad-Hoc
**Project Financial Reviews** — Triggered when a project reaches:
- MVP launch
- First revenue
- $100 total spend
- Request from project lead

---

## FINANCIAL HEALTH METRICS

### Key Targets (Post-Revenue)
| Metric | Target | Current |
|--------|--------|---------|
| Monthly Recurring Revenue (MRR) | $1,000+ by Month 3 | $0 |
| Gross Margin | >80% | N/A |
| CAC Payback Period | <3 months | N/A |
| Net Profit Margin | >40% | N/A |
| Cash Runway | >6 months | Infinite (pre-revenue) |

### Efficiency Targets
| Metric | Target | Current |
|--------|--------|---------|
| Cost per Agent Task | <$0.50 | TBD |
| Token Cost per Project | <$20 for MVP | $0 |
| Revenue per Dollar Spent | >$5 | N/A |

---

## APPROVAL THRESHOLDS

### Automatic (No Approval Needed)
- Individual agent tasks <$1
- Weekly team spend within budget
- Recurring subscriptions already approved

### Team Lead Approval Required
- Single task >$1
- Any new subscription
- Project expense >$50 total

### Stackz Approval Required
- Any expense >$100
- New infrastructure commitment
- Budget increases for teams

### Owner Approval Required
- Capital expenditure >$500
- New service contracts
- Major infrastructure changes

---

## GETTING STARTED

### Week 1 Actions
1. ✅ Initialize ledger.json
2. ✅ Create P&L template
3. ⏳ Log first transactions manually (as teams begin work)
4. ⏳ Establish baseline token costs per team
5. ⏳ Generate first Sunday report (Feb 16)

### Week 2 Actions
1. Implement basic token tracking middleware
2. Set team budgets based on Week 1 usage
3. Create project expense tracking structure
4. Build automated report generator

### Week 3 Actions
1. Full automation of transaction logging
2. Real-time budget alerts
3. Per-project P&L breakdowns
4. Revenue tracking integration (if first project launches)

---

## INTEGRATION WITH OTHER TEAMS

### Finance → HR (Warden)
- **Weekly:** Team budget utilization reports
- **Monthly:** Agent cost efficiency analysis
- **Ad-hoc:** Alert when team exceeds budget

### Finance → Business (Radar)
- **Before approval:** Cost feasibility for new proposals
- **During development:** Project burn rate tracking
- **Post-launch:** ROI calculations

### Finance → Development (Forge)
- **Ongoing:** Infrastructure cost tracking
- **Monthly:** Tool/service cost optimization review

### Finance → Marketing (Megaphone)
- **Ongoing:** Campaign cost tracking (media gen, API usage)
- **Post-campaign:** CAC and ROAS calculations

### Finance → Design (Canvas)
- **Ongoing:** Media generation cost tracking
- **Monthly:** Cost per asset analysis

---

## FILES STRUCTURE

```
/data/.openclaw/workspace/
├── ledger.json                 # Master transaction log
├── P&L_TEMPLATE.md             # Weekly report template
├── FINANCE_TRACKING.md         # This file (system documentation)
├── finance/
│   ├── weekly_reports/
│   │   ├── 2026-02-16.md      # First Sunday report
│   │   └── 2026-02-23.md
│   ├── monthly_reports/
│   │   └── 2026-02.md
│   └── project_reports/
│       └── [project_id].md
└── budgets/
    └── team_budgets.json       # Weekly budget allocations
```

---

**System Status:** ✅ Initialized  
**Next Action:** Begin logging transactions as teams start work  
**First Report:** Sunday, February 16, 2026

---

*"Every dollar tracked. Every forecast modeled. No surprises. Just profit."* — CASHFLOW
