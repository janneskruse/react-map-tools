"use client";

import { useCallback, useContext } from "react";
import { useStore } from "zustand";

import { ProjectLayoutContext } from "@/store/project-layout";
import type { IProjectLayoutState, TLayoutTarget } from "@/types/layout";

export function useProjectLayoutApi() {
  const store = useContext(ProjectLayoutContext);
  if (!store) throw new Error("Project layout requires ProjectLayoutProvider");
  return store;
}

export function useProjectLayoutStore<T>(
  selector: (state: IProjectLayoutState) => T,
) {
  return useStore(useProjectLayoutApi(), selector);
}

// Callback refs publish mount/unmount to portal consumers, unlike ref.current mutations.
export function useLayoutTargetRef(target: TLayoutTarget) {
  const setTarget = useProjectLayoutStore((state) => state.setTarget);
  return useCallback(
    (element: HTMLDivElement | null) => setTarget(target, element),
    [setTarget, target],
  );
}
