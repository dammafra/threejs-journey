uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;

  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  strength = animateSin(angle);

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}