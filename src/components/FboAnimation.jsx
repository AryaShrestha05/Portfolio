import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Vertex shader for round star-like particles
const vertexShader = `
  attribute float size;
  varying float vOpacity;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (300.0 / -mvPosition.z);
    vOpacity = 0.6 + 0.4 * (size / 0.08);
  }
`;

// Fragment shader for round star-like particles with soft glow
const fragmentShader = `
  uniform vec3 uColor;
  varying float vOpacity;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard pixels outside the circle
    if (dist > 0.5) discard;

    // Soft circular falloff for star-like glow
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// Group that rotates to follow the mouse
const RotatingScene = ({ children, mousePos }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      // Rotate the group based on mouse position
      const targetRotationX = mousePos.current.y * 0.5;
      const targetRotationY = -mousePos.current.x * 0.5;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// Particle system
const Particles = ({ isDarkMode }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const count = 5000;

  // Generate random positions in a sphere with hollow center
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);
    const minRadius = 0.7; // Hollow center - particles start from this radius
    const maxRadius = 2.5;

    for (let i = 0; i < count; i++) {
      // Distribute radius from minRadius to maxRadius (hollow center)
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Random sizes for star variety
      sizeArr[i] = 0.02 + Math.random() * 0.06;
    }
    return { positions: pos, sizes: sizeArr };
  }, []);

  // Lighter blue for dark mode, light gray for light mode
  const uniforms = useRef({
    uColor: { value: new THREE.Color(isDarkMode ? 0x6bb3ff : 0xb0b0b0) }
  });

  // Update color when mode changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(isDarkMode ? 0x6bb3ff : 0xb0b0b0);
    }
  }, [isDarkMode]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation based on time
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FboAnimation = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Track mouse position outside of Canvas
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <RotatingScene mousePos={mousePos}>
          <Particles isDarkMode={isDarkMode} />
        </RotatingScene>
      </Canvas>
    </div>
  );
};

export default FboAnimation;
