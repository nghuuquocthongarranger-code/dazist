import type { ReactNode } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export function ReadingModal({ eyebrow, title, subtitle, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="glass glass-gold-edge relative rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px] grid place-items-center rounded-full border border-white/15 text-white/60 hover:text-gold-soft hover:border-gold/50 transition"
          >
            ✕
          </button>

          <div className="no-scrollbar overflow-y-auto flex-1 min-h-0 p-6 sm:p-8">
            <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">{eyebrow}</p>
            <h3 className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold mb-1">{title}</h3>
            {subtitle && <p className="text-white/50 text-sm mb-6">{subtitle}</p>}

            <div className={subtitle ? "" : "mt-6"}>{children}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
