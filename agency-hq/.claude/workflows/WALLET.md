---
name: Agent Wallet & Financial Autonomy
file: WALLET.md
schedule: Passive (event-driven) + Nightly reconciliation 11:00 PM
cron: 0 23 * * *
session: Passive triggers = inline | Nightly = isolated
agents:
  - Cashflow (owner, financial operations)
  - Stackz (infrastructure setup)
  - Smoke (spend reviewer, anomaly detection)
  - All teams (spenders via virtual cards)
---

# Agent Wallet & Financial Autonomy

## Overview

A programmable money layer wired directly into the agent architecture. Every agent team gets a virtual card with hard-coded spend limits enforced at the infrastructure level, not by prompts. Revenue flows in via Stripe Connect, spending flows out via Stripe Issuing, and all transactions are logged to SQLite + Obsidian.

## Architecture

### Components

1. **Stripe Financial Account (Treasury)** - Master wallet, USD-denominated, FDIC-eligible
2. **Stripe Issuing (Spend Layer)** - Virtual cards per agent with spending limits
3. **Stripe Connect (Revenue Layer)** - Incoming payments from ventures
4. **Stripe Agent Toolkit (Action Layer)** - Structured API calls for agents

### Flow
- Revenue IN → Stripe Connect → Financial Account
- Spending OUT → Virtual cards → Funded by Financial Account
- All logged → SQLite + Obsidian + Briefing page

---

## Initial Setup (One-time, Stackz executes)

### Step 1: Enable Stripe Capabilities
Required capabilities: `issuing`, `treasury`

```bash
# Submit capability request via Stripe Dashboard or API
POST /api/stripe/setup/enable-capabilities
{ "capabilities": ["issuing", "treasury"] }
```

Log to: `Agency HQ/Ops/stripe-setup-<date>.md`

### Step 2: Create Master Financial Account

```javascript
const financialAccount = await stripe.treasury.financialAccounts.create({
  supported_currencies: ['usd'],
  features: {
    card_issuing: { requested: true },
    deposit_insurance: { requested: true },
    financial_addresses: { ach: { requested: true } },
    inbound_transfers: { ach: { requested: true } },
    outbound_payments: { ach: { requested: true } }
  }
});
```

Store in `backend/config/stripe.json`:
```json
{
  "financial_account_id": "<id>",
  "routing_number": "<ach routing>",
  "account_number_last4": "<last4>"
}
```

### Step 3: Create Agent Cardholders

```javascript
const cardholders = [
  { name: "Stackz — Build Team", agent: "stackz", team: "build" },
  { name: "Radar — Strategy Team", agent: "radar", team: "strategy" },
  { name: "Megaphone — Marketing", agent: "megaphone", team: "marketing" },
  { name: "Ghost — Content", agent: "ghost", team: "content" },
  { name: "Cashflow — Finance", agent: "cashflow", team: "finance" },
  { name: "Forge — Infrastructure", agent: "forge", team: "infra" },
  { name: "Warden — Operations", agent: "warden", team: "ops" }
];
```

### Step 4: Issue Virtual Cards Per Agent

**Spend Limits:**
```javascript
const spendLimits = {
  stackz:    { daily: 5000,  monthly: 50000,  per_tx: 2000 },
  radar:     { daily: 500,   monthly: 5000,   per_tx: 200 },
  megaphone: { daily: 1000,  monthly: 10000,  per_tx: 500 },
  ghost:     { daily: 200,   monthly: 2000,   per_tx: 100 },
  cashflow:  { daily: 10000, monthly: 100000, per_tx: 5000 },
  forge:     { daily: 2000,  monthly: 20000,  per_tx: 1000 },
  warden:    { daily: 500,   monthly: 5000,   per_tx: 250 }
};
```

**Merchant Category Allowlists:**
```javascript
const merchantAllowlists = {
  stackz: ["computer_programming", "software_stores", "cloud_services", "subscription_services"],
  radar: ["research_services", "subscription_services", "information_retrieval"],
  megaphone: ["advertising_services", "social_media_advertising", "subscription_services"],
  ghost: ["subscription_services", "computer_programming"],
  cashflow: ["all"],  // Broadest access for financial ops
  forge: ["computer_programming", "cloud_services", "data_processing"],
  warden: ["subscription_services", "software_stores"]
};
```

---

## Backend Services

### walletService.js

**requestSpend(agentId, amount, vendor, purpose, category)**
- Validates spend within limits
- Validates vendor category
- Returns masked card details or decline
- Logs to SQLite + Obsidian
- Emits socket event

**logRevenue(source, amount, paymentIntentId, ventureId)**
- Records incoming revenue
- Updates venture financials
- Emits socket event

**getBalance()**
- Returns real-time Financial Account balance

**getSpendByAgent / getSpendByTeam**
- Returns spend breakdowns

