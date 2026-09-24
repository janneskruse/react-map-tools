
"use client";
import type { InputHTMLAttributes } from "react";

import { TextInput } from "@/components/input/input-text";
import { NumberInputControls } from "@/components/input/number/number-input-controls";
import { useNumberInput } from "@/hooks/input/use-number-input";
import { cn } from "@/utils/shadcn-utils";

export interface INumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value" | "defaultValue"
> {
  id: string;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  classNameWrapper?: string;
  classNameInput?: string;
  classNameLabel?: string;
  classNameHelperText?: string;
  variant?: "default" | "inline";
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export interface INumberInputOptions {
  defaultValue: number;
  min?: number;
  max?: number;
  step: number;
  disabled: boolean;
  onChange?: (value: number) => void;
}

export function NumberInput({
  id,
  label,
  error,
  helperText,
  className,
  classNameWrapper,
  classNameInput,
  classNameLabel,
  classNameHelperText,
  variant = "default",
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  ...props
}: INumberInputProps) {
  const input = useNumberInput({
    defaultValue,
    min,
    max,
    step,
    disabled,
    onChange,
  });
  const displayError = error || input.validationError;

  return (
    <TextInput
      {...props}
      className={className}
      classNameWrapper={classNameWrapper}
      id={id}
      type="text"
      inputMode="decimal"
      value={input.inputValue}
      onChange={input.onInputChange}
      onBlur={input.onInputBlur}
      label={label}
      error={displayError}
      helperText={helperText}
      classNameInput={cn("text-center", classNameInput)}
      classNameLabel={classNameLabel}
      classNameHelperText={classNameHelperText}
      classNameEndAdornment="inset-y-0 right-0 flex h-auto"
      variant={variant}
      disabled={disabled}
      endAdornment={
        <NumberInputControls
          disabled={disabled}
          decrementDisabled={input.isMinDisabled}
          incrementDisabled={input.isMaxDisabled}
          onDecrement={input.onDecrement}
          onIncrement={input.onIncrement}
          orientation="vertical"
        />
      }
    />
  );
}
