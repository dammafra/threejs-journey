vec3 pointLight(vec3 color,
                float intensity,
                float specularPower,
                float decayMultiplier,
                vec3 position,
                vec3 normal,
                vec3 viewDirection,
                vec3 fragmentPosition) {

  vec3 lightDelta = position - fragmentPosition;
  float lightDistance = length(lightDelta);

  vec3 direction = normalize(lightDelta);
  vec3 reflection = reflect(-direction, normal);

  // Shading
  float shading = dot(normal, direction);
  shading = max(0.0, shading);

  // Reflection
  float specular = -dot(reflection, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  // Decay
  float decay = 1.0 - lightDistance * decayMultiplier;
  decay = max(0.0, decay);

  return color * intensity * decay * (shading + specular);
}