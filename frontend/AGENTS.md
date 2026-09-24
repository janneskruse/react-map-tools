# react-map-tools Agent Instructions

This is the authoritative project guide for Codex, Claude Code, and GitHub Copilot.
Platform adapters point here; workflows live in `.agents/skills/<name>/SKILL.md`.
Read skills directly if your host cannot invoke them by name. Paths are relative
to the repository root.

## Expert Guidelines

You are an expert in TypeScript, Node.js, Next.js App Router, React 19, shadcn/ui,
Radix UI, Tailwind v4, MapLibre GL JS, deck.gl, Zustand, WebAssembly,
Apache Arrow, and Apache Parquet.

react-map-tools is a reusable Next.js starter for interactive maps, with
MapLibre, deck.gl layers, resizable portal-based layouts, and binary data loading. Plan, implement, and review with that purpose and the
project conventions below in mind. Check the installed versions and existing code
when choosing APIs or patterns; do not assume expertise replaces verification.

## Session routing

At the start of each top-level session, ask **"Which flow should we use: Full or
Simple?"** before starting workflow actions. An explicit selection in the user's
request counts as the answer. You may inspect context while waiting. Remember
the choice through compaction; subagents inherit it and never ask again.

The user's request defines scope. Discussion or review requests do not authorize
implementation. An individual stage command runs that stage, not the entire
pipeline. Do not repeat approvals already given.

### Full flow

`brainstorm → design → beadify → worktree → implement → review ⇄ fixes → ship → pr`

- Brainstorm the problem, scope, and direction; design the solution in
  `docs/designs/YYYY-MM-DD-<feature>-design.md`.
- Get approval of the completed design and then the Beads work breakdown before
  implementation. Existing explicit approvals count; do not gate each subsection.
- Once approved for the complete flow, proceed autonomously through the scoped
  epic, review/fix loop, shipping checks, push, and PR into `dev`. This does not
  authorize merging, deployment, or release tagging.
- Use a feature worktree and bounded implementation subagents. Review independently
  once per coherent change; add earlier reviews for consequential interfaces or risks.
- Pause for unresolved product/design decisions or external blockers, not routine
  fixes. Scope changes need alignment; defects within the approved scope do not.

### Simple flow

`understand/reproduce → fix → verify → commit`

- Work directly in the current workspace with one agent. No Beads creation or
  updates, worktrees, formal design artifacts, or subagents unless requested.
- Establish the cause, make a focused change, run appropriate checks, inspect the
  diff, and commit only your files. Domain skills and coding standards still apply.
- Stop after the commit. Push/PR only when requested. Do not switch branches,
  touch unrelated work, create empty snapshot commits, or clear existing stashes.
- If scope grows beyond a focused change, explain why and ask whether to switch
  flows; do not silently start the full pipeline.

These flow rules govern project tracking and completion, including generic defaults
injected by Beads or optional workflow plugins. This project does not depend on
Superpowers; its generic workflow is not an additional pipeline stage.

## Project and stack

react-map-tools provides an easy base setup for React map projects.

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix |
| Maps | MapLibre GL JS, deck.gl 9, H3 |
| Data | Apache Arrow, Apache Parquet, parquet-wasm |
| Layout / state | react-resizable-panels 4, Zustand, nuqs |
| Checks / tracking | ESLint, TypeScript, Vitest, Playwright CLI, Beads |

### Key Docs

- **Project scope:** `docs/scope.md` and other admin-created context in `docs/`.
- **User stories:** `docs/user-stories.md` (admin-created, organized by MVP/V2/V3).
- **Bug reports and context:** `docs/bugs.md` + `docs/bugs/bug-<desc>.md`.
  Read relevant existing reports when investigating a bug. Beads remains the
  implementation tracker in Full flow; Simple flow does not require new tracking
  artifacts. Do not maintain competing task statuses in both places.
- **Design docs:** `docs/designs/YYYY-MM-DD-<feature>-design.md`.
- **Gap analyses:** `docs/designs/<feature>-gap-analysis-YYYYMMDD.md`, when a
  separate readiness/handoff document is useful. These are optional in the new flow.

## Project Structure

