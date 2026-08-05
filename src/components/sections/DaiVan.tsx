import { useState } from "react";
import { motion } from "framer-motion";
import { daiVan, daiVanNote, daiVanMeta } from "../../data/baziProfile";
import { CanBadge, ChiBadge } from "../CanChiBadge";
import { LuuNienModal } from "../LuuNienModal";

export function DaiVanContent() {
  const [selected, setSelected] = useState<(typeof daiVan)[number] | null>(null);

  return (
    <div>
      <p className="text-white/60 text-sm mb-6">
        {daiVanMeta} Chọn một chặng để xem Lưu Niên (từng năm) bên trong.
      </p>

      <div className="relative pl-6 sm:pl-10">
        <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-linear-to-b from-gold via-white/15 to-transparent" />
        <div className="space-y-3">
          {daiVan.map((v, i) => (
            <motion.div
              key={v.ganChi}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative"
            >
              <span
                className="absolute -left-6 sm:-left-10 top-5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  borderColor: v.favorable ? "#3ddc84" : "rgba(255,255,255,0.25)",
                  background: "#0b0a18",
                }}
              />
              <button
                type="button"
                onClick={() => setSelected(v)}
                className="w-full text-left rounded-xl bg-black/20 border border-white/5 p-4 flex flex-wrap items-center gap-x-6 gap-y-2 hover:border-gold/40 transition min-h-[44px]"
              >
                <div className="flex items-center gap-3 min-w-[160px]">
                  <CanBadge name={v.ganChi.split(" ")[0]} size="sm" />
                  <ChiBadge name={v.ganChi.split(" ")[1]} size="sm" />
                </div>
                <span className="text-white/45 text-sm">{v.start}</span>
                <span className="text-white/45 text-sm">{v.age} tuổi</span>
                <span className={`text-sm ${v.favorable ? "text-moc" : "text-white/55"}`}>{v.tenGod}</span>
                <span className="ml-auto text-xs uppercase tracking-wider text-gold-soft">Xem Lưu Niên →</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-white/70 text-sm leading-relaxed text-left rounded-xl bg-black/20 border border-white/5 p-4 mt-6">
        {daiVanNote}
      </p>

      {selected && (
        <LuuNienModal
          ganChi={selected.ganChi}
          startYear={selected.startYear}
          startAge={selected.age}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
