uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;
  // offset = 0.8 - 0.4 / 2.0
  float barsX = step(0.4, mod(vUv.x * 10.0, 1.0));
  barsX *= step(0.8, mod(vUv.y * 10.0 + animateSin(0.2), 1.0));

  float barsY = step(0.8, mod(vUv.x * 10.0 + animateCos(0.2), 1.0));
  barsY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  strength = barsX + barsY;

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}