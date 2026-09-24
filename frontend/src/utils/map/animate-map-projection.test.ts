// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { LngLat, type CustomLayerInterface, type CustomLayerProjectionData, type CustomRenderMethodInput, type Map } from "maplibre-gl";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import type { MapLibreOverlay } from "@deck.gl/maplibre";

import { animateMapProjection } from "./animate-map-projection";
import useLayerStore from "@/store/layer";

function setup() {
  let frame: FrameRequestCallback = () => {};
  const renderCallbacks: Array<() => void> = [];
  vi.stubGlobal("requestAnimationFrame", vi.fn(callback => { frame = callback; return 1; }));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  const projectionData: CustomLayerProjectionData = {
    mainMatrix: new Float32Array(16), fallbackMatrix: new Float32Array(16),
    clippingPlane: [0, 0, 1, 0], tileMercatorCoords: [0, 0, 1, 1],
    projectionTransition: 1, clipAntimeridian: false,
  };
  const map = {
    getProjection: vi.fn(() => ({ type: "globe" })),
    getCenter: vi.fn(() => new LngLat(-122, 37)), getZoom: vi.fn(() => 3),
    setGlobalStateProperty: vi.fn(), setProjection: vi.fn(),
    getLayer: vi.fn(() => true), removeLayer: vi.fn(),
    addLayer: vi.fn((layer: CustomLayerInterface) => layer.render!(null as never,
      { defaultProjectionData: projectionData } as CustomRenderMethodInput)),
    once: vi.fn((_event: string, callback: () => void) => renderCallbacks.push(callback)),
    off: vi.fn(),
  };
  const overlay = { setProps: vi.fn() };
  return { map, overlay, tick: (time: number) => frame(time), render: () => renderCallbacks.splice(0).forEach(fn => fn()) };
}

afterEach(() => { useLayerStore.getState().reset(); vi.unstubAllGlobals(); });

it("morphs projection without camera setters and preserves layer updates made during animation", () => {
  const { map, overlay, tick, render } = setup();
  const layer = new H3HexagonLayer({ id: "hex", data: [{ hex: "8828308281fffff" }], getHexagon: d => d.hex });
  useLayerStore.getState().upsertLayer({ id: "hex", name: "Hex", layer });
  const complete = vi.fn();
  animateMapProjection(map as never as Map, overlay as never as MapLibreOverlay, true, complete);
  tick(0); tick(900);
  expect(map.setGlobalStateProperty).toHaveBeenLastCalledWith("rmt-projection-flatness", 0.5);
  useLayerStore.getState().setVisibility("hex", false);
  const latest = useLayerStore.getState().layers[0].layer;
  tick(1800); render();
  expect(complete).toHaveBeenCalledOnce();
  expect(map.setProjection).toHaveBeenLastCalledWith({ type: "mercator" });
  expect(overlay.setProps).toHaveBeenLastCalledWith({ views: null, layers: [latest] });
  expect(latest.props.visible).toBe(false);
  expect(latest.props.data).toBe(layer.props.data);
  expect(map.removeLayer).toHaveBeenCalledWith("rmt-projection-morph");
});

it("cancels pending frames, restores the original projection and removes layer subscriptions", () => {
  const { map, overlay, tick } = setup();
  const complete = vi.fn();
  const cancel = animateMapProjection(map as never as Map, overlay as never as MapLibreOverlay, true, complete);
  tick(0); tick(500); cancel();
  expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  expect(complete).not.toHaveBeenCalled();
  expect(map.setProjection).toHaveBeenLastCalledWith({ type: "globe" });
  const calls = overlay.setProps.mock.calls.length;
  useLayerStore.getState().reset();
  expect(overlay.setProps).toHaveBeenCalledTimes(calls);
});
