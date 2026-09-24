"use client";

import { createPortal } from "react-dom";

import MapOverlayBox from "@/components/map/layout/map-overlaybox";
import { cn } from "@/utils/shadcn-utils";
import { Slider } from "@/components/input/slider";
import { useProjectLayoutStore } from "@/hooks/project/use-project-layout";
import useLayerStore from "@/store/layer";

interface ILayerTimeSliderProps {
  className?: string;
}

export function LayerTimeSlider({ className }: ILayerTimeSliderProps) {
  const target = useProjectLayoutStore((state) => state.targets.mapCenterBottom);
  const showTimeSlider = useLayerStore((state) => state.showTimeSlider);
  const years = useLayerStore((state) => state.years);
  const year = useLayerStore((state) => state.selectedYear);
  const status = useLayerStore((state) => state.status);
  const error = useLayerStore((state) => state.error);
  const setYear = useLayerStore((state) => state.setSelectedYear);
  if (!target) return null;
  return createPortal(
    <MapOverlayBox
      initialWidth="100%"
      className={cn("w-full min-w-0 max-w-180", showTimeSlider ? "flex" : "!hidden", className)}
      classNameChildren="relative w-full h-full px-2"
      resizeDirections={{
        right: false,
        left: false,
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
      }}
    >
      <section
        aria-label="Hexagon timeline"
        className="flex w-full flex-col gap-3 p-4 px-2"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-medium">H3 hexagons · {year}</h2>
          <span className="text-xs text-muted-foreground">
            Synthetic annual values
          </span>
        </div>
        {status === "ready" ? (
          <Slider
            aria-label="Year"
            min={years[0]}
            max={years[years.length - 1]}
            value={[year]}
            step={1}
            showTooltip
            showMarks
            showLabels
            onValueChange={([value]) => setYear(value)}
          />
        ) : (
          <p
            role={error ? "alert" : "status"}
            className="text-sm text-muted-foreground"
          >
            {error ?? "Loading timeline…"}
          </p>
        )}
      </section>
    </MapOverlayBox>,
    target,
  );
}

export default LayerTimeSlider;
