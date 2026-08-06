import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Ring, useTexture, Billboard } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Element } from "../lib/elements";
import { elementRatios } from "../data/baziProfile";
import mercuryImg from "../assets/textures/mercury.jpg";
import venusImg from "../assets/textures/venus.jpg";
import marsImg from "../assets/textures/mars.jpg";
import jupiterImg from "../assets/textures/jupiter.jpg";
import saturnImg from "../assets/textures/saturn.jpg";
import sunImg from "../assets/textures/sun.jpg";

// Thứ tự từ trong ra ngoài — Sao Thổ (vành đai) đặt xa nhất để không chen chúc các hành tinh khác
const ORBIT_ORDER: Element[] = ["moc", "thuy", "kim", "hoa", "tho"];

// Ảnh bề mặt thật (NASA / Solar System Scope, CC BY 4.0) ứng với ngũ tinh cổ truyền
const TEXTURE_URL_BY_ELEMENT: Record<Element, string> = {
  moc: jupiterImg,
  hoa: marsImg,
  tho: saturnImg,
  kim: venusImg,
  thuy: mercuryImg,
};

// Mặt Trời phóng to để đúng tỷ lệ thị giác thật ngoài đời (luôn lớn vượt trội so với mọi hành tinh),
// nên các quỹ đạo Ngũ Hành phải dời ra xa hơn để không bị lấn vào khối Mặt Trời.
const SUN_RADIUS = 2.1;

// Trái Đất — điểm nhìn của chính người xem — quay quanh Mặt Trời, còn Mặt Trăng quay quanh Trái Đất (đúng cơ học thật).
const EARTH_ORBIT_RADIUS = 3.4;
const EARTH_ORBIT_SPEED = 0.165;
const EARTH_SIZE = 0.5;
const MOON_LOCAL_ORBIT_RADIUS = 0.78;
const MOON_LOCAL_ORBIT_SPEED = 1.3;
const MOON_SIZE = 0.14;

// Bán kính quỹ đạo cách đều nhau cho cân bằng thị giác — Sao Thổ vẫn ở vòng ngoài cùng vì có vành đai.
const ORBIT_RADIUS: Record<Element, number> = {
  moc: 5.2,
  thuy: 6.6,
  kim: 8.0,
  hoa: 9.4,
  tho: 10.8,
};
const ORBIT_SPEED: Record<Element, number> = {
  moc: 0.2,
  thuy: 0.17,
  kim: 0.145,
  hoa: 0.12,
  tho: 0.085,
};

// Góc khởi đầu cố định (thay vì random) để hai bên trái/phải luôn cân bằng số lượng hành tinh
// ngay từ khung hình đầu tiên: moc + hoa bên phải, thuy + kim bên trái, tho ở chính giữa phía sau.
const ORBIT_ANGLE: Record<Element, number> = {
  moc: (55 * Math.PI) / 180,
  hoa: (335 * Math.PI) / 180,
  thuy: (195 * Math.PI) / 180,
  kim: (165 * Math.PI) / 180,
  tho: (270 * Math.PI) / 180,
};

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

/** Thiết bị cảm ứng — tắt Bloom vì kỹ thuật render-to-texture nhiều lượt của nó dễ render sai
 * (mảng trắng cháy sáng, mất chi tiết) trên một số GPU di động/webview trong ứng dụng. */
function useIsCoarsePointer() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  }, []);
}

/** Vành đai Sao Thổ dựng bằng hạt bụi (Points) rải ngẫu nhiên trong hình khuyên, thay vì một mặt phẳng vẽ rõ nét. */
function SaturnDustRing({ size }: { size: number }) {
  const positions = useMemo(() => {
    const count = 1100;
    const inner = size * 1.45;
    const outer = size * 2.5;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = inner + Math.random() * (outer - inner);
      const theta = Math.random() * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * size * 0.05;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = jitter;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, [size]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size * 0.045}
        color="#dcccA0"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Planet({
  element,
  radius,
  speed,
  size,
  angleOffset,
  reduced,
}: {
  element: Element;
  radius: number;
  speed: number;
  size: number;
  angleOffset: number;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(TEXTURE_URL_BY_ELEMENT[element]);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.3, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const angle = angleOffset + t * speed;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.rotation.y += reduced ? 0 : 0.01;
  });

  return (
    <group ref={groupRef}>
      <group rotation={[tilt, 0, tilt * 0.6]}>
        <mesh>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.02} />
        </mesh>
        {element === "tho" && <SaturnDustRing size={size} />}
      </group>
    </group>
  );
}

function OrbitRing({ radius, color = "#d4af37", opacity = 0.16 }: { radius: number; color?: string; opacity?: number }) {
  return (
    <Ring args={[radius - 0.012, radius + 0.012, 160]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </Ring>
  );
}

function useSunGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,180,80,0.5)");
    grad.addColorStop(1, "rgba(255,120,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Quầng sáng cam toả quanh Mặt Trời — cùng kỹ thuật Billboard + cộng màu (Additive) dùng cho các ngôi sao ở trang Chiêm tinh. */
function SunGlow({ reduced }: { reduced: boolean }) {
  const glowTexture = useSunGlowTexture();
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 0.8) * 0.06;
    if (ref.current) ref.current.scale.setScalar(pulse);
  });
  return (
    <Billboard>
      <mesh ref={ref}>
        <planeGeometry args={[SUN_RADIUS * 3.6, SUN_RADIUS * 3.6]} />
        <meshBasicMaterial
          map={glowTexture}
          color="#ff8a2e"
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}

