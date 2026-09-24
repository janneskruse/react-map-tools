
"use client";

import type { StyleSpecification } from "maplibre-gl";
import "@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css";

import { useSplitMap } from "@/hooks/map/use-split-map";

interface ISplitMapProps {
  mapId?: string;
  splitView: boolean;
  splitMapStyle: StyleSpecification | string | undefined;
}

export function SplitMap({
  mapId = "project-map",
  splitView,
  splitMapStyle,
}: ISplitMapProps) {
  useSplitMap(mapId, splitView, splitMapStyle);
  return null;
}
export default SplitMap;
