#include <common>

mat2 get2dRotateMatrix(float _angle) {
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}