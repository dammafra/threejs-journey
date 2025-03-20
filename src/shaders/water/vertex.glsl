uniform float uTime;

uniform float uWavesElevation;
uniform vec2 uWavesFrequency;
uniform float uWavesSpeed;

uniform float uNoiseElevation;
uniform float uNoiseFrequency;
uniform float uNoiseSpeed;
uniform float uNoiseIterations;

varying float vElevation;

#include '../includes/perlin-classic-3D.glsl'

void main() {
  // Base position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Elevation
  float elevation = sin(modelPosition.x * uWavesFrequency.x + uTime * uWavesSpeed) *
                    sin(modelPosition.z * uWavesFrequency.y + uTime * uWavesSpeed) *
                    uWavesElevation;

  for (float i = 1.0; i <= uNoiseIterations; i++) {
    // clang-format off
    elevation -= abs(perlinClassic3D(vec3(modelPosition.xz * uNoiseFrequency * i, uTime * uNoiseSpeed)) * uNoiseElevation / i);
    // clang-format on
  }

  modelPosition.y += elevation;

  // Final position
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Varyings
  vElevation = elevation;
}