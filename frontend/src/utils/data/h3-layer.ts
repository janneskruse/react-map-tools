import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import { type Table } from "apache-arrow";

import type { IH3Columns, TTimedH3Layer } from "@/types/layer";
import { H3_EXAMPLE } from "@/config/map/h3-example";

export function getH3Columns(table: Table): IH3Columns {
  const low = table.getChild("h3_lo");
  const high = table.getChild("h3_hi");
  const count = table.getChild("count");
  const year = table.getChild("year");
  if (
    !low ||
    !high ||
    !count ||
    !year ||
    !table.numRows ||
    low.type.toString() !== "Uint32" ||
    high.type.toString() !== "Uint32" ||
    count.type.toString() !== "Float32" ||
    year.type.toString() !== "Int32" ||
    [low, high, count, year].some((column) => column.nullCount > 0)
  ) {
    throw new Error(
      "Expected non-null h3_lo/h3_hi UInt32, count Float32 and year Int32 columns",
    );
  }
  return { low, high, count, year };
}

export function getSplitHexagon(
  columns: IH3Columns,
  index: number,
): [number, number] {
  return [columns.low.get(index)!, columns.high.get(index)!];
}

export function createH3Layer(table: Table, year: number): TTimedH3Layer {
  const columns = getH3Columns(table);
  return new H3HexagonLayer<
    never,
    import("@deck.gl/extensions").DataFilterExtensionProps<never>
  >({
    id: H3_EXAMPLE.id,
    // No row-object array or string IDs. Accessors read Arrow vectors by index across batches.
    data: { length: table.numRows },
    // h3-js accepts [low32, high32]; deck.gl 9.4's runtime forwards it unchanged.
    // Remove this targeted suppression when upstream widens the accessor type:
    // https://github.com/visgl/deck.gl/issues/10406
    // @ts-expect-error deck.gl declares string, but its H3 runtime supports split longs.
    getHexagon: (_, { index }) => getSplitHexagon(columns, index),
    getFillColor: (_, { index }) => [
      255,
      Math.max(0, (1 - columns.count.get(index)! / 500) * 255),
      0,
    ],
    getElevation: (_, { index }) => columns.count.get(index)!,
    getFilterValue: (_, { index }) => columns.year.get(index)!,
    filterRange: [year, year],
    extensions: [new DataFilterExtension({ filterSize: 1 })],
    highPrecision: "auto",
    extruded: true,
    elevationScale: 5,
    coverage: 0.9,
    pickable: true,
  });
}
