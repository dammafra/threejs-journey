#include '../includes/simplexNoise4d.glsl'

uniform float uTime;

void main() {
  float time = uTime * 0.2;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv);

  // Flow field
  vec3 flowField = vec3(                              //
      simplexNoise4d(vec4(particle.xyz + 0.0, time)), //
      simplexNoise4d(vec4(particle.xyz + 1.0, time)), //
      simplexNoise4d(vec4(particle.xyz + 2.0, time))  //
  );
  flowField = normalize(flowField);
  particle.xyz += flowField * 0.01;

  gl_FragColor = particle;
}