import type { Map } from "maplibre-gl";

import { GLOBE_CONTROLS } from "@/config/map/globe-controls";

/** Smoothstep avoids abrupt pitch changes at either end of the zoom range. */
export function getGlobePitch(zoom: number, maxPitch = GLOBE_CONTROLS.maxPitch) {
  const { levelZoom, pitchedZoom } = GLOBE_CONTROLS;
  const progress = Math.max(0, Math.min(1, (zoom - levelZoom) / (pitchedZoom - levelZoom)));
  return Math.min(maxPitch, GLOBE_CONTROLS.maxPitch) * progress * progress * (3 - 2 * progress);
}

/** Imperative camera updates avoid React/store work on animation frames. */
export function startGlobeRotation(
  map: Pick<Map, "getContainer" | "getCenter" | "getZoom" | "getProjection" | "isMoving" | "jumpTo">,
  host: HTMLElement = map.getContainer(),
) {
  const pointers = new Set<number>();
  let previousTime: number | undefined;
  let frame = 0;
  function onPointerDown(event: PointerEvent) { pointers.add(event.pointerId); }
  function onPointerUp(event: PointerEvent) { pointers.delete(event.pointerId); }
  function onBlur() { pointers.clear(); previousTime = undefined; }

  function rotate(time: number) {
    const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
    previousTime = time;
    if (elapsed && !document.hidden && !pointers.size && !map.isMoving() && map.getProjection()?.type === "globe") {
      // Reduce angular speed when zoomed in so local views do not race past.
      const speed = GLOBE_CONTROLS.rotationDegreesPerSecond / 2 ** Math.max(0, map.getZoom() - 3);
      const center = map.getCenter();
      map.jumpTo({ center: [center.lng - speed * elapsed / 1000, center.lat] });
    }
    frame = requestAnimationFrame(rotate);
  }

  // The shared host includes both split maps and their divider. Pointer capture
  // on window also handles releases outside the map and cancelled touch gestures.
  host.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("blur", onBlur);
  frame = requestAnimationFrame(rotate);
  return () => {
    cancelAnimationFrame(frame);
    host.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("blur", onBlur);
  };
}
