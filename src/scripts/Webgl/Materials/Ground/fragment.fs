varying vec2 vUv;

const float NOISE_GRANULARITY = 1./255.0;

float random(vec2 coords) {
  return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	float dist = distance(vUv, vec2(0.5));
	dist = smoothstep(0.5, 0., dist);
	dist *= 0.1;
  	float dithered = dist + mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(vUv));
	gl_FragColor = vec4(dithered);
}
