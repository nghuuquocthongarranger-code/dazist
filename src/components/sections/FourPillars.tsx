import { CanBadge, ChiBadge } from "../CanChiBadge";
import { fourPillars, nhatChu, tenGodRatios } from "../../data/baziProfile";
import { motion } from "framer-motion";

export function FourPillarsContent() {
  return (
    <div>
      <p className="text-white/60 text-sm mb-6">
        Nhật Chủ: {nhatChu.can} — {nhatChu.note}. Điểm đặc biệt nhất của lá số: ba trụ Thìn liên tiếp ở Tháng – Ngày – Giờ.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {fourPillars.map((p) => (
          <div
            key={p.position}
            className={`rounded-xl bg-black/20 border p-4 ${p.position === "Ngày" ? "border-gold/50" : "border-white/5"}`}
          >
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Trụ {p.position}</p>
            <div className="flex flex-col gap-3 mb-5">
              <CanBadge name={p.can} size="lg" />
              <ChiBadge name={p.chi} size="lg" />
            </div>
            <p className="text-xs text-gold-soft mb-3">{p.position === "Ngày" ? "Nhật Chủ" : p.canTenGod}</p>
            <div className="border-t border-white/10 pt-3">
              <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Tàng Can</p>
              <ul className="space-y-1.5 text-sm text-white/70">
                {p.tangCan.map((t) => (
                  <li key={t.can} className="flex justify-between gap-2">
                    <span>{t.can}</span>
                    <span className="text-white/45">{t.tenGod}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
          Tỉ lệ 10 Thập Thần (theo trọng số Can gốc + Tàng Can)
        </p>
        <div className="space-y-3">
          {tenGodRatios.map((g, i) => (
            <div key={g.name} className="flex items-center gap-4">
              <span className="w-24 sm:w-28 text-sm text-white/70 shrink-0">{g.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${g.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #d4af37, #f1d98b)" }}
                />
              </div>
              <span className="w-14 text-right text-sm text-gold-soft tabular-nums">{g.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
