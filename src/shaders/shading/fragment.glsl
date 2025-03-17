uniform vec3 uColor;

uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;

uniform vec3 uDirectionalLightPosition;
uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightSpecularPower;

uniform vec3 uPointLight1Position;
uniform vec3 uPointLight1Color;
uniform float uPointLight1Intensity;
uniform float uPointLight1SpecularPower;
uniform float uPointLight1Decay;

uniform vec3 uPointLight2Position;
uniform vec3 uPointLight2Color;
uniform float uPointLight2Intensity;
uniform float uPointLight2SpecularPower;
uniform float uPointLight2Decay;

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
  light += pointLight(uPointLight1Color,         // color
                      uPointLight1Intensity,     // intensity
                      uPointLight1SpecularPower, // specular power
                      uPointLight1Decay,         // decay
                      uPointLight1Position,      // position
                      normal,                    // normal
                      viewDirection,             // view direction
                      vPosition                  // fragment position
  );
  light += pointLight(uPointLight2Color,         // color
                      uPointLight2Intensity,     // intensity
                      uPointLight2SpecularPower, // specular power
                      uPointLight2Decay,         // decay
                      uPointLight2Position,      // position
                      normal,                    // normal
                      viewDirection,             // view direction
                      vPosition                  // fragment position
  );
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}