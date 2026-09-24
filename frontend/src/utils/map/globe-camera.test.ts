// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { LngLat, type Map } from "maplibre-gl";

import { getGlobePitch, startGlobeRotation } from "./globe-camera";

afterEach(() => vi.unstubAllGlobals());

it("keeps globe-scale views level and gradually reaches a bounded 45 degree pitch", () => {
  expect(getGlobePitch(0)).toBe(0);
  expect(getGlobePitch(3)).toBe(0);
  expect(getGlobePitch(6)).toBeCloseTo(22.5);
  expect(getGlobePitch(9)).toBe(45);
  expect(getGlobePitch(20, 30)).toBe(30);
  for (let step = 0; step < 60; step++) {
    const zoom = 3 + step / 10;
    expect(getGlobePitch(zoom + 0.1)).toBeGreaterThan(getGlobePitch(zoom));
  }
});

it("rotates while idle, pauses during holds and movement, and cleans up its animation", () => {
  let frame: FrameRequestCallback = () => {};
  const cancel = vi.fn();
  vi.stubGlobal("requestAnimationFrame", vi.fn(callback => { frame = callback; return 1; }));
  vi.stubGlobal("cancelAnimationFrame", cancel);
  const host = document.createElement("div");
  const jumpTo = vi.fn();
  const isMoving = vi.fn(() => false);
  const map = {
    getContainer: () => host,
    getCenter: () => new LngLat(10, 20),
    getZoom: () => 2,
    getProjection: () => ({ type: "globe" }),
    isMoving,
    jumpTo,
  } as Pick<Map, "getContainer" | "getCenter" | "getZoom" | "getProjection" | "isMoving" | "jumpTo">;
  const stop = startGlobeRotation(map, host);
  frame(0); frame(16);
  expect(jumpTo).toHaveBeenCalledTimes(1);
  expect(jumpTo.mock.calls[0][0].center[0]).toBeLessThan(10);
  expect(jumpTo.mock.calls[0][0].center[1]).toBe(20);
  host.dispatchEvent(Object.assign(new Event("pointerdown"), { pointerId: 1 }));
  frame(32);
  expect(jumpTo).toHaveBeenCalledTimes(1);
  window.dispatchEvent(Object.assign(new Event("pointerup"), { pointerId: 1 }));
  isMoving.mockReturnValue(true);
  frame(48);
  expect(jumpTo).toHaveBeenCalledTimes(1);
  isMoving.mockReturnValue(false);
  frame(64);
  expect(jumpTo).toHaveBeenCalledTimes(2);
  stop();
  expect(cancel).toHaveBeenCalledWith(1);
});
