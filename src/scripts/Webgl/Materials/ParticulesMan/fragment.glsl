in vec4 vWorldPosition;

void main() {
  gl_FragColor = vec4(vWorldPosition.xyz, 0.0);
}
