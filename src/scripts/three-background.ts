import * as THREE from 'three';
import { isMobileDevice, isPageVisible } from './environment';

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let blobMesh: THREE.Mesh | null = null;
let mouseX = 0;
let mouseY = 0;
let scrollProgress = 0;
let blobGroup: THREE.Group | null = null;
let particles: THREE.Points | null = null;
let connectionLines: THREE.LineSegments | null = null;
let orbitalRings: THREE.Mesh[] = [];
let particleVelocities: Float32Array | null = null;
let particleCount = 0;
let starField: THREE.Points | null = null;
let animationId: number | null = null;
let isPaused = false;
let maxConnectionLines = 500;
let skipFactor = 5;

const config = {
  mobile: {
    geometryDetail: 32,
    particleCount: 1000,
    starCount: 4000,
    maxConnectionLines: 200,
    antialias: false,
  },
  desktop: {
    geometryDetail: 64,
    particleCount: 3000,
    starCount: 12000,
    maxConnectionLines: 500,
    antialias: true,
  }
};

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec3 pos = position;
    
    float noise = snoise(pos * 0.5 + uTime * 0.15);
    float noise2 = snoise(pos * 0.8 + uTime * 0.1);
    float noise3 = snoise(pos * 1.2 + uTime * 0.075);
    
    float displacement = (noise * 0.3 + noise2 * 0.2 + noise3 * 0.1) * 0.4;
    
    vec3 mouseInfluence = normalize(pos) * 0.0;
    float mouseDistance = distance(uMouse, vec2(pos.x, pos.y));
    if (mouseDistance < 2.0) {
      mouseInfluence = normalize(pos) * (1.0 - mouseDistance / 2.0) * 0.3;
    }
    
    pos += normal * displacement + mouseInfluence;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vec3 color1 = vec3(0.545, 0.169, 0.886);
    vec3 color2 = vec3(0.655, 0.545, 0.980);
    vec3 color3 = vec3(0.290, 0.102, 0.541);
    
    float gradient = (vPosition.y + 2.0) / 4.0;
    vec3 baseColor = mix(color3, color1, gradient);
    
    baseColor = mix(baseColor, color2, uScrollProgress * 0.3);
    
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
    
    vec3 finalColor = mix(baseColor, color2, fresnel * 0.5);
    
    float glow = fresnel * (0.3 + uScrollProgress * 0.4);
    
    float alpha = 0.15 + fresnel * 0.25 + uScrollProgress * 0.2;
    
    gl_FragColor = vec4(finalColor + glow, alpha);
  }
