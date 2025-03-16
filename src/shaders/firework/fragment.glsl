uniform sampler2D uTexture;

void main() {
  float textureAlpha = texture(uTexture, gl_PointCoord).r;

  // Final color
  gl_FragColor = vec4(1.0, 1.0, 1.0, textureAlpha);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}