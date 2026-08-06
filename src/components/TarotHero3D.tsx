import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles, Float, Billboard, MeshTransmissionMaterial, useCursor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const BALL_RADIUS = 0.95;

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

/** Thiết bị cảm ứng (điện thoại/tablet) — GPU thường không kham nổi kỹ thuật multi-pass
 * (render-to-texture khúc xạ + backside) của MeshTransmissionMaterial, dễ gây lỗi hình ảnh
 * (đen/trắng xoá/vỡ hình). Dùng chất liệu thủy tinh nhẹ hơn cho các thiết bị này. */
function useIsCoarsePointer() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  }, []);
}

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
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
    grad.addColorStop(0, "rgba(150,70,220,0.32)");
    grad.addColorStop(0.5, "rgba(80,40,150,0.14)");
    grad.addColorStop(1, "rgba(10,8,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <>
      <mesh position={[-11, 3, -22]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[13, -5, -26]} rotation={[0, 0, Math.PI / 3]}>
        <planeGeometry args={[34, 34]} />
        <meshBasicMaterial map={texture} transparent opacity={0.35} depthWrite={false} color="#d4af37" />
      </mesh>
    </>
  );
}

/** Chân đế gỗ chạm khắc kiểu đế quả cầu pha lê thật ngoài đời — vòng ôm, thân loe, 3 chân vuốt, viền vàng. */
function Pedestal({ reduced }: { reduced: boolean }) {
  const woodMat = { color: "#2b1a12", roughness: 0.55, metalness: 0.15 } as const;
  const goldMat = { color: "#d4af37", roughness: 0.3, metalness: 0.75, emissive: "#3a2a08", emissiveIntensity: 0.3 } as const;
  const legAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
  const mistRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mistRef.current && !reduced) {
      mistRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group position={[0, -BALL_RADIUS - 0.42, 0]}>
      {/* Vòng ôm cradle đỡ đáy quả cầu */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <torusGeometry args={[BALL_RADIUS * 0.62, BALL_RADIUS * 0.1, 20, 48]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.21, 0]}>
        <torusGeometry args={[BALL_RADIUS * 0.62, BALL_RADIUS * 0.02, 12, 48]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      {/* Thân loe hình nón cụt */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[BALL_RADIUS * 0.5, BALL_RADIUS * 0.34, 0.42, 32]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      <mesh position={[0, -0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BALL_RADIUS * 0.34, 0.018, 10, 32]} />
        <meshStandardMaterial {...goldMat} />
      </mesh>

      {/* Đế tròn đáy */}
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[BALL_RADIUS * 0.62, BALL_RADIUS * 0.7, 0.08, 32]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>

      {/* 3 chân vuốt kiểu cổ điển */}
      {legAngles.map((a, i) => {
        const x = Math.cos(a) * BALL_RADIUS * 0.5;
        const z = Math.sin(a) * BALL_RADIUS * 0.5;
        return (
          <mesh key={i} position={[x, -0.5, z]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.06, 0.22, 10]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
        );
      })}

      {/* Sương mờ huyền bí quẩn quanh đế */}
      <group ref={mistRef}>
        <Sparkles count={18} scale={[BALL_RADIUS * 1.8, 0.3, BALL_RADIUS * 1.8]} size={4} speed={reduced ? 0 : 0.12} color="#c9a6ff" noise={0.6} opacity={0.35} position={[0, -0.3, 0]} />
      </group>
    </group>
  );
}

function useMagicCircleTexture() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    ctx.strokeStyle = "rgba(212,175,55,0.8)";
    ctx.lineWidth = 2;
    [230, 200, 150].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    const points = 8;
    for (let i = 0; i < points; i++) {
      const a1 = (i / points) * Math.PI * 2;
      const a2 = ((i + 3) / points) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * 200, cy + Math.sin(a1) * 200);
      ctx.lineTo(cx + Math.cos(a2) * 200, cy + Math.sin(a2) * 200);
      ctx.strokeStyle = "rgba(212,175,55,0.35)";
      ctx.stroke();
    }
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * 230, cy + Math.sin(a) * 230, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(241,217,139,0.9)";
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);
}

function MagicCircle({ radius, y, reduced }: { radius: number; y: number; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useMagicCircleTexture();
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z += delta * 0.04;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial map={texture} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function CrystalBall({ reduced, onOpen }: { reduced: boolean; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  const coreRef = useRef<THREE.Group>(null);
  const glowTexture = useGlowTexture();
  const isCoarsePointer = useIsCoarsePointer();
  useCursor(hovered);

  useFrame((_state, delta) => {
    if (coreRef.current && !reduced) coreRef.current.rotation.y += delta * 0.1;
  });

  return (
    <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.04 : 1}
      >
        {/* Quầng sáng mềm bao quanh quả cầu — mô phỏng ánh sáng khuếch tán thật ngoài đời */}
        <Billboard>
          <mesh>
            <planeGeometry args={[BALL_RADIUS * (hovered ? 3.4 : 2.9), BALL_RADIUS * (hovered ? 3.4 : 2.9)]} />
            <meshBasicMaterial
              map={glowTexture}
              color="#ffffff"
              transparent
              opacity={hovered ? 0.55 : 0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Billboard>

        <pointLight position={[0, 0, 0]} intensity={hovered ? 1.0 : 0.7} color="#f4f6ff" distance={8} decay={2.2} />
        <pointLight position={[2.4, 2.6, 3.2]} intensity={0.5} color="#fff6d6" distance={16} decay={2} />

        <group ref={coreRef}>
          <Sparkles count={26} scale={BALL_RADIUS * 1.1} size={2} speed={reduced ? 0 : 0.18} color="#f1d98b" noise={0.25} opacity={0.5} />
        </group>

        <mesh>
          <sphereGeometry args={[BALL_RADIUS, isCoarsePointer ? 48 : 96, isCoarsePointer ? 48 : 96]} />
          {isCoarsePointer ? (
            <meshPhysicalMaterial
              color={hovered ? "#ffffff" : "#f2f3f8"}
              transparent
              opacity={0.42}
              roughness={0.08}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.08}
              reflectivity={1}
              envMapIntensity={1.2}
            />
          ) : (
            <MeshTransmissionMaterial
              thickness={1.7}
              roughness={0.16}
              transmission={1}
              ior={1.45}
              chromaticAberration={0.006}
              anisotropicBlur={0.15}
              distortion={0.06}
              distortionScale={0.2}
              temporalDistortion={reduced ? 0 : 0.03}
              backside
              color={hovered ? "#ffffff" : "#f2f3f8"}
            />
          )}
        </mesh>

        <Pedestal reduced={reduced} />
        <MagicCircle radius={BALL_RADIUS * 2.1} y={-BALL_RADIUS - 0.98} reduced={reduced} />
      </group>
    </Float>
  );
}

function Scene({ reduced, onOpen }: { reduced: boolean; onOpen: () => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.45]} />
      <Nebula />
      <Stars radius={90} depth={50} count={4500} factor={2.8} saturation={0} fade speed={reduced ? 0 : 0.5} />
      <group position={[0, -0.15, 0]}>
        <CrystalBall reduced={reduced} onOpen={onOpen} />
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
      />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

export function TarotHero3D({ onOpen }: { onOpen: () => void }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="absolute inset-0" aria-hidden="false">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0.8, 8], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <Scene reduced={reduced} onOpen={onOpen} />
        </Canvas>
      </Suspense>
    </div>
  );
}
