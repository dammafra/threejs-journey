uniform vec3 uColor;

uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;

uniform vec3 uDirectionalLightPosition;
uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightSpecularPower;

varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/ambient-light.glsl'
#include '../includes/directional-light.glsl'
#include '../includes/point-light.glsl'

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 color = uColor;

  // Light
  vec3 light = vec3(0.0);
  light += ambientLight(uAmbientLightColor,    // color
                        uAmbientLightIntensity // intensity
  );
  light += directionalLight(uDirectionalLightColor,         // color
                            uDirectionalLightIntensity,     // intensity
                            uDirectionalLightSpecularPower, // specular power
                            uDirectionalLightPosition,      // position
                            normal,                         // normal
                            viewDirection                   // view direction
  );
  light += pointLight(vec3(1.0, 0.1, 0.1), // color
                      1.0,                 // intensity
                      20.0,                // specular power
                      0.25,                // decay
                      vec3(0.0, 2.5, 0.0), // position
                      normal,              // normal
                      viewDirection,       // view direction
                      vPosition            // fragment position
  );
  light += pointLight(vec3(0.1, 1.0, 0.5), // color
                      1.0,                 // intensity
                      20.0,                // specular power
                      0.25,                // decay
                      vec3(2.0, 2.0, 2.0), // position
                      normal,              // normal
                      viewDirection,       // view direction
                      vPosition            // fragment position
  );
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}