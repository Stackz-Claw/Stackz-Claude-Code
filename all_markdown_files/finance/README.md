# FINANCE TEAM — CASHFLOW
**Team Lead:** `CASHFLOW`  
**Mission:** Track every dollar in and out. Forecast where we're going. Keep every venture profitable. Make sure the company never runs out of money without seeing it coming.

---

## TEAM ROSTER

| Agent | Role | Model | Clearance |
|-------|------|-------|-----------|
| `cashflow` | Finance Lead — P&L, budgets, financial decisions, cross-venture reporting | Kimi K2.5 (Thinking) | Tier 3 |
| `ledger` | Transaction Tracker — logs all income and expenses, categorizes, reconciles | Local Script + Spreadsheet Skill | Tier 3 |
| `forecaster` | Revenue Projections — models scenarios, projects burn rate, runway | Kimi K2.5 Agent + Code Interpreter | Tier 3 |
| `billing` | Invoice Generation — creates invoices, tracks payment status, flags overdue | Local Script + OpenClaw Cron | Tier 3 |

---

## DIRECTORIES

```
finance/
├── README.md                    ← This file
├── agents/
│   ├── SOUL_cashflow.md
│   ├── SOUL_ledger.md
│   ├── SOUL_forecaster.md
│   └── SOUL_billing.md
├── ledger/
│   ├── LEDGER_SCHEMA.md         ← Transaction field definitions
│   ├── transactions.json        ← Running transaction log (ledger writes here)
│   └── [YYYY-MM]-reconciliation.md ← Monthly reconciliation reports
└── reports/
    ├── WEEKLY_PNL_TEMPLATE.md   ← Weekly P&L report format
    ├── MONTHLY_FORECAST_TEMPLATE.md ← Monthly forecast format
    └── [reports archive]        ← Named: YYYY-MM-[type]-report.md
```

---

## FINANCIAL CONTROLS

- No financial action is taken by any finance agent without Stackz awareness
- `billing` generates invoices; humans send them (or explicit approval for automation)
- All API spend tracked per venture — no unattributed costs
- Weekly report to Stackz, monthly report to owner
- Any single-venture monthly burn exceeding $500 requires Stackz review

---

## PER-VENTURE TRACKING

Every active venture in `startup/ventures/` and `stability/portfolio/` has a corresponding entry in `ledger/transactions.json` with the venture slug as a tag. Cashflow can produce per-venture P&L at any time.

---

## CROSS-TEAM INTERFACES

- **Receives from Startup (Founder):** New venture → set up tracking
- **Receives from Dev (Forge):** Infrastructure costs, API usage
- **Receives from Marketing (Megaphone):** Campaign spend
- **Delivers to:** All teams (budget status), Stackz (weekly P&L), Owner (monthly report)
