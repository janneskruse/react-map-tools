"use client";

import { useEffect } from "react";
import { Map, type StyleSpecification } from "maplibre-gl";
import type Compare from "@maplibre/maplibre-gl-compare";

import { attachSplitMapAtmosphere } from "@/utils/map/split-map-atmosphere";
import useMapStore from "@/store/map-state";
import { PROJECTION_MORPH_KEY } from "@/config/map/projection-morph";
import { MAP_CUSTOM_ATTRIBUTION } from "@/config/map/map-styles";

export function useSplitMap(
  mapId: string,
  enabled: boolean,
  style: StyleSpecification | string | undefined,
) {
  // Wait for the primary map before creating the optional comparison map.
  const map = useMapStore((state) => state.getMap(mapId));
  const loaded = useMapStore((state) => state.getIsLoaded(mapId));

  useEffect(() => {
    const host = useMapStore.getState().getComparisonMapDivRef(mapId)?.current;
    if (!map || !host || !loaded || !enabled || !style) return;

    // Both maps fill the same host; Compare clips them at its draggable divider.
    const container = document.createElement("div");
    container.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;isolation:isolate;z-index:0";
    host.appendChild(container);

    const other = new Map({
      container,
      style,
      center: map.getCenter(),
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
      attributionControl: { customAttribution: MAP_CUSTOM_ATTRIBUTION },
    });

    const detachAtmosphere = attachSplitMapAtmosphere(map, host);

    // Projection needs a loaded style, but must not wait for every tile to load.
    let styleReady = false;
    const syncProjection = () => {
      if (!styleReady) return;
      // Styles may omit projection entirely; MapLibre then defaults to Mercator.
      const projection = map.getProjection() ?? { type: "mercator" };
      if ((other.getProjection()?.type ?? "mercator") !== projection.type) {
        other.setProjection(projection);
      }
      // The same projection expression must receive the same animated value.
      const flatness = map.getGlobalState()[PROJECTION_MORPH_KEY];
      if (other.getGlobalState()[PROJECTION_MORPH_KEY] !== flatness) {
        other.setGlobalStateProperty(PROJECTION_MORPH_KEY, flatness ?? null);
      }
    };

    const onStyleLoad = () => {
      styleReady = true;
      syncProjection();
    };
    other.on("style.load", onStyleLoad);
    map.on("render", syncProjection);

    // The plugin reads window at import time, so load it only in the browser.
    let compare: Compare | undefined;
    let disposed = false;
    import("@maplibre/maplibre-gl-compare")
      .then(({ default: CompareControl }) => {
        if (!disposed) compare = new CompareControl(map, other, host);
      })
      .catch((error) => console.error("Comparison control failed", error));

    // Retain the divider’s relative position when a project panel resizes the map.
    let previousWidth = host.clientWidth;
    const observer = new ResizeObserver(() => {
      const fraction = previousWidth
        ? (compare?.currentPosition ?? previousWidth / 2) / previousWidth
        : 0.5;
      map.resize();
      other.resize();
      compare?.setSlider(host.clientWidth * fraction);
      previousWidth = host.clientWidth;
    });
    observer.observe(host);

    // Stop listeners before removing either the divider or the comparison map.
    return () => {
      disposed = true; // Also guard against an import resolving after cleanup.
      observer.disconnect();
      detachAtmosphere();
      map.off("render", syncProjection);
      other.off("style.load", onStyleLoad);
      compare?.remove();
      other.remove();
      container.remove();
      map.resize();
    };
  }, [mapId, map, loaded, enabled, style]);
}
