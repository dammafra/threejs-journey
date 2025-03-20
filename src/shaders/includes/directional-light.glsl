vec3 directionalLight(vec3 color,
                      float intensity,
                      float specularPower,
                      vec3 position,
                      vec3 normal,
                      vec3 viewDirection) {
  vec3 direction = normalize(position);
  vec3 reflection = reflect(-direction, normal);

  // Shading
  float shading = dot(normal, direction);
  shading = max(0.0, shading);

  // Reflection
  float specular = -dot(reflection, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  return color * intensity * (shading + specular);
}