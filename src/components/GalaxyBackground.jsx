import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for particles
const vertexShader = `
  uniform float uTime;
  uniform float uSize;

  attribute float aScale;
  attribute vec3 aRandomness;

  varying vec3 vColor;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin animation
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Add randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = color;
  }
`;

// Fragment shader for particles
const fragmentShader = `
  varying vec3 vColor;

  void main() {
    // Create circular particles with soft edges
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(vColor, strength);
  }
`;

// Galaxy particles component
function GalaxyParticles({ isDark }) {
  const pointsRef = useRef();
  const { size } = useThree();

  // Theme-based colors
  const colors = useMemo(() => {
    if (isDark) {
      return {
        inner: new THREE.Color('#60a5fa'),  // Blue
        outer: new THREE.Color('#a855f7'),  // Purple
      };
    } else {
      return {
        inner: new THREE.Color('#f97316'),  // Orange
        outer: new THREE.Color('#ec4899'),  // Pink
      };
    }
  }, [isDark]);

  // Generate galaxy geometry
  const { geometry, material } = useMemo(() => {
    const parameters = {
      count: 50000,
      size: 0.01,
      radius: 5,
      branches: 5,
      spin: 1,
      randomness: 0.5,
      randomnessPower: 3,
    };

    const positions = new Float32Array(parameters.count * 3);
    const colorsArray = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count);
    const randomness = new Float32Array(parameters.count * 3);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Position
      const radius = Math.random() * parameters.radius;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
      const spinAngle = radius * parameters.spin;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = randomY * 0.5;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      // Color - gradient from inner to outer
      const mixedColor = colors.inner.clone();
      mixedColor.lerp(colors.outer, radius / parameters.radius);

      colorsArray[i3] = mixedColor.r;
      colorsArray[i3 + 1] = mixedColor.g;
      colorsArray[i3 + 2] = mixedColor.b;

      // Scale
      scales[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 * Math.min(size.width, size.height) / 1000 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    return { geometry: geo, material: mat };
  }, [colors, size]);

  // Update colors when theme changes
  useEffect(() => {
    if (pointsRef.current) {
      const colorsArray = pointsRef.current.geometry.attributes.color.array;
      const positions = pointsRef.current.geometry.attributes.position.array;
      const radius = 5;

      for (let i = 0; i < colorsArray.length / 3; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        const distanceToCenter = Math.sqrt(x * x + z * z);

        const mixedColor = colors.inner.clone();
        mixedColor.lerp(colors.outer, distanceToCenter / radius);

        colorsArray[i3] = mixedColor.r;
        colorsArray[i3 + 1] = mixedColor.g;
        colorsArray[i3 + 2] = mixedColor.b;
      }

      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [colors]);

  // Animation loop
  useFrame((state) => {
    if (pointsRef.current) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

// Main Galaxy Background component
export default function GalaxyBackground() {
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 3, 5], fov: 75 }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <GalaxyParticles isDark={isDark} />
    </Canvas>
  );
}
