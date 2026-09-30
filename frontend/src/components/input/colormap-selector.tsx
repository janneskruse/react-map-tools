"use client";

import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/input/select";
import { ColorGradient } from "@/components/map/legend/color-gradient";

import { cn } from "@/utils/shadcn-utils";
import type { IColormapOption, RGB } from "@/types/color";

interface IColormapSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly IColormapOption[];
  getColormap: (value: string) => RGB[];
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function ColormapSelector({
  value,
  onValueChange,
  options,
  getColormap,
  id,
  className,
  disabled,
}: IColormapSelectorProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const selected = options.find((option) => option.id === value);

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <label htmlFor={controlId} className="text-sm">
        <span className="sr-only">Colormap: </span>
        {selected?.label ?? "Choose a colormap"}
      </label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={controlId} className="w-full" size="sm">
          <span aria-hidden="true" className="min-w-0 flex-1">
            {selected && (
              <ColorGradient colormap={getColormap(value)} className="h-4" />
            )}
          </span>
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                textValue={option.label}
              >
                <span className="flex min-w-40 flex-col gap-1">
                  <span>{option.label}</span>
                  <span aria-hidden="true">
                    <ColorGradient
                      colormap={getColormap(option.id)}
                      className="h-4"
                    />
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
