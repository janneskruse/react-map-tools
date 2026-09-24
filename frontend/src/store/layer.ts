"use client";

import { create } from "zustand";

import type { ILayerStore } from "@/types/layer";
import { H3_EXAMPLE } from "@/config/map/h3-example";

export function createLayerStore() {
  return create<ILayerStore>((set) => ({
    layers: [],
    years: [],
    selectedYear: H3_EXAMPLE.initialYear,
    showTimeSlider: true,
    status: "idle",
    error: null,
    upsertLayer: (entry) =>
      set((state) => ({
        layers: [...state.layers.filter((item) => item.id !== entry.id), entry],
      })),
    setVisibility: (id, visible) =>
      set((state) => ({
        layers: state.layers.map((item) =>
          item.id === id
            ? { ...item, layer: item.layer.clone({ visible }) }
            : item,
        ),
      })),
    setShowTimeSlider: (show) => set({ showTimeSlider: show }),
    setSelectedYear: (year) =>
      set((state) =>
        state.years.includes(year) ? { selectedYear: year } : state,
      ),
    reset: () =>
      set({
        layers: [],
        years: [],
        selectedYear: H3_EXAMPLE.initialYear,
        showTimeSlider: true,
        status: "idle",
        error: null,
      }),
  }));
}

const useLayerStore = createLayerStore();
export default useLayerStore;
