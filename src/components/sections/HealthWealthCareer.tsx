import { GlassCard, SectionHeading } from "../GlassCard";
import { health, healthGeneral, wealth, career } from "../../data/baziProfile";
import { ELEMENT_COLOR } from "../../lib/elements";
import { ElementGlyph } from "../icons/ElementGlyph";

export function HealthWealthCareer() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="IX. Cơ thể" title="Sức khỏe" />
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {health.map((h, i) => (
            <GlassCard key={h.organ} delay={i * 0.05}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="grid place-items-center rounded-full glass shrink-0"
                  style={{ width: 38, height: 38 }}
                >
                  <ElementGlyph element={h.element} size={20} />
                </span>
                <p className="font-display text-base" style={{ color: ELEMENT_COLOR[h.element] }}>
                  {h.organ}
                </p>
              </div>
              <p className="text-white/65 text-sm leading-relaxed text-left">{h.note}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="mb-16 sm:mb-20" delay={0.2}>
          <p className="text-gold-soft text-sm text-left leading-relaxed">
            <span className="uppercase tracking-wider text-xs text-white/40 block mb-1">
              Khuyến nghị chung
            </span>
            {healthGeneral}
          </p>
        </GlassCard>

        <SectionHeading eyebrow="X. Tài lộc" title="Tiền bạc" />
        <div className="grid gap-4 sm:gap-6 mb-16 sm:mb-20">
          <GlassCard>
            <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Tài tinh trong lá số</p>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed text-left">{wealth.taiTinh}</p>
          </GlassCard>
          <GlassCard delay={0.06}>
            <p className="text-xs uppercase tracking-wider text-hoa mb-2">Rủi ro lớn nhất</p>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed text-left">{wealth.risk}</p>
          </GlassCard>
          <GlassCard delay={0.12}>
            <p className="text-xs uppercase tracking-wider text-moc mb-2">Gợi ý cụ thể</p>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed text-left">{wealth.suggestion}</p>
          </GlassCard>
        </div>

        <SectionHeading eyebrow="XI. Con đường" title="Sự nghiệp" />
        <GlassCard>
          <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed text-left">
            {career.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
