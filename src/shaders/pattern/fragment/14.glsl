uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;
  // clang-format off
  float barsX = step(animateSin(0.4), mod(vUv.x * 10.0, 1.0)) * step(animateCos(0.8), mod(vUv.y * 10.0, 1.0));
  float barsY = step(animateCos(0.8), mod(vUv.x * 10.0, 1.0)) * step(animateSin(0.4), mod(vUv.y * 10.0, 1.0));
  // clang-format on
  strength = barsX + barsY;

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}