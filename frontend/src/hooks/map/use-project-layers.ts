"use client";

import { useEffect } from "react";

import useMapStore from "@/store/map-state";
import useLayerStore from "@/store/layer";
import { loadParquet } from "@/utils/data/load-parquet";
import { createH3Layer, getH3Columns } from "@/utils/data/h3-layer";
import { H3_EXAMPLE } from "@/config/map/h3-example";

export function useProjectLayers(mapId = "project-map") {
  // Load/convert once per project mount, independently of map readiness.
  useEffect(() => {
    const controller = new AbortController();
    let unsubscribeTime: (() => void) | undefined;

    useLayerStore.setState({ status: "loading", error: null });

    loadParquet(H3_EXAMPLE.url, controller.signal)
      .then((table) => {
        if (controller.signal.aborted) return;

        // Derive slider years from the year column; keep the layer data in Arrow.
        const years = [...new Set(getH3Columns(table).year.toArray())].sort(
          (a, b) => a - b,
        );
        const initial = createH3Layer(table, years[0]);

        useLayerStore.setState({
          years,
          selectedYear: years[0],
          status: "ready",
        });
        useLayerStore
          .getState()
          .upsertLayer({
            id: H3_EXAMPLE.id,
            name: H3_EXAMPLE.name,
            layer: initial,
          });

        // Update the GPU filter without rebuilding Arrow rows or layer accessors.
        unsubscribeTime = useLayerStore.subscribe((state, previous) => {
          if (state.selectedYear === previous.selectedYear) return;

          // A time change must preserve the user’s visibility choice.
          const visible =
            state.layers.find((entry) => entry.id === H3_EXAMPLE.id)?.layer
              .props.visible ?? true;

          state.upsertLayer({
            id: H3_EXAMPLE.id,
            name: H3_EXAMPLE.name,
            layer: initial.clone({
              filterRange: [state.selectedYear, state.selectedYear],
              visible,
            }),
          });
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("H3 example load failed", error);
        useLayerStore.setState({
          status: "error",
          error: "The hexagon data could not be loaded. Reload to try again.",
        });
      });

    // Ignore late fetches and release subscriptions when leaving the project.
    return () => {
      controller.abort();
      unsubscribeTime?.();
      useLayerStore.getState().reset();
    };
  }, []);

  // Bridge imperative stores directly to deck; layer changes need no React render.
  useEffect(() => {
    function updateOverlay() {
      useMapStore
        .getState()
        .getDeckOverlayRef(mapId)
        ?.current?.setProps({
          layers: useLayerStore.getState().layers.map((entry) => entry.layer),
        });
    }

    updateOverlay();

    const unsubscribeLayers = useLayerStore.subscribe((state, previous) => {
      if (state.layers !== previous.layers) updateOverlay();
    });

    // Data may arrive before the map, or the map may be recreated for a new ID.
    const unsubscribeMap = useMapStore.subscribe((state, previous) => {
      if (state.deckOverlayRefs[mapId] !== previous.deckOverlayRefs[mapId])
        updateOverlay();
    });

    return () => {
      unsubscribeLayers();
      unsubscribeMap();
      useMapStore
        .getState()
        .getDeckOverlayRef(mapId)
        ?.current?.setProps({ layers: [] });
    };
  }, [mapId]);
}
