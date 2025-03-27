void main() {
  vec2 uv = gl_PointCoord;
  float distanceToCenter = distance(uv, vec2(0.5));

  if (distanceToCenter > 0.5)
    discard;

  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}