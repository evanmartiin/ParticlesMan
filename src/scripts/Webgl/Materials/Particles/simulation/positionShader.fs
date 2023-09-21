uniform float uTime;
uniform float uDelta;
uniform float uDieSpeed;
uniform sampler2D uRigPositionTexture;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 positionTexture = texture2D(posTex, uv);
	vec3 position = positionTexture.xyz;

	vec4 velocityTexture = texture2D(velTex, uv);
	vec3 velocity = velocityTexture.xyz;

	vec4 rigPositionTexture = texture2D(uRigPositionTexture, uv);
	vec3 rigPosition = rigPositionTexture.xyz;

	float life = positionTexture.w - (uDieSpeed) * uDelta;

	if(life >= 0.0) {
		position += velocity * uDelta;
	} else {
		position = rigPosition * 75.;
		life = (0.5 + fract(positionTexture.w + uTime));
	}

	gl_FragColor = vec4(position, life);
}