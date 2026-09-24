declare module "@maplibre/maplibre-gl-compare" {
  import type { Map } from "maplibre-gl";
  export default class Compare {
    constructor(
      before: Map,
      after: Map,
      container: HTMLElement,
      options?: {
        mousemove?: boolean;
        orientation?: "horizontal" | "vertical";
      },
    );
    currentPosition: number;
    setSlider(position: number): void;
    remove(): void;
  }
}
