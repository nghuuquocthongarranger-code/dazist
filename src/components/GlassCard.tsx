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

export function PartDivider({ label, title }: { label: string; title: string }) {
  return (
    <div className="relative py-10 sm:py-14 px-6">
      <div className="max-w-3xl mx-auto flex items-center gap-4 sm:gap-6">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gold/40" />
        <div className="text-center shrink-0">
          <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-gold/70 mb-1.5">{label}</p>
          <p className="font-display text-lg sm:text-xl text-gradient-gold font-semibold">{title}</p>
        </div>
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gold/40" />
      </div>
    </div>
  );
}
