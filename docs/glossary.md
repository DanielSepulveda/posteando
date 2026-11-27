# Glossary

| Term | In code | Meaning |
| --- | --- | --- |
| Organisation | `organisation` | The tenant: an agency, or a business with its own team. Typed `agency` or `in_house` |
| Brand | `brand` | An inner tenant of an organisation. Shown as "cliente" to an agency and "tu marca" to an in-house team |
| Member | `membership` | A person in an organisation with a role: owner, admin, member, or guest (pinned to one brand) |
| Guest | `membership` with role guest | Usually the agency's customer; sees one brand only |
| Agent | `agent` | An AI actor with its own identity, audit trail and narrow permissions. Keys: `copywriter`, `reviewer`, later `planner`, `reporter`, `assistant` |
| Helper | display data | How an agent appears in the app: a name and a figure. Lety (copywriter, Globo), Checo (reviewer, Nota), Conta (numbers, Barras), Compa (assistant, Domo). Working names |
| Chat | `chat` | A private conversation between one person and one helper, optionally tied to a post (release 1) |
| Post | `post` | What the team creates once: shared media, base caption, brand, stage, approval |
| Publication | `publication` | The post going out to exactly one social account, with its own caption override, settings, time, state and metrics |
| Stage | `post.stage` | Where a post is in the organisation's pipeline. Agency stages plus fixed scheduled, published, failed |
| Publication state | `publication.state` | draft, scheduled, publishing, published, link_ready, missed, outcome_unknown, failed |
| Idea | a post in the idea stage | Not its own entity |
| Content plan, parrilla | `content_plan` | A brand's plan for a period, usually a month: quota per format, slots, brief, deadline. "Parrilla" is what Mexican agencies call it |
| Slot | `posting_schedule` | A weekly time in the brand's time zone that holds posts |
| Approval record | `approval_record` | A frozen copy of what was approved, by whom, when, through which channel; or the rule that let a post skip approval |
| Connection | `connection` | A connected social account: who connected it, scopes, health. Holds no tokens |
| Network gateway | `gateway` app | The separate service that alone holds tokens and talks to networks |
| Asset, asset version | `asset`, `asset_version` | An uploaded original, and its derived versions. Originals are never modified |
| Platform Content | `platform_content` | Anything that exists on a network, with metrics, optionally linked to a publication |
| Metric snapshot | `metric_snapshot` | An append-only reading of a post's metrics, at fixed ages for comparison |
| Brand profile | `brand_profile` | Voice, style, likes, dislikes. An agency-written part and a learned part, kept apart |
| Brand brain | | The profile, brand facts and the searchable archive together (release 3) |
| Brand fact | `brand_fact` | A value with source, confidence and valid-until date. Agents may state a price, date or offer only from a valid fact |
| Autonomy dial | `autonomy_setting` | How far AI goes for a brand: off, ideas, plan, full draft, straight to customer (release 5) |
| Agent run | `agent_run` | One metered run with inputs, outputs, tokens, cost and its accepted, edited or rejected outcome |
| Run chunk | `run_chunk` | The durable output stream of a run, replayed to the browser |
| AI credits | `ai_credit_ledger` | The organisation's pooled credits that pay for agent runs |
| Active brand | `usage_record` | The pricing unit: a brand with any work on it that month |
| Outbox | `domain_event` | Events written in the same transaction as the change, then delivered |
| Missed | | A publication more than 30 minutes late; a person decides what happens |
| Outcome unknown | | A publish that may or may not have happened; never retried blindly |
| Scoped AI | | Every agent does only its designed job and politely refuses anything else |
| CFDI, factura | port `tax_invoicing` | The Mexican tax invoice |
| SPEI | | Mexican bank transfer |
| RESICO | | A simplified tax regime for a persona física; pending an accountant |
| ARCO | `arco_request` | Mexican privacy requests (access, rectification, cancellation, opposition), answered within 20 days |
