uniform float uSize;

void main() {
  // Final position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize;
  gl_PointSize *= 1.0 / -viewPosition.z;
}