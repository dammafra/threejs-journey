attribute float aSize;

uniform float uSize;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uProgress;

// clang-format off
float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax) {
  return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}
// clang-format on

void main() {
  vec3 newPosition = position;

  // Exploding
  float explodingProgress = remap(uProgress, 0.0, 0.1, 0.0, 1.0);
  explodingProgress = clamp(explodingProgress, 0.0, 1.0);
  explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
  newPosition *= explodingProgress;

  // Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y * uPixelRatio * aSize;
  gl_PointSize *= 1.0 / -viewPosition.z;
}