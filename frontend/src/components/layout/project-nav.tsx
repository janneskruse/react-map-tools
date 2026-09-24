
"use client";

import * as React from "react";
import { Layers } from "lucide-react";

import { MapDrawer } from "@/components/map/layout/map-drawer";
import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";
import ModeToggle from "@/components/core/mode-toggle";
import { Separator } from "@/components/core/separator";
import { Button } from "@/components/core/button";
import { LayerPanel } from "@/components/project/panels/layer-panel";
import { useProjectLayoutStore } from "@/hooks/project/use-project-layout";
import { cn } from "@/utils/shadcn-utils";

interface IProjectNavProps extends React.HTMLAttributes<HTMLDivElement> {
  projectId: string;
}

// Retain the original item-driven navigation; Layers is the starter's panel.
const navItemsDict = [
  {
    id: "layers",
    title: "Layers",
    icon: <Layers className="h-4 w-4" />,
    window: () => <LayerPanel />,
  },
];

export function ProjectNav({
  projectId,
  className,
  ...props
}: IProjectNavProps) {
  const showDrawer = useProjectLayoutStore((state) => state.showDrawer);
  const setShowDrawer = useProjectLayoutStore((state) => state.setShowDrawer);
  const [window, setWindow] = React.useState("layers");

  return (
    <div
      {...props}
      aria-label="Project navigation"
      data-project-id={projectId}
      className={cn(
        "relative flex flex-row h-full w-fit min-w-fit min-h-[97%] max-h-[97%] pointer-events-auto overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col min-w-12 max-w-12 w-12 min-h-full h-full justify-between bg-background rounded-l-md overflow-hidden p-2",
          !showDrawer && "rounded-md",
        )}
      >
        <div className="flex flex-col w-full h-full gap-2 items-center justify-start overflow-y-auto">
          {navItemsDict.map((item) => (
            <TooltipWrapper key={item.id} content={item.title} side="right">
              <Button
                variant="ghost"
                size="icon"
                aria-label={item.title}
                aria-pressed={window === item.id}
                aria-expanded={showDrawer && window === item.id}
                onClick={() => {
                  setWindow(item.id);
                  setShowDrawer(true);
                }}
                className={cn(
                  "w-full h-8 rounded-sm p-[7px]",
                  window === item.id &&
                    "bg-secondary hover:bg-secondary text-white hover:text-white",
                )}
              >
                {item.icon}
              </Button>
            </TooltipWrapper>
          ))}
        </div>
        <div className="flex flex-col items-center justify-end gap-4 mb-4">
          <Separator className="w-full" />
          <ModeToggle className="bg-muted-foreground/20 h-8 !w-8" small />
        </div>
      </div>
      <MapDrawer
        className="rounded-l-none"
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
      >
        {navItemsDict.map((item) =>
          item.id === window ? (
            <React.Fragment key={item.id}>{item.window()}</React.Fragment>
          ) : null,
        )}
      </MapDrawer>
    </div>
  );
}
