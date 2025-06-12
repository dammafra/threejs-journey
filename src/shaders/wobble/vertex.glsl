attribute vec4 tangent;

#include '../includes/simplexNoise4d.glsl'

float getWobble(vec3 position) {
  return simplexNoise4d(vec4( //
      position,               // XYZ
      0.0                     // W
      ));
}

void main() {
  vec3 biTangent = cross(normal, tangent.xyz);

  // Neighbors position
  float shift = 0.01;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + biTangent * shift;

  // Wobble
  float wobble = getWobble(csm_Position);
  csm_Position += wobble * normal;
  positionA += getWobble(positionA) * normal;
  positionB += getWobble(positionB) * normal;

  // Compute normal
  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = cross(toA, toB);
}