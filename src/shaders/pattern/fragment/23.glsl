uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/utils.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  strength = random(vUv * animateSin(1.0));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}