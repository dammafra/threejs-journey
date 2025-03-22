uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;

  float square1 = step(animateSin(0.2), max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  float square2 = 1.0 - step(animateSin(0.25), max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  strength = square1 * square2;

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}