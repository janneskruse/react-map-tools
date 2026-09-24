---
name: ship
description: Check approved acceptance criteria and finalize Beads and verification before a feature PR.
---

# Ship

Read repository-root `AGENTS.md`. Input: the feature/epic and approved design.
This stage checks readiness for PR; it does not deploy, merge, or tag a release.

1. Compare the implementation against the design and Bead acceptance criteria.
   Mark each requirement done, partial, or missing with evidence. Use a concise
   readiness report; write a separate gap document only when it aids the handoff.
2. Check review disposition and actual verification results. Reuse evidence valid
   for the current code/dependencies/config/environment; run missing or invalidated
   checks. Do not repeat an unchanged full review or test suite just for this stage.
3. Return material gaps to `implement` and `review` within the authorized scope.
   Obtain alignment for scope changes or deferrals. Do not close unfinished work
   merely to make all Beads green.
4. Close only verified Beads. Explicitly record agreed deferrals in Beads; report
   remaining limitations. Export changed Beads to `.beads/issues.jsonl`.
5. Commit scoped completion artifacts if changed; inspect the staged diff. No
   empty commits, obsolete sync commands, or assumed OpenSpec archive process.
6. Report requirements met, actual checks, unresolved gaps, and readiness. Continue
   to `pr` only when the complete flow or PR creation is authorized.

