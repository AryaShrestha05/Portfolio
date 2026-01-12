import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({ count = 2500 }) => {
  const mesh = useRef();
  const { mouse, viewport } = useThree();

  // Create random positions and "original" positions for the buttery return effect
  const [positions, originalPositions, stepSizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const steps = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 5;
      
      pos.set([x, y, z], i * 3);
      orig.set([x, y, z], i * 3);
      steps[i] = Math.random() * 0.02 + 0.005; // Random individual drift speed
    }
    return [pos, orig, steps];
  }, [count]);

  useFrame((state) => {
    const { array } = mesh.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 1. Subtle constant "floating" movement
      array[i3] += Math.sin(time * stepSizes[i]) * 0.002;
      array[i3 + 1] += Math.cos(time * stepSizes[i]) * 0.002;

      // 2. Buttery Cursor Interaction
      // Convert cursor -1 to +1 range to scene coordinates
      const targetX = (mouse.x * viewport.width) / 2;
      const targetY = (mouse.y * viewport.height) / 2;

      // Distance between particle and mouse
      const dx = array[i3] - targetX;
      const dy = array[i3 + 1] - targetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Interaction radius (how close cursor needs to be)
      if (dist < 2) {
        const force = (2 - dist) * 0.05;
        array[i3] += dx * force;
        array[i3 + 1] += dy * force;
      } else {
        // Smoothly drift back to original position
        array[i3] += (originalPositions[i3] - array[i3]) * 0.02;
        array[i3 + 1] += (originalPositions[i3 + 1] - array[i3 + 1]) * 0.02;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const SmokyBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default SmokyBackground;