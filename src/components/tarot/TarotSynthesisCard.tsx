import type { ReadingSynthesis } from "../../lib/tarotSynthesis";

const TONE_STYLE: Record<string, { text: string; border: string; bg: string }> = {
  "thuan-loi": { text: "text-moc", border: "border-moc/30", bg: "from-moc/15 to-moc/0" },
  "can-nhac": { text: "text-hoa", border: "border-hoa/30", bg: "from-hoa/15 to-hoa/0" },
  "can-bang": { text: "text-gold-soft", border: "border-gold/30", bg: "from-gold/15 to-gold/0" },
};

export function TarotSynthesisCard({ synthesis }: { synthesis: ReadingSynthesis }) {
  const style = TONE_STYLE[synthesis.tone];

  return (
    <div className={`mt-8 rounded-2xl p-6 sm:p-8 bg-linear-to-br ${style.bg} border ${style.border}`}>
      <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Luận tổng quan trải bài</p>
      <p className={`font-display text-xl font-semibold mb-4 ${style.text}`}>{synthesis.toneLabel}</p>

      <p className="text-sm text-white/75 leading-relaxed mb-6">{synthesis.overview}</p>

      {synthesis.positionNotes.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Luận theo từng vị trí</p>
          <ul className="space-y-2.5">
            {synthesis.positionNotes.map((n, i) => (
              <li key={i} className="text-sm text-white/70 leading-relaxed rounded-xl bg-black/15 border border-white/5 p-3">
                <span className="text-gold-soft font-medium">{n.label}: </span>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Phân tích chi tiết</p>
      <ul className="space-y-2.5 mb-6">
        {synthesis.points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70 leading-relaxed">
            <span className="text-gold-soft shrink-0">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Con số ẩn giấu</p>
      <p className="text-sm text-white/65 leading-relaxed mb-6 italic">{synthesis.numerologyNote}</p>

      <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Kết quả cuối cùng</p>
      <p className={`text-sm font-medium leading-relaxed ${style.text}`}>{synthesis.finalVerdict}</p>
    </div>
  );
}
