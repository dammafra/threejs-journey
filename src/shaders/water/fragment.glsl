uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/point-light.glsl'

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  // Base color
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  mixStrength = smoothstep(0.0, 1.0, mixStrength);
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

  // Light
  vec3 light = vec3(0.0);

  light += pointLight(      //
      vec3(1.0),            // color
      10.0,                 // intensity
      30.0,                 // specular power
      0.95,                 // decay multiplier
      vec3(0.0, 0.25, 0.0), // position
      normal,               //
      viewDirection,        //
      vPosition             //
  );

  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}