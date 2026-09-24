import { createContext } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";

import type { IProjectLayoutState } from "@/types/layout";

export const ProjectLayoutContext =
  createContext<StoreApi<IProjectLayoutState> | null>(null);

export function createProjectLayoutStore() {
  return createStore<IProjectLayoutState>()((set) => ({
    panels: { right: false, secondaryRight: false, bottom: false },
    sizes: { right: 28, secondaryRight: 24, bottom: 22 },
    targets: {
      right: null,
      secondaryRight: null,
      bottom: null,
      mapLayout: null,
      mapRight: null,
      mapCenterUp: null,
      mapCenterBottom: null,
    },
    showDrawer: true,
    setShowDrawer: (open) =>
      set((state) => ({
        showDrawer: typeof open === "function" ? open(state.showDrawer) : open,
      })),
    setPanelOpen: (panel, open) =>
      set((state) => ({ panels: { ...state.panels, [panel]: open } })),
    setPanelSize: (panel, size) =>
      set((state) => ({ sizes: { ...state.sizes, [panel]: size } })),
    setTarget: (target, element) =>
      set((state) =>
        state.targets[target] === element
          ? state
          : { targets: { ...state.targets, [target]: element } },
      ),
  }));
}
