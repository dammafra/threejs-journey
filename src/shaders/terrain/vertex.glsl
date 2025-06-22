#include '../includes/simplexNoise2d.glsl'

float getElevation(vec2 position) {
  float elevation = 0.0;
  elevation += simplexNoise2d(position);
  return elevation;
}

void main() {
  // Elevation
  float elevation = getElevation(csm_Position.xz);
  csm_Position.y = elevation;
}