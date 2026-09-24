
import { useCallback, useState } from "react";

import { constrainNumberInput, getNumberInputError } from "@/utils/input/number-input";

import type { ChangeEvent } from "react";
import type { INumberInputOptions } from "@/components/input/input-number";

export function useNumberInput({
  defaultValue,
  min,
  max,
  step,
  disabled,
  onChange,
}: INumberInputOptions) {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(String(defaultValue));
  const [validationError, setValidationError] = useState("");

  const onSetValue = useCallback(
    (nextValue: number) => {
      const constrainedValue = constrainNumberInput(nextValue, min, max);
      setValue(constrainedValue);
      setInputValue(String(constrainedValue));
      setValidationError("");
      onChange?.(constrainedValue);
    },
    [max, min, onChange],
  );
  const onIncrement = useCallback(() => {
    if (!disabled) onSetValue(value + step);
  }, [disabled, onSetValue, step, value]);
  const onDecrement = useCallback(() => {
    if (!disabled) onSetValue(value - step);
  }, [disabled, onSetValue, step, value]);
  const onInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setValidationError("");
  }, []);
  const onInputBlur = useCallback(() => {
    const error = getNumberInputError(inputValue, min, max);
    if (error) {
      setValidationError(error);
      return;
    }
    onSetValue(Number.parseFloat(inputValue));
  }, [inputValue, max, min, onSetValue]);

  return {
    inputValue,
    validationError,
    isMinDisabled: min !== undefined && value <= min,
    isMaxDisabled: max !== undefined && value >= max,
    onIncrement,
    onDecrement,
    onInputChange,
    onInputBlur,
  };
}