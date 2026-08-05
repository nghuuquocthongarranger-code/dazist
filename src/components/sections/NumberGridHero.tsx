import { motion } from "framer-motion";
import { numberGrid, arrows } from "../../data/numerologyProfile";

// Vị trí theo bảng Hệ thống Nhân số học Pythagoras: hàng trên 3-6-9, hàng giữa 2-5-8,
// hàng dưới 1-4-7 (số 1 ở góc dưới-trái); cột dọc 1-2-3 / 4-5-6 / 7-8-9 (đọc từ dưới lên).
const POSITION: Record<number, [number, number]> = {
  3: [60, 60], 6: [150, 60], 9: [240, 60],
  2: [60, 150], 5: [150, 150], 8: [240, 150],
  1: [60, 240], 4: [150, 240], 7: [240, 240],
};

function dotsFor(count: number): string {
  if (count === 0) return "";
  return Array.from({ length: count }, () => "•").join(" ");
}

export function NumberGridHero() {
  const filledArrows = arrows.filter((a) => a.status === "filled");
  const emptyArrows = arrows.filter((a) => a.status === "empty");

  return (
    <section className="relative pt-32 sm:pt-40 pb-10 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(212,175,55,0.1) 0%, transparent 60%)" }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="uppercase tracking-[0.35em] text-xs sm:text-sm text-gold mb-4"
        >
          Phần III
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl text-gradient-gold font-semibold mb-8"
        >
          Thần Số Học
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-xs sm:max-w-sm glass glass-gold-edge rounded-3xl p-6"
        >
          <svg viewBox="0 0 300 300" className="w-full h-auto">
            {/* Đường trống — nét đứt mờ */}
            {emptyArrows.map((a) => {
              const [x1, y1] = POSITION[a.numbers[0]];
              const [x2, y2] = POSITION[a.numbers[2]];
              return (
                <line
                  key={a.key}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth={1.5}
                  strokeDasharray="4 5"
                />
              );
            })}
            {/* Đường đầy đủ — nét vàng sáng, vẽ dần */}
            {filledArrows.map((a, i) => {
              const [x1, y1] = POSITION[a.numbers[0]];
              const [x2, y2] = POSITION[a.numbers[2]];
              return (
                <motion.line
                  key={a.key}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#d4af37"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: "easeOut" }}
                />
              );
            })}
            {/* 9 ô số */}
            {Object.entries(POSITION).map(([numStr, [x, y]]) => {
              const num = Number(numStr);
              const count = numberGrid.counts[num] ?? 0;
              const present = count > 0;
              return (
                <g key={num}>
                  <circle cx={x} cy={y} r={26} fill="rgba(255,255,255,0.03)" stroke={present ? "#d4af37" : "rgba(255,255,255,0.12)"} strokeWidth={present ? 1.5 : 1} />
                  <text
                    x={x}
                    y={y - (present ? 4 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-display"
                    fontSize={present ? 22 : 16}
                    fill={present ? "#f1d98b" : "rgba(255,255,255,0.25)"}
                  >
                    {num}
                  </text>
                  {present && (
                    <text x={x} y={y + 16} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#f1d98b" opacity={0.75}>
                      {dotsFor(count)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 text-white/60 text-sm max-w-md mx-auto leading-relaxed"
        >
          Bảng đồ số Pythagoras suy ra từ toàn bộ chữ số ngày sinh — mỗi đường nối vàng là một "Đường" đã hình thành
          (điểm mạnh), đường đứt nét là "Đường trống" (điểm cần rèn luyện thêm).
        </motion.p>
      </div>
    </section>
  );
}
