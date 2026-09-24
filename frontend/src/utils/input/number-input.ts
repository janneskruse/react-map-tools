
export function constrainNumberInput(value: number, min?: number, max?: number): number {
  if (Number.isNaN(value)) return constrainNumberInput(0, min, max);
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

export function getNumberInputError(value: string, min?: number, max?: number): string {
  if (value === "" || value === "-") return "Value is required";
  const numericValue = Number.parseFloat(value);
  if (Number.isNaN(numericValue)) return "Please enter a valid number";
  if (min !== undefined && numericValue < min) return `Value must be at least ${min}`;
  if (max !== undefined && numericValue > max) return `Value must be at most ${max}`;
  return "";
}