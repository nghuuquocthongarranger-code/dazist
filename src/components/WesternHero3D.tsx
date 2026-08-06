import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Line, Html, Billboard, useCursor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export interface ConstellationStar {
  key: string | null;
  label: string | null;
  position: [number, number, number];
}

// Phỏng theo hình dạng thật của chòm sao Kim Ngưu (Taurus) — một đường dài từ đỉnh xuống cụm sao
// trung tâm (giống cụm Hyades hình chữ V), tỏa nhánh sang trái/phải và một cái đuôi phía dưới.
// 9 điểm sao, chỉ 5 điểm là "sao chính" ứng với 5 chủ đề nội dung; các điểm còn lại chỉ để nối hình.
const STARS: ConstellationStar[] = [
  { key: "natal", label: "Bản đồ sao", position: [-2.1, 2.5, 0.2] }, // 0 — đỉnh, sao sáng
  { key: null, label: null, position: [-0.9, 1.1, -0.2] }, // 1 — nối xuống cụm
  { key: null, label: null, position: [-0.5, 0.35, 0.3] }, // 2 — cụm trên-trái
  { key: "personality", label: "Tính cách", position: [0.1, -0.25, 0] }, // 3 — trung tâm cụm
  { key: null, label: null, position: [0.75, 0.05, -0.3] }, // 4 — cụm trên-phải
  { key: "relationships", label: "Tình duyên", position: [-3.5, 0.5, 0.5] }, // 5 — nhánh trái xa
  { key: "careerWealth", label: "Sự nghiệp & Tài chính", position: [2.1, 1.3, -0.4] }, // 6 — nhánh phải xa
  { key: null, label: null, position: [0.9, -1.15, 0.3] }, // 7 — đuôi
  { key: "health", label: "Sức khỏe", position: [1.85, -2.3, 0] }, // 8 — cuối đuôi
];

// Các cạnh nối giữa điểm sao (không phải một đường liền — chòm sao thật có nhánh rẽ)
const EDGES: [number, number][] = [
  [0, 1],
  [1, 3],
  [2, 3],
  [3, 4],
  [5, 2],
  [4, 6],
  [3, 7],
  [7, 8],
];

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

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function Nebula() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "rgba(90,110,220,0.3)");
    grad.addColorStop(0.5, "rgba(60,50,150,0.14)");
    grad.addColorStop(1, "rgba(10,8,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <>
      <mesh position={[-10, 3, -22]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[14, -4, -26]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[34, 34]} />
        <meshBasicMaterial map={texture} transparent opacity={0.38} depthWrite={false} color="#d4af37" />
      </mesh>
    </>
  );
}

function StarGlow({ radius, color, opacity, glowTexture }: { radius: number; color: string; opacity: number; glowTexture: THREE.Texture }) {
  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[radius, radius]} />
        <meshBasicMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}

function FillerStar({ position, index, reduced, glowTexture }: { position: [number, number, number]; index: number; reduced: boolean; glowTexture: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => index * 2.3 + Math.random() * 2, [index]);
  const [twinkle, setTwinkle] = useState(1);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const v = 0.55 + Math.sin(t * (1.1 + (index % 3) * 0.2) + phase) * 0.35;
    setTwinkle(v);
    if (ref.current) ref.current.scale.setScalar(v);
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#dbe6ff" emissive="#dbe6ff" emissiveIntensity={1.4} roughness={0.4} />
      </mesh>
      <StarGlow radius={0.26} color="#dbe6ff" opacity={twinkle * 0.35} glowTexture={glowTexture} />
    </group>
  );
}

function ActiveStar({
  star,
  index,
  reduced,
  glowTexture,
  onSelect,
  hideLabel,
}: {
  star: ConstellationStar;
  index: number;
  reduced: boolean;
  glowTexture: THREE.Texture;
  onSelect: (key: string) => void;
  hideLabel: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const coreRef = useRef<THREE.Mesh>(null);
  const [glowOpacity, setGlowOpacity] = useState(0.7);
  const phase = useMemo(() => index * 1.7, [index]);
  useCursor(hovered);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.getElapsedTime();
    const twinkle = 0.88 + Math.sin(t * 1.3 + phase) * 0.12;
    const targetScale = (hovered ? 1.55 : 1) * twinkle;
    if (coreRef.current) coreRef.current.scale.setScalar(targetScale);
    setGlowOpacity((hovered ? 0.95 : 0.65) * twinkle);
  });

  return (
    <group position={star.position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (star.key) onSelect(star.key);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <StarGlow radius={hovered ? 1.15 : 0.9} color="#fff6d6" opacity={glowOpacity} glowTexture={glowTexture} />
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color="#fff6d6"
          emissive={hovered ? "#ffe8a8" : "#f1d98b"}
          emissiveIntensity={hovered ? 2.6 : 1.7}
          roughness={0.25}
        />
      </mesh>
      {!hideLabel && (
        <Html center distanceFactor={16} position={[0, -0.55, 0]} style={{ pointerEvents: "none" }}>
          <p
            className="whitespace-nowrap font-display text-center transition-all duration-300"
            style={{
              color: hovered ? "#f1d98b" : "rgba(255,255,255,0.5)",
              fontSize: hovered ? "13px" : "10px",
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
              letterSpacing: "0.03em",
            }}
          >
            {star.label}
          </p>
        </Html>
      )}
    </group>
  );
}

function ConstellationLines() {
  return (
    <>
      {EDGES.map(([a, b], i) => (
        <Line key={i} points={[STARS[a].position, STARS[b].position]} color="#d4af37" transparent opacity={0.28} lineWidth={1} />
      ))}
    </>
  );
}

function Scene({
  reduced,
  isCoarsePointer,
  onSelect,
  hideLabels,
}: {
  reduced: boolean;
  isCoarsePointer: boolean;
  onSelect: (key: string) => void;
  hideLabels: boolean;
}) {
  const glowTexture = useGlowTexture();
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.45]} />
      <Nebula />
      <Stars radius={90} depth={50} count={5500} factor={2.6} saturation={0} fade speed={reduced ? 0 : 0.5} />
      <group position={[0, -2.1, 0]}>
        <ConstellationLines />
        {STARS.map((s, i) =>
          s.key ? (
            <ActiveStar
              key={i}
              star={s}
              index={i}
              reduced={reduced}
              glowTexture={glowTexture}
              onSelect={onSelect}
              hideLabel={hideLabels}
            />
          ) : (
            <FillerStar key={i} position={s.position} index={i} reduced={reduced} glowTexture={glowTexture} />
          ),
        )}
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.22}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.9}
      />
      {!reduced && !isCoarsePointer && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

export function WesternHero3D({
  onSelectTopic,
  hideLabels = false,
}: {
  onSelectTopic: (key: string) => void;
  hideLabels?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  return (
    <div className="absolute inset-0" aria-hidden="false">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0.3, 20], fov: 34 }}
          dpr={isCoarsePointer ? [1, 1.5] : [1, 1.75]}
          gl={{ antialias: true }}
        >
          <Scene reduced={reduced} isCoarsePointer={isCoarsePointer} onSelect={onSelectTopic} hideLabels={hideLabels} />
        </Canvas>
      </Suspense>
    </div>
  );
}
