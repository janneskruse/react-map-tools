"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import { Play } from "lucide-react";

import { Button } from "@/components/core/button";
import { Switch } from "@/components/input/switch";
import MapOverlayBox from "@/components/map/layout/map-overlaybox";
import { useProjectLayoutStore } from "@/hooks/project/use-project-layout";
import type { useGlobeControls } from "@/hooks/map/use-globe-controls";

interface IGlobeControlsProps {
  controls: ReturnType<typeof useGlobeControls>;
}

export function GlobeControls({ controls }: IGlobeControlsProps) {
  const target = useProjectLayoutStore((state) => state.targets.mapCenterUp);
  const id = useId();
  if (!target) return null;
  const disabled = !controls.ready || !controls.isGlobe || controls.transitioning;
  const transitionLabel = controls.isGlobe ? "Transition to 2D" : "Return to globe";

  return createPortal(
    <MapOverlayBox initialWidth="fit-content" className="w-fit max-w-full" resizeDirections={{}}>
      <section aria-label="Globe controls" className="flex flex-col gap-3 p-3 text-sm">
        <div className="flex items-center justify-between gap-6">
          <label htmlFor={`${id}-rotate`}>Rotate globe</label>
          <Switch id={`${id}-rotate`} checked={controls.rotate} onCheckedChange={controls.setRotate} disabled={disabled} />
        </div>
        <div className="flex items-center justify-between gap-6">
          <label htmlFor={`${id}-pitch`}>Smooth pitch zoom</label>
          <Switch id={`${id}-pitch`} checked={controls.smoothPitch} onCheckedChange={controls.setSmoothPitch} disabled={disabled} />
        </div>
        <div className="flex items-center justify-between gap-6">
          <span>{transitionLabel}</span>
          <Button variant="ghost" size="icon-xs" aria-label={transitionLabel}
            disabled={!controls.ready || controls.transitioning} onClick={controls.onTransition}>
            <Play />
          </Button>
        </div>
      </section>
    </MapOverlayBox>, target,
  );
}
