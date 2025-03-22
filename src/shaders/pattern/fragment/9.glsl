uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;

  strength = mod(vUv.y * 10.0, 1.0);
  strength = step(animateSin(0.8), strength);

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}