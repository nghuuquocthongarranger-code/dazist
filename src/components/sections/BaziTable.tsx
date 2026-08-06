import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fourPillars, nhatChu, type PillarData } from "../../data/baziProfile";

function PillarCard({ pillar, index }: { pillar: PillarData; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={() => setOpen(true)}
        className="glass glass-gold-edge rounded-2xl p-4 sm:p-5 text-left w-full hover:border-gold/50 hover:brightness-110 transition group"
      >
        <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">{pillar.position}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-2xl text-white">{pillar.can}</span>
          <span className="text-xs text-white/50">{pillar.canNote}</span>
        </div>
        <p className="text-lg text-gold-soft font-display">{pillar.chi}</p>
        <p className="text-xs text-white/40 mt-1">{pillar.canTenGod}</p>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass glass-gold-edge rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">Trụ {pillar.position}</p>
              <h3 className="font-display text-2xl text-gradient-gold mb-4">
                {pillar.can} <span className="text-white/50 text-lg">({pillar.canNote})</span> — {pillar.chi}
              </h3>

              <div className="space-y-4 text-sm text-white/80">
                <div>
                  <p className="text-gold-soft font-semibold mb-1">Thiên Can</p>
                  <p>{pillar.can} — {pillar.canNote}</p>
                </div>
                <div>
                  <p className="text-gold-soft font-semibold mb-1">Thập Thần (Can)</p>
                  <p>{pillar.canTenGod}</p>
                </div>
                <div>
                  <p className="text-gold-soft font-semibold mb-1">Can Tàng (Địa Chi ẩn tàng)</p>
                  <div className="space-y-1">
                    {pillar.tangCan.map((tc, i) => (
                      <p key={i} className="text-white/60">
                        {tc.can} — {tc.tenGod}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-6 text-sm text-gold-soft hover:text-gold transition"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function BaziTable() {
  return (
    <section className="pt-2 pb-20 sm:pb-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-gold-soft font-display text-lg">
            Nhật Chủ: <span className="text-white">{nhatChu.can}</span>
            <span className="text-white/50 text-sm ml-1">({nhatChu.note})</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {fourPillars.map((pillar, i) => (
            <PillarCard key={pillar.position} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}