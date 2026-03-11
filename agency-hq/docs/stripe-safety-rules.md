---
id: stripe-safety-rules
type: safety
status: active
tags: [stripe, safety, financial-operations]
created: 2026-03-11
---

# Stripe Financial Operations Safety Rules

## Core Principle: Intent-Before-Action

**Before any Stripe API call executes, the following must occur:**

1. **Proposal Phase**: Agent describes intended action (e.g., "Create invoice for $500")
2. **Review Phase**: Cashflow reviews and questions the intent
3. **Approval Phase**: User approves in Approval Inbox (or auto-approve for routine below threshold)
4. **Execution Phase**: Stripe MCP call executes

## Hard Limits

### Spend Limits
| Limit Type | Value | Requires Approval |
|------------|-------|-------------------|
| Per-transaction | Configured per agent | If above limit |
| Daily increase | Max 20% | Yes - always |
| Monthly limit | Configured per agent | If above limit |
| Category | Whitelist only | Adding new category |

### Approval Tiers
- **Auto-approve**: Routine operations within established limits
- **Cashflow review**: New vendors, category changes, limit increases
- **User approval**: Any operation above user's configured threshold

## Agent Card Restrictions

### Category Whitelist
Each agent has predefined allowed categories:
- `software` - SaaS subscriptions, tools
- `infrastructure` - Cloud services, hosting
- `services` - APIs, external services
- `all` - Unrestricted (only Cashflow)

### Limit Enforcement
```javascript
// walletService.js enforces:
// 1. Per-transaction limit check
// 2. Daily spend accumulation check
// 3. Monthly spend accumulation check
// 4. Category whitelist check
```

## Audit Trail

All financial operations must log to:
- **SQLite**: `wallet_transactions` table
- **Obsidian**: Approval decision notes in `Agency HQ/Approvals/`

## Emergency Stop

In case of suspicious activity:
1. Revoke Stripe API key from MCP config
2. Cancel any pending card authorizations
3. Review recent transactions in walletService logs

## Related
- Soul: [cashflow.md](../backend/souls/cashflow.md)
- Integration: [stripe-mcp-integration.md](stripe-mcp-integration.md)