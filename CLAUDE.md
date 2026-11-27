# Instructions for build sessions

You are building Posteando: an agency-first social media scheduling platform for Mexico first (also for in-house teams), driven through MCP first, with a few web screens. The planning is done. Your job is to build it as designed, without rework.

## Read first

1. `docs/README.md`, then the files it lists in order. `docs/conventions.md` applies from the first commit.
2. `docs/release-plan.md` and `docs/release-0-tasks.md` for what to build now.
3. `design/README.md` before writing any UI.

The docs in this repo are the source of truth. Links to claude.ai artifacts inside them point to the research behind a decision; you may not be able to open them, and you do not need to.

## How we work

- **Settled means build it.** Do not reopen a settled decision, swap a chosen library or redesign a flow because another way looks simpler. If you find a real problem with a decision (it cannot work, a library is broken, a network API forbids it), stop, explain it with evidence, propose the smallest change, and wait for Daniel.
- **Open means ask.** Anything in `docs/open-questions.md` is not decided. Do not guess. Build the settled part with a clean seam, and ask.
- **Proposals are not decisions.** A line marked proposal or proposed is not agreed.
- **Later means later.** Leave room in the design (the docs say where), but do not build deferred features early.
- **Release by release.** Work on the current release only. Each task ends with passing tests and CI.
- **Explain trade-offs plainly.** Daniel prefers plain-language summaries and explicit trade-offs: what we gain, what we pay, what we chose. No jargon walls.
- **Ambition in design, not in spend.** Daniel does not want the simpler option picked just because it is one person plus AI building ("complexity must earn its place"), and the platform must run on tight margins, so avoid expensive services.
- **Record decisions.** When a spike or a question is answered, add a dated line to `docs/decisions.md` and update the doc it affects in the same PR.

## Hard rules

- **Tenant isolation is structural.** Every core operation requires the organisation context service; feature code never touches the raw database handle; composite foreign keys include the brand; leak tests cover every operation on every surface. Cross-tenant work uses the named system context only. No Postgres row-level security.
- **Every brand-touching operation takes the brand explicitly.** No "current brand" default anywhere, including MCP.
- **Names:** organisation and brand in code, schema, API and MCP. Never `agency`, `client` or `customer` in identifiers. Agents use stable keys (`copywriter`, `reviewer`); helper names (Lety, Checo, Conta, Compa) are display data only.
- **One core, thin surfaces.** Business rules live only in core operations. MCP tools, HttpApi endpoints and the web client are derived from each operation's Effect Schema.
- **Tokens never leave the network gateway.** The app, MCP, worker and agents never see a network token or app secret. Media goes to the gateway as R2 keys.
- **Agents never approve, publish or delete.** The core and the gateway both enforce it.
- **Never retry a publish commit blindly.** Follow the publication state machine in `docs/conventions.md`, including missed and outcome unknown.
- **State change and domain event in one transaction** (the outbox). Append-only tables have no update path.
- **New posts start as drafts** that a person confirms.
- **The domain is a placeholder** (`posteando.io` or `posteando.mx`, not chosen). Keep it one config value. Do not deploy anything public, register passkeys against a real domain, or configure Meta, TikTok or R2 custom domains until Daniel picks it.
- **Network logos** must be the official files under each network's brand rules. The glyphs in `design/` are stand-ins.
- **Design tokens:** UI code uses semantic tokens only (`surface-*`, `content-*`, `line-*`, `action-*`, `stage-*`, ...), never primitives or hex values. One theme, no dark mode. Regenerate `design/tokens/tokens.css` with `python3 design/tools/build_tokens.py`; never edit it by hand.
- **Strings:** every user-facing string is keyed from the first commit; Spanish (Mexico) source strings, tú, voice per `design/principles-and-voice.md`. No jokes in errors, billing or data. MCP tool names and descriptions are in English.
- **Scoped AI:** every agent does only its designed job and politely refuses anything else, on every surface.
- **Do not copy code from Postiz** (AGPL). Reading for ideas is fine.
- **Never commit secrets.** Use Railway sealed variables and local `.env` files that are git-ignored.
- **Pin Effect to an exact version.** Its MCP and AI modules are marked unstable.

## What not to do

- Do not add a dark mode, an editor screen, per-seat pricing, WebSockets, a message broker, Temporal, Mastra, Hono, Convex or Cloudflare Workers. See the rejected list in `docs/open-questions.md`.
- Do not pull another helper into a helper's chat, or add a share button or private/shared toggle to chats.
- Do not market or write copy that says what the product does not do.
- Do not merge decisions into code that the docs mark as open, parked or later.
- Do not rename helper names, stages or figures in code; they are data.

## Stack at a glance

TypeScript end to end, pnpm workspaces, Effect 4 core (hexagonal, by feature, modular monolith), Drizzle on Effect SQL (week 1 spike; fallback Effect SQL alone), Effect HttpApi with better-auth mounted as a handler, Effect McpServer (fallback official SDK v2), Inngest for publishing and agents behind a thin runtime adapter, pg-boss for analytics (release 1), Railway (web, worker, gateway) with Railway Postgres (Pro, point-in-time recovery, nightly dump to R2), Cloudflare R2 for media, AWS KMS for token keys, Resend, Sentry, Langfuse (release 1), Vite + React + TanStack Router + TanStack DB + AI SDK UI for the app, Astro for the public site, Vitest, Biome, GitHub Actions.
