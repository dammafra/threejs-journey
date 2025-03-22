uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/classic-perlin-noise-2D.glsl'
#include '../../includes/animate.glsl'

void main() {
  float strength;

  strength = step(0.9, sin(classicPerlinNoise2D(vUv * 10.0 + animateTime()) * animateSin(20.0)));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}