uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  angle /= PI * 2.0;
  angle += uAnimate ? sin(uTime) * 0.5 : 0.5;
  strength = angle;

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}