varying vec2 vUv;

void main() {
	float dist = distance(vUv, vec2(0.5));
	dist = smoothstep(0.5, 0., dist);
	dist *= 0.1;
	gl_FragColor = vec4(dist);
}
