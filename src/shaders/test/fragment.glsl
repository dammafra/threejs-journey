#define PI 3.1415926535897932384626433832795

uniform int uPattern;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
              cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

void main() {
  switch (uPattern) {
    case 1: {
      gl_FragColor = vec4(vUv, 1.1, 1.0);
      break;
    }

    case 2: {
      gl_FragColor = vec4(vUv, 0.1, 1.0);
      break;
    }

    case 3: {
      float strength = vUv.x;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 4: {
      float strength = vUv.y;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 5: {
      float strength = 1.0 - vUv.y;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 6: {
      float strength = vUv.y * 10.0;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 7: {
      float strength = mod(vUv.y * 10.0, 1.0);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 8: {
      float strength = mod(vUv.y * 10.0, 1.0);
      strength = step(0.5, strength);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 9: {
      float strength = mod(vUv.y * 10.0, 1.0);
      strength = step(0.8, strength);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 10: {
      float strength = mod(vUv.x * 10.0, 1.0);
      strength = step(0.8, strength);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 11: {
      float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
      strength += step(0.8, mod(vUv.y * 10.0, 1.0));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 12: {
      float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
      strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 13: {
      float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
      strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 14: {
      float barsX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
      float barsY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
      float strength = barsX + barsY;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 15: {
      // offset = 0.8 - 0.4 / 2.0
      float barsX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
      float barsY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
      float strength = barsX + barsY;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 16: {
      float strength = abs(vUv.x - 0.5);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 17: {
      float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 18: {
      float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 19: {
      float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 20: {
      float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
      float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
      float strength = square1 * square2;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 21: {
      float strength = floor(vUv.x * 10.0) / 10.0;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 22: {
      float strength = floor(vUv.x * 10.0) / 10.0;
      strength *= floor(vUv.y * 10.0) / 10.0;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 23: {
      float strength = random(vUv);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 24: {
      vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
      float strength = random(gridUv);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 25: {
      // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
      vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
      float strength = random(gridUv);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 26: {
      float strength = length(vUv);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 27: {
      // float strength = length(vUv - 0.5);
      float strength = distance(vUv, vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 28: {
      float strength = 1.0 - distance(vUv, vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 29: {
      float strength = 0.015 / distance(vUv, vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 30: {
      // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
      // float strength = 0.015 / distance(lightUv, vec2(0.5));

      float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 31: {
      // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
      // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

      // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
      // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

      // float strength = lightX * lightY;

      float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
      strength *= 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 32: {
      vec2 rUv = rotate(vUv, PI * 0.25, vec2(0.5, 0.5));
      float strength = 0.15 / distance(vec2(rUv.x, (rUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
      strength *= 0.15 / distance(vec2(rUv.y, (rUv.x - 0.5) * 5.0 + 0.5), vec2(0.5));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 33: {
      float strength = step(0.25, distance(vUv, vec2(0.5)));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 34: {
      float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 35: {
      float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 36: {
      float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 37: {
      vec2 waveUv = vec2(                 //
          vUv.x,                          //
          vUv.y + sin(vUv.x * 30.0) * 0.1 //
      );
      float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 38: {
      vec2 waveUv = vec2(                  //
          vUv.x + sin(vUv.y * 30.0) * 0.1, //
          vUv.y + sin(vUv.x * 30.0) * 0.1  //
      );
      float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 39: {
      vec2 waveUv = vec2(                   //
          vUv.x + sin(vUv.y * 100.0) * 0.1, //
          vUv.y + sin(vUv.x * 100.0) * 0.1  //
      );
      float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 40: {
      float angle = atan(vUv.x, vUv.y);
      float strength = angle;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 41: {
      float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
      float strength = angle;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 42: {
      float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
      angle /= PI * 2.0;
      angle += 0.5;
      float strength = angle;
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 43: {
      float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
      angle *= 20.0;
      float strength = mod(angle, 1.0);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 44: {
      float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
      float strength = sin(angle * 100.0);
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }

    case 45: {
      float sinusoid = sin((atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5) * 100.0);
      float radius = 0.25 + sinusoid * 0.02;
      float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
      gl_FragColor = vec4(vec3(strength), 1.0);
      break;
    }
  }
}