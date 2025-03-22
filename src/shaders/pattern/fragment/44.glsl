uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  vec2 rUv = uAnimate ? rotate(vUv, PI * 0.1 * uTime, vec2(0.5, 0.5)) : vUv;
  float angle = atan(rUv.x - 0.5, rUv.y - 0.5) / (PI * 2.0) + 0.5;
  strength = sin(angle * 100.0);

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}