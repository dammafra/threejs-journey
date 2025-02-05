uniform float uTime;
uniform float uWavesElevation;
uniform vec2 uWavesFrequency;
uniform float uWavesSpeed;

void main() {
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // clang-format off
  float elevation = sin(modelPosition.x * uWavesFrequency.x + uTime * uWavesSpeed) * 
                    sin(modelPosition.z * uWavesFrequency.y + uTime * uWavesSpeed) * 
                    uWavesElevation;
  // clang-format on

  modelPosition.y += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}