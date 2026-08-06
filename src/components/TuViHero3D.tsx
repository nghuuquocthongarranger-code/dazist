import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Billboard } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Hậu Thiên Bát Quái — thứ tự theo chiều kim đồng hồ bắt đầu từ Ly (Nam, đặt ở đỉnh).
const TRIGRAMS = [
  { symbol: "☲", name: "Ly" },
  { symbol: "☷", name: "Khôn" },
  { symbol: "☱", name: "Đoài" },
  { symbol: "☰", name: "Càn" },
  { symbol: "☵", name: "Khảm" },
  { symbol: "☶", name: "Cấn" },
  { symbol: "☳", name: "Chấn" },
  { symbol: "☴", name: "Tốn" },
];

const CHI_12 = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    grad.addColorStop(0.3, "rgba(255,255,255,0.4)");
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
    grad.addColorStop(0, "rgba(212,175,55,0.26)");
    grad.addColorStop(0.5, "rgba(150,40,40,0.12)");
    grad.addColorStop(1, "rgba(10,8,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <>
      <mesh position={[-10, 3, -22]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[14, -4, -26]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[34, 34]} />
        <meshBasicMaterial map={texture} transparent opacity={0.3} depthWrite={false} color="#d4af37" />
      </mesh>
    </>
  );
}

/** Thuật toán hình học Thái Cực thật — 2 nửa hình S lồng nhau + 2 chấm đối màu. */
function drawTaiji(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, colorA: string, colorB: string) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = colorA;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fillStyle = colorB;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r / 2, 0, Math.PI * 2);
  ctx.fillStyle = colorB;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r / 2, 0, Math.PI * 2);
  ctx.fillStyle = colorA;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r / 7, 0, Math.PI * 2);
  ctx.fillStyle = colorA;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r / 7, 0, Math.PI * 2);
  ctx.fillStyle = colorB;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 4;
  ctx.stroke();
}

/** Vẽ 1 hào (nét liền = Dương, nét đứt hai đoạn = Âm) của một quẻ, xếp chồng 3 hào từ dưới lên. */
function drawTrigramGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number, symbol: string, scale: number) {
  const LINES: Record<string, boolean[]> = {
    "☰": [true, true, true],
    "☱": [false, true, true],
    "☲": [true, false, true],
    "☳": [false, false, true],
    "☴": [true, true, false],
    "☵": [false, true, false],
    "☶": [true, false, false],
    "☷": [false, false, false],
  };
  const yao = LINES[symbol] ?? [true, true, true];
  const w = 46 * scale;
  const h = 8 * scale;
  const gap = 12 * scale;
  ctx.save();
  ctx.translate(cx, cy);
  yao.forEach((yang, i) => {
    const y = (1 - i) * gap - gap;
    ctx.fillStyle = "#f1d98b";
    if (yang) {
      ctx.fillRect(-w / 2, y - h / 2, w, h);
    } else {
      ctx.fillRect(-w / 2, y - h / 2, w * 0.42, h);
      ctx.fillRect(w / 2 - w * 0.42, y - h / 2, w * 0.42, h);
    }
  });
  ctx.restore();
}

