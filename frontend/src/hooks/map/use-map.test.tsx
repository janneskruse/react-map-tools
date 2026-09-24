// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { useMap } from "./use-map";
import useMapStore from "@/store/map-state";
import type { IMapOptions } from "@/types/map";

const maps = vi.hoisted(() => [] as Array<Record<string, ReturnType<typeof vi.fn>>>);
vi.mock("maplibre-gl", () => ({
  Map: class {
    constructor() { maps.push(this as never); }
    addControl = vi.fn();
    remove = vi.fn();
    resize = vi.fn();
    on = vi.fn();
    jumpTo = vi.fn();
    setStyle = vi.fn();
    setProjection = vi.fn();
    setMaxBounds = vi.fn();
    setMinZoom = vi.fn();
    setMaxZoom = vi.fn();
    setMaxPitch = vi.fn();
    isStyleLoaded = vi.fn(() => true);
  },
  AttributionControl: class {}, ScaleControl: class {},
  GPUInitializationError: class extends Error {}, setWorkerUrl: vi.fn(),
}));
vi.mock("@deck.gl/maplibre", () => ({ MapLibreOverlay: class {} }));

const initial: IMapOptions = {
  id: "test-map", mapStyle: { version: 8, sources: {}, layers: [] },
  longitude: -122, latitude: 37, zoom: 11, pitch: 45, bearing: 0,
  minZoom: 0, maxZoom: 20, maxPitch: 75, projection: "globe",
  maxBounds: [-180, -85, 180, 85],
};
let root: Root;
function Harness(options: IMapOptions) {
  const { mapDivRef, comparisonRef } = useMap(options);
  return createElement("div", { ref: comparisonRef }, createElement("div", { ref: mapDivRef }));
}
async function render(options: IMapOptions) {
  await act(() => root.render(createElement(Harness, options)));
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  maps.length = 0;
  root = createRoot(document.createElement("div"));
});
afterEach(async () => {
  await act(() => root.unmount());
  vi.unstubAllGlobals();
});

it("applies server settings in place, preserving the map and deck overlay", async () => {
  await render(initial);
  const map = maps[0];
  act(() => map.on.mock.calls.find(([event]) => event === "style.load")![1]());
  const overlay = useMapStore.getState().getDeckOverlayRef(initial.id)?.current;
  await render({ ...initial, longitude: -73, latitude: 40, zoom: 6, pitch: 20, bearing: 30,
    minZoom: 2, maxZoom: 18, maxPitch: 65, maxBounds: [-100, 10, -50, 60], projection: "mercator" });
  expect(maps).toHaveLength(1);
  expect(map.remove).not.toHaveBeenCalled();
  expect(useMapStore.getState().getDeckOverlayRef(initial.id)?.current).toBe(overlay);
  expect(map.jumpTo).toHaveBeenLastCalledWith({ center: [-73, 40], zoom: 6, pitch: 20, bearing: 30 });
  expect(map.setMinZoom).toHaveBeenLastCalledWith(2);
  expect(map.setMaxZoom).toHaveBeenLastCalledWith(18);
  expect(map.setMaxPitch).toHaveBeenLastCalledWith(65);
  expect(map.setMaxBounds).toHaveBeenLastCalledWith([-100, 10, -50, 60]);
  expect(map.setProjection).toHaveBeenLastCalledWith({ type: "mercator" });
});

it("ignores equal objects and only updates changed settings without resetting a user-panned camera", async () => {
  await render(initial);
  const map = maps[0];
  Object.values(map).forEach(mock => mock.mockClear());
  await render(JSON.parse(JSON.stringify(initial)));
  expect(maps).toHaveLength(1);
  expect(map.setStyle).not.toHaveBeenCalled();
  expect(map.setMaxBounds).not.toHaveBeenCalled();
  expect(map.jumpTo).not.toHaveBeenCalled();
  await render({ ...initial, maxBounds: undefined, maxPitch: 60 });
  expect(map.setMaxBounds).toHaveBeenCalledWith(null);
  expect(map.setMaxPitch).toHaveBeenCalledWith(60);
  expect(map.jumpTo).not.toHaveBeenCalled();
});

it("reloads only the style and reapplies the latest projection after style.load", async () => {
  await render(initial);
  const map = maps[0];
  const onStyleLoad = map.on.mock.calls.find(([event]) => event === "style.load")![1];
  await render({ ...initial, mapStyle: "/replacement.json", projection: "mercator" });
  expect(maps).toHaveLength(1);
  expect(map.setStyle).toHaveBeenCalledWith("/replacement.json");
  expect(useMapStore.getState().getIsStyleLoaded(initial.id)).toBe(false);
  map.setProjection.mockClear();
  act(() => onStyleLoad());
  expect(map.setProjection).toHaveBeenCalledWith({ type: "mercator" });
  expect(useMapStore.getState().getIsStyleLoaded(initial.id)).toBe(true);
});

it("applies projection changes while tiles are loading and defers them before the initial style.load", async () => {
  await render(initial);
  const map = maps[0];
  map.isStyleLoaded.mockReturnValue(false);
  await render({ ...initial, projection: "mercator" });
  expect(map.setProjection).not.toHaveBeenCalled();
  const onStyleLoad = map.on.mock.calls.find(([event]) => event === "style.load")![1];
  act(() => onStyleLoad());
  map.setProjection.mockClear();
  await render({ ...initial, projection: "globe" });
  expect(map.setProjection).toHaveBeenCalledWith({ type: "globe" });
  expect(maps).toHaveLength(1);
});

it("recreates only for a different map identity and clears refs on unmount", async () => {
  await render(initial);
  await render({ ...initial, id: "second-map" });
  expect(maps).toHaveLength(2);
  expect(maps[0].remove).toHaveBeenCalledTimes(1);
  expect(useMapStore.getState().getMap(initial.id)).toBeNull();
  await act(() => root.unmount());
  expect(maps[1].remove).toHaveBeenCalledTimes(1);
  expect(useMapStore.getState().getDeckOverlayRef("second-map")).toBeNull();
});
