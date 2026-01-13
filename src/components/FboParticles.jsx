import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { SimulationMaterial, renderVertexShader, renderFragmentShader } from "./FboShaders";

extend({ SimulationMaterial });

const RotatingScene = ({ children }) => {
  const groupRef = useRef();
  useFrame((state) => {
    const { pointer } = state;
    // Smoother, driftier follow
    const targetPosX = -pointer.x * 1.5; 
    const targetPosY = -pointer.y * 1.2;
    if (groupRef.current) {
      // Lower lerp for "Calm" feel
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.03);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.03);
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const FBOParticles = ({ isDarkMode }) => {
  const size = 128;
  const points = useRef();
  const simMatRef = useRef();
  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const firstFrame = useRef(true);

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const [tA, tB] = useMemo(() => {
    const opts = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType };
    return [new THREE.WebGLRenderTarget(size, size, opts), new THREE.WebGLRenderTarget(size, size, opts)];
  }, []);
  const targets = useRef({ read: tA, write: tB });

  const geoData = useMemo(() => ({
    pos: new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]),
    uv: new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
  }), []);

  const particlesPosition = useMemo(() => {
    const p = new Float32Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      p[i * 3] = (i % size) / size;
      p[i * 3 + 1] = i / size / size;
    }
    return p;
  }, []);

  const uniforms = useMemo(() => ({
    uPositions: { value: null },
    uColor: { value: new THREE.Color(isDarkMode ? 0xffb700 : 0x333333) },
    uTime: { value: 0 }
  }), []);

  useEffect(() => {
    uniforms.uColor.value.setHex(isDarkMode ? 0xffb700 : 0x333333);
  }, [isDarkMode, uniforms]);

  useFrame((state) => {
    const { gl, clock, pointer } = state;
    if (simMatRef.current) {
      const velocity = pointer.clone().sub(prevPointer.current).multiplyScalar(15.0);
      prevPointer.current.copy(pointer);
      simMatRef.current.uniforms.uMouse.value.set(pointer.x, pointer.y, 0);
      simMatRef.current.uniforms.uVelocity.value.lerp(velocity, 0.05);
      simMatRef.current.uniforms.uTime.value = clock.elapsedTime;
      if (!firstFrame.current) simMatRef.current.uniforms.positions.value = targets.current.read.texture;
    }
    gl.setRenderTarget(targets.current.write);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    points.current.material.uniforms.uPositions.value = targets.current.write.texture;
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
    const tmp = targets.current.read;
    targets.current.read = targets.current.write;
    targets.current.write = tmp;
    firstFrame.current = false;
  });

  return (
    <>
      {createPortal(<mesh><simulationMaterial ref={simMatRef} args={[size]} /><bufferGeometry><bufferAttribute attach="attributes-position" args={[geoData.pos, 3]} count={6} /><bufferAttribute attach="attributes-uv" args={[geoData.uv, 2]} count={6} /></bufferGeometry></mesh>, scene)}
      <points ref={points}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} count={size * size} /></bufferGeometry>
        <shaderMaterial transparent blending={THREE.AdditiveBlending} depthWrite={false} fragmentShader={renderFragmentShader} vertexShader={renderVertexShader} uniforms={uniforms} />
      </points>
    </>
  );
};

const FboParticles = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const check = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <RotatingScene><FBOParticles isDarkMode={isDarkMode} /></RotatingScene>
      </Canvas>
    </div>
  );
};

export default FboParticles;