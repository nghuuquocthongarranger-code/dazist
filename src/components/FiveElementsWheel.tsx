import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SINH, KHAC, ELEMENT_LABEL, type Element } from "../lib/elements";

// Thứ tự bố trí quanh vòng tròn theo đúng mạch Tương Sinh: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa,
// Hỏa sinh Thổ, Thổ sinh Kim.
const ELEMENT_ORDER: Element[] = ["kim", "thuy", "moc", "hoa", "tho"];

interface GemInfo {
  gemName: string;
  colorLabel: string;
  base: string;
  light: string;
  dark: string;
  glow: string;
}

const GEM_INFO: Record<Element, GemInfo> = {
  kim: { gemName: "Kim Cương (Diamond)", colorLabel: "Trắng trong suốt", base: "#dfe8f0", light: "#ffffff", dark: "#98a7ba", glow: "rgba(225,235,245,0.6)" },
  moc: { gemName: "Lục Bảo (Emerald)", colorLabel: "Xanh lá", base: "#12a870", light: "#6ff0b4", dark: "#0a4d34", glow: "rgba(40,220,150,0.55)" },
  thuy: { gemName: "Lam Ngọc (Sapphire)", colorLabel: "Xanh dương đậm", base: "#1f5fb0", light: "#7ab8ff", dark: "#0b2c56", glow: "rgba(60,130,230,0.55)" },
  hoa: { gemName: "Hồng Ngọc (Ruby)", colorLabel: "Đỏ", base: "#d42b3f", light: "#ff8a93", dark: "#590e17", glow: "rgba(230,45,65,0.55)" },
  tho: { gemName: "Hoàng Ngọc (Yellow Sapphire)", colorLabel: "Vàng", base: "#e0b23c", light: "#ffe792", dark: "#795a14", glow: "rgba(230,185,65,0.55)" },
};

interface Pt {
  x: number;
  y: number;
}

const CENTER: Pt = { x: 50, y: 50 };
const NODE_RADIUS = 34;

function positionFor(index: number, total: number, radius: number): Pt {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER.x + Math.cos(angle) * radius, y: CENTER.y + Math.sin(angle) * radius };
}

function arcPath(from: Pt, to: Pt, bulge = 1.22): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const cx = CENTER.x + (mx - CENTER.x) * bulge;
  const cy = CENTER.y + (my - CENTER.y) * bulge;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

/** Vòng ánh sáng trung tâm bọc Thái Cực Đồ — nửa Dương (vàng nhạt) / nửa Âm (tím than), 2 chấm đối màu. */
function TaijiCore() {
  const R = 11;
  return (
    <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
      <circle r={R + 5} fill="url(#taiji-halo)" />
      <circle r={R} fill="#f1d98b" stroke="#d4af37" strokeWidth={0.6} />
      <path
        d={`M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${R / 2} ${R / 2} 0 0 1 0 0 A ${R / 2} ${R / 2} 0 0 0 0 ${-R} Z`}
        fill="#241a3d"
      />
      <circle cx={0} cy={-R / 2} r={R / 5.2} fill="#241a3d" />
      <circle cx={0} cy={R / 2} r={R / 5.2} fill="#f1d98b" />
      <circle r={R} fill="none" stroke="#d4af37" strokeWidth={0.5} opacity={0.8} />
    </g>
  );
}

