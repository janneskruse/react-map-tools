// Tremor chartColors [v0.1.0]

export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  blue: {
    bg: "bg-blue",
    stroke: "stroke-blue",
    fill: "fill-blue",
    text: "text-blue",
  },
  red : {
    bg: "bg-red",
    stroke: "stroke-red",
    fill: "fill-red",
    text: "text-red",
  },
  green: {
    bg: "bg-green",
    stroke: "stroke-green",
    fill: "fill-green",
    text: "text-green",
  },
  yellow: {
    bg: "bg-yellow",
    stroke: "stroke-yellow",
    fill: "fill-yellow",
    text: "text-yellow",
  },
  purple: {
    bg: "bg-purple",
    stroke: "stroke-purple",
    fill: "fill-purple",
    text: "text-purple",
  },
  pink: {
    bg: "bg-pink",
    stroke: "stroke-pink",
    fill: "fill-pink",
    text: "text-pink",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

export function getBalancedColor(
  value: number,
  colorsBalance: AvailableChartColorsKeys[],
  category: string,
  categoryColors: Map<string, AvailableChartColorsKeys>
): AvailableChartColorsKeys {
  if (!colorsBalance || colorsBalance.length < 2) {
    return categoryColors.get(category) as AvailableChartColorsKeys;
  }
  return value >= 0 ? colorsBalance[0] : colorsBalance[1];
}