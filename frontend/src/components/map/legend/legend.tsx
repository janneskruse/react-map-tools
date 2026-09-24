
"use client";
import React from "react";

import { ProjectLegend } from "@/components/map/legend/project-legend";
import MapOverlayBox from "@/components/map/layout/map-overlaybox";

import useLayerStore from "@/store/layer";
import { cn } from "@/utils/shadcn-utils";

type LegendProps = {
  title?: string;
  isProjectLegend?: boolean;
  className?: string;
};

export function Legend({ className = "", title = "Legend" }: LegendProps) {
  const showLegend = useLayerStore((state) =>
    state.layers.some((entry) => entry.layer.props.visible),
  );

  return (
    <MapOverlayBox
      className={cn("max-w-150", className, showLegend ? "flex" : "!hidden")}
      classNameChildren="relative w-full h-full p-3"
      resizeDirections={{
        right: true,
        left: true,
        top: true,
        topLeft: true,
        topRight: true,
      }}
    >
      {title && <p className="">{title}</p>}
      <ProjectLegend />
    </MapOverlayBox>
  );
}
