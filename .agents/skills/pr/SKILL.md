---
name: pr
description: Validate a feature branch, push it, and create a pull request into dev when requested.
---

# Pull request

Read repository-root `AGENTS.md`. Input: optional title, approved scope, and
verification report. Run when PR creation or the complete Full flow is authorized.

1. Check branch, status, and scoped commits. Do not open a PR from `main` or `dev`.
   Preserve unrelated changes; resolve task-owned uncommitted changes first.
2. Fetch `origin/dev` and compare against that remote baseline. If integration is
   needed, use `sync-dev`; honor existing authorization. A behind branch alone is
   not proof of a conflict. Do not silently rewrite published history.
3. Inspect the final diff and verification evidence. Run appropriate missing or
   invalidated checks per AGENTS.md, including browser checks for affected UI.
   Do not rerun unchanged checks simply because the stage changed. Fix in-scope
   regressions and reverify; report external blockers. Do not claim unrun checks.
4. Write a proportional title and description explaining the problem, resulting
   behavior, meaningful technical decisions, checks performed, and limitations.
   Follow a repository PR template if one exists. Avoid generated boilerplate,
   invented test counts, and unchecked claims.
5. Push the feature branch with `git push -u origin HEAD`. Use `gh pr view` to
   detect an existing PR before creating a duplicate.
6. Create the PR into `dev` with structured arguments or a UTF-8 body file:
   `gh pr create --base dev --title <title> --body-file <path>`.
   If a PR already exists, update it to describe the final change.
7. Verify the remote branch/PR and report the URL and relevant check results.
   Do not merge, deploy, tag, delete unrelated branches, or clear user stashes.

