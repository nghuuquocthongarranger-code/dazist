import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const TarotHero3D = lazy(() => import("../TarotHero3D").then((m) => ({ default: m.TarotHero3D })));

export function TarotHero({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex items-start justify-center pt-32 sm:pt-40">
      <Suspense fallback={<div className="absolute inset-0 bg-cosmic" />}>
        <TarotHero3D onOpen={onOpen} />
      </Suspense>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 68%, transparent 0%, rgba(5,4,10,0.2) 60%, rgba(5,4,10,0.75) 100%)",
        }}
      />

      <div className="relative z-10 px-6 text-center max-w-3xl mx-auto pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase tracking-[0.4em] text-xs sm:text-sm text-gold mb-5 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]"
        >
          Phần IV
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-gradient-gold leading-[1.1] [filter:drop-shadow(0_4px_24px_rgba(0,0,0,0.85))]"
        >
          Tarot — Trải Bài Đa Dạng
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-5 text-white/70 text-sm sm:text-base tracking-wide [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
        >
          Chạm vào quả cầu pha lê để mở các kiểu trải bài.
        </motion.p>
      </div>
    </section>
  );
}
