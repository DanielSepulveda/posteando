# Pricing and billing

> Status: shape agreed; every price is illustrative until set before release 4.
> Words: in prose, "agency" means an organisation of type agency and "client" or "customer" means a brand. Code, schema and MCP always say organisation and brand (see [conventions.md](conventions.md)).

## Cost, pricing and billing

The goal is to run on tight margins and price below competitors, with Metricool (about $3 to $4 per brand) as the price anchor: no per-seat pricing, unlimited users, and running costs that scale with active brands. The strategy line is "your margin is my opportunity". The figures come from the [running costs and hosting doc](https://claude.ai/artifact/D7MNovwucfrwacyRGMxGeY) and the [pricing unit doc](https://claude.ai/artifact/DK99XftrzVYxUXsUFZue7C).

**Pricing shape**

- **Unit (agreed 2026-11-24).** An active brand per month: any work on it that month by the agency, its AI or MCP, but not portal views, background syncs or reading analytics. Graduated, illustrative prices MXN 99, 79 and 59. Daniel (2026-11-27): keep verifying that the per-brand unit is right as real use comes in, and price rich features competitively without forcing ourselves to be the cheapest. Unlimited users, guests free.
- **WhatsApp.** About 50 messages per active brand a month are included.
- **AI credits.** Pooled per organisation, priced at about 2.5 times model cost, with an included allowance of about USD 0.25 per active brand, prepaid packs and per-brand caps. Runs at organisation level charge the pool and are tagged to a brand when they are about one. MCP with the user's own model uses no credits. How credits are spent (agreed 2026-11-26): a fixed price per action (illustrative: 1 credit for a caption, 30 for a planned month), so agencies never see token maths; small background AI such as tagging and cataloguing is free; the agency sets priorities with an optional monthly cap per brand and switches for which features may spend; when credits run low, automatic background jobs pause first while anything a person asks for keeps working, with a warning at 80%.
- **Pro.** One flat price per organisation (illustrative MXN 399): advanced analytics, branded reports with the customer-facing analyst, AI insights, and the assistant with included credits that overflow into the organisation's credits. Autopilot unlocks with Pro and spends credits per month planned; the trend radar is included with no credits; prospect audits do not need Pro.
- **Free and trial.** A permanent free tier of one brand, which stays free after upgrading, and a 14-day trial without a card.
- **Paying.** Card first through Stripe, SPEI good to have for larger bills, annual prepay with two months free, one CFDI per organisation per month. No minimum charge (agreed 2026-11-26).
- **Designed now.** Usage metering fed by domain events, and an entitlements service in the core that every operation asks before plan-gated work, so prices and units can change without touching features.
- **Ports.** Billing goes through a payments port (Stripe first, a Mexican processor later). Tax invoices go through a separate per-country port; in Mexico it issues CFDI through a low-cost stamping provider at about MX$1 per stamp.

**Publishing on Inngest (rough estimate, figures from a November 2026 search)**

- Billing is per step. Publishing one publication is about 6 executions.
- An account receiving one publication a day is about 180 executions a month.
- The free tier (50,000 executions) carries about 275 such accounts. Pro (1 million included) carries about 5,500, under 2 cents per account per month.
- Pro is [$99 a month, with overage around $50 per extra million. We move to it once customers pay, at roughly 80 clients](https://www.inngest.com/pricing).
- The free tier allows 5 concurrent steps, which could pinch during a burst of posts at a popular hour.

**Cost drivers to watch**

- Running cost before AI is about $1 per client per month at 600 clients, about $2.90 at 30 and $0.76 at 3,000. AI adds roughly $0.50 to $1.50, metered through credits.
- WhatsApp is the largest line before AI, about $0.38 per client at Meta's Mexico rates, kept low by sending utility templates only and metered with an included allowance.
- Stripe fees, about 5.3% of revenue; the fixed fee per charge hurts small bills most.
- The fixed floor: Railway, Postgres with point-in-time recovery, Inngest Pro from about 80 clients, and about $1 a month of KMS.
- AI inference, kept low by model per task, caching and overnight batches. Trend data is a fixed cost of roughly $100 to $150 a month for Mexico. MCP users bring their own model at no cost to us.
- Video storage in R2 is small; old originals can move to cheaper storage with a light preview kept.
- Metric snapshot growth, handled by downsampling older data to daily, and polling volume, kept off the metered vendor and batched per account.
- CFDI stamping, about MX$1 per invoice.
