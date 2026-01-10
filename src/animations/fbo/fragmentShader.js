export default /* glsl */ `
  precision highp float;
  uniform sampler2D uPositions;
  varying vec2 vUv;
  
  void main() {
    // Get particle position from texture
    vec3 pos = texture2D(uPositions, vUv).xyz;
    
    // Create a simple particle
    // pos.xy contains the particle position in 0-1 range
    // We'll draw a small circle at that position
    
    vec2 coord = gl_FragCoord.xy / 1.0;
    vec2 particleScreenPos = pos.xy;
    
    float dist = distance(coord, particleScreenPos);
    float alpha = 1.0 - smoothstep(0.0, 0.05, dist);
    
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;