---
name: brainstorm
description: Explore a problem, alternatives, and scope collaboratively before detailed design.
---

# Brainstorm

Read repository-root `AGENTS.md` and honor the selected flow and requested scope.
Input: an idea, problem, stories document, or existing discussion.

1. Inspect relevant code, existing designs, and user context. In Full flow, inspect
   related Beads when useful; do not create implementation tasks yet.
2. Clarify goals, constraints, success criteria, and exclusions. Ask focused
   questions only where the answer changes the solution.
3. Present realistic alternatives and their tradeoffs, recommending a direction.
   Load domain skills from AGENTS.md when technical choices affect feasibility.
4. Converge on a concise scope and chosen approach. Keep exploration in the
   conversation; do not require separate stories/features documents for every task.
5. For Full flow, hand the agreed direction to `design`. Detailed architecture and
   the approval artifact belong there. For discussion-only requests, stop with the
   agreed direction. In Simple flow, clarification does not create a design gate.

Do not implement during a brainstorming request or invoke a generic planning
pipeline. Reuse decisions already made instead of asking the same questions again.