function ConnectionLines({ positions, hovered }: { positions: Record<Element, Pt>; hovered: Element | null }) {
  const sinhEdges = ELEMENT_ORDER.map((el) => ({ from: el, to: SINH[el] }));
  const khacEdges = ELEMENT_ORDER.map((el) => ({ from: el, to: KHAC[el] }));

  const isSinhActive = (from: Element, to: Element) => !hovered || from === hovered || to === hovered;
  const isKhacActive = (from: Element, to: Element) => !hovered || from === hovered || to === hovered;

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="taiji-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(241,217,139,0.55)" />
          <stop offset="100%" stopColor="rgba(241,217,139,0)" />
        </radialGradient>
        <filter id="glow-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="sinh-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="#f1d98b" />
        </marker>
      </defs>

      {/* Vòng Khắc — nét đứt, mảnh, đỏ nhạt */}
      {khacEdges.map(({ from, to }) => {
        const active = isKhacActive(from, to);
        return (
          <path
            key={`khac-${from}`}
            d={`M ${positions[from].x} ${positions[from].y} L ${positions[to].x} ${positions[to].y}`}
            fill="none"
            stroke="#ff6b7a"
            strokeWidth={active ? 0.55 : 0.35}
            strokeDasharray="1.6 1.8"
            opacity={active ? 0.55 : 0.14}
            style={{ filter: active ? "url(#glow-soft)" : undefined, transition: "opacity 0.35s ease, stroke-width 0.35s ease" }}
          />
        );
      })}

      {/* Vòng Sinh — nét liền, phát sáng, có mũi tên + hiệu ứng chạy dọc theo chiều sinh */}
      {sinhEdges.map(({ from, to }) => {
        const active = isSinhActive(from, to);
        return (
          <motion.path
            key={`sinh-${from}`}
            d={arcPath(positions[from], positions[to])}
            fill="none"
            stroke="#f1d98b"
            strokeWidth={active ? 0.85 : 0.5}
            strokeLinecap="round"
            strokeDasharray="3 2.2"
            markerEnd="url(#sinh-arrow)"
            style={{ filter: active ? "url(#glow-soft)" : undefined }}
            animate={{ strokeDashoffset: [0, -20.8], opacity: active ? 0.95 : 0.22 }}
            transition={{
              strokeDashoffset: { repeat: Infinity, duration: 2.2, ease: "linear" },
              opacity: { duration: 0.35, ease: "easeOut" },
            }}
          />
        );
      })}

      <TaijiCore />
    </svg>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 46;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.3,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
      a: Math.random() * 0.45 + 0.15,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(241,217,139,${p.a})`;
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function Tooltip({ element }: { element: Element }) {
  const info = GEM_INFO[element];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="absolute z-20 left-1/2 top-full mt-3 w-44 -translate-x-1/2 rounded-xl glass glass-gold-edge p-3 text-left pointer-events-none"
    >
      <p className="font-display text-sm text-gradient-gold font-semibold">{ELEMENT_LABEL[element]}</p>
      <p className="text-[10.5px] text-white/60 mt-0.5">{info.gemName}</p>
      <p className="text-[10.5px] text-white/45">{info.colorLabel}</p>
      <p className="text-[10.5px] mt-1.5" style={{ color: "#f1d98b" }}>
        Sinh: {ELEMENT_LABEL[SINH[element]]}
      </p>
      <p className="text-[10.5px]" style={{ color: "#ff8a93" }}>
        Khắc: {ELEMENT_LABEL[KHAC[element]]}
      </p>
    </motion.div>
  );
}

function GemNode({
  element,
  pos,
  hovered,
  onHover,
}: {
  element: Element;
  pos: Pt;
  hovered: Element | null;
  onHover: (el: Element | null) => void;
}) {
  const info = GEM_INFO[element];
  const isHovered = hovered === element;
  const isDimmed = hovered !== null && !isHovered;

  return (
    <motion.button
      type="button"
      onHoverStart={() => onHover(element)}
      onHoverEnd={() => onHover(null)}
      onFocus={() => onHover(element)}
      onBlur={() => onHover(null)}
      className="absolute w-[15%] h-[15%] min-w-[38px] min-h-[38px] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      animate={{ scale: isHovered ? 1.14 : 1, opacity: isDimmed ? 0.5 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 26%, ${info.light} 0%, ${info.base} 55%, ${info.dark} 100%)`,
          boxShadow: `0 0 16px 3px ${info.glow}, 0 0 2px 0 rgba(255,255,255,0.8) inset`,
          border: `1px solid ${info.light}66`,
        }}
      />
      <span
        className="absolute inset-x-0 -bottom-5 text-center text-[10px] sm:text-[11px] font-display whitespace-nowrap"
        style={{ color: info.light, textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
      >
        {ELEMENT_LABEL[element]}
      </span>
      <AnimatePresence>{isHovered && <Tooltip element={element} />}</AnimatePresence>
    </motion.button>
  );
}

/**
 * Vòng Sinh Khắc Ngũ Hành — 5 viên đá quý đại diện Ngũ Hành, nối bằng vòng Tương Sinh (nét liền, phát sáng,
 * chạy theo chiều mũi tên) và vòng Tương Khắc (nét đứt, mờ hơn, đỏ nhạt), Thái Cực Đồ phát sáng ở tâm.
 * Dựng hoàn toàn bằng SVG + CSS + Framer Motion — không dùng thư viện đồ hoạ 3D.
 */
export function FiveElementsWheel() {
  const [hovered, setHovered] = useState<Element | null>(null);

  const positions = useMemo(() => {
    const map = {} as Record<Element, Pt>;
    ELEMENT_ORDER.forEach((el, i) => {
      map[el] = positionFor(i, ELEMENT_ORDER.length, NODE_RADIUS);
    });
    return map;
  }, []);

  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-visible"
      style={{ background: "radial-gradient(ellipse at 50% 50%, #10182f 0%, #0B1020 75%)" }}
    >
      <ParticleField />
      <ConnectionLines positions={positions} hovered={hovered} />
      {ELEMENT_ORDER.map((el) => (
        <GemNode key={el} element={el} pos={positions[el]} hovered={hovered} onHover={setHovered} />
      ))}
    </div>
  );
}
