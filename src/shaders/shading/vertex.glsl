varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Model normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  // Varyings
  vNormal = modelNormal.xyz;
  vPosition = modelPosition.xyz;
}