# Product

> Status: settled unless a line says proposal, later or open. Open items are collected in open-questions.md.
> Releases: "v1" in this file means releases 1 to 4, and "soon after v1" means releases 5 and 6 (see [release-plan.md](release-plan.md)).
> Words: in prose, "agency" means an organisation of type agency and "client" or "customer" means a brand. Code, schema and MCP always say organisation and brand (see [conventions.md](conventions.md)).

## Product in brief

A multi-tenant B2B platform where agencies schedule, publish and measure social content for their customers. It starts from Buffer's model and differs in these ways:

- **One post, many accounts.** The agency creates a post once (media, base caption, client), then picks the accounts it goes out to. Each account gets its own publication, with its own caption override, network settings, status and metrics.
- **Production and publishing in one place.** The monthly content plan, the agency's own stages, approval rules and deadlines live next to the scheduler, so nothing is copied in by hand.
- **AI team members.** Built-in agents (copywriter and reviewer first) own stages like team members, and from release 5 draft the whole month on autopilot, without ever approving or publishing.
- **Agency-first.** Each agency manages many customers. Customers get a portal carrying the agency's logo and can view, comment on and approve their content, even over WhatsApp or from a link without an account. In-house brand teams fit the same model.
- **Agency memory.** A brand brain drafted on day one, an asset library the AI tags itself, a labelled post archive and a profile per customer capture what was made, what was posted and what each customer likes, for the agency now and for AI features later.
- **Analytics as a core feature.** Capture as much as possible about the content and its performance, serve it back, and later turn it into insights.
- **MCP first.** Users drive the platform from their own models, with a few web screens where a model cannot do the job.

Chained follow-ups ("publish this after that one, and include its URL") are an idea to test with real agencies, not a v1 differentiator. The model keeps room for them.

First networks: Instagram and TikTok, plus Facebook. Facebook stays in the first set because agencies often send the same post to Instagram and Facebook, and its posts take clickable links, which Instagram captions do not.

No editing platform: there is never an editor screen, and users edit elsewhere. The line is held loosely: AI may deliver finished media inside the pipeline, such as a filled Canva template, a cover with text, a resized story or subtitles.

Market: Mexico first, without coupling the platform to Mexico. It should fully support what Mexican businesses need to buy and use it, such as a factura (CFDI, the tax invoice). Proposal: Spanish and English, MXN and time zones from day one, with country-specific needs behind ports so the next market is an adapter, not a rewrite.

## Core principles

- MCP first. Users drive the platform from their own models through MCP. Web screens exist only where a model cannot do the job.
- One core, thin surfaces. Every operation lives once in the core. MCP, the web API and background jobs only translate requests into core operations.
- Rent the execution, own the state. Posts and their publications are product data and live in Postgres. Timers, retries and flow control are plumbing and are rented.
- One model, one path. A post is always stored as a small graph of publications, even with one account, so linked follow-ups can be switched on later without a migration.
- Pay for reliability where failure is visible. A missed post loses a customer, so publishing runs on a managed service. A missed metric poll is caught next cycle, so polling is self-run.
- Commit to vendors behind narrow ports. Each vendor sits behind a port shaped by our domain, not a generic wrapper meant for swapping. Adapters use the vendor's own features directly.
- Complexity must earn its place. Being one person plus AI is not a reason to pick the simpler design. Be ambitious where it makes a better platform, name the trade-off, start with a small step and grow. It stays TypeScript end to end and a modular monolith with no message broker. The one deliberate exception is the network gateway, a small second service that alone holds network tokens, because a token leak is the failure that would sink the company.
- Tight margins, modest spend. There is no big budget, and the platform must run cheaply enough to be priced below competitors. Ambition goes into the design, not into big or expensive platforms and services: managed hosting on Railway, no AWS infrastructure of our own (AWS KMS for keys, about $1 a month, is the one exception), and costs that scale with active brands and usage, not seats.
- Isolation is structural. Tenant scoping is built into the core, the data-access layer and the schema, never left to a remembered where clause.
- Originals are never modified, signals are append-only. Assets produce derived versions; feedback, metrics and domain events are only ever added.
- Trust is designed in. Tokens live only in the gateway, every agent run gets short-lived credentials scoped to one brand and its job, the audit log is tamper-evident, and every row records where it came from, so export, transfer and deletion are provable.

