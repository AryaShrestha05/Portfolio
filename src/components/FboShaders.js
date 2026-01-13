import * as THREE from "three";

const glslCurlNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3( vec3 x ){
  float s  = snoise(vec3( x ));
  float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  return vec3( s , s1 , s2 );
}

vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e, 0.0, 0.0 );
  vec3 dy = vec3( 0.0, e, 0.0 );
  vec3 dz = vec3( 0.0, 0.0, e );
  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
  return normalize( vec3( x , y , z ) * (1.0 / (2.0 * e)) );
}
`;

export const simulationVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const simulationFragmentShader = `
uniform sampler2D positions;
uniform float uTime;
uniform vec3 uMouse;
uniform vec2 uVelocity;
varying vec2 vUv;

${glslCurlNoise}

void main() {
  vec3 pos = texture2D(positions, vUv).rgb;
  
  // CALM BASE: Very slow, drifting movement
  vec3 flow = curlNoise(pos * 0.5 + uTime * 0.05);
  
  vec3 mousePos = vec3(uMouse.x, uMouse.y, 0.0);
  vec3 fromMouse = pos - mousePos;
  float dist = length(fromMouse);
  vec3 mouseForce = vec3(0.0);

  // AGGRESSION ONLY ON INTERACTION
  float velSense = length(uVelocity); 
  float radius = 1.0 + (velSense * 0.5); // Radius grows when you move fast

  if (dist < radius) {
    float strength = pow(1.0 - (dist / radius), 2.0);
    // Push away harder if moving faster
    mouseForce += normalize(fromMouse) * strength * (0.05 + velSense * 0.2);
    // Follow the mouse trail
    mouseForce += vec3(uVelocity, 0.0) * strength * 0.8;
  }

  // Jitter scales with mouse movement speed
  vec3 jitter = snoiseVec3(pos * 3.0 + uTime) * (0.002 + velSense * 0.01);
  
  vec3 velocity = (flow * 0.008) + mouseForce + jitter;
  vec3 futurePos = pos + velocity;

  if (length(futurePos) > 2.5) futurePos *= 0.98;

  gl_FragColor = vec4(futurePos, 1.0);
}
`;

export const renderVertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 12.0 * (1.0 / -mvPosition.z);
}
`;

export const renderFragmentShader = `
uniform vec3 uColor;
void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.1, dist) * 0.8;
  gl_FragColor = vec4(uColor * 2.0, alpha);
}
`;

const getRandomData = (size) => {
  const data = new Float32Array(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (Math.random() - 0.5) * 2.0;
    data[i + 1] = (Math.random() - 0.5) * 2.0;
    data[i + 2] = (Math.random() - 0.5) * 0.2;
    data[i + 3] = 1.0;
  }
  return data;
};

export class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size) {
    const positionsTexture = new THREE.DataTexture(getRandomData(size), size, size, THREE.RGBAFormat, THREE.FloatType);
    positionsTexture.needsUpdate = true;
    super({
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
}