
"use client";

import { Moon, Sun } from "lucide-react";

import TooltipWrapper from "@/components/core/custom-tooltip-wrapper";
import { Button } from "@/components/core/button";
import { useColorMode } from "@/hooks/base/use-color-mode";

interface IColorModeToggleProps {
  shadcnButton?: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  small?: boolean;
  className?: string;
}

export default function ModeToggle({
  tooltipSide = "right",
  small = false,
  className,
}: IColorModeToggleProps) {
  const { selectedTheme, onToggle } = useColorMode();
  const label =
    selectedTheme === "light" ? "Switch to dark mode" : "Switch to light mode";
  return (
    <TooltipWrapper side={tooltipSide} content={label}>
      <Button
        variant="ghost"
        size={small ? "icon-sm" : "icon"}
        className={className}
        aria-label={label}
        onClick={onToggle}
      >
        {selectedTheme === "light" ? <Moon /> : <Sun />}
      </Button>
    </TooltipWrapper>
  );
}
