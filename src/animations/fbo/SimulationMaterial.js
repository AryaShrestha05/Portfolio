import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const SimulationMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform sampler2D uPositions;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Get previous position
      vec4 pos = texture2D(uPositions, uv);
      
      // Get neighboring positions
      float width = 138.0;
      vec2 offset = vec2(1.0 / width, 0.0);
      
      vec4 posL = texture2D(uPositions, uv - offset);
      vec4 posR = texture2D(uPositions, uv + offset);
      vec4 posU = texture2D(uPositions, uv - offset.yx);
      vec4 posD = texture2D(uPositions, uv + offset.yx);
      
      // Calculate center
      vec4 center = (posL + posR + posU + posD) / 4.0;
      
      // Apply some force from mouse
      vec2 mouseInfluence = uMouse * 2.0 - 1.0;
      mouseInfluence.y *= -1.0;
      
      // Update position with damping
      vec3 newPos = center.xyz * 0.98 + pos.xyz * 0.02;
      
      // Add mouse influence
      float dist = length(vec2(newPos.x, newPos.y) - mouseInfluence);
      if (dist < 1.0) {
        vec2 dir = normalize(vec2(newPos.x, newPos.y) - mouseInfluence);
        newPos.xy += dir * 0.1 * (1.0 - dist);
      }
      
      gl_FragColor = vec4(newPos, 1.0);
    }
  `
);

extend({ SimulationMaterial });

export default SimulationMaterial;