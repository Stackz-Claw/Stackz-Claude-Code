# MOAT FRAMEWORK
*Used by: moat agent | Applied to every venture that graduates to the Stability portfolio*

---

## WHAT IS A MOAT?

A moat is anything that makes it harder for a competitor to take your customers. Moats don't prevent competition — they make competition expensive. Every venture needs at least one moat that deepens over time. A venture without a moat is renting customers.

---

## THE FIVE MOAT TYPES

### 1. SWITCHING COST MOATS

Customers stay because leaving is painful — not because you're perfect.

**How to build:**
- Deep integrations with customer tools (Zapier flows, Slack bots, browser extensions, API integrations built on top of your product)
- Data accumulation that's hard to export (historical records, trained models, configuration)
- Custom workflows built inside your product
- Team-wide adoption (the more teammates use it, the harder it is for one person to switch)

**Measurement:**
- % of customers with 2+ integrations active
- Average data volume per customer
- Time-to-setup for a new customer (proxy for how long teardown takes)
- Churn rate vs. integration depth correlation

**Moat strength indicators:**
- 🟢 Strong: > 60% of customers have 2+ integrations; churned customers cite "migration effort" in exit surveys
- 🟡 Moderate: Most customers use core product only; few integrations
- 🔴 Weak: One-click export to CSV; no integrations; customers can leave in an afternoon

---

### 2. DATA MOATS

Your product gets better the more people use it, because it accumulates proprietary data.

**How to build:**
- Aggregate anonymized usage patterns to improve recommendations
- Build models on customer data that improve your product (not just theirs)
- Create benchmarks or industry reports from aggregate data
- Log and use behavioral signals to improve onboarding, feature recommendations, churn prediction

**Works best for:** AI products, marketplaces, analytics tools, recommendation engines

**Measurement:**
- Does our product produce better outputs with 10K customers than with 100?
- Do we have data a competitor starting today couldn't replicate for 2+ years?

**Moat strength indicators:**
- 🟢 Strong: Proprietary training data; product measurably improves with scale; competitors cannot buy this data
- 🟡 Moderate: We have data but don't use it to improve the product yet
- 🔴 Weak: We store user data but it doesn't compound into product improvements

---

### 3. NETWORK MOATS

Each new user makes the product more valuable for existing users.

**How to build:**
- Shared workspaces (teams invite teammates)
- Public profiles or portfolios (users want to be found)
- Marketplaces or directories (more sellers → more buyers → more sellers)
- Referral programs with genuine product value (not just discounts)

**Measurement:**
- Viral coefficient (K-factor): does each user bring in >1 other user?
- % of users who joined because another user shared/invited
- DAU/MAU ratio (high stickiness = network is working)

**Moat strength indicators:**
- 🟢 Strong: K-factor > 0.7; users recruit other users without incentive
- 🟡 Moderate: Some sharing behavior; referral program active but not viral
- 🔴 Weak: Product is solo-use only; no sharing mechanic; each acquisition is independent

---

### 4. BRAND MOATS

You become the default name for your category in your target customer's mind.

**How to build:**
- Consistent, high-quality content that educates the market
- Thought leadership (you define the vocabulary of the space)
- Case studies and social proof at scale
- Community building (Slack groups, Discord, forums where customers help each other)
- Category creation ("the X for Y" that you name before competitors do)

**Measurement:**
- Branded search volume (do people search for your product name, not just the category?)
- NPS and qualitative survey responses mentioning trust/reputation
- Press and backlink quality
- Community size and engagement

**Moat strength indicators:**
- 🟢 Strong: Customers recommend you by name; significant branded search; community is self-sustaining
- 🟡 Moderate: Positive reputation in niche; some word-of-mouth; no dominant brand presence
- 🔴 Weak: Customers found you via generic search; brand is interchangeable with competitors

---

### 5. DISTRIBUTION MOATS

You have access to customers that competitors don't — and you've locked it in.

**How to build:**
- Exclusive partnerships with distribution channels (platforms, agencies, resellers)
- SEO dominance on high-intent keywords (takes 12-18 months to build; very durable)
- Marketplace listings (App Store, Shopify, Zapier) with strong review counts
- Email lists with high engagement
- Integration partnerships where your product lives inside another product

**Measurement:**
- % of new customers coming from locked/exclusive channels
- Organic vs. paid acquisition ratio (organic = durable; paid = rented)
- SEO keyword rankings for money terms
- Partner-sourced revenue %

**Moat strength indicators:**
- 🟢 Strong: > 50% of acquisition from channels competitors can't easily replicate; dominant SEO position
- 🟡 Moderate: Some organic and partnership traction; still mostly paid/generic channels
- 🔴 Weak: All acquisition is paid or manual outreach; nothing proprietary

---

## MOAT STATUS TEMPLATE

Used in `stability/portfolio/[venture-slug]/MOAT_STATUS.md`:

```markdown
# MOAT STATUS — [Venture Name]
Last updated: [date] | Assessed by: moat

## Current Moat Inventory

| Moat Type | Strength | Key Assets | 30-Day Priority |
|-----------|----------|------------|-----------------|
| Switching Costs | 🟢/🟡/🔴 | [what exists] | [what to build] |
| Data | 🟢/🟡/🔴 | | |
| Network | 🟢/🟡/🔴 | | |
| Brand | 🟢/🟡/🔴 | | |
| Distribution | 🟢/🟡/🔴 | | |

## Primary Moat (most defensible asset):
[Name the one moat we'd defend at all costs]

## Moat Building Priorities This Quarter:
1. [Highest leverage action]
2. [Second priority]
3. [Third priority]

## Competitive Threat Assessment:
[Is any competitor threatening our primary moat? What are they doing?]
```
