# LEDGER SCHEMA
*Transaction field definitions for the finance ledger*

---

## OVERVIEW

All financial transactions are logged in `transactions.json`. This document defines the schema and data standards.

---

## TRANSACTION OBJECT

```json
{
  "id": "txn_YYYYMMDD_HHMMSS",
  "date": "2026-03-06",
  "type": "income | expense",
  "amount": 1500.00,
  "currency": "USD",
  "venture": "venture-slug",
  "category": "category_name",
  "description": "Transaction description",
  "vendor": "Vendor name (expenses)",
  "customer": "Customer name (income)",
  "payment_method": "card | bank | paypal | stripe | cash | other",
  "status": "pending | completed | failed | refunded",
  "invoice_id": "INV-YYYYMMDD-NNN",
  "metadata": {},
  "created_at": "2026-03-06T12:00:00Z",
  "updated_at": "2026-03-06T12:00:00Z"
}
```

---

## FIELD DEFINITIONS

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique transaction ID |
| `date` | string | Transaction date (YYYY-MM-DD) |
| `type` | enum | income or expense |
| `amount` | number | Decimal amount (positive) |
| `venture` | string | Venture slug (e.g., agency-hq, podcast-forge) |
| `category` | string | Category tag |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `currency` | string | ISO currency code (default: USD) |
| `description` | string | Free-form description |
| `vendor` | string | Vendor name (for expenses) |
| `customer` | string | Customer name (for income) |
| `payment_method` | enum | How payment was made |
| `status` | enum | Transaction status |
| `invoice_id` | string | Link to invoice if applicable |
| `metadata` | object | Additional key-value data |
| `created_at` | ISO timestamp | When record was created |
| `updated_at` | ISO timestamp | Last update time |

---

## ENUM VALUES

### type
- `income` — Money received
- `expense` — Money paid out

### category (Income)
- `product_sales` — Revenue from product sales
- `subscription` — Recurring subscription revenue
- `service` — Service-based income
- `affiliate` — Affiliate commissions
- `refund_received` — Refunds from vendors
- `other_income` — Miscellaneous income

### category (Expense)
- `infrastructure` — Server, hosting, domain costs
- `software` — SaaS subscriptions, tools
- `marketing` — Ads, campaigns, promotions
- `contractors` — Freelancer, contractor payments
- `api_spend` — Third-party API costs
- `payroll` — Employee/contractor payments
- `office` — Office supplies, equipment
- `legal` — Legal fees, compliance
- `travel` — Business travel
- `training` — Education, courses
- `refund_issued` — Refunds to customers
- `other_expense` — Miscellaneous expenses

### payment_method
- `card` — Credit/debit card
- `bank` — Bank transfer
- `paypal` — PayPal
- `stripe` — Stripe payment
- `cash` — Cash
- `crypto` — Cryptocurrency
- `other` — Other method

### status
- `pending` — Awaiting payment
- `completed` — Payment received/processed
- `failed` — Payment failed
- `refunded` — Fully refunded
- `partially_refunded` — Partially refunded

---

## VENTURE SLUGS

| Venture | Slug |
|---------|------|
| Agency HQ | agency-hq |
| [Active Venture 1] | [slug-1] |
| [Active Venture 2] | [slug-2] |
| Internal | internal |

---

## VALIDATION RULES

1. All required fields must be present
2. Amount must be positive number
3. Date must be valid ISO format
4. Venture must match registered slug
5. Category must be from allowed list
6. Status transitions: pending → completed | failed

---

## EXAMPLE RECORDS

### Income Example
```json
{
  "id": "txn_20260306_120000",
  "date": "2026-03-06",
  "type": "income",
  "amount": 99.00,
  "currency": "USD",
  "venture": "podcast-forge",
  "category": "subscription",
  "description": "Monthly subscription - Pro plan",
  "customer": "John Doe",
  "payment_method": "stripe",
  "status": "completed",
  "invoice_id": "INV-20260306-001",
  "created_at": "2026-03-06T12:00:00Z",
  "updated_at": "2026-03-06T12:00:00Z"
}
```

### Expense Example
```json
{
  "id": "txn_20260306_120001",
  "date": "2026-03-06",
  "type": "expense",
  "amount": 25.00,
  "currency": "USD",
  "venture": "agency-hq",
  "category": "infrastructure",
  "description": "Hostinger VPS - March 2026",
  "vendor": "Hostinger",
  "payment_method": "card",
  "status": "completed",
  "created_at": "2026-03-06T12:00:00Z",
  "updated_at": "2026-03-06T12:00:00Z"
}
```

---

## QUERYING THE LEDGER

### Common Queries
```bash
# All transactions for a venture
jq '.[] | select(.venture == "podcast-forge")' transactions.json

# This month's income
jq '[.[] | select(.date | startswith("2026-03") and .type == "income")] | map(.amount) | add' transactions.json

# Pending payments
jq '[.[] | select(.status == "pending")]' transactions.json
```
