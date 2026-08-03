import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "../../data/baziProfile";

const Hero3D = lazy(() => import("../Hero3D").then((m) => ({ default: m.Hero3D })));

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex items-start justify-center pt-40 sm:pt-44">
      <Suspense fallback={<div className="absolute inset-0 bg-cosmic" />}>
        <Hero3D />
      </Suspense>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 68%, transparent 0%, rgba(5,4,10,0.2) 60%, rgba(5,4,10,0.75) 100%)",
        }}
      />

      <div className="relative z-10 px-6 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="uppercase tracking-[0.4em] text-xs sm:text-sm text-gold mb-5 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]"
        >
          DaZiST · Bát Tự Cá Nhân Hóa
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-gradient-gold leading-[1.1] [filter:drop-shadow(0_4px_24px_rgba(0,0,0,0.85))]"
        >
          {personalInfo.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-5 text-white/80 text-base sm:text-lg [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]"
        >
          {personalInfo.birthDate} — {personalInfo.gender}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-2 text-white/60 text-sm tracking-wide [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
        >
          Năm hành tinh quay quanh Nhật Chủ — mỗi vòng quỹ đạo là một Ngũ Hành trong lá số của bạn
        </motion.p>

        <motion.a
          href="#tra-cuu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-9 inline-flex items-center gap-2 glass glass-gold-edge rounded-full px-6 py-3 text-sm font-medium text-gold-soft hover:brightness-125 transition"
        >
          Tra cứu ngày hôm nay
          <span aria-hidden>↓</span>
        </motion.a>
      </div>
    </section>
  );
}
