# Release 0 tasks

> Status: ordered plan for the first build sessions. The scope and gate are settled (see [release-plan.md](release-plan.md)); the order and the split into tasks are a recommendation a build session may refine, but not the scope.

Each task ends with tests passing in CI and a short note in the PR of what was decided along the way. Tasks marked **spike** answer a question first and may change the next tasks; record the answer in [decisions.md](decisions.md).

## Week 1: foundations and spikes

1. **Monorepo skeleton.** pnpm workspaces; packages for `core`, `db`, `gateway-contract`; apps for `web` (HttpApi + MCP + SPA hosting), `worker`, `gateway`, `site` (Astro, later in the week), `spa` (Vite + React + TanStack Router). Biome, Vitest, TypeScript strict, GitHub Actions running lint, type check and tests. Pin Effect to an exact version. Copy `design/tokens/tokens.css` and the fonts into the SPA. The package names are a suggestion; the split into core, surfaces, adapters and gateway is not.
2. **Spike: Drizzle on Effect SQL with Effect 4.1.** One table, one generated migration, and one transaction that writes a row and an outbox row through the shared connection. If Drizzle's Effect driver does not work on Effect 4.1, fall back to Effect SQL alone with hand-written SQL migrations and our own tenant-scoped repository helper (`SqlModel.makeRepository` keys on one id column, which is not enough).
3. **Spike: MCP spec version and auth.** Find the newest MCP spec version that both Effect's McpServer and better-auth's MCP plugin support, and use it (the older docs cited 2025-11-25 for OAuth and 2026-07-28 for transports). Prove an MCP client can complete OAuth 2.1 with PKCE and Client ID Metadata Documents against better-auth mounted inside Effect HttpApi. If Effect's McpServer falls short, use the official MCP TypeScript SDK v2.
4. **Spike: Meta permissions.** Check Meta's current docs for the exact permission list needed for single-image publishing to Instagram (through Facebook business login) and to a Facebook Page, and for reading one post's insights. Check whether one Meta app can later also take Instagram Login or needs a second app. Write the list into decisions.md.
5. **Tenancy core.** Organisation, brand, user, membership tables following conventions.md; the organisation context service; the system context; the shared error set; request ids and version checks; the leak test harness (two organisations, every operation, every surface).
6. **Outbox and events.** Domain event table, same-transaction write, the relay with Postgres NOTIFY, `deliver_events`, and the sweep skeleton.

## Week 2: sign-in, MCP and the gateway

7. **Sign-in.** better-auth with magic link through Resend, passkeys and Google; two-factor required for owners and admins; invite-only sign-up; privacy notice version recorded at sign-up; `create_organisation` (typed agency or in-house). The domain is a config placeholder until Daniel picks it.
8. **MCP surface.** Effect McpServer behind OAuth; `authorize_mcp_client` consent screen picking one organisation and its brands; scopes read, draft, schedule, manage; thin `get_context`; tools derived from operation schemas; every brand-touching tool takes the brand explicitly.
9. **Gateway service.** Effect RPC contract; HMAC signing over body, timestamp and nonce; its own schema and database role; KMS key per environment and data key per organisation, AES-GCM per token; the policy table (agent runs denied publish and delete), ceilings, kill switches, hash-chained receipts; fake network mode.
10. **Connect.** `connect.start`, the OAuth callback in the gateway, `connection.describe`, Connection rows in the app with health states; `start_account_connection`, `complete_account_connection`, thin `create_brand` and thin `list_social_accounts`.

## Week 3: media and publishing

11. **Media.** R2 bucket per environment with organisation and brand prefixed keys; thin `create_upload_link` (an upload page that sends the file straight to R2) and `complete_upload` (images only, JPEG conversion in the worker, size and ratio validation); R2 custom domain on the placeholder domain.
12. **Publishing engine.** `create_draft_post` and `confirm_post`; one Inngest run per publication behind a thin runtime adapter; sleep until due, re-read from Postgres; `publish.prepare`, `publish.commit` and `publish.status` for Instagram and the Facebook Page; the publication state machine in conventions.md, including the 30-minute late window (stored per brand), missed, and outcome unknown with heartbeat and status check; `check_publish_status`; outputs and the published event in one transaction; `get_publish_log`.
13. **Sweep.** `sweep_overdue` re-triggers overdue publications within the window, marks older ones missed, and redelivers stuck events. Test it against an Inngest outage in the fake network mode.
14. **Thin insights.** `metrics.fetch` for one post's insights, stored as an append-only snapshot with the raw response.

## Week 4: trust, deploy and the screencasts

15. **Deletion callback.** `handle_deletion_callback`: maps the person to the connections they granted, deletes those connections and tokens, records the request, serves Meta's status page. Also the deauthorise callback marking connections revoked.
16. **Web screens.** Sign-in, MCP consent, connect, the upload page and a simple post form, using the design tokens and component classes from `design/`. Plain and correct beats polished here.
17. **Public site.** Astro site with privacy, terms and data deletion pages (we draft them; the lawyer reviews before release 4).
18. **Railway deploy.** Three services (web, worker, gateway) on the private network; Railway Postgres on Pro with point-in-time recovery on and a nightly `pg_dump` to R2; dev, staging, production, each with its own Meta test app, KMS key, R2 bucket and Inngest environment; Sentry. **Blocked until the domain is chosen.**
19. **End-to-end check.** From an MCP client: create a brand, connect Instagram and a Facebook Page, upload an image, draft, confirm, publish to both, read the insights, trigger the deletion callback. Record Meta's screencasts for every permission. This is the release 0 gate.

## Needs from Daniel during release 0

- The domain: posteando.io or posteando.mx (blocks task 18).
- The accounts listed in release-plan.md (blocks tasks 7, 9, 11, 12 and 18 against real services; the fake modes work without them).
- Both pilots added as testers on the Meta app.
