import { GlassCard, SectionHeading } from "../GlassCard";
import { thanSatByPillar, thanSatMeanings, thanSatSummary } from "../../data/baziProfile";

export function ThanSat() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="XII. Thần Sát" title="Luận đầy đủ Thần Sát" />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {thanSatByPillar.map((p, i) => (
            <GlassCard key={p.pillar} delay={i * 0.05}>
              <p className="font-display text-base text-gold-soft mb-3">{p.pillar}</p>
              <div className="flex flex-wrap gap-2">
                {p.list.map((s) => (
                  <span
                    key={s}
                    className="text-xs rounded-full px-3 py-1 bg-white/5 border border-white/10 text-white/65"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mb-6" delay={0.15}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {thanSatMeanings.map((m) => (
              <div key={m.name} className="text-left">
                <p className="flex items-center gap-2 font-display text-sm mb-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: m.good ? "#3ddc84" : "#ff5f5f" }}
                  />
                  <span className={m.good ? "text-moc" : "text-hoa"}>{m.name}</span>
                  <span className="text-white/35 text-xs font-normal">({m.freq})</span>
                </p>
                <p className="text-white/55 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="glass-gold-edge">
          <p className="text-gold-soft text-sm leading-relaxed text-left">{thanSatSummary}</p>
        </GlassCard>
      </div>
    </section>
  );
}
