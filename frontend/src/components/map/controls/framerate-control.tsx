
"use client";
import React, { useEffect, useRef, useState, memo } from "react";

import { Gauge } from "lucide-react";

import { Button } from "@/components/core/button";
import FrameRateControl from "@/utils/map/framerate-control";
import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";

import useMapStore from "@/store/map-state";
import { cn } from "@/utils/shadcn-utils";

interface IFramePerfromanceControlProps {
  mapId?: string;
  className?: string;
}

const FramePerfromanceControl = ({
  mapId = "project-map",
  className = "",
}: IFramePerfromanceControlProps) => {
  /////////// useStates and refs ////////////////////////////////
  const map = useMapStore((state) => state.getMap(mapId));
  const isLoaded = useMapStore((state) => state.getIsLoaded(mapId));
  const [visible, setVisible] = useState(false);
  const initialized = useRef(false);
  const frameRateControlRef = useRef(null);

  useEffect(() => {
    if (map && isLoaded) {
      if (visible && !initialized.current) {
        if (!frameRateControlRef.current) {
          //@ts-expect-error FrameRateControl is not typed
          frameRateControlRef.current = new FrameRateControl();
        }
        if (!frameRateControlRef.current) return;
        map.addControl(frameRateControlRef.current);
        initialized.current = true;
      } else if (!visible && initialized.current) {
        if (frameRateControlRef.current) {
          map.removeControl(frameRateControlRef.current);
        }
        initialized.current = false;
      }
    }
  }, [visible, map, isLoaded]);

  //////////// return the component ////////////////////////////////
  return (
    <TooltipWrapper content="Map Framerate control" side="left">
      <Button
        aria-label="Toggle framerate display"
        variant="ghost"
        size="icon"
        onClick={() => {
          setVisible(!visible);
        }}
        className={cn(
          "h-7 w-full rounded-none",
          visible && "bg-secondary hover:bg-secondary",
          className,
        )}
      >
        <Gauge size={18} />
      </Button>
    </TooltipWrapper>
  );
};

export default memo(FramePerfromanceControl);