function Sun({ reduced }: { reduced: boolean }) {
  const texture = useTexture(sunImg);
  texture.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });
  return (
    <>
      <SunGlow reduced={reduced} />
      <Sphere ref={ref} args={[SUN_RADIUS, 64, 64]}>
        <meshStandardMaterial map={texture} emissive="#ff9d2e" emissiveIntensity={0.55} roughness={1} />
      </Sphere>
    </>
  );
}

/** Bề mặt Mặt Trăng dựng bằng canvas thủ công (gradient xám + hố thiên thạch rải ngẫu nhiên) — không cần ảnh tải ngoài. */
function useMoonTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const base = ctx.createRadialGradient(96, 88, 8, 128, 128, 170);
    base.addColorStop(0, "#efeceb");
    base.addColorStop(1, "#9b988f");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 55; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 2.5 + Math.random() * 13;
      ctx.beginPath();
      ctx.fillStyle = `rgba(70,66,60,${0.12 + Math.random() * 0.16})`;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,253,248,${0.1 + Math.random() * 0.12})`;
      ctx.lineWidth = 1;
      ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.85, 0, Math.PI * 2);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** Bề mặt Trái Đất dựng bằng canvas thủ công — nền đại dương xanh, lục địa xanh lục dạng đa giác ngẫu nhiên, vệt mây trắng mờ. */
function useEarthTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const ocean = ctx.createRadialGradient(90, 90, 8, 128, 128, 180);
    ocean.addColorStop(0, "#4a9bdb");
    ocean.addColorStop(1, "#1c4f86");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#4f9455";
    for (let i = 0; i < 9; i++) {
      const cx = Math.random() * 256;
      const cy = Math.random() * 256;
      const points = 7 + Math.floor(Math.random() * 4);
      ctx.beginPath();
      for (let p = 0; p < points; p++) {
        const ang = (p / points) * Math.PI * 2;
        const rad = 9 + Math.random() * 20;
        const x = cx + Math.cos(ang) * rad;
        const y = cy + Math.sin(ang) * rad * 0.8;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 6 + Math.random() * 14;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Moon({ radius, speed, size, reduced }: { radius: number; speed: number; size: number; reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useMoonTexture();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const angle = (200 * Math.PI) / 180 + t * speed;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.rotation.y += reduced ? 0 : 0.008;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

/** Trái Đất quay quanh Mặt Trời; Mặt Trăng lồng bên trong, quay quanh chính Trái Đất — đúng cơ học thật thay vì quay quanh Mặt Trời trực tiếp. */
function Earth({ radius, speed, size, reduced }: { radius: number; speed: number; size: number; reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useEarthTexture();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const angle = (230 * Math.PI) / 180 + t * speed;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    if (meshRef.current) meshRef.current.rotation.y += reduced ? 0 : 0.014;
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0.41, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
        </mesh>
      </group>
      <group rotation={[0.09, 0, 0]}>
        <OrbitRing radius={MOON_LOCAL_ORBIT_RADIUS} color="#c7d2e0" opacity={0.18} />
        <Moon radius={MOON_LOCAL_ORBIT_RADIUS} speed={MOON_LOCAL_ORBIT_SPEED} size={MOON_SIZE} reduced={reduced} />
      </group>
    </group>
  );
}

function Nebula() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "rgba(120,70,200,0.35)");
    grad.addColorStop(0.5, "rgba(70,40,140,0.16)");
    grad.addColorStop(1, "rgba(10,8,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);
  return (
    <>
      <mesh position={[-14, 4, -30]} rotation={[0, 0, 0]}>
        <planeGeometry args={[46, 46]} />
        <meshBasicMaterial map={texture} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh position={[18, -6, -34]} rotation={[0, 0, Math.PI / 3]}>
        <planeGeometry args={[38, 38]} />
        <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} color="#4a9fe0" />
      </mesh>
    </>
  );
}

function Scene({ reduced, isCoarsePointer }: { reduced: boolean; isCoarsePointer: boolean }) {
  const ratioMap = useMemo(() => {
    const m = new Map<Element, number>();
    elementRatios.forEach((r) => m.set(r.element, r.percent));
    return m;
  }, []);

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.5]} />
      <Nebula />
      <Stars radius={90} depth={50} count={4500} factor={2.8} saturation={0} fade speed={reduced ? 0 : 0.6} />
      {/* Cả hệ dời xuống dưới khung hình để chừa khoảng trên cho tiêu đề, đồng thời bớt khoảng trống thừa bên dưới */}
      <group position={[0, -4.1, 0]}>
        <pointLight position={[0, 0, 0]} intensity={6} color="#ffcf7a" distance={60} decay={1.3} />
        <Sun reduced={reduced} />
        <OrbitRing radius={EARTH_ORBIT_RADIUS} color="#7fb8e8" opacity={0.18} />
        <Earth radius={EARTH_ORBIT_RADIUS} speed={EARTH_ORBIT_SPEED} size={EARTH_SIZE} reduced={reduced} />
        {ORBIT_ORDER.map((el) => {
          const radius = ORBIT_RADIUS[el];
          const pct = ratioMap.get(el) ?? 10;
          const size = 0.42 + (pct / 40) * 0.68;
          const speed = ORBIT_SPEED[el];
          return (
            <group key={el}>
              <OrbitRing radius={radius} />
              <Planet
                element={el}
                radius={radius}
                speed={speed}
                size={size}
                angleOffset={ORBIT_ANGLE[el]}
                reduced={reduced}
              />
            </group>
          );
        })}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
      {!reduced && !isCoarsePointer && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.2} />
        </EffectComposer>
      )}
    </>
  );
}

export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 8, 28], fov: 42 }}
          dpr={isCoarsePointer ? [1, 1.5] : [1, 1.75]}
          gl={{ antialias: true }}
        >
          <Scene reduced={reduced} isCoarsePointer={isCoarsePointer} />
        </Canvas>
      </Suspense>
    </div>
  );
}
