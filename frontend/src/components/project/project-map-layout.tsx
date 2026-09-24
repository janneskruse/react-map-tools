
"use client";

import { memo, useRef } from "react";

import ProjectMap from "@/components/project/project-map";
import MapLayout, {
  MapLayoutWrapper,
} from "@/components/map/layout/map-layout";
import MapControlContainer, {
  MapControlBox,
} from "@/components/map/layout/map-controlbox";
import { ProjectNav } from "@/components/layout/project-nav";
import SplitMapControl from "@/components/map/controls/split-map-control";
import FramerateControl from "@/components/map/controls/framerate-control";
import NavigationControl from "@/components/map/controls/navigation-control";
import FullscreenControl from "@/components/map/controls/fullscreen-control";
import { useLayoutTargetRef } from "@/hooks/project/use-project-layout";
import type { TProjectData } from "@/types/project";

interface IProjectMapLayoutProps {
  projectId: string;
  projectData?: TProjectData | null;
  className?: string;
}

export function ProjectMapLayout({
  projectId,
  projectData,
  className,
}: IProjectMapLayoutProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRightRef = useLayoutTargetRef("mapRight");
  const mapCenterUpRef = useLayoutTargetRef("mapCenterUp");
  const mapCenterBottomRef = useLayoutTargetRef("mapCenterBottom");
  return (
    <MapLayoutWrapper className={className} ref={wrapperRef}>
      <MapLayout>
        <ProjectNav projectId={projectId} />
        <div className="relative flex h-full max-h-[97%] min-w-0 flex-1 flex-col items-center justify-between">
          <div ref={mapCenterUpRef} data-layout-target="mapCenterUp" className="flex w-full justify-end" />
          <div
            ref={mapCenterBottomRef}
            data-layout-target="mapCenterBottom"
            className="flex min-h-0 w-full min-w-0 flex-1 items-end justify-center"
          />
        </div>
        <div className="flex h-full items-start gap-2">
          <div ref={mapRightRef} className="pointer-events-auto empty:hidden" />
          <MapControlContainer className="min-w-7">
            <NavigationControl />
            <MapControlBox>
              <FullscreenControl fullscreenContainerRef={wrapperRef} />
            </MapControlBox>
            <MapControlBox>
              <SplitMapControl className="h-7 w-full"/>
            </MapControlBox>
            <MapControlBox>
              <FramerateControl />
            </MapControlBox>
          </MapControlContainer>
        </div>
      </MapLayout>
      <ProjectMap projectData={projectData} />
    </MapLayoutWrapper>
  );
}

export default memo(ProjectMapLayout);
