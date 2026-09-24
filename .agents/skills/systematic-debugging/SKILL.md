---
name: systematic-debugging
description: Investigate bugs, failed checks, and unexpected behavior before choosing a fix.
---

# Systematic debugging

Read repository-root `AGENTS.md`. Preserve the selected flow; debugging does not
create Beads, worktrees, or mandatory design approvals.

1. Establish expected versus actual behavior and a minimal reproduction. Read the
   complete relevant error, inputs, environment, and recent changes.
2. Trace the failure to its source. Compare a working path and inspect data at the
   boundaries. Form a specific hypothesis before modifying code.
3. Test one hypothesis at a time using the smallest useful experiment. Avoid
   bundling speculative fixes or masking the symptom with retries/delays.
4. Fix the cause within scope. Add a regression test when behavior warrants it;
   use existing tests or browser reproduction where that gives meaningful evidence.
5. Verify the original case and affected neighbors, then report the cause, change,
   and checks. Reuse unrelated valid verification per AGENTS.md.
6. If successive attempts add no evidence, revisit assumptions and explain the
   missing information or architectural conflict rather than accumulating patches.

Load domain skills when the failing behavior concerns those domains.

Optional references:
- [root-cause-tracing.md](root-cause-tracing.md): failure originates upstream.
- [condition-based-waiting.md](condition-based-waiting.md): timing/flaky async behavior.
- [defense-in-depth.md](defense-in-depth.md): validation at multiple real boundaries.
