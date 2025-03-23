uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(0.0);

  // Sun orientation
  float sunOrientation = dot(uSunDirection, normal);

  // Day / night color
  float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
  vec3 dayColor = texture(uDayTexture, vUv).rgb;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;
  color = mix(nightColor, dayColor, dayMix);

  // Specular clouds color
  vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

  // Clouds
  float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g);
  cloudsMix *= dayMix;
  color = mix(color, vec3(1.0), cloudsMix);

  // Final color
  gl_FragColor = vec4(color, 1.0);

  // clang-format off
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // clang-format on
}