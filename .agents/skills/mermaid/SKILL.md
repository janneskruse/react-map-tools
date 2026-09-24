---
name: mermaid
description: Create or repair Mermaid diagrams from prose or existing diagram code.
---

# Mermaid

Read repository-root `AGENTS.md`. Input: a description or existing Mermaid code.
This utility does not start a development pipeline or create tracking artifacts.

Choose the simplest suitable diagram type. Preserve the user's meaning, use stable
node IDs and readable labels, quote labels with punctuation, and avoid unsupported
syntax. Check rendering with an available renderer when practical; otherwise state
that syntax was inspected but rendering was not verified.

Return a fenced Mermaid block and a short explanation of meaningful assumptions
or repairs. Modify a repository document only when requested.

