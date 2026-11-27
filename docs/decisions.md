# Decisions log

> Status: every line here was agreed by Daniel on the date shown. "Held loosely" means agreed, but open to change when real use says otherwise. Add new decisions at the bottom of the right section with a date; never rewrite an old line, strike it and add the replacement.

## Product

- 2026-11-22: Agency-first, multi-tenant social scheduling with client guests and approvals, analytics as a core feature. First networks Instagram, Facebook, TikTok.
- 2026-11-22: MCP first. A solid core of operations with MCP and web as thin surfaces over it.
- 2026-11-22: Post (shared media, base caption, brand) with one Publication per target account. Stored as a graph so linked follow-ups can come later without a migration; v1 exposes no links.
- 2026-11-22: Approval is for the whole post. Publications share one time by default with an optional per-account override. Drafts can be confirmed through MCP.
- 2026-11-22: Granular core operations, a smaller curated MCP tool set (18 by release 4, 20 in release 6).
- 2026-11-23: Mexico first, not coupled to Mexico. Rich in formats: every format a network lets us post.
- 2026-11-23: Tenant renamed to organisation, with brands. In-house teams fit the same model. An idea is a post in the idea stage.
- 2026-11-23: Only scheduled, published and failed are fixed stages; approval is a rule attached to a stage, applied per brand. The agency can request approval on a post even when rules allow skipping it.
- 2026-11-23: No fixed job roles. Built-in AI agents fill roles (copywriter, reviewer first); their building blocks ship in v1. The assistant is separate and comes after the agents.
- 2026-11-23: Canva import is in v1 (release 3). Notifications over in-app, email and WhatsApp. Comments inbox only at a limited level. Link tracking deferred.
- 2026-11-23: No content editing screen, held loosely: AI may deliver finished media inside the pipeline, but the product must not read as an editing platform.
- 2026-11-23: All nine AI bets stay. Pooled anonymised results across organisations, with an opt-out. Public data from other businesses may be used.
- 2026-11-24: Scoped AI only: every agent and the assistant does only what it was designed for, on every surface, and politely refuses anything else.
- 2026-11-24: Agency workflow folded in (content plan, stages, approval records, my work, lead times, checklists on posts and plans only).
- 2026-11-26: Read-only ad tracking first, campaign management furthest out (held loosely).
- 2026-11-26: Product name "Posteando" is final.
- 2026-11-27: Helpers: people talk to helpers directly; one helper per chat; no pulling other helpers into a chat; chats private for now; Compa later as an optional front door that delegates. Shared chats parked.
- 2026-11-27: MCP must be designed and built really well and integrate deeply. Sell MCP by what it does; list in the Claude directory around release 4.
- 2026-11-27: AI video clipping (several clips from one long video) is wanted; release open.

## Architecture and stack

