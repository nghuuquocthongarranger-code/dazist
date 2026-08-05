import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { TarotCardView } from "./TarotCardView";
import { TarotDrawView } from "./TarotDrawView";
import { TarotSynthesisCard } from "./TarotSynthesisCard";
import { TAROT_SPREADS, type TarotSpread } from "../../data/tarotSpreads";
import { TAROT_DECK, type TarotCard } from "../../data/tarotDeck";
import { shuffle, type DrawnCard } from "../../lib/tarot";
import { synthesizeReading } from "../../lib/tarotSynthesis";

interface Props {
  onClose: () => void;
}

/**
 * Toàn bộ hành trình Tarot — chọn trải bài, bốc từng lá, xem luận giải — diễn ra trong CÙNG MỘT popup
 * (mở ra khi chạm quả cầu pha lê), không thoát ra ngoài trang cho đến khi người dùng chủ động đóng.
 */
export function TarotModal({ onClose }: Props) {
  const [spread, setSpread] = useState<TarotSpread | null>(null);
  const [results, setResults] = useState<(DrawnCard | null)[]>([]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [deck, setDeck] = useState<TarotCard[]>(() => shuffle(TAROT_DECK));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function startSpread(s: TarotSpread) {
    setDeck(shuffle(TAROT_DECK));
    setSpread(s);
    setResults(new Array(s.cardCount).fill(null));
  }

  function placeCard(index: number, reversed: boolean) {
    if (activeSlot === null) return;
    const card = deck[index];
    setResults((prev) => prev.map((r, i) => (i === activeSlot ? { card, reversed } : r)));
    setActiveSlot(null);
  }

  function restartSpread() {
    if (!spread) return;
    setDeck(shuffle(TAROT_DECK));
    setResults(new Array(spread.cardCount).fill(null));
    setActiveSlot(null);
  }

  function backToPicker() {
    setDeck(shuffle(TAROT_DECK));
    setSpread(null);
    setResults([]);
    setActiveSlot(null);
  }

  const allFilled = spread !== null && results.every((r) => r !== null);
  const synthesis = allFilled && spread ? synthesizeReading(results as DrawnCard[], spread.positions) : null;

  let title = "Chọn kiểu trải bài";
  if (spread && activeSlot !== null) title = "Đang bốc lá bài";
  else if (spread) title = spread.name;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass glass-gold-edge relative rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden flex flex-col"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] grid place-items-center rounded-full border border-white/15 text-white/60 hover:text-gold-soft hover:border-gold/50 transition z-10"
          >
            ✕
          </button>

          <div className="no-scrollbar overflow-y-auto flex-1 min-h-0 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!spread && (
              <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">Quả cầu pha lê</p>
                <h3 className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold mb-2">
                  Chọn kiểu trải bài
                </h3>
                <div className="flex mb-6">
                  <Link
                    to="/tarot/tra-soat"
                    className="text-xs rounded-full px-4 py-2 border border-white/15 text-white/60 hover:border-gold/40 hover:text-gold-soft transition"
                  >
                    Đã bốc bài ngoài đời? Tra soát kết quả tại đây →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {TAROT_SPREADS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => startSpread(s)}
                      className="glass glass-gold-edge rounded-2xl p-5 text-left hover:border-gold/50 hover:brightness-110 transition"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-display text-lg text-gradient-gold font-semibold">{s.name}</p>
                        <span className="text-xs text-gold-soft border border-gold/30 rounded-full px-2.5 py-1 shrink-0">
                          {s.cardCount} lá
                        </span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed mb-2">{s.description}</p>
                      <p className="text-white/40 text-xs">{s.bestFor}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {spread && activeSlot === null && (
              <motion.div key="slots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <p className="font-display text-xl text-gradient-gold font-semibold">{spread.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={backToPicker}
                      className="text-sm rounded-full px-4 py-2 border border-gold/30 text-gold-soft/90 hover:border-gold/60 hover:bg-gold/5 transition min-h-[40px]"
                    >
                      ← Chọn trải bài khác
                    </button>
                    <button
                      type="button"
                      onClick={restartSpread}
                      className="text-sm rounded-full px-4 py-2 border border-white/15 text-white/60 hover:border-gold/40 hover:text-gold-soft transition min-h-[40px]"
                    >
                      Rút lại từ đầu
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {spread.positions.map((pos, i) => {
                    const r = results[i];
                    return (
                      <div key={i} className="glass rounded-2xl p-4 sm:p-5 flex gap-4 items-start">
                        <AnimatePresence mode="wait" initial={false}>
                          {r ? (
                            <motion.div
                              key="card"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                              className="shrink-0"
                            >
                              <TarotCardView card={r.card} reversed={r.reversed} size="md" />
                            </motion.div>
                          ) : (
                            <motion.button
                              key="empty"
                              type="button"
                              onClick={() => setActiveSlot(i)}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="w-24 sm:w-28 aspect-2/3 shrink-0 rounded-xl border-2 border-dashed border-gold/30 hover:border-gold/60 hover:bg-gold/5 transition grid place-items-center text-gold-soft/70 text-xs text-center px-1"
                            >
                              Bấm để bốc lá
                            </motion.button>
                          )}
                        </AnimatePresence>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">{pos.label}</p>
                          <p className="text-white/40 text-xs mb-2 leading-relaxed">{pos.meaning}</p>
                          {r ? (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                            >
                              <p className="font-display text-base text-white/90 mb-1">
                                {r.card.name}
                                {r.reversed && <span className="text-hoa text-xs ml-1.5">(Ngược)</span>}
                              </p>
                              <p className="text-white/65 text-sm leading-relaxed">
                                {r.reversed ? r.card.reversed : r.card.upright}
                              </p>
                            </motion.div>
                          ) : (
                            <p className="text-white/30 text-sm italic">Chưa bốc lá</p>
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

                {allFilled && (
                  <p className="text-xs text-white/35 leading-relaxed text-center px-4 mt-8">
                    Tarot mang tính chiêm nghiệm và định hướng cá nhân, không phải lời tiên tri tuyệt đối — hãy xem
                    đây là một góc nhìn tham khảo để tự soi chiếu.
                  </p>
                )}
              </motion.div>
            )}

            {spread && activeSlot !== null && (
              <motion.div key="draw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-start mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlot(null)}
                    className="text-xs rounded-full px-3 py-1.5 border border-white/15 text-white/50 hover:border-gold/40 hover:text-gold-soft transition"
                  >
                    ← Quay lại trải bài
                  </button>
                </div>
                <TarotDrawView
                  spreadName={spread.name}
                  position={spread.positions[activeSlot]}
                  positionIndex={activeSlot}
                  positionCount={spread.cardCount}
                  deck={deck}
                  onPlace={placeCard}
                />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
