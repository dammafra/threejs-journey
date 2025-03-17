uniform vec3 uColor;

uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;

uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightSpecularPower;

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
  light += ambientLight(uAmbientLightColor,    // color
                        uAmbientLightIntensity // intensity
  );
  light += directionalLight(uDirectionalLightColor,        // color
                            uDirectionalLightIntensity,    // intensity
                            vec3(0.0, 0.0, 3.0),           // position
                            normal,                        // normal
                            viewDirection,                 // view direction
                            uDirectionalLightSpecularPower // specular power
  );
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}