#include <beginnormal_vertex>

float angle = (position.y + uTime) * 0.9;
mat2 rotateMatrix = get2dRotateMatrix(angle);

objectNormal.xz = rotateMatrix * objectNormal.xz;