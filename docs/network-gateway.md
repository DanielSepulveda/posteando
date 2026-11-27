# Network gateway

> Status: settled (all eight design choices agreed by Daniel on 2026-11-26, plus the refresh profiles, per-command policy, no raw proxy, build-not-buy and "outcome unknown" additions the same week). Lands in release 0.

The gateway is a second deployable in the monorepo and the only service that holds network tokens and the Meta and TikTok app secrets. It is the adapter behind the core's social network port, so nothing above the port knows it exists. A token leak is the failure that would sink the company, which is why this one piece is a separate service while everything else stays a modular monolith.

## Shape: an executor, not a proxy

- The app decides, the gateway translates. The app makes every post decision and sends a typed spec per network and format. The gateway only translates: endpoints, fields, upload steps, polling, error mapping, and pinned network API versions.
- A raw or allowlisted proxy is rejected: Graph API `fields` expansion leaks data through path allowlists. There is no raw proxy behind the executor either.
- Results come back in our schema, never as tokens or raw network data. Media goes by R2 key, never by URL; the gateway has read-only access to the bucket and networks pull media from the R2 custom domain.
- Publishing workflows, approvals and domain events stay in the app's Inngest worker. The gateway owns only what needs a secret.

## Commands

Served over Effect RPC on Railway's private network, with an Effect Schema contract.

| Command | What it does | Release |
| --- | --- | --- |
| `connect.start` | Builds the network's OAuth link for a brand | 0 |
| `connection.describe` | What the connection is, its scopes, the accounts it reaches, and its health | 0 |
| `connection.disconnect` | Revokes at the network and deletes the tokens | 0 |
| `publish.prepare` | Validates and uploads media, creates the network container | 0 |
| `publish.commit` | Publishes, idempotently | 0 |
| `publish.status` | Asks the network what happened: confirmation, URL, or whether a timed-out commit posted | 0 |
| `quota.read` | Reads the network's live publish quota (Instagram's cap is documented as both 50 and 100 per 24 hours, so read `content_publishing_limit` live) | 0 |
| `metrics.fetch` | Insights for posts or accounts | 0 thin (one post), 1 full |
| `history.import` | Past posts and metrics for brand onboarding | 2 to 3 |
| `comments.list`, `comments.reply` | The limited comments inbox | Later |
| `ads.read` | Read-only ad tracking | Later |

## What it owns

- The OAuth callback of every connect link, so a fresh token never passes through the main app.
- Network webhooks: Meta's deauthorise and data deletion callbacks (with the status page Meta requires), Meta's managed-accounts notice, TikTok's `authorization.removed`.
- Token refresh ahead of expiry, with a row lock per connection so two refreshes never race, using a **refresh profile per network** (TikTok refresh tokens rotate and its docs disagree on lifetimes, so read `expires_in`).
- Connection health, reported back to the app (states in conventions.md). It runs its own Inngest app over Connect for refresh and health jobs.
- Later, every other customer connection: Canva, Drive, an agency's own WhatsApp number.

## Sealing

- AWS KMS, one key per environment, and one data key per organisation (encryption context = organisation id). Each token is sealed with AES-GCM.
- Only the gateway has KMS decrypt rights.
- Destroying an organisation's data key at day 60 of the leaving workflow makes every copy of its tokens unreadable, backups included (crypto-shredding).
- Its data sits in its own Postgres schema with its own database role, on the same Railway Postgres.

## Policy

The gateway applies its own policy, whatever the app says:

- A policy table per command and actor: allow, needs approval, or deny. Agent runs are always denied publish and delete.
- Publish ceilings per connection and per organisation.
- Kill switches per organisation and global.
- A hash-chained receipt for every command (from release 0).
- Meta's `appsecret_proof` is on, so a leaked Meta token is useless without the app secret.

## Calls between app and gateway

- Private network plus requests signed with HMAC over body, timestamp and nonce. This stops impersonation and replays. It does not stop a breached app from signing; the narrow commands, ceilings, policy and receipts limit what such an app can do. mTLS and delegation tokens were weighed and not chosen.

## Running it

- One replica in release 0. Two from the first paying customer.
- A fake network mode for dev and tests.
- Each environment has its own Meta test app.

## Build, not buy

No Zernio, Nango or Composio. Zernio holds tokens on its own Meta and TikTok apps and costs roughly a whole brand's price per brand; Nango's self-hosted free tier is for hobby use; Composio is for agent tool calls. An aggregator as one adapter for small, later networks stays an open door, decided per network, not a plan.

## Facts to keep in mind

- TikTok's `PULL_FROM_URL` needs a DNS-verified domain and no redirects, which is why media is served from an R2 custom domain.
- Railway gives sealed variables and a WireGuard private network; static IPs are Pro only and not dedicated.
- Instagram takes JPEG only for images; no filters, shopping tags, branded content tags or library music through the API.
- TikTok unaudited apps may only post privately. TikTok's posting UI is prescribed (privacy dropdown with no default, toggles off, a consent line), so approval needs a per-post TikTok settings step (release 4).