`;

function onWindowResize(): void {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const currentConfig = isMobileDevice() ? config.mobile : config.desktop;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, currentConfig.antialias ? 2 : 1));

  const isMobile = isMobileDevice();
  const targetZ = isMobile ? 6.5 : 5;
  if (Math.abs(camera.position.z - targetZ) < 1) {
    camera.position.z = targetZ;
  }
}

function onScroll(): void {
  if (!camera) return;

  const isMobile = isMobileDevice();
  const minZ = isMobile ? 6.5 : 5;
  const maxZ = 18;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  const scrollFactor = scrollProgress * (maxZ - minZ);
  camera.position.z = minZ + scrollFactor;

  if (blobGroup) {
    blobGroup.position.y = -scrollProgress * 2;
  }
}

export function initThreeBackground(): void {
  const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.warn('Elemento canvas 3D não encontrado.');
    return;
  }

  try {
    document.body.classList.add('has-webgl');
    document.body.classList.remove('no-webgl');

    const currentConfig = isMobileDevice() ? config.mobile : config.desktop;
    maxConnectionLines = currentConfig.maxConnectionLines;
    skipFactor = isMobileDevice() ? 8 : 5;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const isMobile = isMobileDevice();
    const initialZ = isMobile ? 6.5 : 5;
    camera.position.set(0, 0, initialZ);

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: currentConfig.antialias,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, currentConfig.antialias ? 2 : 1));
    renderer.setClearColor(0x000000, 0);

    canvas.style.opacity = '1';

    blobGroup = new THREE.Group();
    scene.add(blobGroup);

    const geometry = new THREE.IcosahedronGeometry(2, currentConfig.geometryDetail);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScrollProgress: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    blobMesh = new THREE.Mesh(geometry, material);
    blobGroup.add(blobMesh);

    particleCount = currentConfig.particleCount;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      particleSizes[i] = Math.random() * 0.03 + 0.01;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.005;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        color: { value: new THREE.Color(0xa78bfa) }
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform float uScrollProgress;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = vec3(0.655, 0.545, 0.980);
          vAlpha = 0.4 + uScrollProgress * 0.3;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pointSize = size * (300.0 / -mvPosition.z) * (1.0 + uScrollProgress * 0.5);
          pointSize = clamp(pointSize, 1.0, 14.0);
          gl_PointSize = pointSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });

    connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionLines);

    const starCount = currentConfig.starCount;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const ringCount = 2;
    orbitalRings = [];
    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(3 + i * 1.5, 3.1 + i * 1.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x8a2be2,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.userData = { speed: 0.2 + i * 0.1, offset: i * Math.PI / ringCount };
      orbitalRings.push(ring);
      scene.add(ring);
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    document.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);

    function handleVisibilityChange(): void {
      if (document.hidden) {
        isPaused = true;
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      } else if (isPaused && isPageVisible()) {
        isPaused = false;
        animate();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const clock = new THREE.Clock();

    function animate(): void {
      if (!renderer || isPaused || !isPageVisible()) {
        return;
      }

      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (blobMesh && blobMesh.material instanceof THREE.ShaderMaterial) {
        blobMesh.material.uniforms.uTime.value = elapsedTime;
        blobMesh.material.uniforms.uMouse.value.set(mouseX * 2, mouseY * 2);
        blobMesh.material.uniforms.uScrollProgress.value = scrollProgress;

        const scale = 1 + scrollProgress * 0.5;
        blobMesh.scale.set(scale, scale, scale);

        blobMesh.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1 + mouseY * 0.1;
        blobMesh.rotation.y = elapsedTime * 0.025 + mouseX * 0.1;
      }

      if (particles && particles.material instanceof THREE.ShaderMaterial) {
        particles.material.uniforms.uTime.value = elapsedTime;
        particles.material.uniforms.uScrollProgress.value = scrollProgress;

        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particleVelocities;

        if (velocities) {
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            const dist = Math.sqrt(
              positions[i * 3] ** 2 +
              positions[i * 3 + 1] ** 2 +
              positions[i * 3 + 2] ** 2
            );

            if (dist > 8) {
              const radius = 4 + Math.random() * 3;
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(Math.random() * 2 - 1);

              positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
              positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
              positions[i * 3 + 2] = radius * Math.cos(phi);
            }
          }

          particles.geometry.attributes.position.needsUpdate = true;
          particles.rotation.y = elapsedTime * 0.01;
        }
      }

      if (starField) {
        starField.rotation.y = elapsedTime * 0.002;
      }

      if (connectionLines && particles && particleVelocities) {
        const linePositions = connectionLines.geometry.attributes.position.array as Float32Array;
        const particlePositions = particles.geometry.attributes.position.array as Float32Array;
        let lineIndex = 0;
        const maxDistance = 1.2;
        const maxLines = maxConnectionLines;

        for (let i = 0; i < particleCount && lineIndex < maxLines * 6; i += skipFactor * 3) {
          for (let j = i + skipFactor * 3; j < particleCount && lineIndex < maxLines * 6; j += skipFactor * 3) {
            const dx = particlePositions[i] - particlePositions[j];
            const dy = particlePositions[i + 1] - particlePositions[j + 1];
            const dz = particlePositions[i + 2] - particlePositions[j + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
              linePositions[lineIndex] = particlePositions[i];
              linePositions[lineIndex + 1] = particlePositions[i + 1];
              linePositions[lineIndex + 2] = particlePositions[i + 2];
              linePositions[lineIndex + 3] = particlePositions[j];
              linePositions[lineIndex + 4] = particlePositions[j + 1];
              linePositions[lineIndex + 5] = particlePositions[j + 2];
              lineIndex += 6;
            }
          }
        }

        for (let i = lineIndex; i < maxLines * 6; i++) {
          linePositions[i] = 0;
        }

        connectionLines.geometry.attributes.position.needsUpdate = true;
        if (connectionLines.material instanceof THREE.LineBasicMaterial) {
          connectionLines.material.opacity = 0.1 + scrollProgress * 0.15;
        }
      }

      orbitalRings.forEach((ring, i) => {
        const data = ring.userData as { speed: number; offset: number };
        ring.rotation.z = elapsedTime * data.speed * 0.5 + data.offset;
        ring.rotation.y = Math.sin(elapsedTime * 0.05 + i) * 0.2;
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = 0.1 + scrollProgress * 0.1;
        }
      });

      if (camera) {
        const cameraOffsetX = Math.sin(elapsedTime * 0.05) * 0.3 + mouseX * 0.5;
        const cameraOffsetY = Math.cos(elapsedTime * 0.075) * 0.2 + mouseY * 0.5;
        camera.position.x = cameraOffsetX;
        camera.position.y = cameraOffsetY;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene!, camera!);
    }

    if (isPageVisible()) {
      animate();
    }
  } catch (error) {
    console.error('Falha ao inicializar cena 3D:', error);
    canvas.style.display = 'none';
    document.body.classList.remove('has-webgl');
    document.body.classList.add('no-webgl');
  }
}

