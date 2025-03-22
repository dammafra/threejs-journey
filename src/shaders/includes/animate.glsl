float animateTime() {
  return uAnimate ? uTime : 0.0;
}

float animateSin(float value) {
  return uAnimate ? value * abs(sin(uTime)) : value;
}

float animateCos(float value) {
  return uAnimate ? value * abs(cos(uTime)) : value;
}