import { LayerExtension, type Layer } from "@deck.gl/core";

import { H3_MORPH_SHADER } from "@/config/map/projection-morph";
import type { IProjectionMorphFrame } from "@/types/map";

/** H3's polygon sublayers use the basemap's matrices during a projection morph. */
export class H3ProjectionExtension extends LayerExtension<IProjectionMorphFrame> {
  static extensionName = "H3ProjectionExtension";

  getShaders() {
    return {
      modules: [{
        name: "projectionMorph",
        vs: H3_MORPH_SHADER,
        uniformTypes: {
          globeMatrix: "mat4x4<f32>", flatMatrix: "mat4x4<f32>",
          clippingPlane: "vec4<f32>", globeness: "f32", centerLongitude: "f32", enabled: "f32",
        } as const,
      }],
      inject: {
        "vs:#decl": "out float morph_horizon;",
        "fs:#decl": "in float morph_horizon;",
        "vs:#main-end": /* glsl */ `
          morph_horizon = 0.0;
          if (projectionMorph.enabled > 0.5) {
            float height = geometry.worldPosition.z;
            if (solidPolygon.extruded) {
              float fraction = 1.0;
              #ifdef IS_SIDE_VERTEX
                fraction = positions.y;
              #endif
              height += elevations * solidPolygon.elevationScale * fraction;
            }
            gl_Position = morph_project(vec3(geometry.worldPosition.xy, height));
            vec2 angles = radians(geometry.worldPosition.xy);
            vec3 sphere = vec3(sin(angles.x) * cos(angles.y), sin(angles.y), cos(angles.x) * cos(angles.y));
            // Clip the far hemisphere, relaxing the horizon as the globe unfolds.
            float plane = dot(sphere, projectionMorph.clippingPlane.xyz) + projectionMorph.clippingPlane.w;
            float horizonWeight = clamp((projectionMorph.globeness - 0.2) / 0.8, 0.0, 1.0);
            morph_horizon = (1.0 - plane) * horizonWeight;
          }
        `,
        "fs:DECKGL_FILTER_COLOR": "if (morph_horizon > 1.0) discard;",
      },
    };
  }

  draw(this: Layer, _params: object, extension: H3ProjectionExtension) {
    const { data, centerLongitude } = extension.opts;
    this.setShaderModuleProps({ projectionMorph: data ? {
      globeMatrix: data.mainMatrix,
      flatMatrix: data.fallbackMatrix,
      clippingPlane: data.clippingPlane,
      globeness: data.projectionTransition,
      centerLongitude,
      enabled: 1,
    } : { enabled: 0 } });
  }
}
