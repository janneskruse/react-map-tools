import { expect, it } from "vitest";
import { tableFromArrays } from "apache-arrow";
import { h3IndexToSplitLong } from "h3-js";

import { createLayerStore } from "./layer";
import useMapStore from "./map-state";
import { createH3Layer } from "@/utils/data/h3-layer";

it("toggles actual deck layers without replacing data and rejects unavailable years", () => {
  const [lo, hi] = h3IndexToSplitLong("8828308281fffff");
  const table = tableFromArrays({
    h3_lo: new Uint32Array([lo]),
    h3_hi: new Uint32Array([hi]),
    count: new Float32Array([10]),
    year: new Int32Array([2019]),
  });
  const layer = createH3Layer(table, 2019);
  const store = createLayerStore();
  store.setState({ years: [2019, 2020] });
  store.getState().upsertLayer({ id: layer.id, name: "H3", layer });
  store.getState().setVisibility(layer.id, false);
  expect(store.getState().layers[0].layer.props.visible).toBe(false);
  expect(store.getState().layers[0].layer.props.data).toBe(layer.props.data);
  store.getState().setSelectedYear(2020);
  store.getState().setSelectedYear(3000);
  expect(store.getState().selectedYear).toBe(2020);
  store.getState().reset();
  expect(store.getState().layers).toEqual([]);
});

it("clears only the unmounted map's overlay and DOM references", () => {
  const store = useMapStore.getState();
  store.setDeckOverlayRef("first", { current: null });
  store.setDeckOverlayRef("second", { current: null });
  store.setMapDivRef("first", { current: null });
  store.clearMap("first");
  expect(useMapStore.getState().getDeckOverlayRef("first")).toBeNull();
  expect(useMapStore.getState().getMapDivRef("first")).toBeNull();
  expect(useMapStore.getState().getDeckOverlayRef("second")).not.toBeNull();
  store.clearMap("second");
});
