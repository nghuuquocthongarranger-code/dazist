import { family, marriage } from "../../data/baziProfile";

export function FamilyMarriageContent() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Gia đình gốc</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {family.map((f) => (
            <div key={f.role} className="rounded-xl bg-black/20 border border-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/40 mb-1">{f.role}</p>
              <p className="font-display text-base text-gold-soft mb-2">{f.tenGod}</p>
              <p className="text-white/65 text-sm leading-relaxed text-left">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Hôn nhân</p>
        <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed text-left">
          {marriage.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
