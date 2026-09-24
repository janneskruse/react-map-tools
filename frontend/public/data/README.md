# H3 example data

`sf-h3.parquet` derives from the [deck.gl H3 example](https://deck.gl/docs/api-reference/geo-layers/h3-hexagon-layer)
and [sf.h3cells.json](https://github.com/visgl/deck.gl-data/blob/master/website/sf.h3cells.json).
Upstream data attribution: vis.gl / deck.gl-data contributors. See the upstream repository for provenance.

There are 124 cells and 744 rows: one row per cell for each year from 2019 to 2024.
2019 keeps the original counts; subsequent years are deterministic artificial values,
not historical observations. The generator formula is in `scripts/generate-h3-data.mjs`.

Columns: `h3_lo: UInt32`, `h3_hi: UInt32`, `count: Float32`, `year: Int32`.
H3 words are stored in `[low32, high32]` order. This is ordinary Parquet, not GeoParquet:
there is no encoded geometry column. H3 produces the geometry when rendered.

Regenerate with `pnpm data:generate` in `frontend/`. The source JSON is fetched into
memory only. The generated file uses Zstandard compression and is 3,107 bytes.
Source SHA-256 at generation: `e55fbaa484f0783c41cc44f5ba951fa48db8d32805d5250ed4c14c9f05e420c0`.
