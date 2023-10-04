attribute float aRandom;

uniform float uSize;
uniform float uScale;

uniform sampler2D posMap;
uniform sampler2D velMap;

mat3 getRotation(vec3 velocity) {
  velocity = normalize(velocity);
  velocity.z *= -1.;
  float xz = length(velocity.xz);
  float xyz = 1.;
  float x = sqrt(1. - velocity.y * velocity.y);
  float cosry = velocity.x / xz;
  float sinry = velocity.z / xz;
  float cosrz = x / xyz;
  float sinrz = velocity.y / xyz;
  mat3 maty = mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
  mat3 matz = mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);
  return maty * matz;
}

void main() {
  vec2 posUv;
  posUv.x = mod(float(gl_InstanceID), (uSize));
  posUv.y = float(float(gl_InstanceID) / (uSize));
  posUv /= vec2(uSize);
  vec4 positionTexture = texture2D(posMap, posUv);
  vec4 velocityTexture = texture2D(velMap, posUv);

  mat3 particleRotation = getRotation(velocityTexture.xyz);

  vec3 particleScale = vec3(min(1.0, 10.0 * length(velocityTexture.xyz)), 1.0, 1.0);

  vec3 transformedPos = position * particleScale * aRandom * positionTexture.w * uScale;
  transformedPos = (particleRotation * transformedPos);
  transformedPos.x += positionTexture.x;
  transformedPos.y += positionTexture.y;
  transformedPos.z += positionTexture.z;

  csm_Normal *= particleRotation;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(transformedPos, 1.0);
}
