"use client";

import { Columns3, PanelBottom, PanelRight } from "lucide-react";

import { Button } from "@/components/core/button";
import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";
import { useProjectLayoutStore } from "@/hooks/project/use-project-layout";

export function ProjectLayoutControls() {
  const panels = useProjectLayoutStore((state) => state.panels);
  const setPanelOpen = useProjectLayoutStore((state) => state.setPanelOpen);
  return (
    <div className="flex gap-1">
      <TooltipWrapper content="Bottom panel">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle bottom panel"
          aria-pressed={panels.bottom}
          onClick={() => setPanelOpen("bottom", !panels.bottom)}
        >
          <PanelBottom />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Right panel">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle right panel"
          aria-pressed={panels.right}
          onClick={() => setPanelOpen("right", !panels.right)}
        >
          <PanelRight />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content="Second right panel">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle second right panel"
          aria-pressed={panels.secondaryRight}
          onClick={() => setPanelOpen("secondaryRight", !panels.secondaryRight)}
        >
          <Columns3 />
        </Button>
      </TooltipWrapper>
    </div>
  );
}
