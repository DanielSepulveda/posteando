# Conventions

> Status: settled (agreed by Daniel on 2026-11-27 in the release 0 gap check). These rules apply from the first commit. If code needs to break one, stop and ask.

## Names

- Code, database schema, API and MCP say **organisation** and **brand** everywhere. Never `agency`, `client` or `customer` in identifiers.
- An organisation has a type, `agency` or `in_house`. The type only changes words on screen and in MCP replies ("cliente" for an agency, "tu marca" for an in-house team) and the default stages.
- The profile of a brand is the **brand profile**. Its agency-written part and its learned part are kept apart.
- Agents have stable keys: `copywriter`, `reviewer`, later `planner`, `reporter`, `assistant`. Helper names (Lety, Checo, Conta, Compa) and figures are display data, stored or configured as data, never used as identifiers.
- The product is **Posteando**. That name is final.

## Language

- Screens are in Spanish (Mexico) for the pilots. Every user-facing string is keyed from the first commit, so English is a translation, not a rewrite. Source strings are written in Spanish.
- MCP tool names, descriptions and argument names are in English, because models read English best. Replies and error messages come in the person's language.
- Code, comments, commit messages and docs are in English.

## Tables

- Primary keys are time-ordered UUIDs (UUIDv7).
- Times are stored in UTC. Each brand stores an IANA time zone, used for slots, display and "today".
- Every row that belongs to a brand carries both `organisation_id` and `brand_id` directly. Foreign keys between brand rows are composite (`organisation_id`, `brand_id`, `id`), so a post can never reference another brand's asset or account, even through buggy code.
- Every row records provenance: actor type and actor id (who or what made it: a person, a guest, an agent, the system, a network), source (for example web, MCP, WhatsApp, network import) and, where it came through one, the connection. Export, transfer and deletion filter on these columns. The exact enum values are a release 0 choice.
- Editable rows carry a `version` integer.
- Append-only tables (domain events, feedback, approval records, metric snapshots, audit entries, inbound messages, run chunks) have no update path in code.
- Soft delete only where the leaving workflow needs it (see "Trust, data ownership and leaving" in architecture.md). Everything else is a hard delete.
- No Postgres row-level security. Isolation is in the core and the schema (see "Tenancy" below).

## Tenancy

- Feature code never touches the raw database handle. Every core operation requires the organisation context as an Effect service, so an operation without tenant scope does not compile. The data-access layer adds the scoping itself.
- Cross-tenant work (the sweep, pollers, the outbox relay) uses one clearly named system context, so every bypass can be found with a search.
- Every operation that touches brand data takes the brand explicitly. There is no "current brand" default, on any surface.
- Leak tests: create two organisations, call every core operation as the first through every surface, assert nothing from the second appears. These tests exist from release 0 and grow with every operation.
- R2 keys are prefixed by organisation and brand. Every background job carries both ids.

## Operations, schemas and errors

- One Effect Schema per operation defines input, output and typed errors. The MCP tool, the HttpApi endpoint and the typed web client are derived from it, so they cannot drift.
- One shared error set, used by every operation:

| Error | Meaning | Carries |
| --- | --- | --- |
| `NotFound` | The thing does not exist, or the caller may not know it exists | what was looked for |
| `NotAllowed` | The caller's role, scope or policy forbids it | which permission was missing |
| `Invalid` | Input fails validation | field-level issues |
| `Conflict` | The version the caller read has moved, or the state forbids it | current version or state |
| `NeedsReconnect` | The connection is unhealthy | a reconnect link |
| `RateLimited` | A network or our own limit was hit | retry time |
| `NetworkRefused` | The network rejected the request | the network's reason, in plain words |
| `OutcomeUnknown` | A publish may or may not have happened | what is being checked and what the person can do |

- MCP returns these as tool errors with structured details a model can act on. The web shows them in plain Spanish, without jokes (see design/principles-and-voice.md).
- Commands accept an optional request id. A repeated request id returns the first answer instead of doing the work twice.
- Edits carry the version they read and fail with `Conflict` if it moved. This also suits TanStack DB's optimistic updates.

## Publication states

A post's **stage** and a publication's **state** are two separate fields.

- The post stage belongs to the organisation's pipeline: the agency's own stages (default per organisation type, stored as data from release 1, editable in release 4) plus three fixed stages set by the publishing engine: scheduled, published, failed. The fixed stage is derived from the post's publications: scheduled when all are queued, published when all are out, and "needs attention" when any publication failed, was missed or has an unknown outcome.
- Each publication carries its own state:

