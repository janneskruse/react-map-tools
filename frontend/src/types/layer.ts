import type { Layer } from "@deck.gl/core";
import type { DataFilterExtensionProps } from "@deck.gl/extensions";
import type { H3HexagonLayer } from "@deck.gl/geo-layers";
import type { Vector, Uint32, Float32, Int32 } from "apache-arrow";

export interface IH3Columns {
  low: Vector<Uint32>;
  high: Vector<Uint32>;
  count: Vector<Float32>;
  year: Vector<Int32>;
}
export type TTimedH3Layer = H3HexagonLayer<
  never,
  DataFilterExtensionProps<never>
>;
export interface ILayerEntry {
  id: string;
  name: string;
  layer: Layer;
}
export interface ILayerStore {
  layers: ILayerEntry[];
  years: number[];
  selectedYear: number;
  showTimeSlider: boolean;
  setShowTimeSlider: (show: boolean) => void;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  upsertLayer: (entry: ILayerEntry) => void;
  setVisibility: (id: string, visible: boolean) => void;
  setSelectedYear: (year: number) => void;
  reset: () => void;
}
