uniform vec3 uColor;

#include '../includes/ambient-light.glsl'

void main() {
  vec3 color = uColor;

  // Light
  vec3 light = vec3(0.0);
  light += ambientLight(vec3(1.0), 0.03);
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}