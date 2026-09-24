# react-map-tools

A Next.js starter for interactive maps with MapLibre GL JS, deck.gl, TypeScript,
Zustand, shadcn/ui, and resizable layouts. The working example loads H3 cells from
Parquet into Apache Arrow and filters synthetic annual values on the GPU.

## Run locally

Requires Node.js 22.12+ and pnpm (the pinned version is in package.json).

```sh
pnpm install
pnpm --dir frontend install
pnpm dev
```

Open http://localhost:3000/projects/example. No API token or backend is needed.
`predev` and `prebuild` copy the matching installed parquet-wasm binary into
`frontend/public/wasm/`; it is served locally, not downloaded from a CDN at runtime.
The same preparation script serves MapLibre 6's separate module worker from
`public/workers/`. The first production build downloads the configured Google fonts.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Project layout and portals

The project route wraps the provided header and project context with `NuqsAdapter`
and a `ProjectLayoutProvider`, keyed by project ID. `ResizeLayout` has a bottom
panel and two independent right panels. All three hosts remain mounted while
collapsed, contain no built-in content, and publish DOM targets through callback refs.
Header buttons control visibility; separators support pointer and keyboard resizing.
Sizes remain in memory while the project is mounted. The example portals its
timeline into the map’s center-bottom overlay; the separate resizable bottom panel
stays available for feature content. Unknown project IDs render a 404.

The layout store also exposes `mapLayout`, `mapRight`, `mapCenterUp`, and
`mapCenterBottom` targets.
A feature can mount content without teaching the shell about the feature:

```tsx
const target = useProjectLayoutStore((state) => state.targets.right);
const setPanelOpen = useProjectLayoutStore((state) => state.setPanelOpen);
// Call setPanelOpen("right", true) from the feature's event or lifecycle.
return target ? createPortal(<YourPanel />, target) : null;
```

Imports: `useProjectLayoutStore` from `@/hooks/project/use-project-layout`,
`createPortal` from `react-dom`. Layout stores are isolated between project mounts.
Panel contents are feature-owned; empty right panels are intentional.

## Maps, layers, and binary H3

`useMapStore` owns map IDs and typed `MapLibreOverlay` refs under `deckOverlayRefs`.
The map creates one overlay and cleans it up with MapLibre on unmount. The layer
store contains actual deck layer instances plus names, loading state and timeline
selection. A store subscription updates the overlay without rerendering the map.
The Layers panel uses Eye/EyeOff to clone a layer with a new `visible` prop.

Maps default to globe projection. `MapLibreOverlay` automatically selects deck.gl’s
experimental `GlobeView` and synchronizes the camera; no standalone view is needed.
The comparison map follows the same projection and its draggable divider retains
its relative position during layout resizing.

`useMap` creates a map only on mount or when its ID changes. Server-loaded settings
are compared by JSON value and applied with setters. Only changed camera fields
are applied, so changing bounds, style, or projection does not reset a user-panned
camera. A style change calls `setStyle` on the existing map and reapplies the latest
projection after `style.load`; the map and deck overlay remain the same instances.

The example uses the original `H3HexagonLayer` from `@deck.gl/geo-layers`:

1. Fetch `public/data/sf-h3.parquet`, decode once with parquet-wasm, and read Arrow IPC.
2. Read H3 IDs from two UInt32 columns in `[low32, high32]` order, with numeric
   `count` and `year` columns. No string indices or JSON row arrays are created.
3. Access columns by row index, including across Arrow record batches.
4. Keep the data and accessors stable; slider changes clone the layer with a new
   `DataFilterExtension.filterRange`. Visibility is preserved across time changes.

Parquet reduces transfer size; Arrow avoids materializing row objects. H3 still
calculates cell geometry on the CPU, and WASM/IPC decoding still involves copies.
The bundled WASM initialization cost can dominate a sample this small. This is an
extensible binary-data example, not a claim that Parquet is faster for every dataset.
`highPrecision: "auto"` retains deck.gl's safeguards for coarse cells and pentagons.

[deck.gl issue #10406](https://github.com/visgl/deck.gl/issues/10406) describes the
split-long path. The installed deck.gl 9.4 runtime accepts it through h3-js, while
its TypeScript accessor still declares `string`. One documented `@ts-expect-error`
is isolated in the adapter, with regression tests for bit order and coordinates.

[GeoArrow's H3 wrapper](https://github.com/geoarrow/deck.gl-geoarrow/blob/main/packages/deck.gl-geoarrow/src/layers/h3-hexagon-layer.ts)
also delegates to the original H3 layer, but converts IDs to strings. It adds no
benefit for this adapter and is not installed. Its binary geometry integrations
remain useful for future point and polygon layers.

The sample contains 124 cells × 6 years (2019–2024). All time variation is artificial;
2019 preserves the original counts. See [data provenance](frontend/public/data/README.md).
To regenerate the Parquet without saving JSON:

```sh
pnpm --dir frontend data:generate
```

## Beads and contributor guidance

Beads is installed as a root development dependency. Local tracking is initialized
with prefix `rmt`, using embedded Dolt. No external database process is needed.

```sh
pnpm exec bd ready
pnpm exec bd prime
```

The database and runtime state are ignored by Git. Configuration is tracked.
For a fresh clone, initialize local tracking explicitly with
`pnpm exec bd init --prefix rmt --skip-agents --skip-hooks --non-interactive`.
The supplied `no-git-ops: true` configuration prevents automatic Git operations.
Remote replication is not configured. The selected Simple/Full workflow in
[the agent guide](frontend/AGENTS.md) governs whether to create work items.

Copyright and source-attribution comments in imported components are preserved.
Git history replacement and publication require the owner's review and approval.
