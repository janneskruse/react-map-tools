import { MapView } from "@deck.gl/core";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import type { MapLibreOverlay } from "@deck.gl/maplibre";
import type { CustomLayerInterface, Map } from "maplibre-gl";

import useLayerStore from "@/store/layer";
import { H3ProjectionExtension } from "@/utils/map/h3-projection-extension";
import { MORPH_PROJECTION, PROJECTION_MORPH_KEY } from "@/config/map/projection-morph";
import { GLOBE_CONTROLS } from "@/config/map/globe-controls";
import type { IProjectionMorphFrame } from "@/types/map";

/** Animate projection alone: no flyTo, zoom changes, or dataset reconstruction. */
export function animateMapProjection(map: Map, overlay: MapLibreOverlay, toFlat: boolean, onComplete: () => void) {
  const initialProjection = map.getProjection();
  const frame: IProjectionMorphFrame = { data: null, centerLongitude: map.getCenter().lng };
  const extension = new H3ProjectionExtension(frame);
  // The installed globe preset blends to Mercator from zoom 11 to 12.
  const globeFlatness = Math.max(0, Math.min(1, map.getZoom() - 11));
  const from = toFlat ? globeFlatness : 1;
  const to = toFlat ? 1 : globeFlatness;
  let animationFrame = 0;
  let disposed = false;

  function updateLayers() {
    overlay.setProps({ layers: useLayerStore.getState().layers.map(({ layer }) =>
      layer instanceof H3HexagonLayer
        ? layer.clone({ highPrecision: true, extensions: [...layer.props.extensions, extension] })
        : layer),
    });
  }
  // Supplying the public "maplibre" view avoids the overlay's string-only
  // projection detection. H3 vertex positions come from our shader during morphing.
  // @ts-expect-error deck.gl 9.4 defaults DeckProps.views to null; overlay._getViews supports an explicit maplibre view.
  overlay.setProps({ views: new MapView({ id: "maplibre", repeat: false }) });
  updateLayers();
  const unsubscribe = useLayerStore.subscribe((state, previous) => {
    if (state.layers !== previous.layers) updateLayers();
  });
  const projectionLayer: CustomLayerInterface = {
    id: "rmt-projection-morph", type: "custom", renderingMode: "3d",
    render(_gl, { defaultProjectionData }) {
      frame.data = defaultProjectionData;
      frame.centerLongitude = map.getCenter().lng;
    },
  };
  map.setGlobalStateProperty(PROJECTION_MORPH_KEY, from);
  map.setProjection(MORPH_PROJECTION);
  map.addLayer(projectionLayer);

  function finish(completed: boolean) {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(animationFrame);
    unsubscribe();
    map.setProjection(completed ? { type: toFlat ? "mercator" : "globe" } : initialProjection);
    if (map.getLayer(projectionLayer.id)) map.removeLayer(projectionLayer.id);
    map.setGlobalStateProperty(PROJECTION_MORPH_KEY, null);
    overlay.setProps({ views: null, layers: useLayerStore.getState().layers.map(({ layer }) => layer) });
    if (completed) onComplete();
  }

  // Let the shared projection data render once before starting the clock.
  let started: number | undefined;
  function animate(time: number) {
    if (!frame.data) { animationFrame = requestAnimationFrame(animate); return; }
    started ??= time;
    const progress = Math.min(1, (time - started) / GLOBE_CONTROLS.transitionDuration);
    const eased = progress * progress * (3 - 2 * progress);
    map.setGlobalStateProperty(PROJECTION_MORPH_KEY, from + (to - from) * eased);
    if (progress < 1) animationFrame = requestAnimationFrame(animate);
    else map.once("render", onFinalRender);
  }
  function onFinalRender() { finish(true); }
  animationFrame = requestAnimationFrame(animate);
  return () => { map.off("render", onFinalRender); finish(false); };
}
