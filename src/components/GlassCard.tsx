import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass glass-gold-edge rounded-2xl p-6 sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto"
    >
      <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-gold mb-3 font-medium">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gradient-gold font-semibold">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-white/60 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}
