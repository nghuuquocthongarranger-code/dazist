import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Billboard } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { type Element } from "../lib/elements";

// Thứ tự Ngũ Hành theo vòng Tương Sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc.
const SINH_ORDER: Element[] = ["moc", "hoa", "tho", "kim", "thuy"];

const ELEMENT_LABEL_VI: Record<Element, string> = {
  moc: "Mộc",
  hoa: "Hỏa",
  tho: "Thổ",
  kim: "Kim",
  thuy: "Thủy",
};

// Bảng màu riêng cho ngũ giác — theo đúng tông màu trong hình tham chiếu người dùng gửi.
const PENTAGON_COLOR: Record<Element, string> = {
  moc: "#2fbf9b", // teal/xanh lá
  hoa: "#e2493f", // đỏ
  tho: "#e0b23c", // vàng/gold
  kim: "#a988d9", // tím/lavender
  thuy: "#22447a", // xanh dương đậm
};

const NATURE_ICON: Record<Element, string> = {
  moc: "🌿",
  hoa: "☀️",
  tho: "⛰️",
  kim: "💎",
  thuy: "🌊",
};

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
    grad.addColorStop(0, "rgba(212,175,55,0.28)");
    grad.addColorStop(0.5, "rgba(120,70,40,0.12)");
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
        <meshBasicMaterial map={texture} transparent opacity={0.32} depthWrite={false} color="#4a9fe0" />
      </mesh>
    </>
  );
}

/** Vẽ đường cung nét dày với đầu mũi tên tại điểm cuối, theo chiều góc tăng dần (thuận kim đồng hồ trên canvas). */
function drawArcArrow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  aStart: number,
  aEnd: number,
  color: string,
) {
  const segs = 28;
  ctx.beginPath();
  for (let s = 0; s <= segs; s++) {
    const a = aStart + (aEnd - aStart) * (s / segs);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.9;
  ctx.stroke();
  ctx.globalAlpha = 1;

  const len = 30;
  const wid = 18;
  const fx = -Math.sin(aEnd);
  const fy = Math.cos(aEnd);
  const nx = Math.cos(aEnd);
  const ny = Math.sin(aEnd);
  const tipX = cx + Math.cos(aEnd) * r;
  const tipY = cy + Math.sin(aEnd) * r;
  const baseX = tipX - fx * len;
  const baseY = tipY - fy * len;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseX + nx * (wid / 2), baseY + ny * (wid / 2));
  ctx.lineTo(baseX - nx * (wid / 2), baseY - ny * (wid / 2));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** Vẽ hình bóng người ngồi thiền kiểu hoa sen đơn giản, có vòng xoắn ốc nhỏ trên ngực. */
function drawMeditatingFigure(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Nền quầng sáng phía sau
  const haloGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 170);
  haloGrad.addColorStop(0, "rgba(241,217,139,0.35)");
  haloGrad.addColorStop(1, "rgba(241,217,139,0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 170, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#120f22";
  ctx.beginPath();
  ctx.arc(0, 0, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f1d98b";
  ctx.shadowColor = "rgba(241,217,139,0.85)";
  ctx.shadowBlur = 18;

  // Chân xếp bằng (đế sen)
  ctx.beginPath();
  ctx.ellipse(0, 82, 92, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Thân
  ctx.beginPath();
  ctx.ellipse(0, 8, 62, 82, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tay trái/phải đặt lên gối
  ctx.beginPath();
  ctx.ellipse(-58, 58, 22, 14, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(58, 58, 22, 14, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Đầu
  ctx.beginPath();
  ctx.arc(0, -70, 27, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Vòng xoắn ốc nhỏ trên ngực
  ctx.beginPath();
  ctx.strokeStyle = "#211a38";
  ctx.lineWidth = 2.5;
  const turns = 3.2;
  const steps = 90;
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * turns * Math.PI * 2;
    const rr = (s / steps) * 17;
    const x = rr * Math.cos(t);
    const y = 6 + rr * Math.sin(t);
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

/** Vẽ toàn bộ mandala Ngũ Hành: 5 mảng màu tam giác + mũi tên vòng Tương Sinh + người thiền ở tâm. */
function usePentagonTexture() {
  return useMemo(() => {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 14;
    const gap = 0.018;

    SINH_ORDER.forEach((el, i) => {
      const aStart = -Math.PI / 2 + i * ((Math.PI * 2) / 5) + gap;
      const aEnd = -Math.PI / 2 + (i + 1) * ((Math.PI * 2) / 5) - gap;
      const grad = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
      grad.addColorStop(0, PENTAGON_COLOR[el]);
      grad.addColorStop(1, PENTAGON_COLOR[el] + "cc");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, aStart, aEnd);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Nhãn tên hành
      const aMid = (aStart + aEnd) / 2;
      const lx = cx + Math.cos(aMid) * R * 0.72;
      const ly = cy + Math.sin(aMid) * R * 0.72;
      ctx.font = "600 34px Georgia, serif";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 8;
      ctx.fillText(ELEMENT_LABEL_VI[el], lx, ly);
      ctx.shadowBlur = 0;

      // Mũi tên Tương Sinh chạy dọc theo mảng, hướng sang hành kế tiếp
      drawArcArrow(ctx, cx, cy, R * 0.48, aStart + 0.1, aEnd - 0.1, "rgba(255,255,255,0.85)");
    });

    // Viền vàng ngoài
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 5;
    ctx.stroke();

    drawMeditatingFigure(ctx, cx, cy, 0.82);

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
  const texture = usePentagonTexture();
  const R = 3.2;

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.32;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 2]} intensity={1.6} color="#f1d98b" distance={9} decay={1.8} />
      <mesh>
        <circleGeometry args={[R, 96]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Dải ruy-băng vàng mỏng bao quanh, gợi ý dòng chảy nối 5 điểm thiên nhiên. */
function OuterRibbon({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z += delta * 0.045;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.3]}>
      <torusGeometry args={[3.75, 0.02, 16, 128]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1.1} roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

/** 5 điểm hình ảnh thiên nhiên (lá, mặt trời, núi, tinh thể, nước) toả sáng quanh mandala. */
function NatureRing({ glowTexture }: { glowTexture: THREE.Texture }) {
  return (
    <>
      {SINH_ORDER.map((el, i) => {
        const angle = -Math.PI / 2 + (i + 0.5) * ((Math.PI * 2) / 5);
        const [x, y] = canvasAngleToWorldXY(angle, 4.3);
        return (
          <group key={el} position={[x, y, -0.1]}>
            <Billboard>
              <mesh>
                <planeGeometry args={[1.3, 1.3]} />
                <meshBasicMaterial
                  map={glowTexture}
                  color={PENTAGON_COLOR[el]}
                  transparent
                  opacity={0.5}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </Billboard>
            <Html center distanceFactor={13} style={{ pointerEvents: "none" }}>
              <span style={{ fontSize: "22px", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))" }}>
                {NATURE_ICON[el]}
              </span>
            </Html>
          </group>
        );
      })}
    </>
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
      <group position={[0, 0.2, 0]} scale={[0.33, 0.33, 0.33]}>
        <OuterRibbon reduced={reduced} />
        <NatureRing glowTexture={glowTexture} />
        <Medallion reduced={reduced} />
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.18}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.85}
      />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

export function BaziHero3D() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="absolute inset-0" aria-hidden="false">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0.3, 11], fov: 34 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <Scene reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
