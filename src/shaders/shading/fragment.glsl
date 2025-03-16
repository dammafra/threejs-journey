uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/ambient-light.glsl'
#include '../includes/directional-light.glsl'

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 color = uColor;

  // Light
  vec3 light = vec3(0.0);
  light += ambientLight(vec3(1.0), // color
                        0.03       // intensity
  );
  light += directionalLight(vec3(0.1, 0.1, 1.0), // color
                            1.0,                 // intensity
                            vec3(0.0, 0.0, 3.0), // position
                            normal,              // normal
                            viewDirection,       // view direction
                            20.0                 // specular power
  );
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}