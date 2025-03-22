vec3 halftone(         //
    vec3 color,        //
    vec3 pointColor,   //
    float repetitions, //
    vec3 direction,    //
    vec3 normal,       //
    float low,         //
    float high         //
) {
  float intensity = dot(normal, direction);
  intensity = smoothstep(low, high, intensity);

  vec2 uv = gl_FragCoord.xy / uResolution.y;
  uv *= repetitions;
  uv = mod(uv, 1.0);

  float point = distance(uv, vec2(0.5));
  point = step(0.5 * intensity, point);
  point = 1.0 - point;

  return mix(color, pointColor, point);
}