## Agency workflow

Settled with Daniel on 2026-11-24; the research and reasoning are in [Agency workflow: research and proposal](https://claude.ai/artifact/3ARwhP7PwebCwUE8Tsgexk). Competitors stop at client approval, and what happens before it lives in spreadsheets, Canva, ClickUp and WhatsApp. Joining production and publishing in one place is where the platform wins.

**Content plan (parrilla)**

- A Content Plan belongs to one client and one period, usually a month. It holds the retainer quota per format (for example 12 feed posts, 8 stories, 4 reels), slots on the posting schedule, a brief and a deadline.
- The customer approves the plan in one pass, which approves every post in it. A post that changes afterwards goes back for approval on its own.
- Posts do not need a plan: reactive content and one-offs skip it.
- An idea is a post in the idea stage, with no separate entity, so a client's ideas backlog is its posts in that stage, labelled like everything else. Planning a month means placing ideas into the plan's slots.

**Stages and approval rules**

- Agencies name, order and skip their own production stages per client. Default for a small team: idea, in progress, internal review, customer approval.
- Only scheduled, published and failed are fixed, because the publishing engine sets them.
- Approval is a behaviour attached to a stage (needs internal approval, needs customer approval, locks content), and each client's rules decide when it applies. Rules can tier by label, for example trends need internal review only.
- Client rules set the minimum, never the maximum: the agency can still request approval on a single post, or on a kind of content through a label.
- If the rules require approval, a post cannot be scheduled without it.
- A grace window lets a post still pending at publish time wait a set time instead of failing. Tacit approval (opt-in, off by default) comes later.

**Approval as a record**

- Every approval keeps a frozen copy of what was approved (caption and asset versions per account), plus who approved, when and through which channel (portal, WhatsApp, or recorded by the team after a call).
- Posts that went out without approval are marked with the rule that allowed it.
- The approval history per client and month can be exported, for the day a customer says "I never approved that".

**Who works on what**

- No fixed roles or jobs. A post has one assignee, and a stage can optionally have a default owner per client. Permission roles stay small: owner, admin, member, guest.
- My work is the queue of everything waiting on me across clients, with late items first.
- Deadlines are worked out backwards from the publish date using per-client lead times, and posts at risk are flagged.
- Checklists attach to posts and plans only, and a required item can block the next stage. There is no standalone task manager.

**Feedback**

- Internal and customer threads stay apart. The team and the customer can suggest caption edits that the author accepts in one click.
- Approval and feedback work over WhatsApp, one post at a time or the whole month. A reply (text, image or voice note) lands on the post, tagged with its source.
- Feedback given on a call is recorded by the team, so the history stays whole.

**AI team members**

- The owner of a stage can be an AI agent: copywriter, reviewer, planner and reporter, in that order. A small agency gets the people it lacks.
- An agent is an actor with its own identity and audit trail. When a post enters a stage it owns, a domain event starts a background job. The agent calls the same core operations and hands the post to a person.
- Agents never approve and never publish. Their work arrives as a draft or as suggested edits, and goes straight to the customer for approval only at the top level of a brand's autonomy dial.
- Every edit and rejection feeds the learned part of the brand profile, so agents get better per client.
- Agents sit in their own feature behind the language model port. Built-in runs are metered per run, and an agency can also run them over MCP with its own model.
- Copywriter and reviewer are aimed at v1. Their building blocks ship in v1 regardless: agents as actors, the language model port, metered runs, and the profile and feedback history they read.

**The assistant is separate**

The built-in assistant is a general chat partner. It acts as the user with the user's permissions, uses the same tool set as MCP, delegates specialised work to agents, and asks before steps that cannot be undone. It comes after the agents.

**Helpers in the app (decided 2026-11-27)**

- The AI agents appear in the app as helpers, each with a figure. People talk to a helper directly, in chats.
- One helper per chat. A chat never pulls another helper in: no @mentions of other helpers, no "ask the reviewer" cards inside a chat. The only other valid shape is a driver agent that delegates, which is the assistant (Compa) later, as an optional front door, never mandatory.
- Chats are private to the person who started them for now, and may be tied to a post. Clients never see chats. Shared or team chats are parked (see open-questions.md), not rejected.
- Agents have stable keys in code (`copywriter`, `reviewer`, later `planner`, `reporter`, `assistant`). The helper names Lety (copywriter), Checo (reviewer), Conta (numbers, analyst) and Compa (assistant) are working names and display data only, so renaming one never touches code.
- Delegation, when the assistant arrives: a child run with a brief and references, metered and audited as a chain; one writer at a time, parallel sub-agents only for reads; scope and permissions hold through delegation, with depth capped.

**In-house brand teams**

- The tenant is an organisation with brands. Only agencies see "clients"; an in-house team is an organisation with one brand, and its approvers can be members, not only guests. Design and marketing stay agency first.
- Later: an agency working inside a brand's organisation.

**Inputs and outputs**

Canva import is in v1, because the parrilla and the designs live in Canva at every agency Daniel knows. An export of the plan that looks like a parrilla is a strong v1 candidate. Content the customer posts on their own shows in the calendar and the report as "posted by the customer".

## AI: the agency's memory and eyes

Settled with Daniel on 2026-11-24; the reasoning, costs and deeper designs are in [Bigger AI bets](https://claude.ai/artifact/CZadpNg9YZZyyqKEtVPZip). Beyond agents that write and review, the platform knows each brand deeply, sees what is in every photo and video, watches what works and what is trending in Mexico, and runs the monthly cycle while people approve. All nine bets stay in. Daniel's favourites are the month on autopilot, the brand brain, WhatsApp as the AI front door and the customer-facing analyst.

| Bet | What a small agency gets | When |
| --- | --- | --- |
| 1. Brand brain and instant onboarding | A new client's profile drafted in minutes from 12 months of posts and the website; agents that never invent a price | Release 3 |
| 2. Media understanding | Every photo and video described and tagged without manual work; later, which visuals work per client | Release 3 (tagging), release 6 (creative insights) |
| 3. The month on autopilot | Next month's parrilla drafted end to end, with an autonomy dial per brand | Release 5 |
| 4. Trend radar for Mexico | A short brief when a rising trend fits a client, with a draft ready | Release 6 |
| 5. WhatsApp as the AI front door | Customers send photos and voice notes on WhatsApp; they become assets, feedback and suggested edits | Release 2 (media intake, voice-note feedback), later (assistant over WhatsApp) |
| 6. Prospect audit and competitor benchmark | A two-minute audit of a prospect's Instagram to win the pitch; monthly benchmarks | Release 6 |
| 7. Customer-facing analyst | A monthly report that explains itself, and questions in the portal | Release 5, with the reporter |
| 8. Regulated content checks for Mexico | Rule packs on the reviewer that flag risky promotions, health claims, alcohol and contests | Release 6 |
| 9. Performance forecast and experiments | A score on each draft, and tracked experiments | Far out; its data capture starts in release 1 |

**Decisions from Daniel**

- **Media.** The no-editing line is held loosely. AI may deliver finished media inside the pipeline (a filled Canva template, a cover with text, a story resized from a feed photo, subtitles), but there is never an editor screen and the product must not read as an editing platform.
- **Autonomy.** Each brand has an autonomy dial: off, ideas, plan, full draft, and straight to customer. The top level sends AI drafts to a trusted customer for approval, allowed only while the brand's acceptance rate stays above a threshold, and it drops back on its own if quality falls. Agents still never approve or publish.
- **Pooled learning.** Anonymised results are pooled across organisations, with an opt-out. Agreed 2026-11-26 with pricing: pooled statistics are used free inside agents and insights; benchmarks are shown openly only when built from our own workflow data (approval times, posting cadence); nothing built from network metrics is sold or shown until a lawyer has reviewed Meta's terms. The pool holds de-identified statistics only, never content, in its own tables, and a segment shows only with enough organisations in it (for example 10).
- **Public data.** Public data from other businesses may be used, through the official Instagram Business Discovery API and paid trend providers behind an adapter.
- **Scoped AI only.** Every agent and the assistant do only their designed work, on every surface (web, MCP, WhatsApp, run_agent), and refuse anything else politely. A cheap scope check runs before the main run, refusals are logged, and scope tests are part of each agent's evals. Each run also gets short-lived credentials limited to one brand and the operations its job needs, so the scope is enforced in code, not only in the prompt. This also keeps WhatsApp use within Meta's terms for AI.

**What the architecture needs**

- **Agent platform (decided 2026-11-26, see the stack doc).** Our own, not a framework. Versioned agent definitions (job, prompt, toolkit, model, scope, evals); tools written once as Effect Tools and shared with the MCP server; the context assembly service below; a provider-neutral model gateway on Effect AI that picks a model per task, redacts what a task does not need and records which data categories went to which provider; runs as Inngest functions behind a thin runtime adapter; every model and tool call traced through OpenTelemetry into Langfuse, where the evals also live. No Temporal, Mastra or Vercel eve.
- **Agent output in the browser.** AI SDK UI on the client, with a custom transport over a durable run stream: agent output is written to Postgres as coalesced chunks (about every 100 ms), so a reload replays and then tails, a cancel endpoint stops the run, and approvals inside a run wait on an Inngest event.
- **AI providers.** A provider floor that every model provider, and any vendor receiving client data such as tracing, must meet (no training on our data, service-only terms, listed as a subprocessor), plus an open tier for cheap tasks where the data allows it.
- **Brand brain.** Three layers: the profile (always in the prompt), Brand Facts with source, confidence and valid-until date, and the archive of past posts, feedback and comments. A search index over them is a read model fed by domain events, using pgvector in our Postgres, with embeddings behind their own port. One context assembly service builds the brand packet every agent reads, within a token budget, and is the unit we cache. An agent may state a price, date or offer only if it exists as a valid fact.
- **Media understanding.** AI tags sit apart from tags people set, with the model and version that made them, inside the one labelling system. An asset-analysed event feeds the library, search and insights, and analytics joins metrics to tags. Picking a cover frame is selection, not editing.
- **Autopilot.** A chain of planner, slotting in plain code, copywriter per slot and reviewer, each an Inngest step and its own metered run. A Plan Generation ties the brief, slots and runs together so one slot can be redone. Output goes in through the same core operations people use. Dates (national, regional, per brand) are data.
- **Trends.** A trend source port, a Trend per market with an expiry, and a Trend Match per brand. Detection runs once per market, so its cost is shared by every brand.
- **WhatsApp inbound.** WhatsApp is an inbound surface as well as a channel: Inbound Messages and Contacts per brand, and a cheap router that sends each message to the right core operation. One platform number on Meta's Cloud API serves every agency from release 2; an agency's own number is Later.
- **Prospects and competitors.** Watched Accounts per brand with their public metrics as a separate read model, and a Prospect that becomes a Brand when the deal closes, keeping its audit.
- **Analyst.** A metrics layer defined in code, queried through a few read tools (get_metric, compare_periods, top_posts, get_post_detail) limited to what the viewer may see. The server fills in every number; the model never types one.
- **Regulated checks.** Rule Packs as data, plus an industry on each brand.
- **Forecast data, captured from release 1.** Features per publication (format, time, length, labels, AI tags, trend or not, which agent wrote it) and metric snapshots at fixed ages (1 hour, 1 day, 7 days, 28 days).

**The AI cost and quality layer (v1)**

| Piece | What it does |
| --- | --- |
| Model per task, chosen by evals | Each agent task names its model, and a change ships only when its evals pass. A small cheap model is the default, a larger one only for planning, synthesis and analysis, and open small models for classification and routing where evals allow |
| Cached brand packet | The context assembly output is reused across runs, so most of each prompt is read at cache prices |
| Overnight batch | Plans, library tagging, reports and benchmarks run through the batch API at half price |
| Cost ledger, credits and budgets | Every agent run records tokens and cost and charges the organisation's pooled AI credits, tagged to a brand when it is about one; per-brand caps and alerts |
| Acceptance rate | Per agent and brand: drafts accepted as is, edited or rejected. It decides when the autonomy dial can go up |
| Evals from real work | Accepted and rejected drafts become test sets in Langfuse, run before any prompt or model change |
| Model gateway | Providers stay behind one provider-neutral gateway, which also redacts and records the data categories sent |

Pricing fit (agreed 2026-11-26, see Cost, pricing and billing): every agent run, including the brand brain, media tagging, WhatsApp intake and regulated checks, spends the organisation's pooled AI credits. Pro carries advanced analytics, branded reports with the customer-facing analyst, AI insights and the assistant with an included credit allowance. Agreed 2026-11-26: Pro decides what can be used, and credits pay for each run. Autopilot needs Pro and spends credits per month planned; the trend radar is included in Pro with no credits; prospect audits need no Pro and run on credits, with a few free each month.


## Scheduling, templates and approvals

A post's schedule rule has two modes in v1: a fixed time or the next free slot. A third, relative to a parent, arrives with links.

**Posting schedules (slots)**

- Each client has a posting schedule: weekly slots stored as weekday, local time and timezone, so daylight saving does not shift them.
- Slots hold posts, not individual publications. The slot time applies to every publication of the post unless one overrides it.
- The concrete timestamp is materialised when the post is queued, and remembers which slot it came from, so the queue can re-flow when something is removed or the schedule changes.
- On the calendar a post shows as one item that expands into its publications.

**Templates (after v1)**

- Posts are instances only in v1.
- A template is a post shape (target accounts, network settings, later links) with placeholders, scoped to the agency or to one client. Using one copies it into a real post, so nothing points across clients.
- A slot can later carry a default template, so "Monday" already means a TikTok plus an Instagram Reel.

**Approvals**

- When approval applies is set by each client's rules on the agency's stages (see Agency workflow). If the rules require approval, a post cannot be scheduled without it.
- The customer approves a post as a whole, or a whole content plan in one pass, and it goes out to all its publications. Editing any publication resets approval.
- Every approval is kept as a record with a frozen copy of what was approved.
- Per-publication approval, set by the agency per customer, is a later option. The model does not rule it out.
- Guests see scheduled content as a list or calendar and can comment, approve, reject and react, in the portal or over WhatsApp.
- Feedback attaches to a specific version of the post.
- A post still pending at publish time waits a grace window set per client. Tacit approval (opt-in) comes later.


## Asset library, post archive and brand profile

The platform keeps what agencies make, what they posted and what each customer likes. Together they are the agency's memory, and the data later AI features build on.

**Asset library**

- The library is a product of its own, not only plumbing for publishing. Originals are kept, which settles the media retention question.
- Each asset carries labels, can sit in collections, and shows a status: unused, scheduled or published.
- Each asset keeps a usage history: the posts that used it and how they performed.
- The library is searchable through MCP over labels and transcripts.
- Storage becomes the main cost, so it is tied to the plan. Proposal: move old originals to cheaper storage and keep a light preview, so the library stays browsable at low cost.

**Post archive**

- Posts are catalogued the same way, so agencies can look back: what did we post last Christmas, which trend did we use before.
- One labelling system serves assets and posts alike, with label groups such as campaign, theme, format and season, rather than two separate systems.
- Platform Content that came in through account history can be labelled too, so the archive reaches back before the agency joined.
- Capture as much as possible about each post, for the agency now and for AI features later.

**Brand profile**

- Each customer has a profile, the first layer of the brand brain, documenting voice, visual style, likes and dislikes, so the agency knows what will be approved and what will draw a negative review.
- It has two parts kept apart: what the agency writes, and what is learned from feedback events and performance. Learned suggestions never overwrite what the agency wrote; the agency can accept them into its part.
- The profile is exposed through MCP, so the user's own model reads it before drafting or reviewing. That gives AI value at no inference cost to us.
- The AI copywriter and reviewer agents read the profile, and their edits and rejections feed it (see Agency workflow). Later, more ambitious uses: recommending posts for a customer and suggesting posts or trends from what is trending online. Trends come from the trend radar (see AI: the agency's memory and eyes).

**Music is not tracked.** Agencies do not record the music inside an edited video, and a customer rejecting a post over its music is an ordinary feedback comment. Unverified: the Instagram and TikTok publishing APIs appear not to allow attaching music from the network's library.

## Agency and customer features

These features serve the agency's relationship with its customers. WhatsApp approval, plan approval and the approval history were agreed with the agency workflow; the rest of the v1 split is a proposal.

| Feature | What it does | Scope |
| --- | --- | --- |
| Customer portal | Read-only calendar, approvals and analytics for the customer, carrying the agency's logo | Release 2 |
| Approval without an account | Approve or reject from a link in an email or message, with reminders. The link is signed, expiring and scoped to one client | Release 1 |
| Approval and feedback over WhatsApp | One post at a time or the whole month, with replies landing on the post | Release 2 |
| Plan approval | The customer approves a month's content plan in one pass | Release 1 |
| Approval history | Who approved what, when and through which channel, exportable per client and month | Release 2 |
| Scheduled reports | A monthly report the analyst writes and the agency reviews, sent to the portal and WhatsApp | Release 5 |
| Content intake | The customer drops raw material into the library: over WhatsApp in v1, through a link later | Release 2 (WhatsApp), later (link) |
| Full audit trail | Everything that happened to a post, account or client, built on the event log | Later |

## Ads (after v1)

Many agencies also run ads on the content they publish, and their customers want to see which content works as a post and which works better as an ad. Agreed by Daniel 2026-11-26, held loosely: read-only ad tracking comes first and campaign management furthest out. The levels and their timing below are otherwise a proposal from the [ads research doc](https://claude.ai/artifact/Lvx5RzyTWvcv6hyjxfSSHz).

| Level | What it adds | When |
| --- | --- | --- |
| 0. Organic versus total | Store Instagram's organic and total metrics from the start (this needs Facebook business login), so paid reach shows up later without a backfill | Release 1 (proposal) |
| 1. Read-only ad tracking | Meta through ads_read, and TikTok Spark Ads through the post's item id. We pull the ads that promote an existing post, link them to it, and show spend, reach, clicks and cost per result next to organic performance | The first ads step, Later (agreed, held loosely) |
| 2. Boost only | Boost an existing post, with every spend confirmed by a person. Agents never spend | After tracking (proposal) |
| 3. Campaign management | Budgets, targeting and campaigns from the platform. A much larger product | Furthest out (agreed, held loosely) |

**What it asks of the design now**

- An ad account is another connection type under a brand, held by the network gateway like any other, and read through its ads.read command.
- An ad links to Platform Content the same way a publication does.
- Metric snapshots record whether a number is organic or paid.
- Meta's and TikTok's marketing APIs are separate from the publishing APIs, with their own permissions and app review.
- Open check: whether the TikTok connection should use the Business API accounts product from the start, so a post can be cleared for boosting later.

## Notifications

Notifications must be good and reliable, over three channels: in-app, email and WhatsApp, which Mexican businesses use heavily.

- Proposal: one notification operation in the core reacts to domain events (a post moved stage, an approval was given or is overdue, an account went unhealthy, a publication failed) and decides who to tell.
- Each channel is an adapter behind a notifications port, so adding a channel does not touch the core.
- Each person sets their own preferences: which events, on which channels. From release 2 one platform WhatsApp number on Meta's Cloud API sends for every agency, with utility templates only; an agency's own number is Later.
- WhatsApp charges per message, so it is metered like any other usage and may be tied to the plan.

## More ideas, and how far to take them

| Idea | Position | Scope |
| --- | --- | --- |
| AI insights that change the schedule | Accepted. Insights highlight what works for a customer and recommend schedule changes, building on the brand profile | Later |
| Built-in assistant | Accepted. A general chat partner for users who do not use MCP, acting as the user with the same tool set as MCP and delegating to AI agents. Behind a subscription; comes after the agents | Later |
| Comments inbox | Only at a limited level: read and reply to comments on published posts. No DM automation or chatbots, so the platform is not compared with tools like ManyChat | Later |
| Link tracking | Deferred | Later |
