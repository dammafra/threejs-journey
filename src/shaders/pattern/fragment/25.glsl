uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
  vec2 gridUv = vec2(                                      //
      floor(vUv.x * 10.0) / 10.0,                          //
      floor(vUv.y * 10.0 + animateSin(vUv.x * 5.0)) / 10.0 //
  );
  strength = random(gridUv * animateSin(1.0));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}