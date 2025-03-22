uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  vec2 rUv = uAnimate ? rotate(vUv, PI * 0.1 * uTime, vec2(0.5, 0.5)) : vUv;
  float sinusoid = sin((atan(rUv.x - 0.5, rUv.y - 0.50) / (PI * 2.0) + 0.5) * 100.0);
  float radius = (0.25) + animateSin(sinusoid) * 0.02;
  strength = 1.0 - step(0.01, abs(distance(rUv, vec2(0.5)) - radius));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}