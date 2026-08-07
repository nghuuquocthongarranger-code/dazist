import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, SectionHeading } from "../GlassCard";
import { HOUR_CHI_RANGES } from "../../lib/canChi";
import { evaluatePartner, type PartnerEvaluation } from "../../lib/partnerCompat";
import { ROLE_LABEL, type DungHyKy } from "../../lib/elements";

const TIER_STYLE: Record<PartnerEvaluation["tier"], { bg: string; text: string; hex: string }> = {
  "rat-tot": { bg: "from-gold-soft/25 to-gold/10", text: "text-gold-soft", hex: "#f1d98b" },
  tot: { bg: "from-moc/20 to-moc/5", text: "text-moc", hex: "#3ddc84" },
  "binh-thuong": { bg: "from-white/10 to-white/0", text: "text-white/80", hex: "#cbd5e1" },
  xau: { bg: "from-hoa/25 to-hoa/5", text: "text-hoa", hex: "#ff5f5f" },
};

const ROLE_TONE: Record<DungHyKy, string> = {
  "dung-than": "text-gold-soft",
  "hy-than": "text-moc",
  "hy-than-phu": "text-kim",
  "ky-than": "text-hoa",
  "trung-tinh": "text-white/60",
};

function PercentGauge({ percent, color }: { percent: number; color: string }) {
  return (
    <div
      className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full mx-auto"
      style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Điểm: ${percent} trên 100`}
    >
      <div className="absolute inset-[4px] rounded-full bg-cosmic/90 backdrop-blur-sm grid place-items-center border border-white/10">
        <span className="font-display text-2xl sm:text-3xl font-semibold leading-none" style={{ color }}>
          {percent}
        </span>
      </div>
    </div>
  );
}

export function PartnerCheck() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [hourChi, setHourChi] = useState<string>("");
  const [result, setResult] = useState<PartnerEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) {
      setError("Vui lòng nhập đủ Năm/Tháng/Ngày dương lịch hợp lệ.");
      setResult(null);
      return;
    }
    try {
      setResult(evaluatePartner(y, m, d, hourChi || undefined));
    } catch {
      setError("Không tính được — kiểm tra lại ngày tháng năm.");
      setResult(null);
    }
  }

  const style = result ? TIER_STYLE[result.tier] : null;

  return (
    <section className="pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Bát Tự đối tác"
          title="Người này hợp tác với bạn có lợi không?"
          subtitle="Nhập Năm – Tháng – Ngày dương lịch của đối tác/bạn bè/đồng nghiệp (Giờ sinh không bắt buộc, có thì kết quả chính xác hơn) để xem Ngũ Hành của họ đang là Dụng/Hỷ hay Kỵ Thần đối với chính lá số của bạn."
        />

        <GlassCard>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Năm</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder={`vd. ${currentYear - 25}`}
                min={1900}
                max={2100}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Tháng</label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="1-12"
                min={1}
                max={12}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Ngày</label>
              <input
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="1-31"
                min={1}
                max={31}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Giờ (không bắt buộc)</label>
              <select
                value={hourChi}
                onChange={(e) => setHourChi(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] appearance-none"
              >
                <option value="" className="bg-cosmic">Không rõ</option>
                {HOUR_CHI_RANGES.map((h) => (
                  <option key={h.chi} value={h.chi} className="bg-cosmic">
                    {h.chi} ({h.range})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="col-span-2 sm:col-span-4 mt-1 rounded-xl px-4 py-3 text-sm font-semibold border border-gold/40 text-gold-soft hover:bg-gold/10 transition min-h-[44px]"
            >
              Xem kết quả
            </button>
          </form>

          {error && (
            <p className="text-xs text-hoa bg-hoa/10 border border-hoa/30 rounded-xl px-3 py-2.5 mt-4 leading-relaxed">
              {error}
            </p>
          )}

          <AnimatePresence mode="wait">
            {result && style && (
              <motion.div
                key={result.dayPillar + result.hourPillar}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`mt-6 rounded-2xl p-5 sm:p-6 bg-gradient-to-br ${style.bg} border border-white/10`}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <PercentGauge percent={result.percent} color={style.hex} />
                  <div className="flex-1 text-center sm:text-left">
                    <p className={`font-display text-xl sm:text-2xl font-semibold ${style.text}`}>{result.tierLabel}</p>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">{result.summary}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Tứ Trụ đối tác</p>
                    <div className="space-y-1.5 text-sm">
                      {result.pillars
                        .slice()
                        .reverse()
                        .map((p) => (
                          <div key={p.label} className="flex items-center justify-between">
                            <span className="text-white/50 w-14 shrink-0">{p.label}</span>
                            <span className="text-white font-medium flex-1 text-left">{p.pillarLabel}</span>
                            <span className={`text-xs ${ROLE_TONE[p.role]}`}>{ROLE_LABEL[p.role]}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Quan hệ Địa Chi (Ngày sinh)</p>
                    <p className="text-sm text-gold-soft font-medium">{result.chiRelation.label}</p>
                    <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{result.chiRelation.desc}</p>
                  </div>
                </div>

                {!result.hourPillar && (
                  <p className="text-xs text-white/40 mt-5 italic">
                    Chưa nhập giờ sinh — kết quả dựa trên Năm/Tháng/Ngày, độ chính xác sẽ cao hơn nếu bổ sung giờ sinh của đối tác.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}
