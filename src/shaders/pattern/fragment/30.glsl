uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;
  // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
  // strength = 0.015 / distance(lightUv, vec2(0.5));
  strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * animateSin(5.0) + 0.5), vec2(0.5));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}