import type { RefObject } from "react";
import type { CustomLayerProjectionData, Map, StyleSpecification } from "maplibre-gl";
import type { MapLibreOverlay } from "@deck.gl/maplibre";

export type TMapStyle = StyleSpecification | string;
export type TMapListenersRef = RefObject<Record<string, () => void> | null>;
export type TDeckOverlayRef = RefObject<MapLibreOverlay | null>;

export interface IMapOptions {
  id: string;
  zoom: number;
  pitch: number;
  bearing: number;
  maxZoom: number;
  minZoom: number;
  maxPitch: number;
  longitude: number;
  latitude: number;
  maxBounds?: [number, number, number, number];
  projection: string;
  mapStyle: TMapStyle;
}

export interface IMapStore {
  isLoaded: Record<string, boolean>;
  isStyleLoaded: Record<string, boolean>;
  mapStyles: Record<string, TMapStyle>;
  mapRefs: Record<string, RefObject<Map | null>>;
  mapDivRefs: Record<string, RefObject<HTMLDivElement | null>>;
  comparisonMapDivRefs: Record<string, RefObject<HTMLDivElement | null>>;
  deckOverlayRefs: Record<string, TDeckOverlayRef>;
  mapListenersRefs: Record<string, TMapListenersRef>;
  setIsLoaded: (id: string, loaded: boolean) => void;
  setIsStyleLoaded: (id: string, loaded: boolean) => void;
  setMapStyle: (id: string, style: TMapStyle) => void;
  setMapRef: (id: string, ref: RefObject<Map | null>) => void;
  setMapDivRef: (id: string, ref: RefObject<HTMLDivElement | null>) => void;
  setComparisonMapDivRef: (
    id: string,
    ref: RefObject<HTMLDivElement | null>,
  ) => void;
  setDeckOverlayRef: (id: string, ref: TDeckOverlayRef) => void;
  clearMap: (id: string) => void;
  getMap: (id: string) => Map | null;
  getMapDivRef: (id: string) => RefObject<HTMLDivElement | null> | null;
  getComparisonMapDivRef: (
    id: string,
  ) => RefObject<HTMLDivElement | null> | null;
  getDeckOverlayRef: (id: string) => TDeckOverlayRef | null;
  getMapListenersRef: (id: string) => TMapListenersRef | null;
  getIsLoaded: (id: string) => boolean;
  getIsStyleLoaded: (id: string) => boolean;
  getMapStyle: (id: string) => TMapStyle | null;
}

/** Homogeneous screen coordinates used to clip the globe silhouette. */
export type TGlobeClipPoint = [x: number, y: number, w: number];

/** Mutable render-frame data shared with the temporary H3 projection extension. */
export interface IProjectionMorphFrame {
  data: CustomLayerProjectionData | null;
  centerLongitude: number;
}
