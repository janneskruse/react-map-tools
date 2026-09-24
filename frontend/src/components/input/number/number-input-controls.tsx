"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/core/button";
import { cn } from "@/utils/shadcn-utils";

interface INumberInputControlsProps {
  disabled?: boolean;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  orientation?: "vertical" | "horizontal";
}

export function NumberInputControls({
  disabled,
  decrementDisabled,
  incrementDisabled,
  onDecrement,
  onIncrement,
  orientation = "vertical",
}: INumberInputControlsProps) {
  return (
    <div className={cn("flex", orientation === "vertical" && "flex-col")}>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Increase value"
        disabled={disabled || incrementDisabled}
        onClick={onIncrement}
      >
        <ChevronUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Decrease value"
        disabled={disabled || decrementDisabled}
        onClick={onDecrement}
      >
        <ChevronDown />
      </Button>
    </div>
  );
}
