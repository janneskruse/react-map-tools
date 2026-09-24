import type { CustomLayerInterface, Map } from "maplibre-gl";

import { drawGlobeHalo } from "@/utils/map/draw-globe-halo";
import { getGlobeSilhouette } from "@/utils/map/globe-silhouette";

/** One separate halo supplies the atmosphere; neither split WebGL canvas is filtered. */
export function attachSplitMapAtmosphere(map: Map, host: HTMLElement) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return () => {};
  canvas.classList.add("map-split-atmosphere");
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);
  host.setAttribute("data-split-atmosphere", "");
  let previousOutline = "";
  let previousColor = "";

  // Public projection data gives us the horizon without reading map pixels or
  // private map internals. This layer makes no WebGL draw calls of its own.
  const layer: CustomLayerInterface = {
    id: "react-map-tools-split-atmosphere",
    type: "custom",
    render(_gl, { defaultProjectionData }) {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const resized = canvas.width !== width || canvas.height !== height;
      // The soft halo needs only CSS-pixel resolution, even on a Retina screen.
      if (resized) { canvas.width = width; canvas.height = height; }
      const outline = getGlobeSilhouette(defaultProjectionData, width, height);
      const color = getComputedStyle(canvas).color;
      if (!resized && outline === previousOutline && color === previousColor) return;
      drawGlobeHalo(context, outline, color, width, height);
      previousOutline = outline;
      previousColor = color;
    },
    onRemove() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      previousOutline = "";
      previousColor = "";
    },
  };

  function install() {
    if (!map.getLayer(layer.id)) map.addLayer(layer);
  }
  map.on("style.load", install);
  install();

  // An idle map still needs one redraw when its CSS atmosphere color changes.
  const themeObserver = new MutationObserver(() => map.triggerRepaint());
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class", "style"],
  });

  return () => {
    themeObserver.disconnect();
    map.off("style.load", install);
    if (map.getLayer(layer.id)) map.removeLayer(layer.id);
    canvas.remove();
    host.removeAttribute("data-split-atmosphere");
  };
}
