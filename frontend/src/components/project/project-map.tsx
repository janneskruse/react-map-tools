
"use client";

import { memo } from "react";

import Map from "@/components/map/map";
import { GlobeControls } from "@/components/map/controls/globe-controls";
import { useGlobeControls } from "@/hooks/map/use-globe-controls";
import { LayerTimeSlider } from "@/components/map/interaction/layer-time-slider";
import { useProjectLayers } from "@/hooks/map/use-project-layers";
import type { TProjectData } from "@/types/project";

interface IProjectMapProps {
  projectData?: TProjectData | null;
  className?: string;
}

export function ProjectMap({ projectData, className }: IProjectMapProps) {
  useProjectLayers();
  const globeControls = useGlobeControls();
  return (
    <>
      <Map
        center={projectData?.center}
        zoom={11}
        pitch={0}
        basemap="light"
        projection={globeControls.projection}
        className={className}
      />
      <LayerTimeSlider />
      <GlobeControls controls={globeControls} />
    </>
  );
}

export default memo(ProjectMap);
