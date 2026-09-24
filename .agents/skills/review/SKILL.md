---
name: review
description: Review a scoped code change independently and coordinate fixes within an authorized Full flow.
---

# Review

Read repository-root `AGENTS.md`. Input: feature/Bead, design, or explicit diff range.
A review-only request reports findings; it does not authorize code edits.

## Orchestrator

1. Establish scope, baseline/diff, design intent, acceptance criteria, and available
   verification evidence. Wait for writers before reviewing their changing files.
2. In Full flow, dispatch one independent `reviewer` using AGENTS.md. Add a focused
   security reviewer for consequential auth/RLS/data exposure, or an architecture
   reviewer for substantial boundary changes. Do not launch three reviewers by default.
   In Simple flow, review the diff directly unless delegation was requested.
3. Triage evidence-based findings. Discard false positives and style-only preferences.
   Surface genuine design conflicts; do not silently change approved intent.
4. In an authorized implementation flow, send confirmed findings to `implement`
   in fix mode, preferably reusing the owning worker. Track unfinished work in the
   existing Bead or a scoped child when needed, not a second markdown fix tracker.
5. Recheck fixed findings and affected behavior. Reuse unchanged verification
   evidence; broaden review when the fix changes additional contracts or risks.
   Stop on an unresolved decision/external blocker or a repeated non-progressing
   fix cycle and explain what is needed.
6. Return scope, findings by severity, disposition, verification, and remaining gaps.
   The orchestrator closes only verified Beads and owns commits. For review-only
   requests, stop with the report. Do not independently run ship or PR.

## Reviewer

Read the design, diff, relevant code, and domain skills from AGENTS.md. Check
correctness, integration, security, error cases, maintainability, and acceptance
criteria. Use `playwright-cli` when the finding requires browser evidence.

For each finding give file/location, severity, concrete failing behavior, evidence,
and a suggested correction. Distinguish design challenges from implementation bugs.
Critical/Important means a material defect or unmet requirement, not a preference.
Do not invent findings to meet a quota. Report when evidence is unavailable.

Do not change source files, spawn agents, commit, close Beads, or advance stages.
Return findings to the parent for triage.