- 2026-11-22: Hexagonal, organised by feature, modular monolith, domain events through an outbox, light CQRS for analytics, no event sourcing, no broker. Effect used fully for core and adapters.
- 2026-11-22: No Postgres row-level security. Isolation in app code and schema (composite foreign keys).
- 2026-11-24: Railway for web and worker; Cloudflare only for media (R2), not Workers; media normalised in v1; Inngest Pro once customers pay; WhatsApp via Meta Cloud API with utility templates only; Stripe first, SPEI for larger bills.
- 2026-11-26: Railway Postgres to start (Pro, point-in-time recovery from day one, nightly pg_dump to R2); PlanetScale or Railway HA checked again at the first paying customer.
- 2026-11-26: Drizzle on Effect SQL (spike on Effect 4.1, fallback Effect SQL alone). Effect McpServer (fallback official SDK v2). Own agent platform on Effect AI behind a provider-neutral model gateway, Inngest runtime behind a thin adapter, Langfuse traces and evals, model per task chosen by evals. No Temporal, Mastra or Vercel eve. TanStack DB fed by our API with NOTIFY and SSE (Electric later if needed, no WebSockets yet). AI SDK UI over a durable run stream in Postgres.
- 2026-11-26: Network gateway as a separate service, executor not proxy, app orchestrates, KMS key per environment plus data key per organisation, own schema on the same Postgres, holds all customer connections, private network plus HMAC-signed requests, one replica then two at the first paying customer, lands in release 0. Per-network refresh profiles, per-command policy by actor, no raw proxy, build not buy.
- 2026-11-26: Langfuse Cloud free tier first, self-host when cheaper; traces as OpenTelemetry. Any vendor receiving client data meets the AI provider floor.
- 2026-11-26: better-auth for sign-in and the MCP OAuth server (fallback WorkOS AuthKit). Passkeys and admin two-factor. Client trust page. Hash-chained audit log. Scoped short-lived credentials per agent run.
- 2026-11-26: Gateway metric fetching moves to release 1 (thin read in release 0). No minimum monthly charge.
- 2026-11-27: "Outcome unknown" publish state; never blind-retry a publish commit.
- 2026-11-27: Frontend is React; Solid 2 deferred. Effect HttpApi instead of Hono. Vite React SPA with TanStack Router. pg-boss for the analytics queue from release 1. Public site in Astro.
- 2026-11-27: Release 0 gap check, all agreed: thin release 1 operations pulled into release 0; Instagram plus Facebook Page and one insights read in release 0; JPEG conversion at upload; post stage and publication state as two fields; 30-minute late window then missed; organisation and brand in code; table conventions; shared error set; request ids and version checks; sign-in methods and invite-only; role matrix; Spanish source strings; tooling and environments. See conventions.md.

## Connections and trust

- 2026-11-26: Instagram connects through Facebook business login only in releases 0 and 1 (made firm 2026-11-27); Instagram Login by release 4.
- 2026-11-26: A brand can transfer to another organisation with the client's consent. An organisation leaving: 30 days read-only, then deletion, as a full deprovisioning workflow.
- 2026-11-26: AWS KMS for token keys.

## Releases

- 2026-11-26: Release order 0 to 6 as in release-plan.md, two pilots (Daniel's agency and an in-house company), IG plus FB in the pilot, approval link pasted into WhatsApp in release 1, copywriter in release 1, brand brain before launch.
- 2026-11-27: Release 0 gate: every permission works end to end and the screencasts are recorded; review submitted after business verification; pilots on Standard Access.
- 2026-11-27: Release 1 web: the mocked shell with calendar, post sheet, upload, connect, approval page and a copywriter chat. Inicio, posts table and command palette in releases 2 to 4.

## Pricing

- 2026-11-23: No per-seat charging. Usage-based where possible, advanced features behind a subscription.
- 2026-11-24 and 2026-11-26: Unit is an active brand per month (graduated, illustrative MXN 99/79/59); unlimited users, guests free; pooled organisation AI credits; flat Pro per organisation with the assistant; permanent free tier of one brand that stays free after upgrading; card first, SPEI good to have; annual prepay discount. Pro decides access, credits pay per run; fixed credit price per action; small background AI free.
- 2026-11-27: Keep verifying the per-brand unit with real use; price rich features competitively without forcing ourselves to be the cheapest.

## Design

- 2026-11-26: Direction: papelería-leaning blend with sticker moments, cherry #810100 on cotton, Allo font, tú voice, lift-and-press buttons.
- 2026-11-26: Figures: Sello (brand and logo, eight lobes), Globo (copywriter), Nota (reviewer), Barras (numbers), Domo (assistant); "Puntos" eyes; blink one figure at a time; glance nearest figure only. Inks: cherry, azul tinta #27407A, amarillo #E8B62C, verde botella #2C5B4C, noir.
- 2026-11-27: App UI direction settled. Brand picker at the top of the sidebar under the logo, searchable, "Todas las marcas" by default, plus a "Marcas" directory page.
- 2026-11-27: Design system v1 with primitive and semantic tokens; code uses semantic roles only. One theme, no dark mode. Colour fixes agreed; pastels kept with a stage mark on calendar slips.
