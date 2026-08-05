import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getYearPillar, TEN_GOD_BY_CAN_INDEX_FOR_MAU } from "../lib/canChi";
import { ELEMENT_ROLE, ROLE_LABEL } from "../lib/elements";
import { CanBadge, ChiBadge } from "./CanChiBadge";

interface Props {
  ganChi: string;
  startYear: number;
  startAge: number;
  onClose: () => void;
}

export function LuuNienModal({ ganChi, startYear, startAge, onClose }: Props) {
  const years = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const year = startYear + i;
      const pillar = getYearPillar(year);
      const tenGod = TEN_GOD_BY_CAN_INDEX_FOR_MAU[pillar.canIndex];
      const role = ELEMENT_ROLE[pillar.can.element];
      return { year, age: startAge + i, pillar, tenGod, role };
    });
  }, [startYear, startAge]);

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
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Lưu Niên trong Đại Vận ${ganChi}`}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="glass glass-gold-edge relative rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
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
            <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">Lưu Niên</p>
            <h3 className="font-display text-2xl sm:text-3xl text-gradient-gold font-semibold mb-1">
              Đại Vận {ganChi}
            </h3>
            <p className="text-white/50 text-sm mb-6">
              10 năm từ {startYear} đến {startYear + 9} ({startAge}–{startAge + 9} tuổi)
            </p>

            <div className="space-y-2">
              {years.map((y) => (
                <div
                  key={y.year}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-black/20 border border-white/5 px-4 py-3"
                >
                  <span className="text-white/40 text-sm w-14 shrink-0">{y.year}</span>
                  <span className="text-white/30 text-xs w-16 shrink-0">{y.age} tuổi</span>
                  <div className="flex items-center gap-2">
                    <CanBadge name={y.pillar.can.name} size="sm" />
                    <ChiBadge name={y.pillar.chi.name} size="sm" />
                  </div>
                  <span className="text-sm text-white/60 ml-auto">{y.tenGod}</span>
                  <span className="text-xs text-gold-soft w-24 text-right shrink-0">{ROLE_LABEL[y.role]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