```text
├── frontend/
│   ├── src/app/            # Next.js routes
│   ├── src/components/    # core UI, inputs, maps, project layout
│   ├── src/hooks/         # React hooks
│   ├── src/store/         # Zustand stores
│   ├── src/types/         # Shared TypeScript types
│   ├── src/utils/         # Pure helpers and integrations
│   ├── src/config/        # Static configuration
│   ├── public/            # Parquet example, map styles, local WASM
│   └── scripts/           # Data conversion and WASM preparation
├── .beads/                # Local issue tracking configuration
├── .agents/skills/        # Shared workflow/domain skills
├── .claude/               # Claude adapters
├── .codex/                # Codex adapters
├── docs/                  # Project documentation
└── AGENTS.md              # Points to this authoritative guide
```

`@/` resolves to `frontend/src/`. UI primitives are in `components/core/`;
inputs are in `components/input/`. Run application commands from `frontend/`.

## Tool Selection

| Task | Linux / Bash | Windows / PowerShell | Avoid |
|---|---|---|---|
| Search code patterns/structure | `ast-grep` / `sg` | `ast-grep` | Treating plain-text matches from `grep`, `rg`, or `Select-String` as structural analysis |
| Search text/non-code files or locate symbols/files | `rg` / `rg --files` first; `grep` if unavailable | `rg` / `rg --files` first; `Select-String` for text and `Get-ChildItem` for files if unavailable | Assuming `grep` is installed on Windows |
| Create/update/close Beads (Full flow) | `bd` | `bd` | Parallel task trackers or creating Beads in Simple flow |
| Add/use shadcn UI components | `.agents/skills/shadcn/SKILL.md` | `.agents/skills/shadcn/SKILL.md` | Manually adding or replacing shared UI primitives before consulting the skill and existing custom components |

Use `rg` to locate relevant files or text, then `ast-grep` when the question needs
syntax-aware matching. PowerShell's native alternative to `grep` is `Select-String`:

```powershell
Select-String -LiteralPath 'docs/scope.md' -Pattern 'map' -SimpleMatch
Get-ChildItem -LiteralPath 'docs' -Recurse -File -Filter '*.md' |
    Select-String -Pattern 'questionnaire' -SimpleMatch
```

Both examples search text; they do not replace structural code analysis.

## Domain skills: design, implementation, and review

Load relevant domain skills **before making design decisions**, before implementing
them, and when reviewing their correctness. Reuse guidance already loaded in the
same context; each subagent loads guidance relevant to its own task.

| Skill | When to load | During design |
|---|---|---|
| `shadcn` | Choosing, adding, composing, or modifying UI components | Inspect existing components, variants, accessibility, and project conventions |
| `playwright-cli` | Browser reproduction or user-flow/visual verification | Consult when planning browser checks or inspecting existing UX |
| `systematic-debugging` | Bugs, failing tests, unexpected behavior | Investigate when needed to establish the problem |

Design is read-only with respect to the application: inspecting patterns or docs
does not authorize component installation, migrations, or database mutations.
`mermaid` and `sync-dev` are optional utilities, not mandatory pipeline stages.


## Code Style
- Write concise TypeScript using function components and declarative JSX.
- Use descriptive names such as isPending, isLoading, and hasError.
- Prefer iteration and modularization
- Use function declarations for components and pure helper functions.
- Name event callbacks onX, such as onSubmit or onSelect.
  Use action or ...Action for callbacks intended to run as React Actions.
- Preserve useful existing comments and update comments affected by changes.
- Group imports with blank lines: React/framework/libraries, Styles,
  Icons, Components, Helpers/Hooks, Types, Static Content.
- Use import type for type-only dependencies.
- For temporary debugging, use console.log("name:", { value }).
  Remove temporary logs before completion.

**Component discipline:** Components import from frontend/src (@/) +  `hooks/`, `utils/`, `store/`, `types/`, and `components/`. They are modularized into these categories and avoid being long components but rather abstract functions, hooks and types etc. into the respective folders.

