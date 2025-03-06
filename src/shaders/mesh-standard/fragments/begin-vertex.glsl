#include <begin_vertex>

float angle = transformed.y * 0.9;
mat2 rotateMatrix = get2dRotateMatrix(angle);

transformed.xz = rotateMatrix * transformed.xz;