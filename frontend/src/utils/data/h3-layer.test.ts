import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Table, tableFromIPC, tableFromArrays } from "apache-arrow";
import { readParquet } from "parquet-wasm/node";
import { cellToLatLng, h3IndexToSplitLong, splitLongToH3Index } from "h3-js";

import { createH3Layer, getH3Columns, getSplitHexagon } from "./h3-layer";

describe("Arrow H3 adapter", () => {
  it("keeps unsigned H3 bits and locations identical to string indices", () => {
    const hex = "8828308281fffff";
    const [lo, hi] = h3IndexToSplitLong(hex);
    const table = tableFromArrays({
      h3_lo: new Uint32Array([lo]),
      h3_hi: new Uint32Array([hi]),
      count: new Float32Array([100]),
      year: new Int32Array([2020]),
    });
    const pair = getSplitHexagon(getH3Columns(table), 0);
    expect(splitLongToH3Index(...pair)).toBe(hex);
    expect(cellToLatLng(pair)).toEqual(cellToLatLng(hex));
  });
  it("reads split-long indices across Arrow record batches", () => {
    const hexes = ["8828308281fffff", "8828308283fffff"];
    const batches = hexes.map((hex) => {
      const [lo, hi] = h3IndexToSplitLong(hex);
      return tableFromArrays({
        h3_lo: new Uint32Array([lo]),
        h3_hi: new Uint32Array([hi]),
        count: new Float32Array([1]),
        year: new Int32Array([2019]),
      }).batches[0];
    });
    const columns = getH3Columns(new Table(batches));
    expect(
      hexes.map((_, index) =>
        splitLongToH3Index(...getSplitHexagon(columns, index)),
      ),
    ).toEqual(hexes);
  });
  it("rejects missing/wrongly typed columns before rendering", () => {
    expect(() => getH3Columns(tableFromArrays({ count: [10] }))).toThrow();
  });
  it("loads the actual Parquet asset and changes time without replacing data or accessors", () => {
    const table = tableFromIPC(
      readParquet(readFileSync("public/data/sf-h3.parquet")).intoIPCStream(),
    );
    const layer = createH3Layer(table, 2020);
    const next = layer.clone({ filterRange: [2024, 2024], visible: false });
    expect(table.numRows).toBeGreaterThan(0);
    expect(next.props.data).toBe(layer.props.data);
    expect(next.props.getHexagon).toBe(layer.props.getHexagon);
    expect(next.props.filterRange).toEqual([2024, 2024]);
    expect(next.props.visible).toBe(false);
    expect(new Set(getH3Columns(table).year.toArray())).toEqual(
      new Set([2019, 2020, 2021, 2022, 2023, 2024]),
    );
  });
});
