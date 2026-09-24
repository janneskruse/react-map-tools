"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import useMapStore from "@/store/map-state";
import { getGlobePitch, startGlobeRotation } from "@/utils/map/globe-camera";
import { animateMapProjection } from "@/utils/map/animate-map-projection";

export function useGlobeControls(mapId = "project-map") {
  const map = useMapStore((state) => state.getMap(mapId));
  const loaded = useMapStore((state) => state.getIsLoaded(mapId));
  const [rotate, setRotate] = useState(false);
  const [smoothPitch, setSmoothPitch] = useState(false);
  const [projection, setProjection] = useState("globe");
  const [transitioning, setTransitioning] = useState(false);
  const cancelTransition = useRef<(() => void) | null>(null);
  const isGlobe = projection === "globe";

  useEffect(() => {
    if (!map || !loaded || !rotate || !isGlobe || transitioning) return;
    const host = useMapStore.getState().getComparisonMapDivRef(mapId)?.current;
    return startGlobeRotation(map, host ?? map.getContainer());
  }, [mapId, map, loaded, rotate, isGlobe, transitioning]);

  useEffect(() => {
    if (!map || !loaded || !smoothPitch || !isGlobe || transitioning) return;
    // Modify the same camera update that zoom already produces. Calling setPitch
    // inside a zoom listener would stop an in-progress easeTo / wheel animation.
    map.setTransformCameraUpdate((next) => next.zoom === map.getZoom()
      ? {}
      : { pitch: getGlobePitch(next.zoom, map.getMaxPitch()) });
    map.easeTo({ pitch: getGlobePitch(map.getZoom(), map.getMaxPitch()), duration: 350 });
    return () => map.setTransformCameraUpdate(null);
  }, [map, loaded, smoothPitch, isGlobe, transitioning]);

  // A project change must not leave an animation or completion listener behind.
  useEffect(() => () => { cancelTransition.current?.(); }, [map]);

  const onTransition = useCallback(() => {
    if (!map || !loaded || transitioning) return;
    cancelTransition.current?.();
    map.stop();
    map.setTransformCameraUpdate(null);
    setTransitioning(true);

    const overlay = useMapStore.getState().getDeckOverlayRef(mapId)?.current;
    if (!overlay) { setTransitioning(false); return; }
    cancelTransition.current = animateMapProjection(map, overlay, isGlobe, () => {
      cancelTransition.current = null;
      setProjection(isGlobe ? "mercator" : "globe");
      setTransitioning(false);
    });
  }, [mapId, map, loaded, transitioning, isGlobe]);

  return { rotate, setRotate, smoothPitch, setSmoothPitch, projection,
    isGlobe, transitioning, ready: loaded && !!map, onTransition };
}
