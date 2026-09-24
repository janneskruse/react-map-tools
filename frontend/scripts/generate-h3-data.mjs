// Source: vis.gl deck.gl-data example. Retain upstream attribution in public/data/README.md.
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tableFromArrays, tableToIPC } from "apache-arrow";
import {
  Table,
  writeParquet,
  WriterPropertiesBuilder,
  Compression,
} from "parquet-wasm/node";
import { h3IndexToSplitLong, isValidCell } from "h3-js";

const source =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json";
const response = await fetch(source);
if (!response.ok)
  throw new Error(`Dataset download failed: ${response.status}`);
const text = await response.text();
const rows = JSON.parse(text);
const years = [2019, 2020, 2021, 2022, 2023, 2024];
const length = rows.length * years.length;
const h3_lo = new Uint32Array(length);
const h3_hi = new Uint32Array(length);
const count = new Float32Array(length);
const year = new Int32Array(length);
for (const [timeIndex, currentYear] of years.entries()) {
  for (const [index, row] of rows.entries()) {
    if (!isValidCell(row.hex) || !Number.isFinite(row.count))
      throw new Error("Unexpected H3 example schema");
    const offset = timeIndex * rows.length + index;
    [h3_lo[offset], h3_hi[offset]] = h3IndexToSplitLong(row.hex);
    // 2019 reproduces the original counts. Later years are deterministic synthetic values.
    count[offset] = Math.round(
      row.count *
        (1 +
          timeIndex * 0.12 +
          (timeIndex === 0 ? 0 : Math.sin(index * 0.7 + timeIndex) * 0.25)),
    );
    year[offset] = currentYear;
  }
}
const table = tableFromArrays({ h3_lo, h3_hi, count, year });
const properties = new WriterPropertiesBuilder()
  .setCompression(Compression.ZSTD)
  .build();
const wasmTable = Table.fromIPCStream(tableToIPC(table, "stream"));
const bytes = writeParquet(wasmTable, properties);
// writeParquet consumes the table and writer properties.
await mkdir("public/data", { recursive: true });
await writeFile("public/data/sf-h3.parquet", bytes);
console.log({
  cells: rows.length,
  rows: length,
  bytes: bytes.length,
  sourceSha256: createHash("sha256").update(text).digest("hex"),
});
