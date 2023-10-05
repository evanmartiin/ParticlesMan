uniform int uMapWidth;
uniform int uMapHeight;

in float aFragIndex;

#ifdef USE_INSTANCING
in float aFragOffset;
in float aBoneVisible;
#endif

out vec4 vWorldPosition;

#include <common>
#include <skinning_pars_vertex>

void main() {
  #include <skinbase_vertex>

  #include <begin_vertex>
  #include <skinning_vertex>

  // Position this vertex so that it occupies a unique pixel.
  // https://stackoverflow.com/questions/29053870/retrieve-vertices-data-in-three-js
  // https://stackoverflow.com/questions/20601886/does-gl-position-set-the-center-of-the-rectangle-when-using-gl-points
  #ifdef USE_INSTANCING
  float index = aFragIndex + aFragOffset;
  #else
  float index = aFragIndex;
  #endif

  vec2 destCoords = vec2((0.5 + float(int(index) % uMapWidth)) / float(uMapWidth), (0.5 + floor(float(index) / float(uMapWidth))) / float(uMapHeight)) * vec2(2.0) - vec2(1.0);

  gl_Position = vec4(destCoords, 0.0, 1.0);
  gl_PointSize = 1.0;

  vWorldPosition = modelMatrix * vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
  vWorldPosition = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
  vWorldPosition *= aBoneVisible;
  #endif
}
