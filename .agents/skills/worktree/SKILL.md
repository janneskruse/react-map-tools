---
name: worktree
description: Prepare an isolated feature workspace and shared Beads access for Full flow implementation.
---

# Worktree

Read repository-root `AGENTS.md`. Input: an optional branch/worktree name and the
approved design/Bead. Simple flow does not invoke this skill unless requested.

1. Inspect `git status` and `git worktree list`. Reuse the current worktree if it
   already isolates this feature. Preserve unrelated changes and existing worktrees.
2. Ensure the approved design is available in the feature workspace. If newly
   written, commit only its scoped files first when authorized. Never leave the
   implementer pointing at an untracked document in another workspace.
3. Use `.worktrees/<name>` under the root and the branch convention in AGENTS.md.
   Verify this directory is ignored using `git check-ignore`; add `.worktrees/`
   to the root ignore file if needed before creation. Inspect the intended base:
   prefer current `dev` for new features; preserve approved planning commits.
   If those differ, carry the scoped planning commits to the feature branch.
4. For Full flow, prefer the installed CLI's `bd worktree create` command to wire
   shared Beads state. Check `bd worktree create --help` for supported base/branch
   options. Do not assume an unsupported flag or silently branch from the wrong base.
5. Validate from inside the new workspace with `bd where`, `bd info --json`,
   and `bd worktree list`. Do not copy database files or create a second tracker.
6. Copy gitignored `frontend/.env.local` from the source workspace if present
   and needed, without printing its contents or staging it. Verify absolute source
   and destination paths; do not overwrite an existing workspace's environment.
7. Install dependencies using the repository's package manager and lockfile.
   Establish relevant baseline checks and report pre-existing failures separately.
8. Return the absolute workspace path, branch/base, design path, Beads wiring,
   environment-copy status, and verification baseline. All later agents use that path.

Cleanup follows AGENTS.md; never delete a worktree with unpreserved work.

