---
description: Run the daily launch-radar scan across all 13 platforms for competitive intel and trending products
---

Run the full launch-radar daily scan across all 13 platforms. Use the launch-radar skill.

Priority order:
1. Product Hunt — fetch today's top 10 launches, extract name/tagline/upvotes/category
2. Hacker News Show HN — search via https://hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=created_at_i>[unix timestamp 24h ago] — extract posts with 10+ points
3. Indie Hackers /products newest — extract new listings from last 48h
4. BetaList — today's featured startups
5. Uneed + Fazier + Microlaunch — top 3 products each

For each platform:
- Note any products that directly compete with our active ventures
- Note any trending categories that match our pipeline ideas
- Note any opportunity signals (a gap in the market, a competitor shutting down)

Output the scan digest in the format defined in launch-radar/SKILL.md.

Route the digest to Stackz. Flag anything competitive as HIGH PRIORITY.
