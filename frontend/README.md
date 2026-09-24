# react-map-tools

A Next.js starter for interactive React maps with MapLibre GL JS, deck.gl,
resizable layouts, and columnar data loading. The example displays San Francisco
H3 hexagons with a synthetic annual timeline.

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Maps | MapLibre GL JS 6, deck.gl 9, H3, MapLibre Compare |
| Data | Apache Parquet, Apache Arrow, parquet-wasm |
| Layout and state | Zustand, react-resizable-panels, nuqs |
| Validation | TypeScript, ESLint, Vitest, Playwright CLI |
| Optional issue tracking | Beads (`bd`) |

## Getting started

Requires **Node.js 22.12+** and **pnpm**. The package manager version is pinned in
`package.json`. Run these commands from the repository root:

```sh
pnpm install
pnpm --dir frontend install
pnpm dev
```

Open [the example project](http://localhost:3000/projects/example).
OpenFreeMap basemaps require no API token. The example runs entirely in the
browser; no database, backend service, Docker, or environment variables are needed.

Before development and production builds, `scripts/prepare-assets.mjs` copies the
installed Parquet WASM binary and MapLibre module worker into `public/wasm/` and
`public/workers/`. Keep these assets matched to the installed package versions.
The first build needs network access for the configured Google fonts.

## Project structure

```text
├── frontend/
│   ├── src/
│   │   ├── app/             # Routes and project layout
│   │   ├── components/      # UI, map controls, overlays and project panels
│   │   ├── hooks/           # Map, data and layout lifecycle
│   │   ├── store/           # Shared map refs, layers and project layout
│   │   ├── types/           # Shared TypeScript types
│   │   ├── utils/           # Data adapters, camera and rendering helpers
│   │   └── config/          # Example projects, basemaps and layer settings
│   ├── public/              # Parquet data, map styles, WASM and workers
│   └── scripts/             # Asset preparation and sample generation
├── .agents/skills/          # Development workflow guidance
├── .beads/                  # Optional local issue tracking configuration
├── AGENTS.md                # Entry point for contributor instructions
└── README.md                # Architecture and data-loading details
```

`@/` resolves to `frontend/src/`. Reusable UI lives in `components/core/`, inputs
in `components/input/`, and map controls and overlays in `components/map/`.

## Layout and map controls

The project route combines the project header and context with `NuqsAdapter` and
a project-scoped layout provider. The shell has a resizable bottom panel and two
right panels. Features portal into empty DOM targets held by the layout store;
the shell does not pre-render panel content.

The map center has top and bottom portal targets. The timeline uses the bottom
one; a compact globe-control overlay uses the top-right corner. Existing
`MapOverlayBox` components provide the common overlay styling and optional resizing.

The globe controls offer idle rotation, pitch that follows zoom, and a play button
for a smooth globe-to-flat projection morph at the current zoom. Rotation pauses while the map is held or
otherwise moving. Automatic pitch ranges from 0° at globe scale to 45° when zoomed
in. Both switches start off so the camera initially stays where you put it.
The play action blends the globe into Mercator without animating camera zoom or
center. It becomes “Return to globe” afterward. MapLibre interpolates the actual
projection; a temporary shader extension makes the existing H3 layer use the
same projection matrices, including its extrusion heights. Its Arrow data,
visibility and GPU time filter remain intact. Split maps share the blend value.
MapLibre still applies its viewport bounds: at very low zoom, switching to
Mercator can raise zoom slightly or constrain the center to fit the flat world.

This projection adapter currently targets the example H3 polygon sublayers;
additional deck layer types need their own projection support before they can
participate in a morph. Deck's camera interpolators alone do not change projection
geometry. Tune rotation, pitch thresholds and morph duration in
`src/config/map/globe-controls.ts`.

MapLibre controls the camera and deck.gl follows through `MapLibreOverlay`.
Comparison mode adds a second synchronized basemap with a draggable divider.
The atmosphere uses theme colors from `src/styles/globals.css`; split mode draws
its halo on a separate 2D canvas to avoid filtering the WebGL map canvases.

## Layers and binary data

The example loads `public/data/sf-h3.parquet` once, decodes it with parquet-wasm,
and reads the result as an Arrow table. The original deck.gl `H3HexagonLayer`
accesses H3 IDs as two UInt32 columns, without creating JSON rows or string IDs.
The timeline changes a GPU `DataFilterExtension.filterRange`; it does not rebuild
the dataset. The layer panel toggles visibility with the eye button.

The six years (2019–2024) are artificial; 2019 preserves the source counts.
See [data provenance](public/data/README.md) and the
[root README](../README.md#maps-layers-and-binary-h3) for implementation details
and the limits of the binary approach.

Regenerate the sample from the repository root:

```sh
pnpm --dir frontend data:generate
```

To customize the starter, begin with `src/config/project/project-data.ts`,
`src/config/map/map-styles.ts`, and `src/hooks/map/use-project-layers.ts`.

## Validation and production

Run from the repository root or `frontend/`:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

Deploy with a Next.js-compatible host. When the deployment root is `frontend/`,
use its `build` and `start` scripts so asset preparation runs automatically.

## Beads and contributing

Beads is an optional development tool installed with the root dependencies.
For a fresh clone, initialize it at the repository root:

```sh
pnpm exec bd init --prefix rmt --skip-agents --skip-hooks --non-interactive
pnpm exec bd ready
```

The local database and runtime files are ignored by Git. The tracked configuration
disables automatic Git operations. See [tracking notes](../.beads/README.md) and
[the project agent guide](AGENTS.md) for the Simple and Full workflows.

Preserve the source-attribution and copyright comments in imported components,
including the original authors' stated reuse conditions.
