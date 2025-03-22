uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  vec2 rUv = rotate(vUv, uAnimate ? PI * 0.25 * uTime : PI * 0.25, vec2(0.5, 0.5));
  strength = animateSin(0.15) / distance(vec2(rUv.x, (rUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
  strength *= animateSin(0.15) / distance(vec2(rUv.y, (rUv.x - 0.5) * 5.0 + 0.5), vec2(0.5));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}