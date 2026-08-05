import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCardView } from "./TarotCardView";
import { TarotWheel } from "./TarotWheel";
import type { TarotCard } from "../../data/tarotDeck";
import type { SpreadPosition } from "../../data/tarotSpreads";

interface Props {
  spreadName: string;
  position: SpreadPosition;
  positionIndex: number;
  positionCount: number;
  deck: TarotCard[];
  onPlace: (index: number, reversed: boolean) => void;
}

const FLIP_DELAY_MS = 750;
const FLIP_DURATION_MS = 1700;

/** Nội dung bốc 1 lá bài (bánh xe + hiệu ứng lật) — không tự vẽ overlay/backdrop, dùng để lồng vào modal Tarot hợp nhất. */
export function TarotDrawView({ spreadName, position, positionIndex, positionCount, deck, onPlace }: Props) {
  const [landed, setLanded] = useState<{ index: number; reversed: boolean } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function handleLand(index: number, reversed: boolean) {
    setLanded({ index, reversed });
    window.setTimeout(() => setFlipped(true), FLIP_DELAY_MS);
    window.setTimeout(() => setRevealed(true), FLIP_DELAY_MS + FLIP_DURATION_MS);
  }

  const card = landed ? deck[landed.index] : null;

  return (
    <div className="flex flex-col items-center">
      <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2 text-center">{spreadName}</p>
      <p className="font-display text-lg text-gradient-gold font-semibold mb-1 text-center">
        Vị trí {positionIndex + 1}/{positionCount} — {position.label}
      </p>
      <p className="text-white/45 text-sm mb-8 text-center max-w-sm">{position.meaning}</p>

      <AnimatePresence mode="wait">
        {!landed && (
          <motion.div
            key="wheel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5, ease: "easeInOut" } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <TarotWheel onLand={handleLand} />
          </motion.div>
        )}

        {landed && card && (
          <motion.div
            key="reveal"
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-36 sm:w-44 aspect-2/3 mx-auto">
              <motion.div
                className="absolute -z-10 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: "240%",
                  height: "240%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(241,217,139,0.5) 0%, rgba(212,175,55,0.18) 40%, rgba(212,175,55,0) 70%)",
                  filter: "blur(10px)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.85, 0.35], scale: [0.6, 1.15, 1] }}
                transition={{ duration: FLIP_DURATION_MS / 1000, ease: "easeOut", delay: FLIP_DELAY_MS / 1000 }}
              />
              <div className="absolute inset-0" style={{ perspective: "1200px" }}>
                <div
                  className="relative w-full h-full ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.65,0,0.35,1)`,
                  }}
                >
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                    <TarotCardView faceDown size="lg" />
                  </div>
                  <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <TarotCardView card={card} reversed={landed.reversed} size="lg" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <p className="font-display text-lg text-white/90 mt-5 mb-1 text-center">
                    {card.name}
                    {landed.reversed && <span className="text-hoa text-sm ml-1.5">(Ngược)</span>}
                  </p>
                  <p className="text-white/65 text-sm leading-relaxed text-center max-w-sm mb-6">
                    {landed.reversed ? card.reversed : card.upright}
                  </p>
                  <button
                    type="button"
                    onClick={() => onPlace(landed.index, landed.reversed)}
                    className="rounded-full px-6 py-3 text-sm font-medium border border-gold/40 text-gold-soft hover:bg-gold/10 transition min-h-[44px]"
                  >
                    Đặt lá bài vào trải bài →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
