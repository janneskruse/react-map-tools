import { tableFromIPC, type Table } from "apache-arrow";

let wasmReady: Promise<typeof import("parquet-wasm/esm")> | undefined;

function getParquetReader() {
  // Reuse WASM initialization across requests; a failed initialization can be retried.
  wasmReady ??= import("parquet-wasm/esm")
    .then(async (wasm) => {
      await wasm.default({ module_or_path: "/wasm/parquet_wasm_bg.wasm" });
      return wasm;
    })
    .catch((error) => {
      wasmReady = undefined;
      throw error;
    });
  return wasmReady;
}

export async function loadParquet(
  url: string,
  signal?: AbortSignal,
): Promise<Table> {
  const [wasm, response] = await Promise.all([
    getParquetReader(),
    fetch(url, { signal }),
  ]);
  if (!response.ok)
    throw new Error(`Parquet request failed (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  signal?.throwIfAborted();
  // intoIPCStream consumes/frees the Rust table; Arrow owns the resulting JS buffers.
  return tableFromIPC(wasm.readParquet(bytes).intoIPCStream());
}
