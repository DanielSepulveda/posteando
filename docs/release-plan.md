# Release plan

> Status: settled (release order and first cut agreed by Daniel on 2026-11-26; release 0 scope and gate refined and agreed on 2026-11-27). Release 0 is broken into ordered tasks in [release-0-tasks.md](release-0-tasks.md).

Platform access is the critical path, not the code. Meta's review, business verification and TikTok's audit take weeks, so the releases are cut to unblock them early.

## Pilots

Two pilots: Daniel's own agency, and one company using Posteando in-house for its own brand. Both run on Meta Standard Access as app testers (people with a role on the app), which needs no business verification.

## Build at full strength from release 1

These are foundations that are hard to retrofit, so they are built properly from the start even though early releases use little of them: one core with thin surfaces, tenant isolation (context service, composite keys, leak tests), the outbox, the publishing engine, agents as actors with a cost ledger, and data capture that cannot be recovered later (metric snapshots at fixed ages, forecast features per publication, provenance on every row, accepted privacy notice versions).

## Releases

### Release 0: walking skeleton

One single-image feed post goes from an MCP call to Instagram **and** to a Facebook Page, through the real stack: web, worker, network gateway with KMS, Inngest, R2, Railway Postgres. A thin `metrics.fetch` reads one post's insights. Meta's data deletion callback is live.

- Operations: `create_organisation`, `authorize_mcp_client`, thin `create_brand`, thin `get_context`, `start_account_connection`, `complete_account_connection`, thin `list_social_accounts`, thin `create_upload_link` and `complete_upload` (images only, converted to JPEG at upload, size and ratio validated), `create_draft_post`, `confirm_post`, `publish_publication`, `check_publish_status`, `sweep_overdue`, `get_publish_log`, `deliver_events`, `handle_deletion_callback`.
- The deletion callback in release 0 deletes the person's connections and tokens, records the request and serves Meta's status page. Full data deletion joins when `delete_brand` lands in release 1.
- Web: sign-in, MCP consent, connect, upload page, and a simple post form used for Meta's review screencasts. About four plain screens.
- Instagram connects only through Facebook business login (firm for releases 0 and 1).
- Video, reels, carousels and stories wait for release 1.
- **Gate:** every permission works end to end and Meta's screencasts are recorded. The review is submitted once business verification is done; until then both pilots run on Standard Access. Ads and WhatsApp permissions get their own reviews later.

### Release 1: pilot month

One real agency runs one client's month on Instagram and Facebook, and the in-house pilot runs its own brand.

- Organisations typed agency or in-house at sign-up (wording on screen and in MCP, default stages), brands, members and guests; an organisation switcher for a person in two organisations.
- Upload link with validation, normalising (JPEG, re-encoding out-of-spec video), thumbnails, labels. All formats the API allows on Instagram and Facebook.
- Posts with publications; content plan with an optional quota and slots, whole-month approval; default stages per organisation type stored as data (in-house: idea, in progress, approval); one assignee; my work.
- Approval by a signed link (the agency pastes it into WhatsApp; no platform WhatsApp number yet) or by a signed-in member for in-house teams, with approval records.
- The copywriter agent, fed by the agency-written brand profile, with scoped AI, the cost ledger, acceptance rate and evals; Langfuse from here.
- Metric snapshots from day one (full `metrics.fetch`, pg-boss analytics queue) and per-post performance.
- Email and in-app notifications. Usage records, nothing charged.
- About 10 MCP tools.
- Web, as mocked: the app shell (sidebar with the brand picker under the logo, "Todas las marcas" by default) with the calendar, the post sheet, upload, connect, the approval page and a chat with the copywriter. Inicio, the posts table and the command palette follow in releases 2 to 4, while MCP stays the main way in.
- The app's own audit entries with their hash chain; the headless React component library choice (Base UI is the lean); the "Sin confirmar" pill.
- **Gate:** both pilots run a full month.

### Release 2: customers on WhatsApp

One platform WhatsApp number on Meta's Cloud API (utility templates only); approval and feedback over WhatsApp, one post or the whole month; voice notes; media intake; transcription; suggested edits; the customer connect-invite link (Connection Request entity); the portal with the agency's logo; the client trust page; approval history export; notification preferences.

### Release 3: brand brain and reviewer

Brand onboarding (12 months of history through `history.import`, plus the website), brand facts, memory search (pgvector), full context assembly, the reviewer agent, media tagging, Canva import.

### Release 4: public launch

TikTok (after its app review and content posting audit), custom stages and stage owners, lead times, checklists, approval tiers and grace window, parrilla export, the full 18-tool MCP set, the metrics read tools, Instagram Login for brands with no Facebook Page, Stripe, usage pricing, CFDI, brand export and transfer, deprovisioning, privacy requests, rate limits on our own API and MCP, public sign-up. Lawyer review of terms and privacy before this release.

### Release 5: the month on autopilot

Autonomy dial, planner, the autopilot chain, reporter and customer-facing analyst, calendar dates, the Pro subscription tier, AI-produced media inside the pipeline.

### Release 6: radar and growth

Trend radar, prospect audit, competitor benchmark, rule packs (regulated content checks), creative insights, pooled benchmarks.

### Later

The assistant (Compa), including over WhatsApp; read-only ad tracking; an agency's own WhatsApp number; quick stories; the weekly rewrite of the learned profile; tacit approval; the workload view; templates; linked follow-ups; the content intake link; Drive and Dropbox import; an agency working inside a brand's organisation; cross-organisation dashboards; the full audit trail view; webhooks; the limited comments inbox; link tracking.

### Far out

Performance forecasts and built-in experiments (their data capture starts in release 1).

## Outside the code, start now

These take weeks and are Daniel's to do: open the accounts (AWS for KMS only, Railway Pro, Inngest, Cloudflare R2, a Meta developer account with a business portfolio, Resend, Sentry; Langfuse can wait for release 1); buy the domain (posteando.io or posteando.mx) before the first deploy; the public Astro site with privacy, terms and data deletion pages; an accountant on RESICO versus the general regime; business registration as persona física con actividad empresarial about a month before the first paying customer or before opening beyond Meta testers; Meta business and Tech Provider verification; the TikTok developer organisation about three months before launch.