**HARD RULES — violations will be rejected:**
1. **No business logic in components.** If a function inside a component is >15 lines or does async work (API calls, DB queries, email sending), it MUST be extracted to a hook in `@/hooks/` or a utility in `@/utils/`.
2. **Files in `@/hooks/` MUST export a hook** (a function starting with `use` that calls React hooks). Pure computation functions go in `@/utils/`, not `@/hooks/`.
3. **No types/interfaces in component files** except the component's own `I...Props` interface. All other types go in `@/types/`.
4. **Realtime subscriptions MUST be in dedicated hooks** in `@/hooks/realtime/`, never inline in components.
5. **Component max size: ~150 lines.** If a component exceeds this, split into subcomponents or extract logic to hooks/utils.
6. **Static constants (arrays, maps, configs) go in `@/config/`**, not inside component files.

## Component Organization — Group related components into subfolders

- Plan folder placement before adding components. Inspect the existing feature
  structure and reuse its groups instead of adding every file to the feature root.
- Create subfolders when components share a clear feature or responsibility,
  such as `products/editor`, `products/listing`, `products/presentation`,
  `products/publishing`, `products/detail`, or `products/cache`. Organize this way
  as the feature grows; do not wait for the user to request a cleanup.
- Keep feature-wide page/layout composition at the feature root. Place supporting
  components and their colocated tests in the relevant group.
- Use descriptive lowercase, dash-separated folder names. Keep the hierarchy
  shallow; small cohesive groups can remain flat without unnecessary nesting.
- When regrouping files, update imports and test mocks together, preserve behavior,
  and verify affected consumers. Hooks, utilities, types, schemas, and configuration
  still belong in their dedicated top-level directories.

## Naming
- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components

## TypeScript
- All types are stored in `@/types`
- Use TypeScript for all code
- Prefer interfaces over types
- Avoid enums; use maps
- Use functional components with TypeScript interfaces
- avoid using any or unknown types
- dont ever use any!
- avoid types in component files and rather use common imports from "@/types"
- only have component interfaces inside components
- name types with a capital T infront like TUser and interfaces with I...Props like ISidebarProps

## Syntax
- Use "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals
- Use concise syntax for simple statements
- Use declarative JSX

## UI/Styling
- Use Shadcn UI, Radix, and Tailwind v4
- There is a /shadcn skill to know about available components
- Other than usually done by Shadcn, we store input components like "select", "input" etc. under @/components/input
- Also, normal Shadcn ui components are stored under @/components/core instead of @/components/ui
- Some elements like Badge, Banner (for info or warning Cards), Card, Command, Colormode Toggle, Image (a wrapper around Next/Image), Navigation menu, Notification Badge, Sidebar, Spinner, Tabs, Toast and Tooltip are custom adaptions and stored with the "custom-" prefix like "@/components/core/custom-image.tsx"
- for Tooltips please use the TooltipWrapper from "@/components/core/custom-tooltip-wrapper.tsx"
- for toasts please use the custom toastTrigger function from  "@/components/core/custom-toast.tsx"
- Implement responsive design with Tailwind CSS v4
- there are custom colors defined in "@/styles/global.css"
- new styles files should generally go into the "@/styles" folder or integrate into the "@/styles/global.css" styles file
- Use mobile-first responsive layouts, semantic HTML, accessible names,
  keyboard interaction, and visible focus states.
- Respect reduced-motion preferences when adding animations (e.g. motion-safe:animate-bounce).
- Use a modern tech like design with thin borders (like `className="border-t border-border"`), light background gradients where applicable (like `bg-main bg-[radial-gradient(51.63%_42.56%_at_95%_35%,rgba(20,184,166,0.18)_0%,rgba(20,184,166,0)_100%)]`) and backdrop blur, etc.

**UI components rule:** When adding or modifying any shadcn/ui component, **always load the `shadcn` skill first** (`.agents/skills/shadcn/SKILL.md`). This ensures correct installation, theming, and usage patterns.

## Performance
- Minimize 'use client', 'useEffect', and 'setState'
- Favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: WebP, size data, lazy loading
- Optimize Web Vitals (LCP, CLS, FID)

## React 19
- Use React 19 features like Suspense, Server Components, and Streaming
- Remember that forwardRef is being deprecated
- Use form Actions and useActionState when they simplify mutation,
  result, and pending-state handling.
- Call useFormStatus from a component inside its parent form.
- Use useOptimistic inside Actions or transitions when temporary
  feedback is appropriate. Handle failures and reconcile confirmed data.
- Use transitions for non-urgent updates; keep text-input updates urgent.
  Follow the documented requirements for updates after await.
