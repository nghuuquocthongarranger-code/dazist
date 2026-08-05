import { bodyStrength, dungHyKy, tamThinTuHinh } from "../../data/baziProfile";
import { ELEMENT_COLOR } from "../../lib/elements";

export function ConstitutionContent() {
  return (
    <div>
      <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5 mb-4">
        <div className="flex flex-wrap items-baseline gap-3 mb-4">
          <span className="font-display text-2xl text-gradient-gold font-semibold">{bodyStrength.verdict}</span>
          <span className="text-white/50 text-sm">Cách cục: {bodyStrength.cachCuc}</span>
        </div>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {bodyStrength.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {dungHyKy.map((d) => {
          const color = ELEMENT_COLOR[d.colorElement];
          return (
            <div key={`${d.role}-${d.colorElement}`} className="rounded-xl bg-black/20 border border-white/5 p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                <span className="text-xs uppercase tracking-wider text-white/40">{d.title}</span>
              </div>
              <p className="font-display text-lg mb-1" style={{ color }}>
                {d.element}
              </p>
              <p className="text-xs uppercase tracking-wider text-white/45 mb-2">
                Thập Thần: <span className="text-gold-soft normal-case tracking-normal">{d.tenGod}</span>
              </p>
              <p className="text-white/60 text-sm leading-relaxed text-left">{d.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-black/20 border border-gold/20 p-4 sm:p-5">
        <p className="font-display text-lg text-gold-soft mb-3">{tamThinTuHinh.title}</p>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {tamThinTuHinh.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
