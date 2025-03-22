varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(vUv, 1.0);

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}