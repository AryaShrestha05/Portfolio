import * as THREE from "three";

const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const simulationFragmentShader = `
  uniform sampler2D positions;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVelocity;
  varying vec2 vUv;

  float snoise(vec3 v) {
    // Standard Simplex Noise for the "Calm" drift
    return fract(sin(dot(v, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    vec3 pos = texture2D(positions, vUv).rgb;
    
    // CALM: Subtle drifting movement
    vec3 drift = vec3(
      snoise(vec3(pos.x, pos.y, uTime * 0.1)),
      snoise(vec3(pos.y, pos.z, uTime * 0.1)),
      0.0
    ) * 0.003;

    // AGGRESSIVE: Follows mouse only when uVelocity is high
    vec2 mouseDir = pos.xy - uMouse;
    float dist = length(mouseDir);
    vec3 interaction = vec3(0.0);
    
    if (dist < 0.8) {
        float force = pow(1.0 - dist/0.8, 2.0);
        interaction = vec3(normalize(mouseDir), 0.0) * force * (uVelocity * 0.2);
    }

    vec3 nextPos = pos + drift + interaction;
    
    // Keep it in an orb shape
    if (length(nextPos) > 1.4) nextPos *= 0.98;

    gl_FragColor = vec4(nextPos, 1.0);
  }
`;

export default class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size) {
    const length = size * size;
    const data = new Float32Array(length * 4);
    for (let i = 0; i < length; i++) {
      data[i * 4 + 0] = (Math.random() - 0.5) * 2.0;
      data[i * 4 + 1] = (Math.random() - 0.5) * 2.0;
      data[i * 4 + 2] = (Math.random() - 0.5) * 0.2;
      data[i * 4 + 3] = 1.0;
    }
    const positionsTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    positionsTexture.needsUpdate = true;

    super({
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
}