/** Vẽ toàn bộ gương Bát Quái: Thái Cực ở tâm + 8 quẻ xoay quanh, viền vàng. */
function useBaguaTexture() {
  return useMemo(() => {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 14;

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "#120f22";
    ctx.fill();

    const seg = (Math.PI * 2) / 8;
    TRIGRAMS.forEach((t, i) => {
      const aStart = -Math.PI / 2 + i * seg - seg / 2 + 0.012;
      const aEnd = aStart + seg - 0.024;
      const grad = ctx.createRadialGradient(cx, cy, R * 0.42, cx, cy, R);
      grad.addColorStop(0, i % 2 === 0 ? "#2a2340" : "#241d38");
      grad.addColorStop(1, i % 2 === 0 ? "#3a3060cc" : "#332a52cc");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, aStart, aEnd);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      const aMid = -Math.PI / 2 + i * seg;
      const lx = cx + Math.cos(aMid) * R * 0.76;
      const ly = cy + Math.sin(aMid) * R * 0.76;
      drawTrigramGlyph(ctx, lx, ly, t.symbol, 1.15);
      // Tên quẻ (có dấu đôi như "Tốn", "Cấn") KHÔNG vẽ bằng canvas fillText ở đây — canvas không ghép đúng
      // dấu thanh chồng dấu mũ trong một số font, nhãn được vẽ đè bằng Html DOM riêng (component TrigramLabels).
    });

    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + i * seg - seg / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.42, cy + Math.sin(a) * R * 0.42);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = "rgba(212,175,55,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    drawTaiji(ctx, cx, cy, R * 0.4, "#f1d98b", "#211a38");

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 6;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function canvasAngleToWorldXY(angle: number, r: number): [number, number] {
  return [Math.cos(angle) * r, -Math.sin(angle) * r];
}

function Medallion({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useBaguaTexture();
  const R = 1.0;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.32;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0.9]} intensity={0.5} color="#f1d98b" distance={2.8} decay={1.8} />
      <mesh>
        <circleGeometry args={[R, 96]} />
        <meshStandardMaterial map={texture} roughness={0.35} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <TrigramLabels radius={R} />
    </group>
  );
}

/** Tên 8 quẻ vẽ bằng Html DOM (thay vì canvas fillText) để các chữ có dấu đôi như "Tốn", "Cấn" hiển thị đúng.
 * Đặt theo CÙNG góc với ký hiệu hào trên texture nhưng bán kính lớn hơn (ra ngoài, cùng hướng) — không lệch
 * theo trục dọc cố định — để chữ luôn thẳng hàng đều với hình quẻ ở mọi vị trí quanh vòng tròn. */
function TrigramLabels({ radius }: { radius: number }) {
  const seg = (Math.PI * 2) / 8;
  return (
    <>
      {TRIGRAMS.map((t, i) => {
        const aMid = -Math.PI / 2 + i * seg;
        const [x, y] = canvasAngleToWorldXY(aMid, radius * 0.94);
        return (
          <Html key={t.name} position={[x, y, 0.05]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <span
              className="font-display"
              style={{ fontSize: "11px", color: "rgba(241,217,139,0.9)", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
            >
              {t.name}
            </span>
          </Html>
        );
      })}
    </>
  );
}

function OuterRibbon({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z += delta * 0.04;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.3]}>
      <torusGeometry args={[1.35, 0.007, 16, 128]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.8} roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

/** 12 điểm nhỏ toả sáng quanh gương, ứng 12 Địa Chi / 12 cung của lá số Tử Vi, xoay chậm ngược chiều. */
function ChiRing({ reduced, glowTexture }: { reduced: boolean; glowTexture: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z -= delta * 0.03;
  });
  return (
    <group ref={ref}>
      {CHI_12.map((chi, i) => {
        const angle = -Math.PI / 2 + i * ((Math.PI * 2) / 12);
        const [x, y] = canvasAngleToWorldXY(angle, 1.6);
        return (
          <group key={chi} position={[x, y, -0.1]}>
            <Billboard>
              <mesh>
                <planeGeometry args={[0.19, 0.19]} />
                <meshBasicMaterial
                  map={glowTexture}
                  color="#f1d98b"
                  transparent
                  opacity={0.55}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </Billboard>
            <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
              <span
                className="font-display"
                style={{ fontSize: "9px", color: "#f1d98b", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
              >
                {chi}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const glowTexture = useGlowTexture();
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#8ea6d8", "#0b0a18", 0.4]} />
      <directionalLight position={[4, 8, 4]} intensity={0.7} color="#fff6d6" />
      <Nebula />
      <Stars radius={90} depth={50} count={4500} factor={2.6} saturation={0} fade speed={reduced ? 0 : 0.5} />
      <group position={[0, 0.1, 0]}>
        <OuterRibbon reduced={reduced} />
        <ChiRing reduced={reduced} glowTexture={glowTexture} />
        <Medallion reduced={reduced} />
      </group>
      <OrbitControls
        enabled={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.18}
      />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0.45} luminanceSmoothing={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

export function TuViHero3D() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="w-full h-full" aria-hidden="false">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0.1, 6], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <Scene reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
