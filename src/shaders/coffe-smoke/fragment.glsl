void main() {
  // Final color
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format off
}