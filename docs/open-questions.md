# Open questions, parked ideas and rejected options

> Status: nothing in this file is decided. A build session must not build around an open question by guessing; it asks, or builds the settled part and leaves a clean seam. Rejected options are listed so nobody re-proposes them without new facts.

## Needed before or during release 0

| Question | Who decides | Blocks |
| --- | --- | --- |
| The domain: posteando.io or posteando.mx | Daniel | The first deploy (passkeys, Meta app, gateway callbacks, R2 media domain, privacy pages bind to it) |
| Exact Meta permission list for Instagram (via Facebook Login) and Page publishing plus insights | Check Meta docs, week 1 | Meta app setup |
| Whether a second Meta app is needed for Instagram Login later | Check Meta docs, week 1 | Nothing in release 0 |
| Newest MCP spec version both Effect's McpServer and better-auth's MCP plugin support | Spike, week 1 | MCP surface |
| Does Drizzle's Effect driver work on Effect 4.1 | Spike, week 1 | Data layer (fallback ready) |
| Verify Meta's "Require App Secret" setting with `appsecret_proof` on | Check during gateway work | Nothing |
| Whether the pilots' Instagram accounts are linked to a Facebook Page | Daniel | If not, Instagram Login moves earlier than release 4 (release 1 work) |

## Settle during a release

| Question | By |
| --- | --- |
| The "Sin confirmar" pill for the outcome unknown state (proposed in the design system) | Release 1 |
| Headless React component library (Base UI is the lean) | Release 1 |
| Organisation switcher design for a person in two organisations | Release 1 |
| Instagram's video limits, for the normalising step | Release 1 |
| Per-network format capability matrix, and which formats need assisted publishing | Release 1 (IG, FB), 4 (TikTok) |
| Which network settings each adapter exposes first | Release 1 |
| Whether Instagram and TikTok publishing APIs can attach library music (believed not) | Release 1 |
| Transcription provider (Groq or Deepgram, tested on Mexican Spanish) | Release 2 |
| Meta's template approval for approval messages, and the official Mexico WhatsApp rate card | Release 2 |
| Verify Meta's AI Providers terms and how the product is described in business verification (scoped AI, not general-purpose) | Release 2 |
| Embeddings provider for the brand memory index | Release 3 |
| What the Canva API allows importing; whether autofill can fill brand templates | Release 3 |
| Prospect audit timing | Release 3 |
| Pro's price, its included credits, the credit price of each action, free prospect audits per month | Before release 4 |
| Lawyer: Meta Platform Terms 3.a.iv and pooled benchmarks; our LFPDPPP roles (encargado and responsable); whether TikTok excludes utility use; whether Page posts fall under a Meta deletion request | Before release 4 |
| Accountant: RESICO or the general regime | Before the first paying customer |
| TikTok: what the API returns and when the public URL is available; whether to use the Business API accounts product (for later boosting) | Before release 4 |
| Verify expiring R2 links on the custom domain work for TikTok | Before release 4 |
| Rate limits on our own API and MCP | Release 4 |
| Stripe's SPEI fee; PlanetScale storage and egress price | First paying customer |
| Storage allowance per plan, and when old originals move to cheaper storage | Before release 4 |
| Recheck the top pricing tier against Postiz | Before release 4 |
| Which release gets AI video clipping | Any time (ask the pilot agency) |
| Helper names (Lety, Checo, Conta, Compa are working names) | Any time; display data only |
| Acceptance-rate threshold that unlocks autonomy level 4 | Release 5 |
| Trend data provider and its terms risk | Release 6 |
| How much of a public account Instagram Business Discovery shows | Release 6 |
| Legal review of the Mexican rule packs | Release 6 |
| How much account history each network exposes | Release 3 |
| Whether one number can be shared with the WhatsApp Business app (agency's own number) | Later |
| Ads: which networks expose a paid versus organic split, and what ad permissions cost in review | Later |

## Parked (not rejected, waiting for a reason)

- **Shared or team chats.** Daniel dislikes both a private/shared toggle and a share button, imagines something like a shared workspace where teammates can jump in, and first wants to know why teams would want it.
- **Chained follow-ups and URL referencing** between publications. Test with real agencies, then decide what a follow-up does when its parent fails. The schema already stores posts as a graph.
- **Per-publication approval** as a per-customer setting.
- **Tacit approval** (opt-in, off by default).
- **An aggregator as one adapter** for small, later networks, decided per network.
- **Electric** for specific collections, only if offline or very busy screens need it.
- **Effect Workflow** as a long-term alternative runtime for agents.
- **Temporal**, only for months-long per-brand agent workflows or runs over 1,000 steps.
- **Solid 2** for the frontend.
- **Redis Streams** for the agent run stream, only if chunk writes weigh on Postgres.
- **Trigger.dev** if transcoding or heavy video work becomes a feature.
- **Code mode** for MCP if the tool set grows past 20.
- **Railway HA or PlanetScale (us-east-1)**, checked at the first paying customer.

## Deferred (agreed to come later; do not build early)

Templates, linked follow-ups, Drive and Dropbox import, watched-folder sync, webhooks for external systems, ads, the in-app assistant, the limited comments inbox, link tracking, an agency's own WhatsApp number, the full audit trail view, cross-organisation dashboards, the workload view, the content intake link, performance forecasts and experiments.

## Rejected (do not re-propose without new facts)

| Option | Why not |
| --- | --- |
| Postgres row-level security | Daniel does not want it; isolation is in code and schema where it is visible and testable |
| Schema per tenant | The scheduler and pollers scan due work across all tenants |
| Full event sourcing, a message broker, microservices | A modular monolith with an outbox is enough; the gateway is the one deliberate exception |
| Temporal for publishing or agents | No built-in per-key throttling; self-hosting would sit on the publishing path |
| Trigger.dev, Cloudflare Workflows, our own Postgres scheduler for publishing | See the options table in architecture.md |
| Convex | Would replace Postgres, undoing composite-key tenancy and pgvector |
| Cloudflare Workers for the app | Not full Node; video and agent runs run long |
| Hono | Effect HttpApi derives endpoints, OpenAPI and a typed client from the same schemas |
| Mastra, Vercel eve, any agent framework | Our own thin agent platform on Effect AI and Inngest |
| Zernio, Nango, Composio for network connections | Build, not buy (see network-gateway.md) |
| A raw or allowlisted network proxy | Graph API field expansion leaks through allowlists |
| AI SDK resumable-stream | Needs Redis and has stop caveats; our run stream lives in Postgres |
| WebSockets now | Not until co-editing |
| Per-seat pricing | Unlimited users is the model |
| Helpers pulled into another helper's chat (@mentions, "consulta" cards) | Daniel called it a half-implemented design; one helper per chat |
| A private/shared toggle or share button for chats | Daniel dislikes both; shared chats are parked |
| Marketing as "para agencias chiquitas", or copy that says what we don't do | Position as power-ups; say what we do |
| A dark mode | One theme, "papel" |
| An editor screen | Not an editing platform |
| A ManyChat-style DM automation | Comments inbox stays limited |
| Music tracking | Music rejections are ordinary feedback |
| Fixed job roles (copywriter, strategist) for people | Small agencies may not have them; agents fill roles |
| Copying Postiz code | AGPL; reading for ideas only |
