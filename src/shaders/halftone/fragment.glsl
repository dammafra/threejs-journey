uniform vec3 uColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/ambient-light.glsl'
#include '../includes/directional-light.glsl'
#include '../includes/halftone.glsl'

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
  color = halftone(         //
      color,                //
      vec3(1.0, 0.0, 0.0),  // pointColor
      50.0,                 // repetitions
      vec3(0.0, -1.0, 0.0), // direction
      normal,               //
      -0.8,                 // intensity low
      1.5                   // intensity high
  );

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}