import type { CameraOptions, Map } from "maplibre-gl";

import type { IMapOptions } from "@/types/map";

/** Apply only changed props so unrelated settings never reset a user-panned camera. */
export function updateMapSettings(map: Map, previous: IMapOptions, next: IMapOptions) {
  if (JSON.stringify(previous.mapStyle) !== JSON.stringify(next.mapStyle)) {
    map.setStyle(next.mapStyle);
  }
  // Expand limits first so a new valid range may lie outside the old range.
  if (next.maxZoom > previous.maxZoom) map.setMaxZoom(next.maxZoom);
  if (next.minZoom !== previous.minZoom) map.setMinZoom(next.minZoom);
  if (next.maxZoom < previous.maxZoom) map.setMaxZoom(next.maxZoom);
  if (next.maxPitch !== previous.maxPitch) map.setMaxPitch(next.maxPitch);
  if (JSON.stringify(next.maxBounds) !== JSON.stringify(previous.maxBounds)) {
    map.setMaxBounds(next.maxBounds ?? null);
  }
  const camera: CameraOptions = {};
  if (next.longitude !== previous.longitude || next.latitude !== previous.latitude) {
    camera.center = [next.longitude, next.latitude];
  }
  if (next.zoom !== previous.zoom) camera.zoom = next.zoom;
  if (next.pitch !== previous.pitch) camera.pitch = next.pitch;
  if (next.bearing !== previous.bearing) camera.bearing = next.bearing;
  if (Object.keys(camera).length) map.jumpTo(camera);
}
