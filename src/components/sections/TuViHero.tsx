import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const TuViHero3D = lazy(() => import("../TuViHero3D").then((m) => ({ default: m.TuViHero3D })));

export function TuViHero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-6 px-6">
      <div className="relative z-10 px-6 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase tracking-[0.4em] text-xs sm:text-sm text-gold mb-5"
        >
          Phần V
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-gradient-gold leading-[1.1]"
        >
          Tử Vi Đẩu Số
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-5 text-white/70 text-sm sm:text-base tracking-wide"
        >
          Lá số 12 cung — chạm vào từng cung trên bàn cờ để xem sao và luận giải.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xs sm:max-w-sm mx-auto h-[260px] sm:h-[320px] mt-6"
      >
        <Suspense fallback={<div className="absolute inset-0" />}>
          <TuViHero3D />
        </Suspense>
      </motion.div>
    </section>
  );
}
