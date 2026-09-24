
"use client";

import { memo } from "react";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import WebGLSupport from "@/components/map/alerts/webgl-support";
import { useMap } from "@/hooks/map/use-map";
import { cn } from "@/utils/shadcn-utils";
import { MAP_BASESTYLES } from "@/config/map/map-styles";

interface IMapProps {
  id?: string;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  maxZoom?: number;
  minZoom?: number;
  maxPitch?: number;
  center?: [number, number];
  maxBounds?: [number, number, number, number];
  projection?: string;
  basemap?: string;
  style?: StyleSpecification | string;
  className?: string;
  classNameMapDiv?: string;
}

export function Map({
  id = "project-map",
  zoom = 10,
  pitch = 45,
  bearing = 0,
  maxZoom = 20,
  minZoom = 0,
  maxPitch = 75,
  center = [-122.41669, 37.7853],
  maxBounds,
  projection = "globe",
  basemap = "light",
  style,
  className,
  classNameMapDiv,
}: IMapProps) {
  const { mapDivRef, comparisonRef, gpuError, setGpuError } = useMap({
    id,
    zoom,
    pitch,
    bearing,
    maxZoom,
    minZoom,
    maxPitch,
    longitude: center[0],
    latitude: center[1],
    maxBounds,
    projection,
    mapStyle: style ?? MAP_BASESTYLES[basemap]?.url ?? MAP_BASESTYLES.light.url,
  });
  return (
    <div
      id={`comparisonMapDiv-${id}`}
      ref={comparisonRef}
      data-projection={projection}
      className={cn("map-scene relative isolate z-0 h-full w-full overflow-hidden", className)}
    >
      <WebGLSupport
        open={gpuError !== null}
        onOpenChange={(open) => {
          if (!open) setGpuError(null);
        }}
      />
      {/* Keep deck/native controls below the comparison handle's stacking context. */}
      <div
        ref={mapDivRef}
        style={{ position: "absolute", inset: 0, isolation: "isolate", zIndex: 0 }}
        className={cn("h-full w-full", classNameMapDiv)}
      />
    </div>
  );
}

export default memo(Map);
