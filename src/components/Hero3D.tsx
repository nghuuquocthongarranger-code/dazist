import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";
import { ELEMENT_COLOR, ELEMENT_LABEL, type Element } from "../lib/elements";
import { elementRatios } from "../data/baziProfile";

const ORBIT_ORDER: Element[] = ["moc", "hoa", "tho", "kim", "thuy"];

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const angle = angleOffset + t * speed;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.rotation.y += reduced ? 0 : 0.008;
  });

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.45}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>
      {hovered && (
        <Html distanceFactor={10} position={[0, size + 0.5, 0]} center>
          <div className="glass glass-gold-edge rounded-full px-3 py-1 text-xs whitespace-nowrap font-display pointer-events-none">
            <span style={{ color }}>{ELEMENT_LABEL[element]}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <Ring args={[radius - 0.01, radius + 0.01, 128]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#d4af37" transparent opacity={0.15} side={THREE.DoubleSide} />
    </Ring>
  );
}

function Sun() {
  return (
    <Sphere args={[1.1, 64, 64]}>
      <meshStandardMaterial
        color="#f1d98b"
        emissive="#d4af37"
        emissiveIntensity={1.4}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
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
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#f1d98b" distance={40} decay={2} />
      <Stars radius={80} depth={40} count={2500} factor={2.5} saturation={0} fade speed={reduced ? 0 : 0.5} />
      <Sun />
      {ORBIT_ORDER.map((el, i) => {
        const radius = 2.6 + i * 1.35;
        const pct = ratioMap.get(el) ?? 10;
        const size = 0.28 + (pct / 40) * 0.55;
        const speed = 0.18 - i * 0.022;
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
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
      />
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
