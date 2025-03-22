uniform vec3 uColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/ambient-light.glsl'
#include '../includes/directional-light.glsl'

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uColor;

  // Light
  vec3 light = vec3(0.0);

  light += ambientLight( //
      vec3(1.0),         // color
      1.0                // intensity
  );

  light += directionalLight( //
      vec3(1.0),             // color
      1.0,                   // intensity
      1.0,                   // specular power
      vec3(1.0, 1.0, 0.0),   // position
      normal,                //
      viewDirection          //
  );

  color *= light;

  // Halftone
  float repetitions = 50.0;

  vec2 uv = gl_FragCoord.xy / uResolution.y;
  uv *= repetitions;
  uv = mod(uv, 1.0);

  // Final color
  gl_FragColor = vec4(uv, 1.0, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}