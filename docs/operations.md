# Core operations

> Status: settled catalogue. The Scope column is the release each operation lands in.
> Words: in prose, "agency" means an organisation of type agency and "client" or "customer" means a brand. Code, schema and MCP always say organisation and brand (see [conventions.md](conventions.md)).

## Core operations

The core exposes about 172 granular operations across fourteen features. The Scope column follows the agreed release plan ([First release cut and release order](https://claude.ai/artifact/S7hXHSsBAzGwGhZGmpjb9Q), agreed 2026-11-26): release 0 is the walking skeleton, release 1 the pilot month, 2 customers on WhatsApp, 3 brand brain and reviewer, 4 the public launch, 5 the month on autopilot, 6 radar and growth, then later and far out. What this doc earlier called v1 is releases 1 to 4, and soon after v1 is releases 5 and 6; where the prose still says v1, read it that way. By operation row, roughly 17 land in release 0 (5 of them thin versions of release 1 operations), 60 in release 1, 11 in release 2, 7 in release 3, 20 in release 4, 8 in release 5 and 10 in release 6. The MCP does not expose them one to one: it offers a smaller curated tool set on top (see Proposed MCP tool set), and release 1 ships about 10 of those tools, the full 18 arriving with release 4.

Every operation that touches client data takes the client explicitly. Internal operations are called by Inngest, the poller or the worker and are never exposed as tools.

Names (agreed 2026-11-27): code, schema and MCP say organisation and brand everywhere, and "cliente" or "tu marca" are only words on screen, chosen by organisation type. The names below already use organisation and brand (`create_organisation`, `create_brand`, `get_brand_profile`, ...). Agents have stable keys (`copywriter`, `reviewer`, later `planner`, `reporter`, `assistant`); the helper names (Lety, Checo, Conta, Compa) are display data only. Release 0 also takes thin versions of `create_brand`, `get_context`, `list_social_accounts`, `create_upload_link` and `complete_upload` (images only, converted to JPEG at upload), because the walking skeleton cannot run without them.

### Tenancy and access

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `create_organisation` | Sign up: creates the organisation, typed as agency or in-house (which sets the words on screen and in MCP and the default stages), and its owner membership | Command | Web | Release 0 |
| `get_context` | Who am I: agency, role, and the clients I can act on | Read | MCP, Web | Release 0 (thin), full in release 1 |
| `create_brand` | Adds a customer, with timezone and approval policy | Command | MCP, Web | Release 0 (thin), full in release 1 |
| `update_brand` | Changes name, timezone or approval policy | Command | MCP, Web | Release 1 |
| `list_brands` | Clients with account health and what is queued | Read | MCP, Web | Release 1 |
| `archive_brand` | Stops publishing and polling for a customer, keeps history | Command | Web | Later |
| `invite_member` | Invites staff with a role, optionally scoped to one client | Command | MCP, Web | Release 1 |
| `invite_guest` | Invites a customer guest pinned to one client | Command | MCP, Web | Release 1 |
| `list_members` | Staff and guests with roles | Read | MCP, Web | Release 1 |
| `change_member_role` | Changes a role or client scope | Command | Web | Later |
| `remove_member` | Revokes a staff or guest membership | Command | Web | Release 1 |
| `authorize_mcp_client` | OAuth consent that grants a model access to one organisation and the brands picked on the consent screen | Command | Web | Release 0 |
| `revoke_mcp_client` | Lists and revokes MCP grants | Command | Web | Release 1 |

### Connections

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `start_account_connection` | Returns the OAuth link for an agency user to connect an account | Command | MCP, Web | Release 0 |
| `create_connect_invite` | Creates the expiring link the customer uses to connect their own account | Command | MCP, Web | Release 2 |
| `complete_account_connection` | OAuth callback, handled by the network gateway: it seals the tokens in its own schema, and the app records the Connection for the client | Command | Internal (gateway callback) | Release 0 |
| `list_social_accounts` | Accounts per client with health status | Read | MCP, Web | Release 0 (thin), full in release 1 |
| `disconnect_social_account` | Disconnects, asking what to do with scheduled content | Command | MCP, Web | Release 1 |
| `refresh_account_tokens` | Proactive token refresh, run inside the network gateway, which reports health back to the app | Command | Internal (worker) | Release 1 |
| `mark_account_unhealthy` | From auth errors or deauthorisation callbacks; blocks publications, pauses polling, emits the event | Command | Internal | Release 1 |
| `connect_source` | Connects Google Drive or Dropbox | Command | Web | Later |

### Assets

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `create_upload_link` | Returns a link to an upload page that sends the file straight to R2 | Command | MCP, Web | Release 0 (images only), full in release 1 |
| `complete_upload` | Registers the asset and emits asset uploaded | Command | Internal (web) | Release 0 (images only), full in release 1 |
| `import_from_source` | Copies a file from Drive or Dropbox into R2 as an asset | Command | MCP, Web | Later |
| `list_assets` | A client's assets with status and per-network validation results | Read | MCP, Web | Release 1 |
| `get_asset` | One asset with versions, features and transcript | Read | MCP, Web | Release 1 |
| `search_assets` | Searches a client's library over labels and transcripts | Read | MCP, Web | Release 1 |
| `get_asset_usage` | The posts that used an asset and how they performed | Read | MCP, Web | Release 4 |
| `process_asset` | Pipeline steps: validate against network rules, thumbnail, transcribe | Command | Internal (worker) | Release 1 |
| `tier_old_originals` | Moves old originals to cheaper storage, keeping a light preview | Command | Internal (worker) | Later |
| `copy_asset_to_brand` | Explicit copy of an asset to another client | Command | MCP, Web | Later |

### Labels, archive and brand profile

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `manage_labels` | Defines label groups and labels for the agency | Command | MCP, Web | Release 1 |
| `review_ai_tags` | Confirms or rejects AI tags on assets (behind the `label` MCP tool) | Command | MCP, Web | Release 3 |
| `label_items` | Adds or removes labels on assets, ideas, posts or Platform Content | Command | MCP, Web | Release 1 |
| `manage_collections` | Creates collections and moves assets in and out | Command | MCP, Web | Release 4 |
| `search_posts` | The archive: posts and Platform Content by label, date, network or performance | Read | MCP, Web | Release 1 |
| `get_brand_profile` | Voice, style, likes and dislikes, with learned suggestions shown apart | Read | MCP, Web | Release 1 |
| `update_brand_profile` | Edits the agency-authored part | Command | MCP, Web | Release 1 |
| `learn_profile_suggestions` | Derives suggestions from feedback events, agent edits and performance | Command | Internal (worker) | Later |
| `accept_profile_suggestion` | Moves a learned suggestion into the agency-authored part | Command | MCP, Web | Later |
| `recommend_posts` | Suggests posts or trends for a customer; trends need an outside data source | Read | MCP, Web | Later |

### Customer features

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `get_portal` | The customer's read-only calendar, approvals and analytics, with the agency's logo | Read | Web (portal) | Release 2 |
| `create_approval_link` | Signed, expiring link for approving without an account; sent when a post or plan needs approval | Command | Internal, MCP | Release 1 |
| `send_approval_reminders` | Reminds the customer about posts and plans still waiting, by email or WhatsApp | Command | Internal (worker) | Release 1 |
| `approve_plan` | The customer approves a whole content plan in one pass | Command | Web (portal), WhatsApp | Release 1 |
| `schedule_report` | The analyst's monthly report per customer, reviewed by the agency, sent to the portal and WhatsApp | Command | MCP, Web | Release 5 |
| `create_intake_link` | A link for the customer to drop raw material into the library | Command | MCP, Web | Later |

### Ads (later)

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `connect_ad_account` | Connects a customer's ad account through OAuth | Command | MCP, Web | Later |
| `sync_ads` | Pulls ads that promote existing posts and links them to Platform Content | Command | Internal (poller) | Later |
| `get_ad_performance` | Spend, reach, clicks and cost per result next to organic performance | Read | MCP, Web | Later |

### Agency workflow, plans and agents

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `set_pipeline_stages` | Names, orders and skips the agency's stages, with approval behaviours, per client. Default stages per organisation type are stored as data from release 1; editing them comes in release 4 | Command | MCP, Web | Release 4 |
| `set_stage_owner` | Optional default owner per stage per client, a person or an AI agent | Command | MCP, Web | Release 4 |
| `set_lead_times` | Per client: how long each stage needs before the publish date | Command | MCP, Web | Release 4 |
| `move_post_stage` | Moves a post on; applies the approval rules, hands it to the stage owner and sets due dates | Command | MCP, Web | Release 1 |
| `assign_post` | Hands a post to someone else | Command | MCP, Web | Release 1 |
| `list_my_work` | Everything waiting on me across clients, late items first | Read | MCP, Web | Release 1 |
| `check_item` | Ticks a checklist item on a post or plan; a required item can block the next stage | Command | MCP, Web | Release 4 |
| `get_workload` | Posts per person per week | Read | MCP, Web | Later |
| `create_plan` | A content plan for a client and period, with an optional quota per format, brief and deadline | Command | MCP, Web | Release 1 |
| `edit_plan` | Changes the quota, slots, brief or deadline | Command | MCP, Web | Release 1 |
| `request_plan_approval` | Sends the whole plan to the customer through the portal or WhatsApp | Command | MCP, Web | Release 1 |
| `get_plan_status` | Quota progress ("9 of 12 ready"), approval state and posts at risk | Read | MCP, Web | Release 1 |
| `export_plan` | An export of the plan that looks like a parrilla | Read | MCP, Web | Release 4 |
| `add_idea` | Creates a post in the idea stage, from the team, the customer or a model | Command | MCP, Web | Release 1 |
| `plan_idea_into_slot` | Places an idea post into a plan slot | Command | MCP, Web | Release 1 |
| `configure_agent` | Turns an AI agent on for a client and sets what it may do | Command | Web | Release 1 |
| `run_agent` | Runs an agent (copywriter, reviewer; later planner, reporter) on a post or plan; metered per run | Command | MCP, Web, Internal | Release 1 |
| `import_from_canva` | Imports designs from Canva into the library | Command | MCP, Web | Release 3 |
| `get_network_capabilities` | The formats and settings each network supports | Read | MCP, Web | Release 1 |
| `mark_published_manually` | Closes an assisted publication posted by hand | Command | MCP, Web | Release 4 |

### Notifications, billing and usage

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `notify` | Reacts to domain events and sends to each person on their chosen channels | Command | Internal (worker) | Release 1 |
| `set_notification_preferences` | Which events, on which channels (in-app, email, WhatsApp) | Command | Web | Release 2 |
| `list_notifications` | The in-app notification feed | Read | Web | Release 1 |
| `record_usage` | Writes metered units from domain events | Command | Internal | Release 1 |
| `check_entitlement` | Answers whether the plan allows an action or has usage left | Read | Internal | Release 4 |
| `get_usage` | The agency's usage and plan limits | Read | MCP, Web | Release 4 |
| `issue_tax_invoice` | Issues the country's tax invoice for a payment, CFDI in Mexico | Command | Internal (worker) | Release 4 |

### Assistant and other ideas (later)

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `ask_assistant` | The in-app assistant: a model calling the same core operations | Command | Web | Later |
| `recommend_schedule_changes` | AI insights that suggest when and what to post | Read | MCP, Web | Later |
| `list_comments`, `reply_to_comment` | A limited inbox for comments on published posts | Read, Command | MCP, Web | Later |
| `create_tracked_link` | Short links with click tracking | Command | MCP, Web | Later |

### AI bets

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `onboard_brand` | Imports 12 months of posts, metrics and comments plus the website, and drafts the brand brain | Command | MCP, Web | Release 3 |
| `review_profile_draft` | Accepts, edits or drops each drafted profile item and fact | Command | MCP, Web | Release 3 |
| `manage_brand_facts` | Adds, edits, expires or asks the customer to confirm a fact | Command | MCP, Web, WhatsApp | Release 3 |
| `search_brand_memory` | Searches past posts, feedback, facts and comments for a brand | Read | MCP, Web | Release 3 |
| `assemble_context` | Builds the cached brand packet an agent reads, within a token budget | Read | Internal | Releases 1 (basic), 3 (full) |
| `refresh_learned_summary` | Weekly rewrite of the learned part of the profile | Command | Internal (worker) | Later |
| `analyse_asset` | Describes and tags a photo or video and proposes cover frames | Command | Internal (worker, batch) | Release 3 |
| `get_creative_insights` | Which visuals and formats work per brand, from AI tags joined to metrics | Read | MCP, Web | Release 6 |
| `receive_inbound_message` | Stores a WhatsApp message and finds its contact and brand | Command | Internal (webhook) | Release 2 |
| `route_inbound_message` | Sends a message to the right operation: asset, feedback, approval, status question or the agency | Command | Internal | Release 2 |
| `manage_contacts` | A brand's customer contacts and their phone numbers | Command | MCP, Web | Release 2 |
| `draft_quick_story` | A story text in the brand voice for a photo the customer sends | Command | WhatsApp | Later |
| `set_autonomy_level` | How far AI goes for a brand, from off to straight to customer | Command | MCP, Web | Release 5 |
| `generate_plan` | Runs the autopilot chain for a brand and month | Command | MCP, Web, Internal | Release 5 |
| `regenerate_slot` | Redoes one slot of an AI-drafted plan | Command | MCP, Web | Release 5 |
| `send_shot_list` | Sends the customer the photos still needed, over WhatsApp | Command | MCP, Web | Release 5 |
| `manage_calendar_dates` | National, regional and per-brand dates | Command | Web | Release 5 |
| `scan_trends`, `match_trends` | One scan per market, then matching per brand | Command | Internal (worker) | Release 6 |
| `list_trend_briefs` | Trends that fit a brand, with drafts ready | Read | MCP, Web, WhatsApp | Release 6 |
| `draft_from_trend` | Puts a trend draft into the pipeline | Command | MCP, Web, WhatsApp | Release 6 |
| `run_prospect_audit` | Audits any business's public Instagram | Command | MCP, Web | Release 6 |
| `manage_watched_accounts` | Competitors a brand is benchmarked against | Command | MCP, Web | Release 6 |
| `get_competitor_benchmark` | A brand against its competitors over a period | Read | MCP, Web | Release 6 |
| `convert_prospect` | Turns a prospect into a brand, keeping its audit | Command | Web | Release 6 |
| `get_metric`, `compare_periods`, `top_posts`, `get_post_detail` | The metrics layer's read tools, limited to what the viewer may see | Read | MCP, Web | Release 4 |
| `ask_analyst` | A customer or agency question answered from data, with server-filled numbers | Read | Web (portal), MCP, WhatsApp | Release 5 |
| `write_report_narrative` | The analyst's monthly narrative, as a draft for the agency | Command | Internal | Release 5 |
| `manage_rule_packs` | Turns regulated content rules on per brand | Command | Web | Release 6 |
| `score_draft`, `manage_experiments` | Forecast a draft against the brand's history; track experiments | Read, Command | MCP, Web | Far out |
| `check_scope` | Refuses requests outside an agent's designed work before the main run | Read | Internal | Release 1 |
| `get_ai_costs`, `set_ai_budget` | Cost ledger per organisation, and its monthly AI budget | Read, Command | Web | Release 1 |
| `get_acceptance_rate` | Accepted, edited and rejected drafts per agent and brand | Read | MCP, Web | Release 1 |
| `run_evals` | Runs an agent's eval set before a prompt or model change | Command | Internal | Release 1 |
| `set_pooling_opt_out` | Leaves the anonymised pool, and its features | Command | Web | Release 4 |
| `aggregate_pool`, `get_benchmarks` | Builds the statistics-only pool; shows benchmarks against similar businesses | Command, Read | Internal; MCP, Web | Release 6 |

### Posts and scheduling

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `create_draft_post` | A post with media, base caption and target accounts, as a draft | Command | MCP, Web | Release 0 |
| `edit_post` | Changes media, base caption or schedule; resets approval | Command | MCP, Web | Release 1 |
| `set_publications` | Adds or removes the accounts a post goes to | Command | MCP, Web | Release 1 |
| `edit_publication` | Caption override, network settings or time override for one account; resets approval | Command | MCP, Web | Release 1 |
| `preview_post` | Resolved times and per-publication validation before confirming | Read | MCP, Web | Release 1 |
| `confirm_post` | A person confirms a draft; it is scheduled or sent for approval | Command | MCP, Web | Release 0 |
| `cancel_post` | Cancels a whole post or one publication | Command | MCP, Web | Release 1 |
| `resolve_missed_publication` | Human decision on a missed publication: publish now, reschedule or drop | Command | MCP, Web | Release 1 |
| `get_post` | One post with every publication's state and outputs | Read | MCP, Web | Release 1 |
| `get_calendar` | Posts and publications for a client and date range | Read | MCP, Web | Release 1 |
| `set_posting_schedule` | A client's weekly slots | Command | MCP, Web | Release 1 |
| `get_publish_log` | Every publish attempt and its outcome, the main support tool | Read | MCP, Web | Release 0 |
| `publish_publication` | Re-reads the publication, publishes idempotently, records outputs and the event | Command | Internal (Inngest) | Release 0 |
| `check_publish_status` | Waits for the network to confirm and the URL to become available | Command | Internal (Inngest) | Release 0 |
| `sweep_overdue` | Re-triggers overdue publications and redelivers stuck events | Command | Internal (worker) | Release 0 |
| `reflow_queue` | Re-materialises slot times after a removal or schedule change | Command | Internal | Release 1 |
| `link_publications` | Publish one after another, with a delay and its URL in the caption | Command | MCP, Web | Later |
| `create_template`, `use_template` | Save a post shape; copy it into a real post | Command | MCP, Web | Later |

### Approvals and feedback

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `list_pending_approvals` | What waits on the customer, per client | Read | MCP, Web | Release 1 |
| `request_approval` | Asks the customer to approve one post, even when the rules would not require it | Command | MCP, Web | Release 1 |
| `approve_post`, `reject_post` | The customer through a link, or a signed-in member for an in-house team, approves or rejects a specific version of the whole post, with a reason; writes an approval record | Command | Web (portal), WhatsApp | Release 1 |
| `comment_on_post` | Comment or react on a post; agency comments can be internal, never shown to the customer | Command | MCP, Web | Release 1 |
| `suggest_edit` | Suggests a caption edit, from the team or the customer | Command | MCP, Web, WhatsApp | Release 2 |
| `accept_suggested_edit` | The author accepts a suggested edit in one click | Command | MCP, Web | Release 2 |
| `record_feedback` | The team records feedback or an approval given on a call, with who and when | Command | MCP, Web | Release 2 |
| `get_feedback` | Feedback history for a post or a client | Read | MCP, Web | Release 1 |
| `set_approval_rules` | Per client: who approves, tiers by label, grace window, later tacit approval | Command | MCP, Web | Release 4 |
| `export_approval_history` | The approval records for a client and month, including posts that skipped approval and why | Read | MCP, Web | Release 2 |
| `set_approval_mode` | Per customer: approve the whole post or each publication | Command | Web | Later |

### Analytics and insights

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `poll_account_metrics` | Batched, decaying poll per account; appends snapshots | Command | Internal (poller) | Release 1 |
| `get_post_performance` | Growth curve and latest metrics per publication, rolled up for the post | Read | MCP, Web | Release 1 |
| `get_brand_analytics` | A client's performance over a period, across networks | Read | MCP, Web | Release 4 |
| `get_organisation_overview` | Dashboards across all of an agency's clients | Read | MCP, Web | Later |
| `backfill_account_history` | Imports posts made outside the platform as Platform Content | Command | Internal (poller) | Release 3 (brand onboarding imports 12 months) |
| `get_brand_insights` | Preference profile and performance hints for a client | Read | MCP, Web | Later |
| `export_report` | A shareable report for the customer | Read | MCP, Web | Later |

### Platform

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| `manage_subscription` | Plan and payment through Stripe | Command | Web | Release 4 |
| `deliver_events` | Delivers outbox events to their reactions | Command | Internal (worker) | Release 0 |
| `get_audit_history` | What happened to a post, account or client, from the event log | Read | MCP, Web | Later |
| `manage_webhooks` | Subscribe external systems to domain events | Command | MCP, Web | Later |

### Trust and data ownership

Added 2026-11-26 from the trust doc. The operations are decided; their releases are proposed, not agreed.

| Operation | What it does | Kind | Surfaces | Scope |
| --- | --- | --- | --- | --- |
| handle_deletion_callback | Meta's data deletion callback and TikTok's removal webhook: maps the person to their connections and runs the deletion | Command | Internal (gateway webhook) | Release 0 |
| delete_brand | Deletes a brand's data, revoking its connections first | Command | Web | Release 1 |
| get_trust_page | The client's view of what is connected, who has access and what AI touched, with revoke | Read | Web (portal) | Release 2 |
| export_brand | Builds the brand's export zip behind expiring links | Command | MCP, Web | Release 4 |
| transfer_brand | Moves a brand to another organisation with the client's consent | Command | Web | Release 4 |
| start_deprovisioning | Runs the leaving workflow for an organisation or a brand | Command | Internal, Web | Release 4 |
| manage_privacy_requests | Privacy notice versions, acceptances and the ARCO request inbox | Command | Web | Release 4 |

**Scope calls worth a look**

- Decided: Drive import is later. Files arrive through the upload link from release 1, and designs through the Canva import from release 3.
- Decided: posts go to one or more accounts, with no links between publications. Chained follow-ups and URL referencing are later, an idea to test with real agencies.
- Decided 2026-11-26 (release plan): two pilots, one agency and one company using it for its own brand. Release 0 is a single-image post from an MCP call to Instagram and to a Facebook Page through the real stack, plus one insights read, so every permission Meta reviews is shown working (see release-plan.md).
- Release 1, pilot month: organisations typed agency or in-house, brands, members and guests; Instagram and Facebook; upload link, validation and labels; posts with publications; content plan with an optional quota and whole-month approval; default stages per organisation type stored as data, one assignee, my work; approval by signed link or by a signed-in member, with approval records; the copywriter agent with scoped AI, the cost ledger, acceptance rate and evals; metric snapshots and per-post performance; email and in-app notifications; usage records with nothing charged; about 10 MCP tools.
- Release 2, customers on WhatsApp: platform number, approval and feedback over WhatsApp, voice notes, media intake, suggested edits, the customer connect-invite link, the portal with the agency's logo, approval history export.
- Release 3, brand brain and reviewer: onboarding, brand facts, memory search, full context assembly, the reviewer agent, media tagging, Canva import.
- Release 4, public launch: TikTok, custom stages and stage owners, lead times, checklists, approval tiers and grace window, parrilla export, the full 18-tool MCP set, the metrics read tools, Stripe, usage pricing, CFDI.
- Release 5, the month on autopilot: autonomy dial, planner, autopilot chain, reporter and customer-facing analyst, calendar dates, subscription tier.
- Release 6, radar and growth: trend radar, prospect audit, competitor benchmark, rule packs, creative insights, pooled benchmarks.
- Later: the assistant (including over WhatsApp), read-only ad tracking, an agency's own WhatsApp number, quick stories, the weekly rewrite of the learned profile, tacit approval, the workload view, templates, linked follow-ups, the content intake link, an agency working inside a brand's organisation, cross-client dashboards and the full audit trail.
- Far out: performance forecasts and built-in experiments.
