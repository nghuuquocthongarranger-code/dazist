import { GlassCard, SectionHeading } from "../GlassCard";
import { bodyStrength, dungHyKy, tamThinTuHinh } from "../../data/baziProfile";
import { ELEMENT_COLOR } from "../../lib/elements";

export function Constitution() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="III, IV & V. Cốt lõi lá số"
          title="Thân Vượng — Dụng Thần — Tự Hình"
        />

        <GlassCard className="mb-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <span className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold">
              {bodyStrength.verdict}
            </span>
            <span className="text-white/50 text-sm">Cách cục: {bodyStrength.cachCuc}</span>
          </div>
          <div className="space-y-3 text-white/70 text-sm sm:text-base leading-relaxed text-left">
            {bodyStrength.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </GlassCard>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {dungHyKy.map((d, i) => {
            const color = ELEMENT_COLOR[d.colorElement];
            return (
              <GlassCard key={`${d.role}-${d.colorElement}`} delay={i * 0.06}>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                  />
                  <span className="text-xs uppercase tracking-wider text-white/40">{d.title}</span>
                </div>
                <p className="font-display text-lg mb-2" style={{ color }}>
                  {d.element}
                </p>
                <p className="text-white/60 text-sm leading-relaxed text-left">{d.desc}</p>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard delay={0.2} className="glass-gold-edge">
          <p className="font-display text-xl text-gold-soft mb-3">{tamThinTuHinh.title}</p>
          <div className="space-y-3 text-white/70 text-sm sm:text-base leading-relaxed text-left">
            {tamThinTuHinh.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
