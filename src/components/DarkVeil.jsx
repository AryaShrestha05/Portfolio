import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const vertex = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
uniform vec2 uResolution;
uniform float uTime;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;
uniform float uInvert;

vec4 sigmoid(vec4 x){return 1./(1.+exp(-x));}

vec4 cppn_fn(vec2 uv, float t){
    vec4 buf = vec4(uv.x, uv.y, sin(t * 0.2), cos(t * 0.3));
    // Complex mathematical noise for "smoky" movement
    for(int i=0; i<3; i++) {
        buf = sigmoid(buf * 2.5 + vec4(sin(t + uv.x), cos(t - uv.y), 0.5, 0.2));
    }
    return buf;
}

void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    // Apply warp
    uv += uWarp * vec2(sin(uv.y * 3.0 + uTime), cos(uv.x * 3.0 + uTime));

    vec4 col = cppn_fn(uv, uTime);
    float gray = dot(col.rgb, vec3(0.299, 0.587, 0.114));

    // Base smoke effect
    vec3 smoke = vec3(gray) * 4.0;

    // Add noise and scanlines
    float scan = sin(gl_FragCoord.y * uScanFreq) * uScan;
    smoke -= scan;

    // Invert for light mode (dark smoke on light bg)
    smoke = mix(smoke, 1.0 - smoke * 0.3, uInvert);

    // Reduce opacity for subtlety
    float alpha = mix(0.15, 0.08, uInvert);

    gl_FragColor = vec4(smoke, alpha);
}
`;

export default function DarkVeil({ speed = 0.2, warpAmount = 0.1, resolutionScale = 0.8 }) {
  const ref = useRef();
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Initial check
    checkTheme();

    // Create observer for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uNoise: { value: 0.02 },
      uScan: { value: 0.05 },
      uScanFreq: { value: 2.0 },
      uWarp: { value: warpAmount },
      uInvert: { value: isDark ? 0.0 : 1.0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      blending: THREE.NormalBlending
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w * resolutionScale, h * resolutionScale, false);
      uniforms.uResolution.value.set(canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    let frame;
    const loop = (t) => {
      uniforms.uTime.value = t * 0.001 * speed;
      uniforms.uInvert.value = isDark ? 0.0 : 1.0;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [speed, warpAmount, resolutionScale, isDark]);

  return (
    <canvas
      ref={ref}
      className="w-full h-full opacity-30 dark:opacity-20 transition-opacity duration-500"
    />
  );
}
