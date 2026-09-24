import type { CustomLayerProjectionData } from "maplibre-gl";
import type { TGlobeClipPoint } from "@/types/map";

/** Project the globe's horizon circle using MapLibre's public custom-layer data. */
export function getGlobeSilhouette(data: CustomLayerProjectionData, width: number, height: number) {
  if (data.projectionTransition < 0.999 || !width || !height) return "";
  const [a, b, c, d] = data.clippingPlane;
  const length = Math.hypot(a, b, c);
  if (!length) return "";
  const n = [a / length, b / length, c / length];
  const distance = -d / length;
  if (Math.abs(distance) >= 1) return "";
  const radius = Math.sqrt(1 - distance * distance);

  // Two perpendicular unit vectors span the horizon plane.
  const axis = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
  const u = [n[1] * axis[2] - n[2] * axis[1], n[2] * axis[0] - n[0] * axis[2], n[0] * axis[1] - n[1] * axis[0]];
  const uLength = Math.hypot(...u);
  for (let i = 0; i < 3; i++) u[i] /= uLength;
  const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
  const matrix = data.mainMatrix;
  let polygon: TGlobeClipPoint[] = [];
  for (let i = 0; i < 192; i++) {
    const angle = i * Math.PI * 2 / 192;
    const point = n.map((value, j) => value * distance + radius * (u[j] * Math.cos(angle) + v[j] * Math.sin(angle)));
    const [x, y, z] = point;
    polygon.push([
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
      matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15],
    ]);
  }

  // Clip before dividing by W: a pitched horizon can extend behind the camera.
  // The margin keeps the artificial clip edges and their shadows offscreen.
  const xLimit = 1 + 256 / width;
  const yLimit = 1 + 256 / height;
  for (const plane of [[0, 0, 1, -0.000001], [1, 0, xLimit, 0], [-1, 0, xLimit, 0], [0, 1, yLimit, 0], [0, -1, yLimit, 0]]) {
    const output: TGlobeClipPoint[] = [];
    for (let i = 0; i < polygon.length; i++) {
      const from = polygon[i];
      const to = polygon[(i + 1) % polygon.length];
      const fromDistance = from[0] * plane[0] + from[1] * plane[1] + from[2] * plane[2] + plane[3];
      const toDistance = to[0] * plane[0] + to[1] * plane[1] + to[2] * plane[2] + plane[3];
      if (fromDistance >= 0) output.push(from);
      if ((fromDistance >= 0) !== (toDistance >= 0)) {
        const t = fromDistance / (fromDistance - toDistance);
        output.push([from[0] + t * (to[0] - from[0]), from[1] + t * (to[1] - from[1]), from[2] + t * (to[2] - from[2])]);
      }
    }
    polygon = output;
  }
  if (polygon.length < 3) return "";
  return polygon.map(([x, y, w], i) => `${i ? "L" : "M"}${((x / w + 1) * width / 2).toFixed(2)},${((1 - y / w) * height / 2).toFixed(2)}`).join(" ") + " Z";
}
