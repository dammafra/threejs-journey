#include '../includes/simplexNoise4d.glsl'

void main() {
  // Wobble
  float wobble = simplexNoise4d(vec4( //
      csm_Position,                   // XYZ
      0.0                             // W
      ));

  csm_Position += wobble * normal;
}