# Posteando docs

These docs are the source of truth for building Posteando. They carry settled decisions only; anything open, parked, deferred or rejected lives in [open-questions.md](open-questions.md). Links to claude.ai artifacts inside them point to the research behind a decision and may not be readable from a build session; the decision itself is always written here.

## Read in this order

1. [product.md](product.md): what Posteando is, its principles, the agency workflow, AI, approvals, library, notifications.
2. [architecture.md](architecture.md): the stack, one core with thin surfaces, publishing, analytics, tenancy, the data model, connections, media, trust.
3. [conventions.md](conventions.md): names, tables, tenancy, errors, publication states, sign-in, roles, tooling, environments. Applies from the first commit.
4. [release-plan.md](release-plan.md) and [release-0-tasks.md](release-0-tasks.md): what to build, in what order.
5. Reference while building: [operations.md](operations.md) (every core operation with its release), [mcp.md](mcp.md) (the curated MCP tool set), [network-gateway.md](network-gateway.md), [pricing-and-billing.md](pricing-and-billing.md), [glossary.md](glossary.md).
6. History and limits: [decisions.md](decisions.md), [open-questions.md](open-questions.md).
7. Design: [../design/README.md](../design/README.md), [../design/principles-and-voice.md](../design/principles-and-voice.md), [../design/app-ui.md](../design/app-ui.md).

## Status words

| Word | Meaning |
| --- | --- |
| Settled, agreed, decided | Build it as written |
| Held loosely | Agreed; build it, but expect it may change with real use |
| Proposal, proposed | Not agreed. Do not build around it without asking |
| Open | Not decided; see open-questions.md |
| Parked | Not rejected, waiting for a reason |
| Later, far out | Deferred on purpose. Leave room, do not build |
| Rejected | Do not re-propose without new facts |

## Where docs disagree

Newest wins, in this order: conventions.md, then release-plan.md, then the other docs. If two docs still disagree, stop and ask rather than pick one.
