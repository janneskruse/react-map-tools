---
name: sync-dev
description: Integrate the latest dev branch into a feature branch and resolve relevant conflicts.
---

# Sync dev

Read repository-root `AGENTS.md`. Input: optional `merge` or explicitly requested
`rebase`. This utility does not create Beads or switch flows.

1. Inspect status, branch, and upstream. Use on a feature branch, not `main`/`dev`.
   Preserve unrelated changes; do not auto-stash or reset them.
2. Fetch `origin/dev`; inspect ahead/behind commits and the merge base.
   If no commits are missing, report that and stop.
3. Default to merge, preserving published history. Rebase only when requested and
   appropriate to branch ownership. Follow existing authorization for integration.
   A merge/rebase modifies the workspace: do not label it a read-only dry run.
4. Integrate once. Resolve straightforward conflicts using both changes' intent;
   ask about consequential product/behavior conflicts that the context cannot settle.
5. Verify the combined result with affected checks from AGENTS.md. Fix merge-induced
   regressions in scope; invalidate prior evidence for affected code.
6. Commit the integration as appropriate and report the strategy, conflicts, and
   checks. Push only if authorized by the active flow/request.

If integration cannot be completed, report the state and safe continuation/abort
option. Never use a destructive reset to hide a failed integration.

