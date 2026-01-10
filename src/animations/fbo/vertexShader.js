export default /* glsl */ `
  uniform sampler2D uPositions;
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    
    // Get particle position from texture
    vec3 pos = texture2D(uPositions, uv).xyz;
    
    // Transform to clip space
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 2.0;
  }
`;