#include '../includes/simplexNoise4d.glsl'

uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;

void main() {
  float time = uTime * 0.2;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv);
  vec4 base = texture(uBase, uv);

  // Dead
  if (particle.a >= 1.0) {
    particle.a = fract(particle.a); // this fixes long frames, i.e. when the browser tab is inactive
                                    // - alternative: mod(particle.a, 1.0)
    particle.xyz = base.xyz;
  }
  // Alive
  else {

    // Flow field
    vec3 flowField = vec3(                              //
        simplexNoise4d(vec4(particle.xyz + 0.0, time)), //
        simplexNoise4d(vec4(particle.xyz + 1.0, time)), //
        simplexNoise4d(vec4(particle.xyz + 2.0, time))  //
    );
    flowField = normalize(flowField);
    particle.xyz += flowField * uDeltaTime * 0.5;

    // Decay
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle;
}