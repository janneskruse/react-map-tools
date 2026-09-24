
"use client";

import { create } from "zustand";
import type { IMapStore } from "@/types/map";

function withoutId<T>(values: Record<string, T>, id: string) {
  const next = { ...values };
  delete next[id];
  return next;
}

const useMapStore = create<IMapStore>((set, get) => ({
  isLoaded: {},
  isStyleLoaded: {},
  mapStyles: {},
  mapRefs: {},
  mapDivRefs: {},
  comparisonMapDivRefs: {},
  deckOverlayRefs: {},
  mapListenersRefs: {},
  setIsLoaded: (id, loaded) =>
    set((s) => ({ isLoaded: { ...s.isLoaded, [id]: loaded } })),
  setIsStyleLoaded: (id, loaded) =>
    set((s) => ({ isStyleLoaded: { ...s.isStyleLoaded, [id]: loaded } })),
  setMapStyle: (id, style) =>
    set((s) => ({ mapStyles: { ...s.mapStyles, [id]: style } })),
  setMapRef: (id, ref) =>
    set((s) => ({ mapRefs: { ...s.mapRefs, [id]: ref } })),
  setMapDivRef: (id, ref) =>
    set((s) => ({ mapDivRefs: { ...s.mapDivRefs, [id]: ref } })),
  setComparisonMapDivRef: (id, ref) =>
    set((s) => ({
      comparisonMapDivRefs: { ...s.comparisonMapDivRefs, [id]: ref },
    })),
  setDeckOverlayRef: (id, ref) =>
    set((s) => ({ deckOverlayRefs: { ...s.deckOverlayRefs, [id]: ref } })),
  clearMap: (id) =>
    set((s) => ({
      isLoaded: withoutId(s.isLoaded, id),
      isStyleLoaded: withoutId(s.isStyleLoaded, id),
      mapStyles: withoutId(s.mapStyles, id),
      mapRefs: withoutId(s.mapRefs, id),
      mapDivRefs: withoutId(s.mapDivRefs, id),
      comparisonMapDivRefs: withoutId(s.comparisonMapDivRefs, id),
      deckOverlayRefs: withoutId(s.deckOverlayRefs, id),
      mapListenersRefs: withoutId(s.mapListenersRefs, id),
    })),
  getMap: (id) => get().mapRefs[id]?.current ?? null,
  getMapDivRef: (id) => get().mapDivRefs[id] ?? null,
  getComparisonMapDivRef: (id) => get().comparisonMapDivRefs[id] ?? null,
  getDeckOverlayRef: (id) => get().deckOverlayRefs[id] ?? null,
  getMapListenersRef: (id) => get().mapListenersRefs[id] ?? null,
  getIsLoaded: (id) => get().isLoaded[id] ?? false,
  getIsStyleLoaded: (id) => get().isStyleLoaded[id] ?? false,
  getMapStyle: (id) => get().mapStyles[id] ?? null,
}));

export default useMapStore;