- Use Suspense for supported loading sources and meaningful UI sections.
  Do not wrap every Client Component in Suspense automatically.
- Pass stable Promises to use(); do not create uncached fetch Promises
  during client rendering. Prefer await in async Server Components.
- Accept ref as a prop in new React 19 function components.
  Preserve forwardRef where compatibility still requires it.
- In RSC frameworks, follow the framework's server/client boundaries.
  Keep credentials and privileged operations in server-only code.
- On React 19.2+, use useEffectEvent only for Effect-triggered logic
  requiring current values without resynchronization.
- On React 19.2+, consider Activity for hidden UI that should retain state.
  Ensure Effects and imperative resources clean up correctly.
- On React 19.3+, consider ViewTransition for coordinated animations
  and use(browser()) for components that require browser-only rendering.
  Verify framework compatibility before introducing them.
- Do not assume React Compiler is enabled. Check build configuration
  before relying on automatic memoization.

## State and Rendering

- Keep render logic pure and update state immutably.
- Use useState for local state and useReducer for related transitions.
- Derive values from existing props/state instead of duplicating them.
- Lift shared state only as far as necessary.
- Reserve Zustand in @/store for genuinely shared client state.
  Avoid duplicating remote data or authentication state already owned
  by a data cache or authentication provider.
- Use refs for imperative handles and values that do not drive rendering.
- Use stable data identifiers as list keys.
- Keep component definitions at module scope rather than inside
  another component's render function.

- **State management decision rule:** Use `useState` for local UI state, fetched data for remote data, and Zustand (`@/store`) only for truly global cross-component state (e.g., map instance, active project, shared layers). Do not reach for Zustand for things a single component or its children own.

## Map and data lifecycle

- Project layout state is scoped to `ProjectLayoutProvider`; panel hosts remain empty
  until feature components portal into them. Store DOM targets through callback refs.
- Store the map layout target in the project layout store. Store map and typed
  `MapLibreOverlay` refs by map ID in the map state store.
- Add each deck overlay once, remove map controls on unmount, and clear store refs.
- Load Parquet with `parquet-wasm/esm` and `apache-arrow`. Initialize WASM once;
  serve the matching installed binary from `public/wasm` via the preparation script.
- Keep Arrow data and accessors stable during time filtering. Update deck.gl's
  `DataFilterExtension.filterRange`; do not filter/rebuild row arrays on slider moves.
- The H3 demo reads split UInt32 columns. Its targeted TypeScript suppression is
  documented against deck.gl issue #10406; verify this path when upgrading deck.gl.

## Hooks
- When components have complex function requirements, abstract functions if possible to hooks
- Store hooks under "@/hooks/"
- Store map related hooks under "@/hooks/map" and data related hooks under "@/hooks/data", all other simply under @/hooks/"
- There are already hooks for Debounce, several map and realtime hooks, for callbacks, window resize or for mobile and breakpoint detection.
- **A hook MUST call at least one React hook** (useState, useEffect, useCallback, useMemo, useRef, etc.). If it doesn't, it belongs in `@/utils/` as a plain function, not in `@/hooks/`.

## Data
- optimize WASM for data processing
- handle Apache Parquet and Apache Iceberg with WASM in a web context
- Prefer columnar Arrow access; avoid materializing JSON rows for rendering.


## Next.js
- Use the App Router and follow its file, layout,
  and routing conventions.
- Default to Server Components. Choose prerendering, caching, and
  request-time rendering based on data freshness and personalization.
- Add 'use client' only at boundaries that need state, event handlers,
  effects, client hooks, or browser APIs. Keep these boundaries small
  to minimize client JavaScript.
- Fetch initial data in Server Components where practical. Access
  databases and upstream services through shared server code rather
  than calling the application's own Route Handlers.
- Allow client-side fetching when polling, browser-dependent data, or
  a shared browser cache is needed.
- Start independent data requests concurrently. Use Promise.all when
  results are needed together, or separate Suspense boundaries when
  sections can render independently.
- Use React.cache() to deduplicate repeated server reads within a
  request; do not confuse it with persistent caching.
- Use loading.tsx for route loading states and Suspense for independently
  loading sections. Place slow async work inside the relevant boundary
  and provide skeletons that approximate the final layout.
