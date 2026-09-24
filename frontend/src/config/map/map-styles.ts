import type { TMapStylesConfig } from "@/types/map-styles";

// App credit is added alongside each basemap’s source attribution.
export const MAP_CUSTOM_ATTRIBUTION = "&copy; Jannes Kruse | React map tools";

export const MAP_BASESTYLES: Record<string, TMapStylesConfig> = {
  bright: {
    name: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright",
    attribution: "© OpenStreetMap contributors",
  },
  light: {
    name: "Light",
    url: "https://tiles.openfreemap.org/styles/positron",
    attribution: "© OpenStreetMap contributors",
  },
  "google-satellite": {
    name: "Google Satellite",
    url: "/map/styles/google-satellite.json",
    attribution: "Map data ©2023 Google",
  },
  transparent: {
    name: "Transparent",
    url: "/map/styles/transparent.json",
    attribution: null,
  },
};
