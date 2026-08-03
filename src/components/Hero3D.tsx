import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, Ring } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ELEMENT_COLOR, ELEMENT_LABEL, type Element } from "../lib/elements";
import { elementRatios } from "../data/baziProfile";
import {
  mercuryTexture,
  venusTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  saturnRingTexture,
  sunTexture,
} from "../lib/planetTextures";

const ORBIT_ORDER: Element[] = ["moc", "hoa", "tho", "kim", "thuy"];

const PLANET_NAME: Record<Element, string> = {
  moc: "Sao Mộc",
  hoa: "Sao Hỏa",
  tho: "Sao Thổ",
  kim: "Sao Kim",
  thuy: "Sao Thủy",
};

const TEXTURE_BY_ELEMENT: Record<Element, () => THREE.CanvasTexture> = {
  moc: jupiterTexture,
  hoa: marsTexture,
  tho: saturnTexture,
  kim: venusTexture,
  thuy: mercuryTexture,
};

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function SaturnRing({ size }: { size: number }) {
  const texture = useMemo(() => saturnRingTexture(), []);
  return (
    <Ring args={[size * 1.5, size * 2.4, 64]} rotation={[Math.PI / 2.35, 0, 0]}>
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.85}
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
  const [hovered, setHovered] = useState(false);
  const angleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const color = ELEMENT_COLOR[element];
  const texture = useMemo(() => TEXTURE_BY_ELEMENT[element](), [element]);
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
        <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <sphereGeometry args={[size, 56, 56]} />
          <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
        </mesh>
        {/* quầng khí đại diện Ngũ Hành — giữ mặt hành tinh thật rõ nét, chỉ viền màu bao quanh */}
        <mesh scale={hovered ? 1.22 : 1.12}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.28 : 0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {element === "tho" && <SaturnRing size={size} />}
      </group>
      {hovered && (
        <Html distanceFactor={10} position={[0, size + 0.6, 0]} center>
          <div className="glass glass-gold-edge rounded-full px-3 py-1 text-xs whitespace-nowrap font-display pointer-events-none">
            <span style={{ color }}>
              {PLANET_NAME[element]} · {ELEMENT_LABEL[element]}
            </span>
          </div>
        </Html>
      )}
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
  const texture = useMemo(() => sunTexture(), []);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });
  return (
    <>
      <Sphere ref={ref} args={[1.15, 64, 64]}>
        <meshStandardMaterial map={texture} emissive="#ffb454" emissiveIntensity={1.7} roughness={1} />
      </Sphere>
      {/* quầng sáng phụ để mô phỏng vành nhật hoa khi bloom cộng hưởng */}
      <Sphere args={[1.35, 32, 32]}>
        <meshBasicMaterial color="#ffcf7a" transparent opacity={0.12} depthWrite={false} />
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
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 0, 0]} intensity={6} color="#ffcf7a" distance={50} decay={1.6} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.4]} />
      <Nebula />
      <Stars radius={90} depth={50} count={4500} factor={2.8} saturation={0} fade speed={reduced ? 0 : 0.6} />
      <Sun />
      {ORBIT_ORDER.map((el, i) => {
        const radius = 2.7 + i * 1.4;
        const pct = ratioMap.get(el) ?? 10;
        const size = 0.26 + (pct / 40) * 0.55;
        const speed = 0.16 - i * 0.02;
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
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.15} />
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
        <Canvas camera={{ position: [0, 5, 13], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <Scene reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
