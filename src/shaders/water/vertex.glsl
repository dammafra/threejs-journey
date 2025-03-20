uniform float uTime;

uniform float uWavesElevation;
uniform vec2 uWavesFrequency;
uniform float uWavesSpeed;

uniform float uNoiseElevation;
uniform float uNoiseFrequency;
uniform float uNoiseSpeed;
uniform float uNoiseIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include '../includes/perlin-classic-3D.glsl'

float waveElevation(vec3 position) {
  float elevation = sin(position.x * uWavesFrequency.x + uTime * uWavesSpeed) *
                    sin(position.z * uWavesFrequency.y + uTime * uWavesSpeed) * uWavesElevation;

  for (float i = 1.0; i <= uNoiseIterations; i++) {
    // clang-format off
    elevation -= abs(perlinClassic3D(vec3(position.xz * uNoiseFrequency * i, uTime * uNoiseSpeed)) * uNoiseElevation / i);
    // clang-format on
  }

  return elevation;
}

void main() {
  // Base position
  float shift = 0.01;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec3 modelPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
  vec3 modelPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

  // Elevation
  float elevation = waveElevation(modelPosition.xyz);
  modelPosition.y += elevation;
  modelPositionA.y += waveElevation(modelPositionA);
  modelPositionB.y += waveElevation(modelPositionB);

  // Compute normal
  vec3 toA = normalize(modelPositionA - modelPosition.xyz);
  vec3 toB = normalize(modelPositionB - modelPosition.xyz);
  vec3 computedNormal = cross(toA, toB);

  // Final position
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Varyings
  vElevation = elevation;
  vNormal = computedNormal;
  vPosition = modelPosition.xyz;
}