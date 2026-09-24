---
name: design
description: Create a feature design or review an existing design before Beads implementation.
---

# Design

Read repository-root `AGENTS.md`. Input: a feature description, stories/design path,
or `--review <design-path>`. This is the Full flow design stage; an explicit design
request can also run alone without authorizing implementation.

## Create or refine

1. Read the agreed scope, relevant code, and prior decisions.
2. Apply AGENTS.md's domain-skill rules before selecting the architecture:
   load `shadcn` for component
   choices. Inspect existing patterns; do not install components or apply migrations.
   Consult `playwright-cli` when defining browser verification or inspecting UX.
3. Write `docs/designs/YYYY-MM-DD-<feature>-design.md`, proportionate to complexity:
   - Problem, user flow, goals, and explicit exclusions.
   - Architecture, affected components/hooks/types and paths.
   - Data contracts, state ownership, error/loading states, and accessibility.
   - Database/client/schema choices, migrations, authorization and RLS where relevant.
   - Alternatives, chosen tradeoffs, and conditions that would change the decision.
   - Observable acceptance criteria and verification strategy, including browser flows.
   - Remaining questions and dependencies.
4. Present the completed design for approval. Resolve material questions together;
   do not require approval of each subsection. Honor approval already supplied.
5. Once approved, hand the design to `beadify` when continuing the Full flow.
   Design alone neither creates Beads nor reports that work is implemented.

## Review mode

Read the existing design and the code it depends on. Check feasibility, domain
patterns, missing behavior, security, acceptance criteria, and verification.
Report concrete findings with evidence; distinguish defects from alternative tastes.
Revise within the agreed intent. Surface consequential design decisions to the user.
An approved design changed materially needs renewed approval of the changed scope.
Use a bounded independent `plan-writer` only when useful in Full flow or explicitly
requested. There is no mandatory number of review passes.
