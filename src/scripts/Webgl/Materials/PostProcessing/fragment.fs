precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D uVelocity;

uniform float uRatio;
uniform float uResolution;

uniform float uTime;

varying vec2 vUv;

#define PI 3.14159265359
#define NEAR 1.
#define FAR 100.

void main() {
	vec2 vel = texture2D(uVelocity, vUv).xy;

	vec3 scene = texture2D(tDiffuse, vUv + vel).rgb;

	gl_FragColor = vec4(scene, 1.);

}
