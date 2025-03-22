uniform bool uMixUVColor;
uniform bool uAnimate;
uniform float uTime;

varying vec2 vUv;

#include '../../includes/animate.glsl'

void main() {
  float strength;

  vec2 waveUv = vec2(                               //
      vUv.x + animateSin(sin(vUv.y * 100.0) * 0.1), //
      vUv.y + animateSin(sin(vUv.x * 100.0) * 0.1)  //
  );
  strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

  gl_FragColor = vec4(vec3(strength), 1.0);

#include '../../includes/mix-uv-colors.glsl'
}