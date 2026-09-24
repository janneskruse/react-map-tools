// Tremor getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0);
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

// modified Tremor hasOnlyOneValueForKey [v0.1.0]

interface StringKeyObject {
  [key: string]: number | string | boolean | null | undefined;
}

export function hasOnlyOneValueForKey(
  array: object[],
  keyToCheck: string
): boolean {
  const values: (number | string | boolean | null | undefined)[] = [];

  for (const obj of array) {
    if (
      typeof obj === "object" &&
      obj !== null &&
      Object.prototype.hasOwnProperty.call(obj, keyToCheck)
    ) {
      const value = (obj as StringKeyObject)[keyToCheck];
      values.push(value);
      if (values.length > 1) return false;
    }
  }

  return true;
}

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue",
]