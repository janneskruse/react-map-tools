"use client";

import { useState } from "react";
import { SquareSplitHorizontal } from "lucide-react";

import { Button } from "@/components/core/button";
import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";
import SplitMap from "@/components/map/elements/split-map";
import { MAP_BASESTYLES } from "@/config/map/map-styles";

interface ISplitMapControlProps {
  className?: string;
}

export function SplitMapControl({ className }: ISplitMapControlProps) {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <TooltipWrapper content="Compare basemaps" side="left">
        <Button
          className={className}
          variant="ghost"
          size="icon"
          aria-label="Compare basemaps"
          aria-pressed={enabled}
          onClick={() => setEnabled(!enabled)}
        >
          <SquareSplitHorizontal />
        </Button>
      </TooltipWrapper>
      <SplitMap splitView={enabled} splitMapStyle={MAP_BASESTYLES.bright.url} />
    </>
  );
}
export default SplitMapControl;
