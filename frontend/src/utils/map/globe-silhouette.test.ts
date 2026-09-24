import { expect, it } from "vitest";
import type { CustomLayerProjectionData } from "maplibre-gl";

import { getGlobeSilhouette } from "./globe-silhouette";

function projection(): CustomLayerProjectionData {
  return {
    mainMatrix: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    fallbackMatrix: new Float32Array(16),
    clippingPlane: [0, 0, 1, 0],
    tileMercatorCoords: [0, 0, 1, 1],
    projectionTransition: 1,
    clipAntimeridian: false,
  };
}

it("projects the sphere's horizon into screen coordinates and follows the map matrix", () => {
  const data = projection();
  expect(getGlobeSilhouette(data, 200, 200)).toMatch(/^M0.00,100.00 /);
  data.mainMatrix[12] = 0.5;
  expect(getGlobeSilhouette(data, 200, 200)).toMatch(/^M50.00,100.00 /);
});

it("does not draw a globe in Mercator or with an empty viewport", () => {
  expect(getGlobeSilhouette({ ...projection(), projectionTransition: 0 }, 200, 200)).toBe("");
  expect(getGlobeSilhouette(projection(), 0, 200)).toBe("");
});

it("clips a horizon that crosses behind the camera without infinite coordinates", () => {
  const data = projection();
  data.mainMatrix[7] = 2;
  const path = getGlobeSilhouette(data, 200, 200);
  expect(path).not.toBe("");
  expect(path).not.toMatch(/NaN|Infinity/);
  const coordinates = path.match(/-?\d+\.\d+/g)!.map(Number);
  expect(coordinates.every(value => value >= -128.01 && value <= 328.01)).toBe(true);
});
