import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { TarotCardView } from "../components/tarot/TarotCardView";
import { TarotSynthesisCard } from "../components/tarot/TarotSynthesisCard";
import { TAROT_SPREADS, getSpreadById } from "../data/tarotSpreads";
import { MAJOR_ARCANA, MINOR_ARCANA, SUIT_LABEL, getCardById, type Suit } from "../data/tarotDeck";
import { synthesizeReading } from "../lib/tarotSynthesis";
import type { DrawnCard } from "../lib/tarot";

interface Selection {
  cardId: string;
  reversed: boolean;
}

const SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

export function TarotLookupPage() {
  const [spreadId, setSpreadId] = useState(TAROT_SPREADS[0].id);
  const spread = getSpreadById(spreadId)!;
  const [selections, setSelections] = useState<Selection[]>(
    Array.from({ length: spread.cardCount }, () => ({ cardId: "", reversed: false })),
  );

  useEffect(() => {
    setSelections(Array.from({ length: spread.cardCount }, () => ({ cardId: "", reversed: false })));
  }, [spread.cardCount]);

  function updateCard(i: number, cardId: string) {
    setSelections((prev) => prev.map((s, idx) => (idx === i ? { ...s, cardId } : s)));
  }
  function updateReversed(i: number, reversed: boolean) {
    setSelections((prev) => prev.map((s, idx) => (idx === i ? { ...s, reversed } : s)));
  }

  const drawn: DrawnCard[] = selections
    .map((s) => {
      const card = s.cardId ? getCardById(s.cardId) : undefined;
      return card ? { card, reversed: s.reversed } : null;
    })
    .filter((d): d is DrawnCard => d !== null);
  const allFilled = drawn.length === spread.cardCount;
  const synthesis = allFilled ? synthesizeReading(drawn, spread.positions) : null;

  return (
    <>
      <PageIntro
        eyebrow="Tra soát kết quả"
        title="Đã bốc bài ngoài đời? Nhập vào đây"
        subtitle="Chọn kiểu trải bài bạn đã dùng, rồi nhập từng lá bạn bốc được (và có bị ngược hay không) để xem luận giải."
      />

      <section className="pb-20 sm:pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Link
              to="/tarot"
              className="text-sm rounded-full px-5 py-2.5 border border-white/15 text-white/70 hover:border-gold/40 hover:text-gold-soft transition"
            >
              ← Quay lại rút bài trực tuyến
            </Link>
          </div>

          <div className="glass glass-gold-edge rounded-2xl p-5 sm:p-6 mb-6">
            <label htmlFor="spread-select" className="block text-sm text-white/70 mb-2 font-medium">
              Kiểu trải bài bạn đã dùng
            </label>
            <select
              id="spread-select"
              value={spreadId}
              onChange={(e) => setSpreadId(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
            >
              {TAROT_SPREADS.map((s) => (
                <option key={s.id} value={s.id} className="bg-cosmic-2">
                  {s.name} ({s.cardCount} lá)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {spread.positions.map((pos, i) => {
              const sel = selections[i];
              const card = sel?.cardId ? getCardById(sel.cardId) : undefined;
              return (
                <div key={i} className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-start">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <TarotCardView card={card} reversed={sel?.reversed} faceDown={!card} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">{pos.label}</p>
                    <p className="text-white/40 text-xs mb-3 leading-relaxed">{pos.meaning}</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
                      <select
                        value={sel?.cardId ?? ""}
                        onChange={(e) => updateCard(i, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
                      >
                        <option value="" className="bg-cosmic-2">
                          — Chọn lá bài —
                        </option>
                        <optgroup label="Ẩn Chính (Major Arcana)" className="bg-cosmic-2">
                          {MAJOR_ARCANA.map((c) => (
                            <option key={c.id} value={c.id} className="bg-cosmic-2">
                              {c.name} ({c.nameEn})
                            </option>
                          ))}
                        </optgroup>
                        {SUITS.map((suit) => (
                          <optgroup key={suit} label={`${SUIT_LABEL[suit]} (${suit})`} className="bg-cosmic-2">
                            {MINOR_ARCANA.filter((c) => c.suit === suit).map((c) => (
                              <option key={c.id} value={c.id} className="bg-cosmic-2">
                                {c.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-sm text-white/70 shrink-0 px-1 min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={sel?.reversed ?? false}
                          onChange={(e) => updateReversed(i, e.target.checked)}
                          className="w-4 h-4 accent-gold"
                        />
                        Bài ngược
                      </label>
                    </div>
                    {card && (
                      <p className="text-white/70 text-sm leading-relaxed rounded-xl bg-black/20 border border-white/5 p-3">
                        {sel.reversed ? card.reversed : card.upright}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {synthesis && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <TarotSynthesisCard synthesis={synthesis} />
            </motion.div>
          )}

          <p className="text-xs text-white/35 leading-relaxed text-center px-4 mt-10">
            Tarot mang tính chiêm nghiệm và định hướng cá nhân, không phải lời tiên tri tuyệt đối — hãy xem đây là
            một góc nhìn tham khảo để tự soi chiếu.
          </p>
        </div>
      </section>
    </>
  );
}
