# WALLET AUTONOMOUS SKILL
# Load this before any self-directed financial action.
# Always load alongside WALLET_SKILL.md and CASHFLOW_SKILL.md.

---

## WHAT THIS SKILL ENABLES

This skill governs how Stackz and Smoke autonomously:
- Pay for API usage (Ollama, Anthropic, OpenAI, Brave, etc.)
- Purchase and upgrade tools
- Trial new tools before committing
- Fund marketing campaigns and launch pushes
- Access approved vendor lists

This is DIFFERENT from WALLET_SKILL.md (which handles reconciliation
and Cashflow's CFO duties). This skill is for SPENDING DECISIONS.

---

## PRE-SPEND PROTOCOL (MANDATORY — EVERY TIME)

Before executing any spend, run this sequence:

```
1. READ PRIME DIRECTIVE
   cat Agency HQ/Agents/stackz/WALLET_PRIME_DIRECTIVE.md

2. CALCULATE MULTIPLIER
   Use ollamaService.thinkFast() with prompt:
   "Given this spend: [DESCRIPTION] at [COST]/[PERIOD],
    what is the projected return multiplier?
    Consider: time saved, quality improvement, revenue enabled.
    Return JSON: { multiplier: float, confidence: 'high'|'medium'|'low',
                   return_path: string, time_to_return: string }"

3. CHECK POOL AVAILABILITY
   GET /api/wallet/pools
   Confirm the relevant pool has sufficient balance.

4. CHECK VENDOR APPROVAL
   GET /api/wallet/vendors/approved?name=<vendor>
   If not approved and cost > $50: add to APPROVED_VENDORS first (see below).

5. WRITE INTENT NOTE (always, no exceptions)
   File: Agency HQ/Finance/Intent/<date>-<agent>-<vendor>-<slug>.md
   Include: multiplier, return_path, pool_source, amount

6. SMOKE CO-SIGN (if cost > $100)
   Call SMOKE_REVIEW with the intent note as the diff.
   Smoke must return APPROVE before proceeding.

7. EXECUTE VIA STRIPE MCP
   Use the card assigned to the spend category.

8. LOG THE EXPENSE
   POST /api/wallet/expense/log { ... }
   Write to Agency HQ/Finance/Expenses/<date>-<vendor>.md
```

---

## SPEND CATEGORIES AND THEIR CARDS

Each category has a dedicated virtual Stripe Issuing card.
Never use a category's card for a different category's expense.

| Category | Card Name | Monthly Budget | Pool |
|----------|-----------|---------------|------|
| API Credits | stackz-api | $500 | Operational |
| Tools & SaaS | stackz-tools | $300 | Operational |
| Infrastructure | stackz-infra | $400 | Operational |
| Marketing | stackz-growth | $500 | Growth |
| Campaigns | stackz-launch | $1,000 | Growth |
| Tool Trials | stackz-trial | $150 | Growth |
| Emergency | stackz-reserve | $0 default | Reserve |

Card retrieval: GET /api/wallet/cards?category=<category>
Balance check: GET /api/wallet/cards/<card_id>/balance

---

## APPROVED VENDORS LIST

Vendors pre-approved for autonomous spend (within category budgets):

### API PROVIDERS (stackz-api card)
- Anthropic (claude API) — auto-renew credits when < $20 remaining
- Ollama Cloud — auto-renew when credits < 100k tokens
- OpenAI — for comparison experiments only, cap $50/month
- Brave Search API — auto-renew when requests < 1,000 remaining
- Resend (email) — auto-renew when < 500 emails remaining
- Twilio — if Telegram MCP requires it
- AssemblyAI — transcription if needed for content workflows

### TOOLS & SAAS (stackz-tools card)
- GitHub (Copilot, Actions minutes) — within limits
- Vercel — deployment, auto-renew
- Railway / Render — backend hosting
- Cloudflare — DNS, Workers if needed
- Supabase — if SQLite migrates to hosted
- Linear — project tracking (Jaleel approval first time)
- Notion API — if vault-alternative needed

### INFRASTRUCTURE (stackz-infra card)
- AWS (S3, Lambda) — only pre-approved services
- DigitalOcean — VPS if needed for heavy workloads
- Cloudflare R2 — storage
- Upstash (Redis) — caching layer if needed

### MARKETING (stackz-growth card)
- X/Twitter Ads — Megaphone manages, Smoke approves campaigns
- Meta Ads — only after first campaign approved by Jaleel
- Google Ads — only after first campaign approved by Jaleel
- Beehiiv — newsletter if content strategy calls for it
- Kit (ConvertKit) — email marketing

### TOOL TRIALS (stackz-trial card)
Any new tool can be trialed for up to $50/month if:
- It is not on the approved list yet
- The multiplier calculation shows > 3x potential
- Smoke approves the trial
- Trial period is capped at 30 days before a keep/cancel decision

Adding a vendor to approved list after successful trial:
POST /api/wallet/vendors/approve { name, category, monthly_cap, justification }

---

## AUTO-RENEWAL RULES (no approval needed)

These execute automatically when thresholds are hit:

```javascript
const AUTO_RENEW_RULES = [
  {
    vendor: 'Anthropic',
    trigger: 'api_credits < $20',
    action: 'purchase $100 credits',
    card: 'stackz-api',
    pool: 'operational',
    max_per_month: 3  // max 3 top-ups = $300/month cap
  },
  {
    vendor: 'Ollama',
    trigger: 'remaining_tokens < 100000',
    action: 'purchase standard pack',
    card: 'stackz-api',
    pool: 'operational',
    max_per_month: 2
  },
  {
    vendor: 'Brave Search',
    trigger: 'remaining_requests < 1000',
    action: 'purchase next tier',
    card: 'stackz-api',
    pool: 'operational',
    max_per_month: 1
  }
];
```

Wire these into backend/services/autoRenewalService.js.
Run the check every 6 hours via scheduler:
cron.schedule('0 */6 * * *', autoRenewalService.check)