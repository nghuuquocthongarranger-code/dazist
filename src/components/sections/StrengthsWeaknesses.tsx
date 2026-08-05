import { strengths, weaknesses, type SwItem, type Source } from "../../data/strengthsWeaknesses";

const SOURCE_LABEL: Record<Source, string> = {
  bazi: "Bát Tự",
  western: "Chiêm tinh",
  numerology: "Thần số học",
  both: "Bát Tự + Chiêm tinh",
  all: "Cả 3 hệ thống",
};

const SOURCE_CLASS: Record<Source, string> = {
  bazi: "border-gold/40 text-gold-soft bg-gold/10",
  western: "border-thuy/40 text-thuy bg-thuy/10",
  numerology: "border-hoa/40 text-hoa bg-hoa/10",
  both: "border-moc/40 text-moc bg-moc/10",
  all: "border-gold text-gold-soft bg-gold/25 font-semibold shadow-[0_0_10px_-2px_rgba(212,175,55,0.7)]",
};

function SwList({ items }: { items: SwItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li
          key={i}
          className={`text-sm text-white/70 leading-relaxed text-left ${it.source === "all" ? "rounded-lg -mx-1 px-1 py-0.5 bg-gold/5" : ""}`}
        >
          <span
            className={`inline-block align-middle mr-2 mb-1 text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${SOURCE_CLASS[it.source]}`}
          >
            {it.source === "all" && "★ "}
            {SOURCE_LABEL[it.source]}
          </span>
          {it.text}
        </li>
      ))}
    </ul>
  );
}

export function StrengthsWeaknessesContent() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-xl bg-black/20 border border-moc/20 p-4 sm:p-5">
        <p className="font-display text-lg text-moc mb-4">Điểm mạnh</p>
        <SwList items={strengths} />
      </div>
      <div className="rounded-xl bg-black/20 border border-hoa/20 p-4 sm:p-5">
        <p className="font-display text-lg text-hoa mb-4">Điểm yếu</p>
        <SwList items={weaknesses} />
      </div>
    </div>
  );
}
