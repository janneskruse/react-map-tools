---
name: beadify
description: Convert an approved design into scoped Beads work units and dependencies for the Full flow.
---

# Beadify

Read repository-root `AGENTS.md`. Input: an approved design path or feature name.
Use only in Full flow or when the user explicitly requests tracked work.

1. Read the design and existing matching Beads. Obtain missing design approval
   before creating the implementation breakdown; do not duplicate existing tasks.
2. Group work into independently implementable and verifiable units. Merge tasks
   that require rereading the same context or cannot be verified separately.
   Separate genuinely independent concerns; avoid rigid minute/line/commit quotas.
3. If multiple tasks are needed, create an epic and children with `--parent`.
   Set prerequisite edges using `bd dep add <task> <prerequisite>`.
4. Each task contains the design path/section, scope and affected paths, acceptance
   criteria, relevant domain skills, and actual verification commands or procedures.
   Describe the contract clearly; do not prewrite the entire implementation.
5. Minimize shared-file ownership. Sequence overlapping tasks. Include integration
   verification across modules; include `playwright-cli` flows when behavior needs
   browser verification. Do not assume a Playwright test framework exists.
6. Present the breakdown and dependencies for approval before implementation.
   Existing explicit approval counts. If delegated, return the breakdown to the
   parent; do not ask the user or advance the pipeline yourself.
7. For an authorized Full flow, proceed to `worktree` and `implement` after approval.
   Export changed Beads with the next relevant commit per AGENTS.md.

A `plan-writer` can handle a bounded breakdown when useful. Revisit it when
requirements or evidence change, not for a fixed quota of refinement passes.
