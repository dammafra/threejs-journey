if (uMixUVColor) {
  // Clamp
  strength = clamp(strength, 0.0, 1.0);

  // Mix colors
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, animateSin(1.0));
  vec3 color = mix(blackColor, uvColor, strength);

  gl_FragColor = vec4(color, 1.0);
}