---

## Real-time Authorization Webhook

`POST /api/webhooks/stripe/issuing-authorization`

Runs synchronously before every transaction:

1. Identify agent from card metadata
2. Check daily spend (SQLite)
3. Validate vendor category
4. Run Smoke's anomaly detection:
   - New vendor?
   - >2x typical transaction?
   - Outside operating hours (2 AM - 10 PM)?
   - Unusual spend rate?
5. Approve / Flag / Decline

---

## SQLite Schema

```sql
CREATE TABLE wallet_transactions (
  id INTEGER PRIMARY KEY,
  stripe_transaction_id TEXT UNIQUE,
  type TEXT,  -- spend | revenue | transfer | refund
  agent_id TEXT,
  team TEXT,
  amount INTEGER,  -- cents
  currency TEXT DEFAULT 'usd',
  vendor TEXT,
  category TEXT,
  description TEXT,
  status TEXT,  -- authorized | settled | declined | refunded
  venture_id TEXT,
  authorized_at TEXT,
  settled_at TEXT,
  flagged INTEGER DEFAULT 0,
  flag_reason TEXT,
  stripe_payload TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallet_balances (
  id INTEGER PRIMARY KEY,
  snapshot_at TEXT,
  available INTEGER,
  pending INTEGER,
  restricted INTEGER,
  recorded_by TEXT
);

CREATE TABLE agent_spend_limits (
  id INTEGER PRIMARY KEY,
  agent_id TEXT UNIQUE,
  card_id TEXT,
  cardholder_id TEXT,
  daily_limit INTEGER,
  monthly_limit INTEGER,
  per_tx_limit INTEGER,
  allowed_categories TEXT,
  last_updated TEXT,
  updated_by TEXT
);

CREATE TABLE revenue_records (
  id INTEGER PRIMARY KEY,
  stripe_payment_intent_id TEXT UNIQUE,
  source TEXT,
  source_type TEXT,
  amount INTEGER,
  venture_id TEXT,
  received_at TEXT,
  notes TEXT
);
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wallet/balance | Real-time balance |
| GET | /api/wallet/transactions | Filtered history |
| GET | /api/wallet/spend-by-agent | Spend by agent |
| GET | /api/wallet/revenue | Revenue records |
| GET | /api/wallet/agent/:id/limits | Agent limits |
| POST | /api/wallet/agent/:id/limits | Update limits |
| GET | /api/wallet/runway | Burn rate & runway |
| POST | /api/webhooks/stripe/issuing-authorization | Card auth |
| POST | /api/webhooks/stripe/payment-intent-succeeded | Revenue |
| POST | /api/webhooks/stripe/treasury-received-credit | ACH receipt |

---

## Cashflow Daily Routine

**7:00 AM** — Morning brief financial section
- Agent limit status
- Overnight spend anomalies
- Pending invoices

**6:00 PM** — Daily snapshot
`Agency HQ/Finance/Daily/<YYYY-MM-DD>.md`

**11:00 PM** — Nightly reconciliation
- Sync Stripe → SQLite
- Update venture P&L
- Agent spend health check
- Write reconciliation report

---

## Security Rules (Non-negotiable)

1. **No external transfers** without Approval Inbox entry
2. **No raw card numbers** — always masked
3. **$500+ transactions** logged to Obsidian immediately
4. **Balance < $500** → auto-freeze all cards + critical alert
5. **No new cardholders** without Approval Inbox
6. **Webhook signature verification** required on all endpoints
7. **Limit increases** max 20%/day; above requires approval

---

## Soul File Updates

### Cashflow
```
## Wallet Protocol
I am the financial operator of the swarm.
I watch the balance the way a CFO watches cash flow.

I do not wait to be asked — I report daily.
I flag anomalies the moment the webhook fires.
I write to the Zettelkasten when I see financial patterns.

I never touch card numbers. I never initiate large transfers
without an approval trail. I treat Jaleel's money with the
same care I'd treat my own.

When runway drops below 60 days I escalate.
When an agent exceeds 80% of their monthly limit I notify.
When revenue doesn't match projections I investigate.
```

### All Agents
```
## Financial Protocol
When I need to spend money, I call walletService.requestSpend().
I never attempt to access card numbers directly.
I document every spend with a clear purpose and vendor.
I do not spend outside my allowed merchant categories.
If I need something outside my limits, I submit to Approval Inbox.
I never try to work around spending controls.
```

---

## OpenClaw Cron Registration

```bash
# Nightly reconciliation
openclaw cron add \
  --name "Nightly Financial Reconciliation" \
  --cron "0 23 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Run Cashflow's nightly reconciliation. Sync Stripe to SQLite, update venture P&L, check agent spend health, write reconciliation report to Agency HQ/Finance/Reconciliation/." \
  --announce
```