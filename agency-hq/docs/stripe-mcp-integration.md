---
id: stripe-mcp-2026-03-11
type: integration
status: active
tags: [stripe, mcp, finance, integration]
created: 2026-03-11
---

# Stripe MCP Server Integration

## Overview
Integrated official `@stripe/mcp` server into the Stackz agent architecture for direct Stripe API access.

## Configuration

### Claude Code (.claude.json)
```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

## Available Tools

### Customer Management
- `stripe_list_customers` - List all customers
- `stripe_create_customer` - Create new customer
- `stripe_get_customer` - Get customer details

### Invoice Operations
- `stripe_list_invoices` - List invoices
- `stripe_create_invoice` - Create invoice
- `stripe_finalize_invoice` - Finalize and send
- `stripe_void_invoice` - Void invoice
- `stripe_pay_invoice` - Pay/collect invoice

### Subscriptions
- `stripe_list_subscriptions` - List subscriptions
- `stripe_create_subscription` - Create subscription
- `stripe_cancel_subscription` - Cancel subscription
- `stripe_update_subscription` - Update subscription

### Payments
- `stripe_list_payments` - List payments
- `stripe_capture_payment` - Capture payment
- `stripe_refund_payment` - Issue refund

### Payouts
- `stripe_list_payouts` - List payouts
- `stripe_create_payout` - Create payout

### Issued Cards (Stripe Issuing)
- `stripe_list_cards` - List virtual cards
- `stripe_create_card` - Create virtual card
- `stripe_authorize_card` - Authorize card
- `stripe_capture_card` - Capture authorization
- `stripe_cancel_card` - Cancel card

### Financial Data
- `stripe_get_balance` - Get account balance
- `stripe_list_transactions` - List transactions

## Safety Rules

### Intent-Before-Action Pattern
1. Agent proposes action (e.g., "Create invoice for $X")
2. Cashflow reviews and questions intent
3. User approves in Approval Inbox
4. Only then does the actual Stripe MCP call execute

### Hard Limits
- Daily spend limit increase: max 20% without approval
- Per-transaction limits per agent
- Category restrictions (whitelist approach)

## Related
- Soul: [cashflow.md](../backend/souls/cashflow.md)
- Service: [walletService.js](../backend/services/walletService.js)
- Skills: [self-optimize.json](../skills/self-optimize.json)