in vec4 vWorldPosition;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  return res * res;
}

void main() {
  float n = noise(vWorldPosition.xy);
  vec3 render = mix(vWorldPosition.xyz, vWorldPosition.xyz * 0.5, n);

  gl_FragColor = vec4(render, 0.0);
  gl_FragColor = vec4(vWorldPosition.xyz, 0.0);
}
