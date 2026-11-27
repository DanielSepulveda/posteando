# Architecture

> Status: settled. Pins, fallbacks and the week 1 spikes are in release-0-tasks.md.
> Words: in prose, "agency" means an organisation of type agency and "client" or "customer" means a brand. Code, schema and MCP always say organisation and brand (see [conventions.md](conventions.md)).

## Stack

One TypeScript codebase deployed on Railway as three services, web, worker and the network gateway, with Postgres as the single source of truth. Hosting and the stack were settled on 2026-11-26; the reasoning and numbers are in [Running costs and hosting](https://claude.ai/artifact/D7MNovwucfrwacyRGMxGeY) and [Technical stack checks](https://claude.ai/artifact/SoP71HnYUqSSWmQnH1v1qe).

```
 MCP clients     browser (React SPA)     WhatsApp webhook          network OAuth callbacks + webhooks
      |                 |                      |                                |
      v                 v                      v                                v
 +------------------- web service -------------------+                 +------------------+
 | MCP server | Effect HttpApi + SSE | inbound hooks  |                 |  network gateway |
 +-------------------------+-------------------------+   signed        |  (only holder of |
                           | core operations (Effect) |  commands       |  tokens; KMS;    |
 Inngest --calls steps--> worker service -------------+--(Effect RPC,-->|  refresh, health)|
 (publishing, agents)     (outbox relay, pg-boss,        HMAC)          +--------+---------+
                           media normalising)                                    |
                           |                                                     v
                           v                                         Meta / TikTok APIs
       Postgres: app schema | gateway schema (own role)              (pull media from R2)
       Cloudflare R2: media, nightly pg_dump
```

Inngest calls the worker for each publishing and agent step. The worker also runs the analytics queue, media normalising and transcription, and sends every network call to the gateway as a signed command. Only the gateway can ask AWS KMS to open a token, and networks pull media straight from R2.

| Layer | Choice | Why |
| --- | --- | --- |
| App | Effect 4 core behind an Effect HttpApi web API, an MCP server and a React web app, as a modular monolith | One language end to end; one core behind every surface (see Architecture) |
| Hosting | Railway: web, long-running worker and the network gateway as separate services on its private network. Cloudflare only for media | Managed and billed by actual use, which suits a bursty worker. Workers are not serverless because video and agent runs run long. The app is plain containers, so Render or Ravion stay cheap moves later |
| Database | Railway Postgres to start, on Pro, with point-in-time recovery from day one and a nightly pg_dump to R2. At the first paying customer: Railway's high-availability cluster or PlanetScale in AWS us-east-1 | 1 to 2 ms on the private network and the cheapest start; the later move is ordinary Postgres to Postgres. Holds the graph, tenancy, outbox, run stream, analytics queue, snapshots and the pgvector index |
| Data access | Drizzle on top of Effect SQL, sharing one connection and transaction | Typed schema and generated migrations for core tables; raw Effect SQL for analytics, the outbox relay and LISTEN. Fallback: Effect SQL alone if Drizzle's driver fails on Effect 4 |
| Durable execution | Inngest for publishing and agent runs, behind a thin runtime adapter | Per-account throttling, retries and waits for approval. Pro from the first paying customer. Temporal was weighed and ruled out |
| Analytics polling | Postgres queue (pg-boss or Graphile Worker) in the worker | Highest job volume and loss-tolerant, so it stays off the metered vendor |
| Live updates | The outbox relay fires Postgres NOTIFY; each API instance pushes server-sent events; TanStack DB collections in the browser apply them | No extra service. Electric later, per collection, only if offline or very busy screens need it; no WebSockets until co-editing |
| AI | Our own agent platform: Effect AI behind a provider-neutral model gateway, a model per task chosen by evals, Langfuse for traces and evals | One tool definition serves MCP, agents and the assistant (see AI) |
| Agent output in the browser | AI SDK UI (useChat with our own transport) over a durable run stream kept in Postgres | Replies survive reloads, dropped connections and runs in the worker; stop and approvals go through the core |
| MCP | Effect's McpServer, official SDK v2 as fallback | Tools are Effect services with our Layers; the module is marked unstable, so the Effect version is pinned |
| Login and MCP authorisation | better-auth: organisations, invites, passkeys, required two-factor for admins, and the OAuth 2.1 server for MCP. WorkOS AuthKit as fallback | Self-hosted and free, with no per-user fees to fight the pricing model |
| Secrets | One AWS KMS key per environment and a data key per organisation, opened only by the network gateway | About $1 a month; deleting an organisation's data key makes every copy of its tokens unreadable |
| Media | Cloudflare R2: direct uploads, a normalising step in the worker (JPEG conversion, re-encoding out-of-spec video), served to networks from a custom domain verified with TikTok | Free egress, because networks pull and the worker never pushes bytes |
| Messaging | Resend for email; WhatsApp through Meta's Cloud API directly, utility templates only | No reseller markup per message |
| Payments and invoices | Stripe first (cards and Billing), SPEI for larger bills, a Mexican processor later; a CFDI stamping provider behind the tax invoicing port | Card first; one CFDI per organisation per month |
| Supporting | Transcription API (Deepgram or Groq, tested on Mexican Spanish), error tracking, a log of every publish attempt | The publish log is the main support tool |

## Architecture: one core, thin surfaces

The core holds the domain and every operation, and knows nothing of HTTP, MCP, Postgres or Inngest. Everything else is either a surface that calls into it or an adapter it calls out to (hexagonal, ports and adapters).

| Side | Parts | Role |
| --- | --- | --- |
| Inbound surfaces | MCP server, web API with its live-update stream, Inngest functions, polling worker, WhatsApp inbound webhook, network events forwarded by the gateway, in-app assistant (later) | Translate a request into a core operation and the result back. No business rules |
| Core | Domain model and operations, organised by feature | Rules, validation, tenant scope, state changes and their events |
| Outbound ports | Social networks (served by the network gateway, a separate process), storage, database, job runner (a thin runtime adapter over Inngest), transcription, clock, analytics, notifications, payments, tax invoicing, ads (later, also through the gateway), model gateway for agents and the assistant, embeddings, trend data | Interfaces shaped by the domain, with one adapter each and a fake for tests |

Inside that structure, code is organised by feature (vertical slices): tenancy, connections, assets, posts, approvals, analytics. Each slice holds its own operations, domain types and the feature-specific parts of its adapters.

**Effect throughout**

- Effect is used fully for the core and the adapters. Ports are Effect services and adapters are layers, so tests swap in a fake per port, including the clock.
- The organisation context is a required service, so an operation without tenant scope does not compile.
- One schema per operation defines its input, output and typed errors. The MCP tool, the API endpoint and the UI client are derived from it, so the three cannot drift.
- Inngest owns durability across steps: sleeping until due and retrying a whole step. Effect owns everything inside a step, including its retries, timeouts and errors.

**Domain events**

- Reactions run on domain events: publication published, URL available, account went unhealthy, approval given or rejected, asset uploaded.
- A state change and its event are written in the same database transaction and delivered from there (an outbox). The sweep job is the safety net for anything left undelivered.
- The events form our own durable log rather than living only on Inngest, because the same log feeds webhooks, audit history and insights.
- No full event sourcing: tables hold current state and the log records what happened. No message broker and no microservices; it stays a modular monolith.

**Commands and reads (light CQRS)**

- Commands go through core operations. Analytics reads use query-shaped read paths behind the analytics port, so they can start on Postgres and move to a dedicated analytics store later without the core changing.
- Ports are designed for the ambitious version, with a modest adapter behind each to start. The trade-off is more port design up front, paid back when an adapter is replaced without touching the core.

**The network gateway**

- A second deployable in the same monorepo and the only service that holds client tokens and the Meta and TikTok app secrets. It is the adapter behind the core's social network port, so nothing above the port changes. Its design is in [Network gateway design](https://claude.ai/artifact/7nkPDxLoqe1fnvmgot5SyM); Daniel agreed all eight choices on 2026-11-26.
- An executor, not a proxy: about a dozen named, typed commands (connect, describe, disconnect, publish prepare, commit and status, metrics, history import, comments, quota, later ads) served over Effect RPC on Railway's private network. Results come back in our schema, never as tokens or raw network data, and media goes by R2 key, never by URL.
- The app decides, the gateway translates. Publishing workflows, approvals and domain events stay in the app's Inngest worker. The gateway owns only what needs a secret: the OAuth callback of the connect link, network webhooks including deauthorisation and data deletion, token refresh and connection health, run as its own Inngest app over Connect.
- Its own policy, whatever the app says: an agent-run actor can never publish or delete, publish ceilings per connection and per organisation, kill switches per organisation and global, and a hash-chained receipt for every command. Meta's appsecret_proof is on, so a leaked Meta token is useless without the app secret.
- Requests are signed (HMAC over body, timestamp and nonce) on the private network. That stops impersonation and replays, not a breached app; the narrow commands, ceilings and receipts limit what such an app can do.
- It holds every customer connection as they arrive: social networks now, Canva, Drive and an agency's own WhatsApp number later. Its data sits in its own schema and database role on the same Postgres. One replica in release 0, two from the first paying customer, and it lands in release 0 so the Meta review recording shows the real connect flow. A thin read of one post's insights lands in release 0 for Meta's review, and full metric fetching in release 1, because the pilot month already records metric snapshots (agreed 2026-11-26).

**Libraries**

| Need | Choice | Status |
| --- | --- | --- |
| Core, errors, dependencies | Effect 4 | Agreed |
| Schemas | Effect Schema | Agreed, follows the Effect choice |
| Database schema, migrations and queries | Drizzle on Effect SQL | Agreed 2026-11-26; the first spike confirms Drizzle's driver on Effect 4.1, else Effect SQL alone |
| MCP server | Effect's McpServer | Agreed 2026-11-26; official SDK v2 as fallback |
| Model calls and tools | Effect AI, with the provider SDK for batch work | Agreed 2026-11-26 |
| Traces and evals | Langfuse (MIT) | Agreed 2026-11-26; Langfuse Cloud's free tier to start, self-hosted once the cloud bill would pass the cost of self-hosting; traces go out as OpenTelemetry so a later move to Braintrust stays cheap (hosting agreed 2026-11-26) |
| Login and OAuth server | better-auth | Agreed 2026-11-26; WorkOS AuthKit as fallback |
| HTTP | Effect HttpApi (endpoints, OpenAPI and a typed client from the operation schemas), with better-auth mounted as a plain handler | Agreed 2026-11-27, replacing Hono |
| Analytics queue | pg-boss | Agreed 2026-11-27, from release 1 |
| Web UI | React with TanStack DB, TanStack Router and AI SDK UI | TanStack DB and AI SDK UI agreed 2026-11-26; Router agreed 2026-11-27, as a Vite single-page app; the public site is Astro |


## Posts and publishing

A post is what the agency creates, and a publication is that post going out to one account. Both live in Postgres; Inngest only executes them, one run per publication, and each step calls a core operation.

**Model**

- A **Post** holds the shared media (asset versions), the base caption, the client and the approval state.
- A **Publication** is the post on exactly one social account. It has its own caption override, network settings, status, failure handling and metrics.
- A **link** between publications ("publish this after that one, and include its URL") is the only part that makes a post a workflow. Links form a directed acyclic graph, with no loops or branching.
- v1 exposes posts with one or more publications and no links. The core still stores each post as a graph, so links can be switched on later without a migration.

**Network settings**

- Each publication holds settings typed by its network and defined by that network's adapter. Examples: Reel or feed post on Instagram, privacy and duet permissions on TikTok, a clickable link on Facebook.
- Validation runs per publication, so one network rejecting the media or a setting does not block the others.

**Formats**

- Support every format a network allows: if the API can publish it, or we can find a way to publish it, it is supported. Being rich in formats lets agencies rely on us instead of another tool or doing it by hand.
- Proposal: each network adapter declares a capability matrix (feed post, Reel, Story, carousel, video, and so on), and the UI, the MCP and validation read from it.
- Proposal: for formats the API cannot publish, assisted publishing. At the scheduled time the assignee gets a reminder with the media and caption ready to post by hand, and marks it done.

**Timing**

- All publications of a post share one time by default, with an optional override per account.
- A publication is due when its time has passed. Once links exist, its parents must also be published with their outputs available.

**Execution**

1. One Inngest run per publication, never one run per post.
2. The run sleeps until due, then re-reads the publication from Postgres. Edits and cancellations are just row updates.
3. It publishes idempotently, so a retry never double posts. A publish commit is never retried blindly (agreed 2026-11-27): a heartbeat tells "never started" from "timed out", the gateway asks the network for the post's status, and a publication it still cannot place goes to an "outcome unknown" state for a person to decide.
4. It writes the outputs (post ID, URL) and a publication-published event in one transaction. Once links exist, delivering that event triggers the follow-ups.

A small sweep job finds overdue publications, re-triggers them and redelivers any stuck events, which covers a vendor outage.

Agreed 2026-11-27: a post's stage and a publication's state are two fields. The publication carries its own state (draft, scheduled, publishing, published, link ready, missed, outcome unknown, failed); the post's fixed stages are derived from its publications, with "needs attention" when any publication failed, was missed or has an unknown outcome. A publication up to 30 minutes late goes out automatically, including when the sweep re-triggers it; past that it becomes missed and a person decides. The window is stored per brand. The state diagram is in the [Release 0 gap check](https://claude.ai/artifact/8P6dv8rsfyFGpsqjdFHPo8).

**Publishing is not instant**

Instagram and TikTok publish asynchronously: upload, then wait for confirmation. "Published" and "URL available" are separate states, and a linked follow-up waits on the second. TikTok's public URL may only arrive after moderation; this needs verifying against the API.

**Follow-ups and referencing (later)**

A linked follow-up writes its caption with a placeholder such as the parent's URL. It is resolved when the follow-up publishes, not when it is scheduled, and a publication may only reference its ancestors. This is an idea to test with real agencies before it is exposed.

**Rate limits**

Publishing and polling use separate queues but share one rate budget per connected account. Publishing always wins.

**Options considered**

| Option | Verdict | Reason |
| --- | --- | --- |
| Inngest | Chosen | Richest flow control per key; runs steps in our own worker; low cost at publishing volume |
| Trigger.dev | Close second | Runs tasks on its own machines with no timeouts, and is self-hostable. Revisit if transcoding or heavy video work becomes a feature |
| Temporal | Ruled out | Weighed again for agents on 2026-11-26: about the same unit price, no built-in per-key throttling, and self-hosting would sit on the publishing path. A thin runtime adapter keeps it possible for months-long agent workflows |
| Cloudflare Workflows | Not now | Capacity is fine, but per-account flow control would be hand-built on Durable Objects, and Workers are not full Node. It is a platform choice, not a service swap |
| Own Postgres scheduler | Analytics only | Too much ongoing care for one person on the path where failures are visible |
| Convex | Skipped | Heavy analytics queries are not its strength, and adopting it would replace Postgres, undoing composite-key tenancy and pgvector |


## Analytics

Analytics polling is the largest workload and the main consumer of API rate limits, so it is designed separately from publishing.

- **Two kinds of data.** Content metadata (duration, format, transcript) is extracted once at upload and owned by us. Performance metrics are a time series pulled from the networks.
- **Append-only snapshots.** Never overwrite counters. Each snapshot stores a small normalised set (views, likes, comments, shares) plus the raw platform response, so new fields are not lost and growth curves are possible.
- **Storage.** Analytics sits behind its own port with query-shaped read paths. It starts on partitioned Postgres tables with older data downsampled to daily, and can move to a dedicated analytics store later without the core changing.
- **Decaying poll schedule.** Often in the first two days, then daily, then weekly. Snapshots at fixed ages (1 hour, 1 day, 7 days, 28 days) are kept for fair comparison and forecasts.
- **Batching.** Poll per account, not per post. Metrics hang off each publication and roll up per post across networks.
- **Whole-account history.** A Platform Content entity represents anything that exists on a network, with metrics hanging off it and an optional link back to a publication. Posts made outside the platform fit the same model. How far back each network allows needs verifying.
- **Loss-tolerant by design.** A missed poll is picked up on the next cycle, which is why this runs on a plain Postgres queue.

## Tenancy, isolation and access

The tenant is an organisation (an agency, or a business with its own team) and each of its brands is an inner tenant. An agency's UI calls brands clients, and this doc keeps "agency" and "client" for readability. Posting one customer's content to another customer's account is the worst bug this product can have, so isolation is enforced in three places.

**Structure**

- Shared schema, not schema-per-tenant: the scheduler and pollers scan due work across all tenants constantly.
- Every client-owned row carries both the agency ID and the client ID directly, not inferred through joins.

**Enforcement (in application code, no row-level security)**

- Feature code never touches the raw database handle. Core operations require the organisation context as an Effect service, so an operation without tenant scope does not compile, and the data-access layer adds the scoping itself.
- Cross-tenant work, such as the pollers and the sweep, uses one clearly named system context, so every bypass is easy to find.
- An MCP grant is scoped to one organisation and chosen brands, and every MCP tool names the client explicitly. The same grant check runs for web, MCP, WhatsApp and agents, and every call is logged with the person and the client app.
- Leak tests: create two agencies, call every core operation as the first through each surface, and assert nothing from the second appears.
- Composite foreign keys include the client ID, so a post or publication physically cannot reference an asset or social account of another client, even if application code is buggy.
- No Postgres row-level security. Isolation lives in the application and the schema, where it stays visible in code and testable.

**Boundaries**

- The agency boundary is a hard wall.
- The client boundary is soft for agency staff, who see dashboards across customers, and hard for guests, whose session is pinned to one client.
- The same scoping applies everywhere: R2 paths prefixed by agency and client, both IDs on every background job, insights computed per client, plus the statistics-only pool.
- Only agency-level templates are shared across clients. Moving an asset between clients is an explicit copy.
- Job claiming is fair across tenants, so one large agency cannot starve the rest.

**Users**

A Membership links a user to an organisation with a permission role (owner, admin, member or guest), optionally scoped to one client. A guest is a membership scoped to one client. There are no job roles. AI agents are actors too, with their own identity and narrow permissions.

## Data model

Nine groups of entities, plus templates later. Everything below Organisation and User carries the organisation ID and brand ID, and every row records its provenance: who or what made it (the agency, the client, Meta, TikTok, a website, an AI agent) and the connection that brought it in. Export, transfer and deletion filter on that.

| Group | Entities | Key points |
| --- | --- | --- |
| Tenancy and access | Organisation, Brand, User, Membership, Agent, Contact, Brand Profile, Approval Rules, Autonomy Setting, Approval Link, Pipeline Stage, Stage Owner, Lead Times, Subscription, Notification Preference | Organisation is the tenant, typed agency or in-house; a Brand is shown as a Client in an agency's UI and carries an industry and a city from a fixed list. Membership holds a permission role and optional brand scope; Agent is an AI actor with its own identity. Contact: a customer's phone and email per brand, for WhatsApp and approvals. Approval Rules per brand: who approves, tiers by label, grace window, later tacit approval. Autonomy Setting: how far AI goes for the brand, gated by acceptance rate. Pipeline Stage: named by the agency, with approval behaviours; only scheduled, published and failed are fixed. Stage Owner: optional default person or agent per stage per brand. Brand Profile keeps an agency-authored part and a learned part apart. Approval Link: signed, expiring, scoped to one brand. Subscription: plan and entitlements |
| Connections | Connection, Source Connection, WhatsApp Number, Ad Account (later) | Connection: network, external account, how it was connected (Instagram Login, Facebook business login, system user), who granted it, scopes and health (healthy, degraded, needs reconnect, revoked). It holds no tokens: those live only in the network gateway's own schema. Source Connection: Canva, Drive, Dropbox. WhatsApp Number: the platform's from release 2, an agency's own later |
| Content | Asset, Asset Version, Asset Features, Collection | Asset is the original plus where it came from. Versions are derivatives, including AI-produced media. Features hold metadata, transcript and the AI description. Status and usage history are derived from the posts that use an asset |
| Labels | Label Group, Label, AI Tag | One system across assets, posts and Platform Content, with groups such as campaign, theme, format and season. AI tags sit apart from tags people set, with the model and version that made them |
| Brand brain | Brand Fact, Brand Memory Index, Calendar Date, Rule Pack | Brand Fact: value, source, confidence, valid until. Brand Memory Index: a pgvector read model over posts, feedback, facts and comments, fed by domain events. Calendar Date: national, regional or per brand. Rule Pack: regulated content rules by industry |
| Posts | Content Plan, Plan Generation, Post, Publication, Publication Link, Posting Schedule, Platform Content | Content Plan: brand, period, quota per format, slots, brief, deadline, approval state. Plan Generation: the brief, slots and agent runs behind an AI-drafted plan. Post: brand, optional plan and slot, source (team, customer or a model; an idea is a post in the idea stage), base caption, asset versions, schedule rule, stage, assignee, derived stage due dates, approval state. Publication: one social account, caption override, network-typed settings, optional time override, publish state, and the features kept for forecasts. Publication Link (later): trigger and delay. Platform Content: external ID and URL, optional link to a publication, including posts the customer made on their own |
| Signals | Feedback Event, Suggested Edit, Internal Comment, Approval Record, Checklist Item, Inbound Message, Metric Snapshot | Feedback, approval records, inbound messages and snapshots are append-only. Feedback carries its source (portal, WhatsApp text or voice note, email, recorded by the team). Approval Record: a frozen copy of what was approved, who, when and through which channel, or the rule that let a post skip approval. Internal comments are never shown to the customer. Snapshots hang off Platform Content, are kept at fixed ages, and mark each number as organic or paid |
| Market and growth | Trend, Trend Match, Watched Account, Prospect | Trend: per market, with an expiry. Trend Match: a trend that fits a brand. Watched Account: a competitor's public metrics over time. Prospect: an audited business that becomes a Brand when the deal closes |
| System | Domain Event, Usage Record, Notification, Agent Run, Run Chunk, AI Credit Ledger, Eval Set, Pool Aggregate, Audit Entry, Deprovisioning, Export Job, Privacy Notice Acceptance, ARCO Request | Domain Event: append-only log written in the same transaction as each state change, feeding reactions, notifications, usage metering, webhooks, audit history and insights. Usage Record: active brands and other metered units per organisation. Notification: what was sent, to whom, on which channel. Agent Run: one metered run with inputs, outputs, tokens, cost and its accepted, edited or rejected outcome. Run Chunk: the durable output stream of a run. AI Credit Ledger: the organisation's pooled credits, packs, allowances, per-brand caps and which features may spend. Eval Set: accepted and rejected drafts per agent. Pool Aggregate: de-identified statistics only, in its own tables. Audit Entry: hash-chained, each entry hashing the one before, so approvals and access changes cannot be quietly edited. Deprovisioning: the leaving workflow's state per organisation or brand. Export Job: an asynchronous brand export. Privacy Notice Acceptance: which notice version a person accepted. ARCO Request: a privacy request and its 20-day deadline |
| Later | Template, Checklist Template, Experiment, Ad | Template: copied into a post on use. Checklist Template: per brand. Experiment: a hypothesis tracked across a plan. Ad: links to Platform Content like a publication does |

Two entities to add with their releases: Chat (release 1: one helper, one owner, private, optionally tied to a post, holding its agent runs) and Connection Request (release 2: the customer's connect-invite journey and its states, from the onboarding doc). Table conventions agreed 2026-11-27: time-ordered UUIDs; times in UTC with each brand's IANA time zone; organisation and brand ids with composite foreign keys; provenance columns on every row; a version number on editable rows; no update path on append-only tables; soft delete only where the leaving workflow needs it.


## Connected accounts and integrations

Access to social accounts is always OAuth: the platform never sees a password. Tokens are held only by the network gateway (see The network gateway), encrypted with a data key per organisation, and every call to a network goes through it. The app knows a Connection (who connected what, with which scopes, and its health), never a token. Decided 2026-11-26 with the onboarding, trust and gateway docs.

**Two ways to connect an account**

- An agency user connects it directly when they already have access.
- The agency sends the customer a connect link, built on the same signed, expiring guest-link mechanism as approvals. The customer logs in on the network itself and grants permission; the OAuth callback lands in the gateway, so a fresh token never passes through the main app. The customer needs no account on the platform and can revoke access from the network at any time.
- Releases 0 and 1 connect Instagram only through Facebook business login (made firm by Daniel 2026-11-27); Instagram Login, for clients with no Page, is added by release 4. Facebook business login is preferred because it gives Facebook Pages, the organic versus total metrics and later ads, with a system user token for clients that have a business portfolio, since it does not die when one employee leaves.

**Lifecycle**

- Each connection has a health state: setup unfinished, healthy, degraded, needs reconnect, or revoked (one list, shared with the gateway design).
- The gateway refreshes tokens ahead of expiry with a lock per connection, so two refreshes never race, and reports health back to the app. Changes are also detected from authentication errors on any call and from the networks' webhooks: Meta's deauthorise and data deletion callbacks, Meta's managed-accounts notice 30 days ahead, and TikTok's authorization.removed.
- When a connection goes unhealthy nothing is deleted. Its pending publications become blocked, metric polling pauses, and the agency gets a reconnect link through notifications, which can be forwarded to the customer.
- Reconnecting the same external account resumes everything. Posts whose time already passed go to a "missed" state for a human decision, never a stale burst.
- A deliberate disconnect inside the platform asks what to do with the scheduled content, then revokes the token at the network and deletes it from the gateway.
- A network data deletion request names a person, not a Page, so it is mapped to the connections that person granted and runs the deletion machinery (see Trust, data ownership and leaving).

**Network adapters**

Each network is an adapter inside the gateway, because media rules, token refresh and publish flows differ per network and change over time. The app asks for named commands (publish.prepare and publish.commit, metrics.fetch, history.import and so on) and the gateway translates them for each network.

**Content sources**

- Google Drive and Dropbox are source adapters, alongside direct upload. An MCP tool can trigger an import, since large files cannot pass through a model.
- Copy on import: the file is pulled into R2 as an asset and its origin recorded. A live pointer could change or vanish before publish time.
- Start with a file picker, which keeps permission scopes narrow. Watched-folder sync comes later.

## Media pipeline and insights

Every upload is an asset that passes through a chain of independent processing steps; the original is never modified. Media is served to the networks from an R2 custom domain, which TikTok requires to be verified.

| Tier | What | When |
| --- | --- | --- |
| 1 | Validation against each network's rules (duration, aspect ratio, file size) at upload, plus thumbnails for the calendar and approval view | Release 1 |
| 1 | Normalising (agreed 2026-11-24): convert images to JPEG and re-encode out-of-spec video with ffmpeg in the worker, as a new derived version, instead of rejecting the file | Release 1 |
| 2 | Transcription through an external API: caption and hashtag suggestions, search across a client's library, and a feature to join against performance | Release 2 |
| 2 | Media understanding: an AI description and tags for every photo and video, text on screen, cover frame candidates | Release 3 (tagging) |
| 3 | AI-produced media inside the pipeline: a story resized from a feed photo, subtitles, a cover with text, a filled Canva template. AI video clipping, several clips cut from one long video on request, is wanted (Daniel, 2026-11-27; its release is still open). Never an editor screen | Release 5, with autopilot |

A future step such as resize is one more link in the chain that produces a new derived version. Approvals stay honest because a client approves a specific version.

**Insights: capture now, build later**

- Three signals are keyed to the same asset version: extracted features, the client's feedback, and performance.
- Feedback is stored as structured events (approved or rejected, with a reason and comments), not loose text.
- The learned part of the brand profile is a summary over that history. Reviewing a new upload against it is one more pipeline step.
- A client may have only a few dozen posts. That is enough to spot feedback patterns but thin for performance claims, so those are framed as hints.
- Insights use each agency's own data. The only thing shared is an anonymised, statistics-only pool across organisations, with an opt-out and a minimum segment size.


## Trust, data ownership and leaving

Decided 2026-11-26 from the [onboarding and data trust doc](https://claude.ai/artifact/WEFXZQsCeQnTjLPY32pPCE) and the [network gateway doc](https://claude.ai/artifact/7nkPDxLoqe1fnvmgot5SyM). Agencies hand us their clients' accounts, so trust is part of the product, not a compliance afterthought.

- **Login.** better-auth for people and for MCP: email magic link, passkeys and Google sign-in for people; OAuth 2.1 with client ID metadata documents and refresh tokens that cannot be reused for MCP; two-factor required for owners and admins. Sign-up is by invite only until the public launch, and the accepted terms and privacy notice version is recorded at sign-up (agreed 2026-11-27). WorkOS is the fallback if it falls short.
- **Keys.** AWS KMS with one key per environment and a data key per organisation. Network tokens are encrypted one by one inside the gateway. Destroying an organisation's data key at day 60 makes its tokens unreadable everywhere, backups included.
- **Agents.** Each agent run gets short-lived credentials limited to one brand and the operations its job needs. Agent actors can never publish or delete, which the gateway also enforces.
- **Client trust page.** The client sees what is connected, who at the agency has access, and what AI touched, and can revoke.
- **Audit log.** Hash-chained, each entry hashing the one before, so approvals and access changes are a record nobody can quietly edit.
- **The brand is the unit.** export_brand (a zip of JSON, CSV metrics and the original assets, behind expiring links), transfer_brand (with the client's consent; the old agency loses access and the new one connects its own accounts) and delete_brand. A client leaving an agency, an agency leaving us, and a network deletion request all run on this machinery and on the provenance every row carries.
- **Leaving.** One durable Inngest workflow per organisation, every step idempotent and logged. Day 0: read-only, and publications not yet posted go back to drafts. Days 1 to 30: export, reactivate, or a client claims its brand. Day 30: every connection revoked at the network and its tokens deleted, soft delete. Day 60: hard delete of rows and R2 media. Kept: invoices and CFDI for as long as tax law asks (about 5 years), a minimal record of the deprovisioning, and de-identified aggregates.
- **Network deletion.** Meta's data deletion callback with its status page, and TikTok's authorization.removed webhook, live from release 0.
- **Mexican privacy law.** Versioned privacy notices with a record of who accepted which version, and an ARCO request inbox answered within 20 days. We act as encargado for the agencies' client data and as responsable for our own customers, which a lawyer still has to confirm.
- **AI providers.** Every provider meets the provider floor in the AI section.

Not worth it yet: SOC 2, dedicated hardware security modules, customer-held keys, data residency, and zero retention with AI providers.


**Risks and their mitigations**

| Risk | Mitigation |
| --- | --- |
| App review delays or rejections | Apply early; let granted permissions shape the first features |
| Content crossing between clients | Composite foreign keys, required organisation context, leak tests |
| A model posts for the wrong client | Client named on every tool, MCP grant scoped to one organisation and chosen brands, new posts start as drafts a person confirms |
| Network tokens stolen | Only the gateway holds them, encrypted with a data key per organisation; the main app, MCP and agents never see one |
| Prompt injection through comments, websites or messages | Scoped toolkits and short-lived run credentials per brand; agents can never publish or delete |
| A reaction is lost | Event written in the same transaction as the change; the sweep redelivers |
| Double posting on retry | Idempotent publish commands in the gateway |
| Inngest outage | Sweep job re-triggers overdue publications from Postgres |
| Railway or database outage | Point-in-time recovery from day one, a nightly dump to R2, and Railway HA or PlanetScale from the first paying customer |
| Effect modules still changing | Pin versions, keep each library behind an adapter we can swap (Effect SQL alone for Drizzle, the official MCP SDK for Effect's server) |
| Polling exhausts rate limits or budget | Shared per-account budget where publishing wins; decaying, batched polls |
| Network APIs change | One adapter per network, inside the gateway |
