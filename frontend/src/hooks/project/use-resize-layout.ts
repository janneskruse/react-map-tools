"use client";

import { useEffect, useRef } from "react";
import type {
  GroupImperativeHandle,
  Layout,
  LayoutChangedMeta,
} from "react-resizable-panels";

import {
  useProjectLayoutApi,
  useProjectLayoutStore,
} from "@/hooks/project/use-project-layout";
import { getLayoutPanelSizes } from "@/utils/layout/panel-sizes";

export function useResizeLayout() {
  const store = useProjectLayoutApi();
  const panels = useProjectLayoutStore((state) => state.panels);
  const horizontalRef = useRef<GroupImperativeHandle>(null);
  const verticalRef = useRef<GroupImperativeHandle>(null);

  useEffect(() => {
    const { sizes } = store.getState();
    horizontalRef.current?.setLayout(
      getLayoutPanelSizes(
        panels.right,
        panels.secondaryRight,
        sizes.right,
        sizes.secondaryRight,
      ),
    );
  }, [panels.right, panels.secondaryRight, store]);

  useEffect(() => {
    const bottom = panels.bottom ? store.getState().sizes.bottom : 0;
    verticalRef.current?.setLayout({ main: 100 - bottom, bottom });
  }, [panels.bottom, store]);

  function onHorizontalLayoutChanged(layout: Layout, meta: LayoutChangedMeta) {
    if (!meta.isUserInteraction) return;
    const state = store.getState();
    for (const panel of ["right", "secondaryRight"] as const) {
      if (layout[panel] > 0) state.setPanelSize(panel, layout[panel]);
      if (state.panels[panel] !== layout[panel] > 0)
        state.setPanelOpen(panel, layout[panel] > 0);
    }
  }

  function onVerticalLayoutChanged(layout: Layout, meta: LayoutChangedMeta) {
    if (!meta.isUserInteraction) return;
    const state = store.getState();
    if (layout.bottom > 0) state.setPanelSize("bottom", layout.bottom);
    if (state.panels.bottom !== layout.bottom > 0)
      state.setPanelOpen("bottom", layout.bottom > 0);
  }

  return {
    panels,
    horizontalRef,
    verticalRef,
    onHorizontalLayoutChanged,
    onVerticalLayoutChanged,
  };
}
