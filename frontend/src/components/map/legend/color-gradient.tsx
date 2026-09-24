
"use client";
import React from "react";

import { rgbToHex } from "@/utils/data/colormap";

import type { RGB } from "@/types/color";

import { cn } from "@/utils/shadcn-utils";

type ColorGradientProps = {
  colormap: RGB[];
  hasLabels?: boolean;
  minValue?: number;
  maxValue?: number;
  className?: string;
  dtype?: string;
};

export function ColorGradient({
  className = "",
  hasLabels = false,
  minValue,
  maxValue,
  colormap,
  dtype,
}: ColorGradientProps) {
  const hexColors = colormap.map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]));
  const gradientString = `linear-gradient(to right, ${hexColors.join(", ")})`;

  const labelRange =
    maxValue !== undefined && minValue !== undefined
      ? maxValue - minValue
      : null;
  const numberOfLabels = 5;
  const labels =
    labelRange !== null
      ? Array.from({ length: numberOfLabels }, (_, index) => {
          const value = minValue! + (labelRange / (numberOfLabels - 1)) * index;
          return (
            <p key={index}>
              {dtype === "int" ? Math.round(value) : value.toFixed(2)}
            </p>
          );
        })
      : null;

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div
        className={cn("relative flex w-full h-8 rounded-xs", className)}
        style={{ background: gradientString }}
      />
      {hasLabels && labels && (
        <div className="flex justify-between w-full text-sm">{labels}</div>
      )}
    </div>
  );
}
