# Stripe MCP Server Integration

**Type**: Infrastructure / Financial Operations
**Created**: 2026-03-11
**Status**: Active

## Overview

Integrated `@stripe/mcp` into the Stackz agent architecture to enable full Stripe API access as native MCP tool calls.

## Configuration

### Claude Code (.claude.json)
```json
"stripe": {
  "command": "npx",
  "args": ["-y", "@stripe/mcp"],
  "env": {
    "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
  }
}
```

## Available MCP Tools

| Category | Tools |
|----------|-------|
| Customers | list, create, get, update, delete |
| Invoices | list, create, finalize, send, void, pay |
| Subscriptions | list, create, cancel, update |
| Payments | list, capture, refund |
| Payouts | list, create |
| Issued Cards | list, create, authorize, capture, cancel |
| Balance | get_balance |
| Transactions | list_transactions |

## Integration Points

### walletService.js
- Added `setMcpMode()` / `getMcpMode()` for toggling MCP-aware mode
- Added documentation for intent-before-action pattern

### Cashflow Soul (cashflow.md)
- Added MCP Integration section with available tools
- Added Safety Rules section

## Safety Rules

1. **Intent-Before-Action**: Cashflow questions every financial operation's intent before execution
2. **Hard Limits**: Daily spend increases capped at 20% without approval
3. **Category Restrictions**: Agents can only spend in pre-approved categories
4. **Approval Required**: New vendor relationships require Cashflow review + user approval
5. **Audit Trail**: All operations logged to SQLite + Obsidian vault

## Related

- Soul: [cashflow.md](../../backend/souls/cashflow.md)
- Service: [walletService.js](../../backend/services/walletService.js)
- MCP Server: [Stripe Documentation](https://stripe.com/docs)