import { numerologyProfile, numerologyMeaning, numerologyIntro } from "../../data/numerologyProfile";

const ORDER: (keyof typeof numerologyProfile)[] = [
  "lifePath",
  "expression",
  "soulUrge",
  "personality",
  "birthday",
  "maturity",
  "attitude",
];

export function NumerologyContent() {
  return (
    <div>
      <p className="text-white/55 text-sm mb-6">{numerologyIntro}</p>
      <div className="space-y-8">
        {ORDER.map((key) => {
          const core = numerologyProfile[key];
          const meaning = numerologyMeaning[key];
          return (
            <div key={key}>
              <div className="flex items-center gap-3 mb-2">
                <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold-soft">
                  {typeof core === 'object' ? core.value : core}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    {typeof core === 'object' ? core.label : ''}
                    {typeof core === 'object' && core.isMaster && <span className="text-gold-soft"> · Số Chủ</span>}
                  </p>
                </div>
              </div>
              <p className="font-display text-gold-soft text-base mb-3">{meaning.headline}</p>
              <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
                {meaning.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
