"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  Map,
  AttributionControl,
  ScaleControl,
  GPUInitializationError,
  setWorkerUrl,
} from "maplibre-gl";
import { MapLibreOverlay } from "@deck.gl/maplibre";

import { updateMapSettings } from "@/utils/map/update-map-settings";
import useMapStore from "@/store/map-state";
import { MAP_CUSTOM_ATTRIBUTION } from "@/config/map/map-styles";

import type { IMapOptions } from "@/types/map";

export function useMap(options: IMapOptions) {
  // DOM hosts and imperative instances live for the lifetime of this map ID.
  const mapDivRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const deckOverlayRef = useRef<MapLibreOverlay | null>(null);
  const [gpuError, setGpuError] = useState<GPUInitializationError | null>(null);

  const { id } = options;

  // Compare JSON values, not object identities from server responses / rerenders.
  const settingsKey = JSON.stringify(options);
  const appliedOptions = useRef<IMapOptions | null>(null);

  // Read current settings on creation without making them creation dependencies.
  const getInitialOptions = useEffectEvent(
    () => JSON.parse(settingsKey) as IMapOptions,
  );

  // A replacement style can overwrite projection; always reapply the latest prop.
  const onStyleLoad = useEffectEvent((map: Map) => {
    map.setProjection({ type: options.projection });
    useMapStore.getState().setIsStyleLoaded(id, true);
  });

  // Create once per ID. Settings updates below keep this map and overlay intact.
  useEffect(() => {
    if (!mapDivRef.current) return;

    const initial = getInitialOptions();
    appliedOptions.current = initial;
    const state = useMapStore.getState();

    // Serve the worker bundled with the installed MapLibre version.
    setWorkerUrl("/workers/maplibre-gl-worker.mjs");
    let map: Map | null = null;
    let observer: ResizeObserver | null = null;

    try {
      map = new Map({
        container: mapDivRef.current,
        style: initial.mapStyle,
        center: [initial.longitude, initial.latitude],
        zoom: initial.zoom,
        pitch: initial.pitch,
        bearing: initial.bearing,
        maxZoom: initial.maxZoom,
        minZoom: initial.minZoom,
        maxPitch: initial.maxPitch,
        maxBounds: initial.maxBounds,
        attributionControl: false,
      });

      // MapLibreOverlay automatically chooses MapView / GlobeView from the map.
      const overlay = new MapLibreOverlay({ layers: [] });
      mapRef.current = map;
      deckOverlayRef.current = overlay;

      // Register each control once; retain the source credits plus our own credit.
      map.addControl(overlay);
      map.addControl(
        new AttributionControl({ customAttribution: MAP_CUSTOM_ATTRIBUTION }),
      );
      map.addControl(new ScaleControl(), "bottom-left");

      // Publish refs so controls and layer subscriptions can access this map by ID.
      state.setMapRef(id, mapRef);
      state.setMapDivRef(id, mapDivRef);
      state.setComparisonMapDivRef(id, comparisonRef);
      state.setDeckOverlayRef(id, deckOverlayRef);
      state.setMapStyle(id, initial.mapStyle);

      const activeMap = map;
      map.on("style.load", () => onStyleLoad(activeMap));
      map.on("load", () => state.setIsLoaded(id, true));

      // Panel resizing changes the map host even without a window resize.
      observer = new ResizeObserver(() => activeMap.resize());
      if (comparisonRef.current) observer.observe(comparisonRef.current);
    } catch (error) {
      // Reflect a failure from MapLibre's external GPU initialization.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (error instanceof GPUInitializationError) setGpuError(error);
      console.error("Map initialization failed", error);
    }

    // MapLibre removes its controls (including deck) when the map is removed.
    return () => {
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
      deckOverlayRef.current = null;
      state.clearMap(id);
    };
  }, [id]);

  // Apply a changed settings snapshot in place. Equal JSON values do nothing.
  useEffect(() => {
    const map = mapRef.current;
    const previous = appliedOptions.current;
    if (!map || !previous) return;

    const next = JSON.parse(settingsKey) as IMapOptions;
    if (JSON.stringify(previous.mapStyle) !== JSON.stringify(next.mapStyle)) {
      useMapStore.getState().setIsStyleLoaded(id, false);
      useMapStore.getState().setMapStyle(id, next.mapStyle);
    }

    // This helper diffs individual fields and batches changed camera fields.
    updateMapSettings(map, previous, next);

    // isStyleLoaded() also waits for tiles; style.load is the readiness we need.
    // While the initial/replacement style loads, onStyleLoad uses the latest props.
    if (
      previous.projection !== next.projection &&
      useMapStore.getState().getIsStyleLoaded(id)
    ) {
      map.setProjection({ type: next.projection });
    }

    appliedOptions.current = next;
  }, [id, settingsKey]);

  return { mapDivRef, comparisonRef, gpuError, setGpuError };
}
