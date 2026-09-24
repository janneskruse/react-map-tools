---
name: implement
description: Implement approved Beads or confirmed review fixes in the Full flow using bounded workers.
---

# Implement

Read repository-root `AGENTS.md`. Input: a Bead/epic ID, or confirmed review findings
within that scope. Simple fixes follow the Simple flow in AGENTS.md directly.

## Orchestrator

1. Read the approved design, Bead acceptance criteria, dependencies, and worktree
   state. Ensure the feature worktree is ready via `worktree` before editing.
2. Claim ready work with `bd update <id> --claim`; a failed claim is not ownership.
   Stay within the requested epic. Do not pick unrelated items from `bd ready`.
3. Assign bounded work to `implementer` agents using AGENTS.md's model, effort,
   context, and file-ownership rules. Dispatch independent work in parallel only
   when it does not share files or dependencies.
4. Inspect their diffs and verification evidence. Resolve integration issues.
   Commit coherent verified work with explicit paths; workers do not stage or commit.
   Keep tasks in progress until acceptance and independent review are satisfied.
5. Review once per coherent change using `review`; use earlier focused reviews
   only for consequential interfaces or risks. Do not add a reviewer per tiny task.
6. Confirmed defects return to the existing implementer where possible. Reproduce,
   fix, verify affected behavior, and have the reviewer recheck the findings/delta.
   This is the same work cycle, not a new design/beadify/worktree pipeline.
7. After acceptance and review pass, close verified tasks and then the epic when
   all its requirements are met. Export Beads with the relevant completion commit.
   For an authorized complete flow continue to `ship`, then `pr`.

When called from review for fixes, return the changed files and evidence to the
calling review stage; do not recursively launch review or advance to ship.

## Worker

Read the assigned scope and design. Load relevant domain skills under AGENTS.md,
including shadcn when applicable. Establish a failing test or
reproduction for behavior changes, implement, and verify affected cases. Use
`systematic-debugging` for unexplained failures and `playwright-cli` for relevant UI.

Stay in the assigned absolute workspace and files. Do not spawn agents, change
task scope, commit, close Beads, or advance stages. Report files changed, acceptance
results, exact checks/outcomes, and blockers. If implementation stalls, explain the
evidence and attempted approaches so the orchestrator can escalate intelligently.

Stop dependent work on an actual blocker; independent authorized work can continue.
Do not mark failed or incomplete work complete.
