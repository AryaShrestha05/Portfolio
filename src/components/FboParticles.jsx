import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

import {
  SimulationMaterial,
  renderVertexShader,
  renderFragmentShader
} from "./FboShaders";

// Extend R3F to recognize SimulationMaterial
extend({ SimulationMaterial });

const RotatingScene = ({ children }) => {
  const groupRef = useRef(null);

  useFrame((state) => {
    const { pointer } = state;
    // Rotate the group based on mouse position
    const targetRotationX = pointer.y * 0.5; // Reduced intensity for smoother feel
    const targetRotationY = -pointer.x * 0.5;
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const FBOParticles = ({ isDarkMode }) => {
  const size = 128; // Power of 2 (16,384 particles)

  const points = useRef(null);
  const simulationMaterialRef = useRef(null);
  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const firstFrame = useRef(true); // Track first frame for initialization

  // Ping-Pong Buffers setup
  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1), []);

  // Create two buffers
  const [targetA, targetB] = useMemo(() => {
    const options = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false
    };
    const t1 = new THREE.WebGLRenderTarget(size, size, options);
    const t2 = new THREE.WebGLRenderTarget(size, size, options);
    return [t1, t2];
  }, [size]);

  // Track which is Read and which is Write
  const targets = useRef({ read: targetA, write: targetB });

  const positions = useMemo(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]), []);
  const uvs = useMemo(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), []);

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
      uColor: {
        value: new THREE.Color(isDarkMode ? 0xffb700 : 0x000000)
      }
    }),
    []
  );

  useEffect(() => {
    // Dark Mode: Gold (#FFB700), Light Mode: Black
    const colorHex = isDarkMode ? 0xffb700 : 0x000000;
    if (points.current) {
      points.current.material.uniforms.uColor.value.setHex(colorHex);
    }
  }, [isDarkMode]);

  useFrame((state) => {
    const { gl, clock, pointer } = state;

    // Simulation
    if (simulationMaterialRef.current) {
      // Calculate velocity
      const currentPointer = pointer.clone();
      const velocity = currentPointer.clone().sub(prevPointer.current).multiplyScalar(10.0);
      prevPointer.current.copy(currentPointer);

      // Clamp velocity
      velocity.x = THREE.MathUtils.clamp(velocity.x, -2, 2);
      velocity.y = THREE.MathUtils.clamp(velocity.y, -2, 2);

      simulationMaterialRef.current.uniforms.uMouse.value.set(pointer.x, pointer.y, 1.0);
      simulationMaterialRef.current.uniforms.uVelocity.value.lerp(velocity, 0.1);
      simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;

      // Only swap texture AFTER first frame (so we use the random init texture first)
      if (!firstFrame.current) {
        simulationMaterialRef.current.uniforms.positions.value = targets.current.read.texture;
      }
    }

    // Render to WRITE target
    gl.setRenderTarget(targets.current.write);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Update Points to use the NEW texture
    if (points.current) {
      points.current.material.uniforms.uPositions.value = targets.current.write.texture;
    }

    // Swap buffers for next frame
    const temp = targets.current.read;
    targets.current.read = targets.current.write;
    targets.current.write = temp;

    firstFrame.current = false;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
              count={positions.length / 3}
            />
            <bufferAttribute
              attach="attributes-uv"
              args={[uvs, 2]}
              count={uvs.length / 2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
            count={particlesPosition.length / 3}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={renderFragmentShader}
          vertexShader={renderVertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

const FboParticles = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkMobile();
    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true
    });

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 1.4] }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false }}
        frameloop={isVisible ? "always" : "never"}
      >
        <RotatingScene>
          <FBOParticles isDarkMode={isDarkMode} />
        </RotatingScene>
        {!isMobile && <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />}
      </Canvas>
    </div>
  );
};

export default FboParticles;