- Follow the project's configured caching model. When Cache Components
  is enabled, use 'use cache', cacheLife(), and cacheTag() for reusable
  data or UI, and Suspense around uncached request-time work.
- Invalidate affected caches after mutations. Use updateTag() in Server
  Actions for immediate visibility of writes, revalidateTag(tag, 'max')
  for background refresh, and revalidatePath() for path invalidation.
- Lazy-load substantial optional Client Components with next/dynamic
  and on-demand libraries with import(). Use ssr: false only when
  browser-only rendering is required, inside a Client Component.
- Use Server Actions primarily for UI mutations. Use Route Handlers
  for HTTP APIs, webhooks, and custom responses. Do not use Server
  Actions as a general parallel data-fetching mechanism.
- For custom streaming endpoints, return a Response containing a
  ReadableStream.
- Keep sensitive data access in server-only modules. Validate untrusted
  inputs and enforce authentication and resource-level authorization
  for every protected action and endpoint.
- Pass only necessary, React-serializable data to Client Components.
  Never expose secrets through props or public environment variables.
- Prefer next/link for internal navigation. Provide loading, error,
  not-found, and mutation-pending states with accessible feedback.
- Use next/image, next/font, and next/script where appropriate. Define
  metadata and relevant sitemap, robots, and social-image files using
  Next.js conventions.
- Access request APIs asynchronously, including cookies(), headers(),
  page params, and page searchParams.
- Use proxy.ts when request interception is needed. Enforce data
  authorization at the data access layer and protected entry points.
- Run linting explicitly in CI alongside type checking, relevant tests,
  and a production build. Do not rely on next build to run linting.
- Measure bundle size and Core Web Vitals using production builds.
  Verify streaming behavior on the deployed infrastructure.
- Consult the official documentation matching the installed Next.js
  version before introducing version-sensitive APIs or configuration.

## Pre-Completion Checklist

Before claiming any implementation is done, verify ALL of the following:

- [ ] No function >15 lines inside a component file (extract to hook or util)
- [ ] No async logic inside component files (extract to hook or util)
- [ ] No realtime subscriptions inside component files (must be in `@/hooks/realtime/`)
- [ ] Files in `@/hooks/` actually call React hooks — pure functions go in `@/utils/`
- [ ] No type definitions in component files except `I...Props` interfaces
- [ ] No static constants/configs in component files (move to `@/config/`)
- [ ] Component files are under ~150 lines
- [ ] Named exports for components, `T` prefix for types, `I...Props` for interfaces
- [ ] Imports follow the group order: React, Styles, Icons, Components, Helpers, Types, Static

If ANY check fails, fix it before reporting completion.

## Error Handling
- User-facing errors: use `toastTrigger` from `@/components/core/custom-toast.tsx`
- Developer/debug logging: use `console.log("name:", {value})` — never swallow errors silently
- Never expose raw error stack traces to the UI
- Validate at system boundaries (user input, API responses); trust internal types

## Environment Variables

The included OpenFreeMap basemaps need no API token. Keep any future secrets in
`frontend/.env.local`, never in source or public assets. Add provider-specific
configuration only when that provider is actually used.

## Testing
- **Unit/integration tests:** Write meaningful behavior tests first (red-green-refactor) using the existing test setup. This rule lives here; no separate TDD skill is required.
- **Browser verification:** Prefer `playwright-cli` for interactive browser checks and visual verification — no E2E test framework for now
- TDD for logic, `playwright-cli` for verifying user flows during implementation
- No test framework is mandated for new additions — follow the pattern already in the file being tested
- Before claiming completion, run appropriate checks, read their output, and inspect the diff. Documentation-only changes need syntax/reference checks rather than application tests.
- Record verification results and the tested revision or working diff. Reuse them only while relevant code, dependencies, configuration, and environment remain unchanged; rerun affected checks after fixes or integration.

## Git Hygiene

- **Stage only relevant files** — Never `git add .` or `git add -A`. Explicitly add files related to the current change.
- **Review before commit** — Run `git status` and `git diff --cached` to verify what's staged.

### Branch Naming

**Priority order:**
1. Bead exists → `feat/<bead-id>-<short-desc>` (e.g., `feat/mp-5ef-app-header`)
2. Exploratory → `explore/<desc>` (e.g., `explore/caching-strategy`)
3. Bug fix → `fix/<desc>` (e.g., `fix/login-redirect`)


