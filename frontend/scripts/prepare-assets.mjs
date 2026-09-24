import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

await mkdir("public/wasm", { recursive: true });
await copyFile(
  fileURLToPath(import.meta.resolve("parquet-wasm/esm/parquet_wasm_bg.wasm")),
  "public/wasm/parquet_wasm_bg.wasm",
);

// MapLibre 6 ships a separate module worker; its relative URL is lost when bundled.
await mkdir("public/workers", { recursive: true });
await copyFile(
  fileURLToPath(import.meta.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs")),
  "public/workers/maplibre-gl-worker.mjs",
);
await copyFile(
  fileURLToPath(import.meta.resolve("maplibre-gl/dist/maplibre-gl-shared.mjs")),
  "public/workers/maplibre-gl-shared.mjs",
);
