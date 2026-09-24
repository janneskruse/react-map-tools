
"use client";
import React, { useState, useEffect } from "react";

import { Fullscreen, Minimize } from "lucide-react";

import { Button } from "@/components/core/button";
import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";

interface FullscreenControlProps {
  fullscreenContainerRef?: React.RefObject<HTMLElement | null>;
  label?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const FullscreenControl = ({
  fullscreenContainerRef,
  label = "Open in fullscreen",
  tooltipSide = "left",
  className,
}: FullscreenControlProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreenContainerRef || !fullscreenContainerRef.current) return;

    if (isFullscreen) {
      fullscreenContainerRef.current.requestFullscreen();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }, [fullscreenContainerRef, isFullscreen]);

  // esc event listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <TooltipWrapper content={label} side={tooltipSide}>
      <Button
        className={`h-7 w-7 rounded-none ${className || ""}`}
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={() => {
          setIsFullscreen((prev) => !prev);
        }}
      >
        {isFullscreen ? <Minimize size={18} /> : <Fullscreen size={18} />}
      </Button>
    </TooltipWrapper>
  );
};

export default FullscreenControl;