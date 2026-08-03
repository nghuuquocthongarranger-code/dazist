import { GlassCard, SectionHeading } from "../GlassCard";
import { CanBadge, ChiBadge } from "../CanChiBadge";
import { fourPillars, nhatChu, tenGodRatios } from "../../data/baziProfile";
import { motion } from "framer-motion";

export function FourPillars() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="I & II. Lá số gốc"
          title="Tứ Trụ & Thập Thần"
          subtitle={`Nhật Chủ: ${nhatChu.can} — ${nhatChu.note}. Điểm đặc biệt nhất của lá số: ba trụ Thìn liên tiếp ở Tháng – Ngày – Giờ.`}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {fourPillars.map((p, i) => (
            <GlassCard key={p.position} delay={i * 0.08} className={p.position === "Ngày" ? "ring-1 ring-gold/50" : ""}>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Trụ {p.position}</p>
              <div className="flex flex-col gap-3 mb-5">
                <CanBadge name={p.can} size="lg" />
                <ChiBadge name={p.chi} size="lg" />
              </div>
              <p className="text-xs text-gold-soft mb-3">
                {p.position === "Ngày" ? "Nhật Chủ" : p.canTenGod}
              </p>
              <div className="border-t border-white/10 pt-3">
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Tàng Can</p>
                <ul className="space-y-1.5 text-sm text-white/70">
                  {p.tangCan.map((t) => (
                    <li key={t.can} className="flex justify-between gap-2">
                      <span>{t.can}</span>
                      <span className="text-white/45">{t.tenGod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6 sm:mt-8" delay={0.3}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
            Tỉ lệ 10 Thập Thần (theo trọng số Can gốc + Tàng Can)
          </p>
          <div className="space-y-3">
            {tenGodRatios.map((g, i) => (
              <div key={g.name} className="flex items-center gap-4">
                <span className="w-24 sm:w-28 text-sm text-white/70 shrink-0">{g.name}</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${g.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #d4af37, #f1d98b)",
                    }}
                  />
                </div>
                <span className="w-14 text-right text-sm text-gold-soft tabular-nums">
                  {g.percent}%
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
