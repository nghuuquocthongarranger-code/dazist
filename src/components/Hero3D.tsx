import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Ring, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { Element } from "../lib/elements";
import { elementRatios } from "../data/baziProfile";
import mercuryImg from "../assets/textures/mercury.jpg";
import venusImg from "../assets/textures/venus.jpg";
import marsImg from "../assets/textures/mars.jpg";
import jupiterImg from "../assets/textures/jupiter.jpg";
import saturnImg from "../assets/textures/saturn.jpg";
import saturnRingImg from "../assets/textures/saturn_ring.png";
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

// Bán kính & tốc độ quỹ đạo riêng từng hành tinh — giãn cách tăng dần ra ngoài cho cân đối,
// Sao Thổ đặt xa nhất vì có vành đai choán thêm không gian.
const ORBIT_RADIUS: Record<Element, number> = {
  moc: 2.1,
  thuy: 3.0,
  kim: 4.1,
  hoa: 5.3,
  tho: 7.3,
};
const ORBIT_SPEED: Record<Element, number> = {
  moc: 0.2,
  thuy: 0.17,
  kim: 0.145,
  hoa: 0.12,
  tho: 0.085,
};

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function SaturnRing({ size }: { size: number }) {
  const texture = useTexture(saturnRingImg);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <Ring args={[size * 1.5, size * 2.4, 64]} rotation={[Math.PI / 2.35, 0, 0]}>
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </Ring>
  );
}

function Planet({
  element,
  radius,
  speed,
  size,
  reduced,
}: {
  element: Element;
  radius: number;
  speed: number;
  size: number;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
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
        {element === "tho" && <SaturnRing size={size} />}
      </group>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <Ring args={[radius - 0.012, radius + 0.012, 160]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#d4af37" transparent opacity={0.16} side={THREE.DoubleSide} />
    </Ring>
  );
}

function Sun() {
  const texture = useTexture(sunImg);
  texture.colorSpace = THREE.SRGBColorSpace;
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });
  return (
    <>
      <Sphere ref={ref} args={[1.15, 64, 64]}>
        <meshStandardMaterial map={texture} emissive="#ff9d2e" emissiveIntensity={0.55} roughness={1} />
      </Sphere>
      {/* Vành nhật hoa nhiều lớp — tạo cảm giác ánh sáng lan tỏa thật thay vì một khối mờ phẳng */}
      <Sphere args={[1.32, 32, 32]}>
        <meshBasicMaterial color="#ffb454" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[1.55, 32, 32]}>
        <meshBasicMaterial color="#ff9d2e" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[1.9, 24, 24]}>
        <meshBasicMaterial color="#ffcf7a" transparent opacity={0.045} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Sphere>
    </>
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

function Scene({ reduced }: { reduced: boolean }) {
  const ratioMap = useMemo(() => {
    const m = new Map<Element, number>();
    elementRatios.forEach((r) => m.set(r.element, r.percent));
    return m;
  }, []);

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[0, 0, 0]} intensity={6} color="#ffcf7a" distance={60} decay={1.3} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.5]} />
      <Nebula />
      <Stars radius={90} depth={50} count={4500} factor={2.8} saturation={0} fade speed={reduced ? 0 : 0.6} />
      <Sun />
      {ORBIT_ORDER.map((el) => {
        const radius = ORBIT_RADIUS[el];
        const pct = ratioMap.get(el) ?? 10;
        const size = 0.24 + (pct / 40) * 0.5;
        const speed = ORBIT_SPEED[el];
        return (
          <group key={el}>
            <OrbitRing radius={radius} />
            <Planet element={el} radius={radius} speed={speed} size={size} reduced={reduced} />
          </group>
        );
      })}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.2} />
        </EffectComposer>
      )}
    </>
  );
}

export function Hero3D() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 7, 20], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <Scene reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
