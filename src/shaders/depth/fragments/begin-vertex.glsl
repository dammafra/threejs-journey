#include <begin_vertex>

float angle = sin(transformed.y + uTime) * 0.4;
mat2 rotateMatrix = get2dRotateMatrix(angle);

transformed.xz = rotateMatrix * transformed.xz;