## Command Execution

### Avoid Compound Commands

**Do NOT use shell constructs** like `for`, `while`, `if`, or command chaining (`&&`, `||`) in Bash calls. The permission system only checks the first command, so compound commands require manual approval even when inner commands are allowed.

| Instead of | Do this |
|------------|---------|
| `for id in a b c; do bd show $id; done` | Run 3 parallel `bd show` calls |
| `echo "..." && bd show mp-123` | Run separate `echo` and `bd show` calls |
| `cd dir && command` | Use the command's directory flag, or standalone `cd` + separate Bash call |

### Git Commands Requiring Approval

These git operations are intentionally NOT auto-approved (destructive/remote):
- `git push` — sends to remote
- `git merge` — modifies history
- `git rebase` — rewrites history
- `git reset` — can lose work
- `git checkout` — could switch branches unexpectedly


### Beads (Full flow only)

Beads (`bd`) tracks implementation scope, acceptance criteria, and dependencies.
Use it instead of parallel task lists in markdown, TodoWrite, or separate bug docs.
Design documents describe decisions, not a second task tracker. Simple flow skips Beads operations unless the user explicitly requests setup or tracking.

The project-local CLI is available through `pnpm exec bd` from the repository root.
Run `bd onboard` for initial setup and `bd prime` for installed CLI guidance when
entering Full flow. This guide's selected flow and authorization rules govern
generic session-close suggestions from the CLI.

```bash
bd ready
bd show <id>
bd update <id> --claim
bd create --type=epic --title="Feature"
bd create --parent=<epic-id> --type=task --title="Work unit"
bd dep add <task> <prerequisite>
bd close <id>
bd export -o .beads/issues.jsonl
```

Create independently verifiable work units, not arbitrary 2-minute tasks. Close
only verified work; keep unresolved items open. Export the snapshot when Beads
changes, stage it with the relevant commit, and push it with the full-flow branch.
Do not create empty snapshot commits or use obsolete `bd sync`. Use `bd remember`
for durable project knowledge when needed, not MEMORY.md files.



## Subagents (Full flow or explicit request)

Use these roles and defaults; the main session remains the orchestrator. Planning
usually stays in the main conversation; delegate a planner only for a bounded
independent investigation or work breakdown.

| Role | Responsibility | Codex model / effort | Claude model / effort |
|---|---|---|---|
| `plan-writer` | Assigned design research or Beads breakdown | `gpt-5.6-sol` / high | `opus` / high |
| `implementer` | Assigned implementation or confirmed fixes | `gpt-5.6-terra` / medium | `sonnet` / medium |
| `reviewer` | Independent correctness, security, design checks | `gpt-5.6-sol` / high | `opus` / high |

- Codex: use the matching `.codex/agents/*.toml` role when supported. With a generic
  spawn tool, specify the table's model and reasoning explicitly, use focused
  context rather than a full-history fork, and include the role in the prompt.
- Claude: use the matching `.claude/agents/*.md` subagent type. These are thin
  platform adapters for this table and the relevant skill.
- Copilot/other hosts: use available equivalent capabilities. If model/effort or
  delegation controls are unavailable, disclose this and use a supported fallback;
  never claim an exact model or independent review that did not run.
- Escalate ambiguous, security-sensitive, or repeatedly failing implementation to
  the strong model/high effort. Keep routine fixes with the existing implementer.
  Do not default every task to maximum reasoning.
- Assignments include the selected flow, absolute workspace path, role, objective,
  owned files, design/Bead references, acceptance criteria, and checks. Require
  reading this guide and relevant domain skills. Request concise reports with
  changed files, findings, evidence, and blockers.
- Parallelize only independent work with disjoint file ownership. Shared-file work
  is sequential. Wait for writers before integration checks or reviewing their diff.
  Subagents do not spawn further agents or advance the pipeline.
- Start with one independent reviewer. Add a focused security/architecture reviewer
  only when warranted, and report evidence-based findings.

## Local Development

From the repository root, run `pnpm install` for Beads tooling, then
`pnpm --dir frontend install` for the app. Run `pnpm dev` for the frontend.
Validation: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`.
Preserve all imported copyright and attribution comments.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
