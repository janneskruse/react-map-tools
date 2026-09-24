# react-map-tools issue tracking

Beads is installed through the root package.json. Run `pnpm exec bd ready` or
`pnpm exec bd prime` at the repository root. This checkout is initialized with
prefix `rmt`, embedded Dolt, and no replication remote. Runtime databases are ignored.

`no-git-ops: true` prevents Beads from staging or committing application files.
For a fresh clone, run `pnpm exec bd init --prefix rmt --skip-agents --skip-hooks --non-interactive`.
The project guide in `frontend/AGENTS.md` controls when tracking is used.