```
 draft ──confirm (and approval, if rules require)──> scheduled
 scheduled ──due──> publishing
 scheduled ──connection unhealthy──> (held) ──reconnected──> scheduled
 scheduled / held ──more than 30 min late──> missed            [a person decides]
 publishing ──network confirms──> published ──URL available──> link_ready
 publishing ──network refuses──> failed
 publishing ──commit timed out──> outcome_unknown             [gateway checks the network;
                                                               a person decides if still unclear]
 outcome_unknown ──network says nothing was posted──> publishing (automatic retry)
 outcome_unknown ──network shows the post──> published
 missed ──person: post now / move / drop──> publishing / scheduled / (dropped)
```

- Approval and cancelling belong to the post, so they happen before scheduled.
- A publication up to 30 minutes late still goes out automatically, including when the sweep re-triggers it. Past that it becomes missed and a person decides: post now, move it, or drop it. The window is stored per brand so it can change later; 30 minutes is the default everywhere.
- A publish commit is never retried blindly. A heartbeat tells "never started" from "timed out", and `publish.status` asks the network whether the post exists. Automatic retry happens only when the network says nothing was posted.
- "Published" and "link ready" are separate because Instagram and TikTok publish asynchronously.
- The UI pill for `outcome_unknown` ("Sin confirmar") is proposed in the design system, not agreed. Settle it in release 1.

## Connection health

One list, shared by the app and the gateway: `setup_unfinished`, `healthy`, `degraded`, `needs_reconnect`, `revoked`. When a connection goes unhealthy nothing is deleted: its scheduled publications are held, metric polling pauses, and the organisation gets a reconnect link.

## Sign-in

- better-auth, with email magic link (sent through Resend), passkeys and Google sign-in.
- Two-factor is required for owners and admins.
- Sign-up is by invite only until the public launch (release 4).
- The accepted terms and privacy notice version is recorded at sign-up from day one, because that record cannot be rebuilt later.
- MCP authorisation is OAuth 2.1 through better-auth (PKCE, Client ID Metadata Documents, protected resource metadata, refresh tokens that cannot be reused, no token passthrough). A grant covers one organisation and the brands picked on the consent screen. A person in two organisations authorises each separately.

## Roles and permissions

Enforced in the core, so web, MCP, WhatsApp and agents share one check.

| Action | Owner | Admin | Member | Guest (one brand) | Agent run |
| --- | --- | --- | --- | --- | --- |
| Billing; delete or transfer a brand or the organisation | Yes | No | No | No | No |
| Invite and remove people; revoke anyone's MCP grant | Yes | Yes | No | No | No |
| Connect and disconnect accounts | Yes | Yes | Yes | Through a connect link (release 2) | No |
| Create and edit posts and plans | Yes | Yes | Yes | Suggest edits (release 2) | Drafts and suggestions only |
| Confirm, schedule, cancel | Yes | Yes | Yes | No | Never |
| Approve as the customer | In-house approvers only | In-house approvers only | In-house approvers only | Yes | Never |

MCP scopes map onto the same rows: `read` for every read, `draft` for creating and editing, `schedule` for confirming and cancelling, and a separate `manage` scope for people and brands. Confirming may ask for a step-up.

The gateway applies its own policy on top, whatever the app says: an agent-run actor can never publish or delete (see network-gateway.md).

## Request ids, events and the outbox

- A state change and its domain event are written in the same transaction (the outbox). The relay delivers events and fires Postgres NOTIFY; the sweep redelivers anything stuck.
- No event sourcing: tables hold current state, the event log records what happened.

## Tooling

- pnpm workspaces, one monorepo. Vitest for tests, Biome for lint and format, GitHub Actions for CI.
- Sentry free tier for errors. Langfuse Cloud free tier for traces from release 1, with traces sent as OpenTelemetry.
- Effect versions are pinned, because Effect's MCP and AI modules are marked unstable.

## Environments

- Three environments: dev, staging, production. Each has its own Meta test app, KMS key, R2 bucket and Inngest environment.
- The gateway has a fake network mode for dev and tests, so most work never touches a real network.
- **The product domain is not chosen yet**: posteando.io or posteando.mx. Keep it a single configuration value (for example `APP_DOMAIN`) with a placeholder. It must be fixed before the first deploy, because passkeys, the Meta app settings, the gateway's OAuth callback and webhook addresses, the R2 media domain verified with TikTok, and the privacy, terms and deletion pages all bind to it. Changing it after users exist signs everyone out of their passkeys.
