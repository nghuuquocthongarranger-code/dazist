import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { evaluateDay } from "../../lib/canChi";
import { CanBadge, ChiBadge } from "../CanChiBadge";
import { SectionHeading } from "../GlassCard";
import { ROLE_LABEL } from "../../lib/elements";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const TIER_STYLE: Record<string, { bg: string; text: string; ring: string; hex: string }> = {
  "rat-tot": { bg: "from-gold-soft/25 to-gold/10", text: "text-gold-soft", ring: "shadow-[0_0_40px_-8px_#d4af37aa]", hex: "#f1d98b" },
  tot: { bg: "from-moc/20 to-moc/5", text: "text-moc", ring: "shadow-[0_0_40px_-10px_#3ddc8488]", hex: "#3ddc84" },
  "binh-thuong": { bg: "from-white/10 to-white/0", text: "text-white/80", ring: "", hex: "#cbd5e1" },
  xau: { bg: "from-tho/20 to-tho/5", text: "text-tho", ring: "shadow-[0_0_40px_-10px_#e0a94a88]", hex: "#e0a94a" },
  "rat-xau": { bg: "from-hoa/25 to-hoa/5", text: "text-hoa", ring: "shadow-[0_0_40px_-8px_#ff5f5faa]", hex: "#ff5f5f" },
};

function PercentGauge({ percent, color }: { percent: number; color: string }) {
  return (
    <div
      className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Điểm ngày: ${percent} trên 100`}
    >
      <div className="absolute inset-[5px] rounded-full bg-cosmic/90 backdrop-blur-sm grid place-items-center border border-white/10">
        <span className="font-display text-2xl sm:text-3xl font-semibold leading-none" style={{ color }}>
          {percent}
        </span>
        <span className="text-[10px] text-white/40 mt-1">/ 100</span>
      </div>
    </div>
  );
}

export function DayLookup() {
  const [dateStr, setDateStr] = useState(() => toISODate(new Date()));

  const verdict = useMemo(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return evaluateDay(new Date(y, m - 1, d));
  }, [dateStr]);

  const today = toISODate(new Date());
  const style = verdict ? TIER_STYLE[verdict.tier] : TIER_STYLE["binh-thuong"];

  return (
    <section id="tra-cuu" className="relative py-20 sm:py-28 px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Công cụ cá nhân hóa"
          title="Hôm nay là ngày tốt hay xấu?"
          subtitle="Đối chiếu Can ngày và Tàng Can trong Chi ngày (chính khí, trung khí, dư khí) với Dụng Thần (Mộc), Hỷ Thần (Thủy) và Kỵ Thần (Thổ, Hỏa) trong lá số của bạn."
        />

        <div className="glass glass-gold-edge rounded-3xl p-6 sm:p-10">
          <label htmlFor="day-lookup-date" className="block text-sm text-white/70 mb-2 font-medium">
            Chọn ngày cần xem
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              id="day-lookup-date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value || today)}
              className="w-full sm:w-auto bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setDateStr(today)}
              className="min-h-[44px] rounded-xl px-4 py-3 text-sm border border-white/15 hover:border-gold/60 hover:text-gold-soft transition"
            >
              Hôm nay
            </button>
          </div>

          <AnimatePresence mode="wait">
            {verdict && (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={`mt-8 rounded-2xl p-6 sm:p-8 bg-linear-to-br ${style.bg} border border-white/10 ${style.ring}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <CanBadge name={verdict.pillar.can.name} size="lg" />
                    <ChiBadge name={verdict.pillar.chi.name} size="lg" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-display text-2xl sm:text-3xl font-semibold ${style.text}`}>
                      {verdict.tierLabel}
                    </span>
                    <PercentGauge percent={verdict.percent} color={style.hex} />
                  </div>
                </div>

                <p className="text-white/85 leading-relaxed mb-5">{verdict.summary}</p>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/65">
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Can ngày (lộ)</p>
                    <p>
                      {verdict.pillar.can.name} — {ROLE_LABEL[verdict.canRole]} · Thập Thần{" "}
                      <span className="text-gold-soft">{verdict.tenGod}</span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/20 p-4 border border-white/5">
                    <p className="text-white/40 uppercase tracking-wider text-xs mb-1">
                      Chi ngày {verdict.pillar.chi.name} — Tàng Can
                    </p>
                    <ul className="space-y-1">
                      {verdict.hiddenStems.map((h) => (
                        <li key={h.can} className="flex justify-between gap-2">
                          <span>
                            {h.can} <span className="text-white/35">({Math.round(h.weight * 100)}%)</span>
                          </span>
                          <span className="text-right">
                            {h.tenGod} · <span className="text-gold-soft">{ROLE_LABEL[h.role]}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
