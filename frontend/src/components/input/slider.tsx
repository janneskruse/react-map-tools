
"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/utils/shadcn-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip";
interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  className?: string;
  classNameSlider?: string;
  classNameThumb?: string;
  classNameTrack?: string;
  classNameRange?: string;
  classNameTooltipContent?: string;
  classNameTooltipArrow?: string;
  defaultValue?: number[]; // single value: [50], range: [20, 80]
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  showTooltip?: boolean;
  showMarks?: boolean;
  showLabels?: boolean;
  step?: number;
  marksStep?: number;
}

function Slider({
  className,
  classNameSlider,
  classNameThumb,
  classNameTrack,
  classNameRange,
  classNameTooltipContent,
  classNameTooltipArrow,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  marksStep,
  showTooltip = false,
  showMarks = false,
  showLabels = false,
  onValueChange,
  ...props
}: SliderProps) {

  const stringifiedValue = JSON.stringify(value);
  const stringifiedDefaultValue = JSON.stringify(defaultValue);

  const initialValues = React.useMemo(() => {
    const parsedValue = stringifiedValue
      ? JSON.parse(stringifiedValue)
      : undefined;
    const parsedDefaultValue = stringifiedDefaultValue
      ? JSON.parse(stringifiedDefaultValue)
      : undefined;
    return Array.isArray(parsedValue)
      ? parsedValue
      : Array.isArray(parsedDefaultValue)
        ? parsedDefaultValue
        : [min];
  }, [stringifiedValue, stringifiedDefaultValue, min]);

  const [currentValues, setCurrentValues] =
    React.useState<number[]>(initialValues);
  const [showTooltipState, setShowTooltipState] = React.useState(false);
  const currentValuesRef = React.useRef<number[]>(currentValues);
  const isInternalUpdateRef = React.useRef(false);

  // Sync currentValues with external value changes
  React.useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    if (value && Array.isArray(value)) {
      const hasChanged = value.some(
        (val, idx) => val !== currentValuesRef.current[idx]
      );

      if (hasChanged) {
        console.log("Slider: Syncing values from external change:", { value });
        setCurrentValues(value);
        currentValuesRef.current = value;
      }
    }
  }, [value]);

  // log currentvalues change
  React.useEffect(() => {
    console.log("Slider: currentValues changed:", { currentValues });
  }, [currentValues]);

  const marksCount = React.useMemo(() => {
    if (!showMarks || !step) return 0;
    if (!marksStep) {
      return Math.floor((max - min) / step) + 1;
    }
    return Math.floor((max - min) / marksStep) + 1;
  }, [showMarks, marksStep, step, min, max]);

  const onPointerDown = () => {
    if (showTooltip) setShowTooltipState(true);
  };

  const onPointerUp = React.useCallback(() => {
    if (showTooltip) setShowTooltipState(false);
  }, [showTooltip]);

  React.useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerUp]);

  const onValueChangeInternal = (newValues: number[]) => {
    isInternalUpdateRef.current = true;
    setCurrentValues(newValues);
    currentValuesRef.current = newValues;
    onValueChange?.(newValues);
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={initialValues}
      value={currentValues}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChangeInternal}
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        classNameSlider,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-accent relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3",
          classNameTrack
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-muted absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            classNameRange
          )}
        />
      </SliderPrimitive.Track>

      {showMarks && marksCount > 0 && (
        <div className="absolute inset-0 flex grow w-full items-center justify-between px-[7px] pointer-events-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:py-[7px] data-[orientation=vertical]:px-0">
          {Array.from({ length: marksCount }).map((_, index) => (
            <div
              key={index}
              className="bg-muted rounded-full w-[1px] h-2 data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-1"
            />
          ))}
        </div>
      )}

      {currentValues.map((currentValue, index) => {
        const thumb = (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className={cn(
              "bg-mainWeak/70 ring-ring/50 block h-5 w-1.5 shrink-0 rounded-sm border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
              classNameThumb
            )}
            onMouseEnter={() => showTooltip && setShowTooltipState(true)}
            onMouseLeave={() => showTooltip && setShowTooltipState(false)}
          />
        );

        if (!showTooltip) return thumb;

        return (
          <TooltipProvider key={index}>
            <Tooltip open={showTooltip && showTooltipState}>
              <TooltipTrigger asChild>{thumb}</TooltipTrigger>
              <TooltipContent
                className={cn("bg-accent mb-2", classNameTooltipContent || "")}
                classNameArrow={cn("!hidden", classNameTooltipArrow || "")}
              >
                {currentValue?.toString()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </SliderPrimitive.Root>
    {showLabels && (
      <div className="flex w-full justify-between px-1">
        <span className="text-sm text-contrast/70">{min}</span>
        <span className="text-sm text-contrast/70">{max}</span>
      </div>
    )}
    </div>
  );
}

export { Slider };