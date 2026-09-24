import type { ProjectionSpecification } from "maplibre-gl";

export const PROJECTION_MORPH_KEY = "rmt-projection-flatness";
export const MORPH_PROJECTION: ProjectionSpecification = {
  type: ["interpolate", ["linear"], ["number", ["global-state", PROJECTION_MORPH_KEY], 0],
    0, "vertical-perspective", 1, "mercator"],
};

// Projection conventions follow MapLibre's public custom-layer projection data.
// https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/CustomRenderMethodInput/
export const H3_MORPH_SHADER = /* glsl */ `
layout(std140) uniform projectionMorphUniforms {
  mat4 globeMatrix;
  mat4 flatMatrix;
  vec4 clippingPlane;
  float globeness;
  float centerLongitude;
  float enabled;
} projectionMorph;

vec4 morph_project(vec3 lngLatHeight) {
  const float pi = 3.141592653589793;
  float longitude = radians(lngLatHeight.x);
  float latitude = radians(clamp(lngLatHeight.y, -85.051129, 85.051129));
  float cosLat = cos(latitude);
  vec3 sphere = vec3(sin(longitude) * cosLat, sin(latitude), cos(longitude) * cosLat);
  vec3 elevated = sphere * (1.0 + lngLatHeight.z / 6371008.8);
  vec4 globe = projectionMorph.globeMatrix * vec4(elevated, 1.0);
  vec2 mercator = vec2((lngLatHeight.x + 180.0) / 360.0,
    (1.0 - log(tan(pi / 4.0 + latitude / 2.0)) / pi) / 2.0);
  mercator.x += floor((projectionMorph.centerLongitude + 180.0) / 360.0 - mercator.x + 0.5);
  float altitude = lngLatHeight.z / (40030228.884 * cosLat);
  vec4 flatPosition = projectionMorph.flatMatrix * vec4(mercator, altitude, 1.0);
  return mix(flatPosition, globe, projectionMorph.globeness);
}
`;
