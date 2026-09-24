
"use client";
import React from "react";

import { ArrowRightFromLine, ArrowLeftFromLine } from "lucide-react";

import { Button } from "@/components/core/button";
import MapOverlayBox from "@/components/map/layout/map-overlaybox";

type MapDrawerProps = {
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
};

export function MapDrawer({
  showDrawer = true,
  setShowDrawer,
  children,
  className = "",
}: MapDrawerProps) {
  return (
    <div className="relative flex w-fit h-full">
      <MapOverlayBox
        resizeDirections={{
          right: true,
        }}
        initialWidth="min(300px, 55vw)"
        initialHeight={"100%"}
        className={`relative flex w-fit h-full z-10 max-w-[55vw] sm:max-w-150 overflow-hidden ${className}`}
        classNameChildren="flex flex-col w-full h-full items-start"
        collapsibleDirection="horizontal"
        collapsed={!showDrawer}
        // collapsedWidth={"fit-content"}
      >
        {/* Main content area */}
        {children}
      </MapOverlayBox>
      <Button
        className="relative top-4 z-50 rounded-r-md rounded-l-none cursor-pointer !pointer-events-auto"
        variant="contrast"
        size={"icon"}
        aria-label={showDrawer ? "Close layers panel" : "Open layers panel"}
        onClick={() => setShowDrawer(!showDrawer)}
      >
        {showDrawer ? (
          <ArrowLeftFromLine className="w-4 h-4" />
        ) : (
          <ArrowRightFromLine className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
