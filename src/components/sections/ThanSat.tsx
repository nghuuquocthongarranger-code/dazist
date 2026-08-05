import { thanSatByPillar, thanSatMeanings, thanSatSummary, type ThanSatNature } from "../../data/baziProfile";

const NATURE_COLOR: Record<ThanSatNature, string> = {
  tot: "#3ddc84",
  xau: "#ff5f5f",
  "trung-tinh": "#b98ce0",
};

const NATURE_LABEL: Record<ThanSatNature, string> = {
  tot: "Sao tốt",
  xau: "Sao xấu",
  "trung-tinh": "Trung tính",
};

const NATURE_TEXT_CLASS: Record<ThanSatNature, string> = {
  tot: "text-moc",
  xau: "text-hoa",
  "trung-tinh": "text-[#b98ce0]",
};

const NATURE_BY_NAME: Record<string, ThanSatNature> = {};
thanSatMeanings.forEach((m) => {
  m.name.split(",").forEach((part) => {
    NATURE_BY_NAME[part.trim()] = m.nature;
  });
});

export function ThanSatContent() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
        {(Object.keys(NATURE_LABEL) as ThanSatNature[]).map((n) => (
          <span key={n} className="flex items-center gap-2 text-xs text-white/55">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: NATURE_COLOR[n], boxShadow: `0 0 8px ${NATURE_COLOR[n]}` }}
            />
            {NATURE_LABEL[n]}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {thanSatByPillar.map((p) => (
          <div key={p.pillar} className="rounded-xl bg-black/20 border border-white/5 p-4">
            <p className="font-display text-base text-gold-soft mb-3">{p.pillar}</p>
            <div className="flex flex-wrap gap-2">
              {p.list.map((s) => {
                const nature = NATURE_BY_NAME[s];
                const color = nature ? NATURE_COLOR[nature] : "rgba(255,255,255,0.4)";
                return (
                  <span
                    key={s}
                    className="text-xs rounded-full px-3 py-1 bg-white/5 border"
                    style={{ borderColor: `${color}55`, color }}
                  >
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        {thanSatMeanings.map((m) => (
          <div key={m.name} className="text-left">
            <p className="flex items-center gap-2 font-display text-sm mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: NATURE_COLOR[m.nature], boxShadow: `0 0 6px ${NATURE_COLOR[m.nature]}` }}
              />
              <span className={NATURE_TEXT_CLASS[m.nature]}>{m.name}</span>
              <span className="text-white/35 text-xs font-normal">({m.freq})</span>
            </p>
            <p className="text-white/55 text-xs leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-gold-soft text-sm leading-relaxed text-left rounded-xl bg-black/20 border border-gold/20 p-4">
        {thanSatSummary}
      </p>
    </div>
  );
}
