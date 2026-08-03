import { GlassCard, SectionHeading } from "../GlassCard";
import { family, marriage } from "../../data/baziProfile";

export function FamilyMarriage() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="VII. Lục thân" title="Gia đình gốc" />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {family.map((f, i) => (
            <GlassCard key={f.role} delay={i * 0.06}>
              <p className="text-xs uppercase tracking-wider text-white/40 mb-1">{f.role}</p>
              <p className="font-display text-lg text-gold-soft mb-3">{f.tenGod}</p>
              <p className="text-white/65 text-sm leading-relaxed text-left">{f.desc}</p>
            </GlassCard>
          ))}
        </div>

        <SectionHeading eyebrow="VIII. Lương duyên" title="Hôn nhân" />
        <GlassCard>
          <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed text-left">
            {marriage.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
