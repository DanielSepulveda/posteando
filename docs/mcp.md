# MCP surface

> Status: settled. Release 1 ships about 10 of these tools; the full 18 arrive with release 4.
> Words: in prose, "agency" means an organisation of type agency and "client" or "customer" means a brand. Code, schema and MCP always say organisation and brand (see [conventions.md](conventions.md)).

## MCP first, with a few web screens

MCP is a first-class surface and the preferred one: users drive the platform from their own models. Daniel (2026-11-27): even if MCP no longer stands out on its own, it must be designed and built really well and integrate deeply, because agencies may choose a platform by its MCP support. The web keeps only the screens a model cannot replace.

| Web screen | Why it stays on the web |
| --- | --- |
| Connect social accounts | OAuth consent happens on the network, and the customer invite link is opened by someone with no platform account |
| Video upload | Large files cannot pass through a model. The MCP hands back an upload link, or imports from Canva from release 3 (Drive import is Later) |
| Customer portal and approvals | The agency's customers review and approve without any MCP setup, or any account |
| Calendar | Seeing the plan at a glance is a visual job |
| Sign-in, MCP consent and billing | Account setup, authorising an MCP client and payment need a browser |

**Safety when a model acts**

- MCP login is OAuth 2.1 through better-auth, following the newest MCP spec version that both Effect's McpServer and better-auth's MCP plugin support (checked in release 0 week 1) (PKCE, Client ID Metadata Documents, protected resource metadata, no token passthrough). A grant is scoped to one organisation and the brands the user picks on the consent screen, and its scopes follow the tools (read, draft, schedule, manage; see conventions.md, "Roles and permissions"), so confirming can ask for a step-up. A user in two organisations authorises each separately, and admins can list and revoke MCP clients.
- A model choosing the client raises the risk of cross-client posting, so every tool takes the client explicitly. There is no "current client" default.
- New posts start as drafts, and a person confirms a draft before it can be scheduled or sent for approval.
- Decided: a draft can be confirmed through MCP. This leans on the model host's own tool-approval prompt, so the confirm result names the client and accounts, and the web calendar stays the place to review.

**Proposed MCP tool set**

The core keeps its granular operations, and the MCP exposes a smaller curated set on top: 18 tools by the public launch (release 4), built by merging operations a model would otherwise have to choose between. Internal operations never become tools. Release 1 ships about 10 of them for the pilots. The AI bets keep the set at 18 by widening existing tools, and add 2 tools in release 6. Every tool, like every agent, enforces scoped AI: a request outside what it was designed for is politely refused.

| Tool | What it covers | Core operations behind it |
| --- | --- | --- |
| `get_context` | Who I am, my clients, their accounts and health, the formats each network supports, my usage and AI budget | `get_context`, `list_brands`, `list_social_accounts`, `get_network_capabilities`, `get_usage`, `get_ai_costs` |
| `manage_brand` | Create or update a client: approval rules, posting schedule, stages and their owners, lead times, contacts, autonomy level and rule packs | `create_brand`, `update_brand`, `set_posting_schedule`, `set_approval_rules`, `set_pipeline_stages`, `set_stage_owner`, `set_lead_times`, `manage_contacts`, `set_autonomy_level`, `manage_rule_packs` (soon after) |
| `manage_team` | List staff and guests; invite either | `list_members`, `invite_member`, `invite_guest` |
| `connect_account` | A connect link for me, or an invite link for the customer | `start_account_connection`, `create_connect_invite` |
| `disconnect_account` | Disconnect an account and decide what happens to scheduled content | `disconnect_social_account` |
| `get_upload_link` | Link for uploading media outside the model, or an import from Canva | `create_upload_link`, `import_from_canva` |
| `find_assets` | Search the library by label, AI tag, transcript or meaning; one asset's versions, validation and usage | `list_assets`, `get_asset`, `search_assets`, `get_asset_usage` |
| `label` | Apply labels to assets, ideas, posts or past content; confirm or reject AI tags; manage label groups and collections | `label_items`, `review_ai_tags`, `manage_labels`, `manage_collections` |
| `brand_brain` | Read or edit a brand's profile and facts, run instant onboarding, search the brand's memory | `get_brand_profile`, `update_brand_profile`, `manage_brand_facts`, `onboard_brand`, `review_profile_draft`, `search_brand_memory` |
| `save_plan` | Create or edit a content plan, place ideas into its slots, send it for approval; generate a plan or regenerate one slot (soon after) | `create_plan`, `edit_plan`, `plan_idea_into_slot`, `request_plan_approval`, `generate_plan`, `regenerate_slot` |
| `find_plans` | A client's plans with quota progress, approval state, posts at risk, and the export | `get_plan_status`, `export_plan` |
| `save_post` | Create or edit a post or idea, its accounts, per-account overrides, stage, assignee and checklist; returns the preview | `create_draft_post`, `edit_post`, `set_publications`, `edit_publication`, `preview_post`, `add_idea`, `move_post_stage`, `assign_post`, `check_item` |
| `confirm_post` | Confirm a draft or ask for approval; names the client and accounts, and sends approval links when needed | `confirm_post`, `request_approval`, `create_approval_link` |
| `cancel_post` | Cancel a post or one publication, or drop a missed one | `cancel_post`, `resolve_missed_publication` |
| `find_posts` | My work, calendar, one post, the archive by label, pending approvals, feedback, approval history and the publish log | `get_post`, `get_calendar`, `search_posts`, `list_pending_approvals`, `get_feedback`, `export_approval_history`, `get_publish_log`, `list_my_work` |
| `feedback` | Comment internally or to the customer, suggest or accept an edit, record feedback from a call or a voice note, close a post published by hand | `comment_on_post`, `suggest_edit`, `accept_suggested_edit`, `record_feedback`, `mark_published_manually` |
| `run_agent` | Run the copywriter or reviewer on a post or plan (the planner and autopilot soon after), using the brand packet; metered per run | `run_agent` |
| `get_analytics` | The metrics read tools: one metric, two periods compared, top posts, one post in detail; numbers always come from the server, never from the model. Asking the analyst a question comes soon after | `get_metric`, `compare_periods`, `top_posts`, `get_post_detail`, `ask_analyst` (soon after) |
| `trends` (soon after) | Trend briefs that fit a brand, and a draft post from one | `list_trend_briefs`, `draft_from_trend` |
| `audit_account` (soon after) | Audit a prospect's public account, or compare a client with watched accounts and pooled benchmarks | `run_prospect_audit`, `get_benchmarks`, `manage_watched_accounts` |

- `confirm_post` stays its own tool on purpose, so confirming is always a separate, visible act.
- The trade-off: merged tools take richer inputs, so their schemas and descriptions must be good. In return the model chooses among 18 tools instead of about 70.
- The agency workflow took the set from 15 to 18, above the 12 to 15 first aimed for, and the AI bets bring it to 20 in release 6. If it grows further, merging plans into posts or code mode (the model writes a short script against a typed API) stays an option.
