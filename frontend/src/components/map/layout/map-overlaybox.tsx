
"use client";
import React, { useCallback, useMemo } from "react";
import { ResizeBox, ResizeChildren } from "@/components/core/custom-resize-box";

interface MapOverlayBoxProps {
  resizeDirections?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topRight?: boolean;
    topLeft?: boolean;
    bottomRight?: boolean;
    bottomLeft?: boolean;
  };
  initialWidth?: number | string;
  initialHeight?: number | string;
  children: React.ReactNode;
  className?: string;
  classNameChildren?: string;
  collapsed?: boolean;
  collapsibleDirection?: "vertical" | "horizontal";
  collapsedHeight?: number | string | "auto";
  collapsedWidth?: number | string | "auto";
}

export default function MapOverlayBox({
  resizeDirections = {
    bottom: true,
    left: true,
    bottomLeft: true,
  },
  initialWidth = 300,
  initialHeight = "auto",
  children,
  className = "",
  classNameChildren = "",
  collapsed = false,
  collapsibleDirection = "vertical",
  collapsedHeight = 0,
  collapsedWidth = 0,
}: MapOverlayBoxProps) {
  // Memoize the children content
  const memoizedChildren = useMemo(() => children, [children]);

  // Memoize the render function
  const renderContentCallback = useCallback(
    () => (
      <>
        <ResizeChildren className={`inherit ${classNameChildren}`}>
          {memoizedChildren}
        </ResizeChildren>
      </>
    ),
    [classNameChildren, memoizedChildren]
  );

  return (
    <ResizeBox
      resizeDirections={resizeDirections}
      initialWidth={initialWidth}
      initialHeight={initialHeight}
      className={`project-map-overlay-box !pointer-events-auto relative bg-background rounded-sm bg-background/50 backdrop-blur-md ${className}`}
      renderContent={renderContentCallback}
      collapsibleDirection={collapsibleDirection}
      collapsed={collapsed}
      collapsedHeight={collapsedHeight}
      collapsedWidth={collapsedWidth}
    />
  );
}