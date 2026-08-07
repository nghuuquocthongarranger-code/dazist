import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, SectionHeading } from "../GlassCard";
import { CAN, CHI, type CanChiPair } from "../../lib/canChi";
import { evaluatePartnerManual, type PartnerEvaluation, type Gender } from "../../lib/partnerCompat";
import { ROLE_LABEL, ELEMENT_LABEL, type DungHyKy } from "../../lib/elements";

const TIER_STYLE: Record<PartnerEvaluation["compatTier"], { bg: string; text: string; hex: string }> = {
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

const PERIOD_TONE: Record<"dung" | "hy" | "ky" | "binh-thuong", string> = {
  dung: "text-gold-soft bg-gold/10 border-gold/30",
  hy: "text-moc bg-moc/10 border-moc/30",
  "binh-thuong": "text-white/60 bg-white/5 border-white/10",
  ky: "text-hoa bg-hoa/10 border-hoa/30",
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

const EMPTY_PAIR: CanChiPair = { can: "", chi: "" };

/** Chọn Can trước (10 lựa chọn), Chi sau chỉ hiện 6 lựa chọn hợp lệ theo đúng âm dương của Can đã chọn —
 * nhanh hơn nhiều so với cuộn tìm trong danh sách 60 tổ hợp, mà vẫn không thể chọn ra cặp Can Chi sai. */
function PillarPicker({
  label,
  pair,
  onChange,
}: {
  label: string;
  pair: CanChiPair;
  onChange: (pair: CanChiPair) => void;
}) {
  const canIndex = pair.can ? CAN.findIndex((c) => c.name === pair.can) : -1;
  const validChis = canIndex >= 0 ? CHI.filter((_, idx) => idx % 2 === canIndex % 2) : CHI;

  return (
    <div>
      <label className="block text-xs text-gold-soft mb-1.5">{label}</label>
      <div className="grid grid-cols-2 gap-1.5">
        <select
          value={pair.can}
          onChange={(e) => onChange({ can: e.target.value, chi: "" })}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] appearance-none"
        >
          <option value="" className="bg-cosmic">Can</option>
          {CAN.map((c) => (
            <option key={c.name} value={c.name} className="bg-cosmic">{c.name}</option>
          ))}
        </select>
        <select
          value={pair.chi}
          onChange={(e) => onChange({ ...pair, chi: e.target.value })}
          disabled={!pair.can}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] appearance-none disabled:opacity-40"
        >
          <option value="" className="bg-cosmic">Chi</option>
          {validChis.map((c) => (
            <option key={c.name} value={c.name} className="bg-cosmic">{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function PartnerCheck() {
  const [gender, setGender] = useState<Gender>("nam");
  const [birthYear, setBirthYear] = useState("");
  const [startAgeYears, setStartAgeYears] = useState("");
  const [startAgeMonths, setStartAgeMonths] = useState("");
  const [preciseBirthDateTime, setPreciseBirthDateTime] = useState("");
  const [yearP, setYearP] = useState<CanChiPair>(EMPTY_PAIR);
  const [monthP, setMonthP] = useState<CanChiPair>(EMPTY_PAIR);
  const [dayP, setDayP] = useState<CanChiPair>(EMPTY_PAIR);
  const [hourP, setHourP] = useState<CanChiPair>(EMPTY_PAIR);
  const [result, setResult] = useState<PartnerEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const byNum = Number(birthYear);
    const startYearsNum = Number(startAgeYears);
    const startMonthsNum = startAgeMonths ? Number(startAgeMonths) : 0;
    const hasYear = yearP.can && yearP.chi;
    const hasMonth = monthP.can && monthP.chi;
    const hasDay = dayP.can && dayP.chi;
    const hasHour = hourP.can && hourP.chi;
    if (
      !birthYear || byNum < 1900 || byNum > 2100 ||
      !startAgeYears || startYearsNum < 0 || startYearsNum > 20 ||
      startMonthsNum < 0 || startMonthsNum > 11 ||
      !hasYear || !hasMonth || !hasDay
    ) {
      setError("Vui lòng nhập đủ Năm sinh, Tuổi khởi vận (năm, tháng từ 0–11), và chọn đủ Can + Chi cho Trụ Năm / Tháng / Ngày.");
      setResult(null);
      return;
    }
    try {
      setResult(
        evaluatePartnerManual({
          gender,
          birthYear: byNum,
          startAgeYears: startYearsNum,
          startAgeMonths: startMonthsNum,
          preciseBirthDateTime: preciseBirthDateTime ? new Date(preciseBirthDateTime) : undefined,
          year: yearP,
          month: monthP,
          day: dayP,
          hour: hasHour ? hourP : undefined,
        }),
      );
    } catch {
      setError("Có lỗi khi tính toán — kiểm tra lại các lựa chọn.");
      setResult(null);
    }
  }

  const style = result ? TIER_STYLE[result.compatTier] : null;

  return (
    <section className="pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Bát Tự đối tác"
          title="Người này hợp tác với bạn có lợi không?"
          subtitle="Nhập trực tiếp Tứ Trụ (Can Chi), Giới tính, Năm sinh và Tuổi khởi vận mà bạn đã biết của đối tác — không suy từ ngày Dương lịch để tránh sai lệch — nhằm xem năm nay và Đại Vận hiện tại có thuận lợi cho họ không."
        />

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs text-gold-soft mb-1.5">Giới tính</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] appearance-none"
                >
                  <option value="nam" className="bg-cosmic">Nam</option>
                  <option value="nu" className="bg-cosmic">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gold-soft mb-1.5">Năm sinh (Dương lịch)</label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="vd. 1998"
                  min={1900}
                  max={2100}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Tuổi khởi vận (nhập Đại Vận đầu tiên)</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  value={startAgeYears}
                  onChange={(e) => setStartAgeYears(e.target.value)}
                  placeholder="Năm, vd. 7"
                  min={0}
                  max={20}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
                />
                <input
                  type="number"
                  value={startAgeMonths}
                  onChange={(e) => setStartAgeMonths(e.target.value)}
                  placeholder="Tháng, vd. 6"
                  min={0}
                  max={11}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">
                Tuổi đối tác bắt đầu bước vào Đại Vận đầu tiên theo lá số gốc của họ, theo đúng cách nói truyền thống "X tuổi Y tháng" (ví dụ: khởi vận lúc 7 tuổi 6 tháng) — nhập đúng số này thay vì để hệ thống ước lượng, để tránh sai lệch thời điểm từng giai đoạn 10 năm.
              </p>
            </div>

            <div>
              <label className="block text-xs text-gold-soft mb-1.5">Ngày giờ sinh chính xác (không bắt buộc)</label>
              <input
                type="datetime-local"
                value={preciseBirthDateTime}
                onChange={(e) => setPreciseBirthDateTime(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] [color-scheme:dark]"
              />
              <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">
                Chỉ dùng để tính Tiết Khí lúc sinh (đầu/giữa/cuối tiết) — hoàn toàn KHÔNG ảnh hưởng tới Tứ Trụ, Tứ Trụ vẫn lấy đúng theo Can Chi bạn chọn bên dưới. Để trống nếu không biết giờ sinh chính xác.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <PillarPicker label="Trụ Năm" pair={yearP} onChange={setYearP} />
              <PillarPicker label="Trụ Tháng" pair={monthP} onChange={setMonthP} />
              <PillarPicker label="Trụ Ngày" pair={dayP} onChange={setDayP} />
              <PillarPicker label="Trụ Giờ (không bắt buộc)" pair={hourP} onChange={setHourP} />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold border border-gold/40 text-gold-soft hover:bg-gold/10 transition min-h-[44px]"
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
                key={result.pillars.map((p) => p.pillarLabel).join("-")}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 space-y-5"
              >
                {/* Lớp 1: có lợi cho bản thân mình không */}
                <div className={`rounded-2xl p-5 sm:p-6 bg-gradient-to-br ${style.bg} border border-white/10`}>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <PercentGauge percent={result.compatPercent} color={style.hex} />
                    <div className="flex-1 text-center sm:text-left">
                      <p className={`font-display text-xl sm:text-2xl font-semibold ${style.text}`}>{result.compatTierLabel}</p>
                      <p className="text-sm text-white/70 mt-2 leading-relaxed">{result.compatSummary}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">Tứ Trụ đối tác</p>
                      <div className="space-y-1.5 text-sm">
                        {result.pillars.map((p) => (
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
                </div>

                {/* Lớp 2: bản thân người đó có đang thuận vận không */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">Vận trình của chính người này</p>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    Nhật Chủ <span className="text-white font-medium">{result.ownAnalysis.nhatChu}</span> ({ELEMENT_LABEL[result.ownAnalysis.nhatChuElement]}) —{" "}
                    <span className="text-gold-soft font-medium">{result.ownAnalysis.verdict === "vuong" ? "Thân Vượng" : "Thân Nhược"}</span>{" "}
                    (ước tính, phe sinh/trợ ~{result.ownAnalysis.supportPercent}%). Dụng Thần: <span className="text-gold-soft">{ELEMENT_LABEL[result.ownAnalysis.dungElement]}</span>, Hỷ Thần:{" "}
                    <span className="text-moc">{ELEMENT_LABEL[result.ownAnalysis.hyElement]}</span>.
                  </p>

                  {result.tietKhi && (
                    <p className="text-xs text-white/50 mb-4 leading-relaxed">
                      Tiết khí lúc sinh: sinh vào tiết <span className="text-gold-soft">{result.tietKhi.tietName}</span>, ở khoảng <span className="text-gold-soft">{result.tietKhi.position}</span> tiết (trước khi chuyển sang tiết {result.tietKhi.nextTietName}) — góp phần xác nhận thêm mức độ đắc lệnh của Trụ Tháng.
                    </p>
                  )}

                  <div className={`rounded-xl px-4 py-3 border mb-5 ${PERIOD_TONE[result.currentYearRole]}`}>
                    <p className="text-sm font-semibold">
                      Năm {result.currentYear} ({result.currentYearPillar}) — {result.currentYearLabel}
                    </p>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-gold/70 mb-2">
                    8 Đại Vận ({result.daiVanThuan ? "Thuận hành" : "Nghịch hành"}, tính từ Trụ Tháng, khởi vận lúc {result.startAgeLabel} theo bạn nhập)
                  </p>
                  {result.currentDaiVanIndex === -1 && (
                    <p className="text-xs text-white/50 italic mb-2">Đối tác chưa nhập Đại Vận đầu tiên (hiện dưới {result.startAgeLabel}).</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {result.daiVan.map((dv, i) => (
                      <div
                        key={i}
                        className={`rounded-xl px-2.5 py-2 border text-center ${
                          i === result.currentDaiVanIndex ? `${PERIOD_TONE[dv.role]} ring-1 ring-gold/50` : "border-white/10 text-white/50"
                        }`}
                      >
                        <p className="text-[10px] text-white/40">{dv.ageRange[0]}–{dv.ageRange[1]}t</p>
                        <p className="text-sm font-medium">{dv.pillar}</p>
                        {i === result.currentDaiVanIndex && <p className="text-[10px] mt-0.5">(hiện tại)</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ưu điểm / Khuyết điểm khi làm việc với người này */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white/5 border border-white/10">
                  <p className="text-xs uppercase tracking-wider text-gold/70 mb-3">Ưu điểm & Khuyết điểm khi làm việc với người này</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-moc mb-2">Ưu điểm</p>
                      <ul className="space-y-2 text-sm text-white/70">
                        {result.prosCons.strengths.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-moc shrink-0">+</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-hoa mb-2">Khuyết điểm</p>
                      <ul className="space-y-2 text-sm text-white/70">
                        {result.prosCons.weaknesses.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-hoa shrink-0">−</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {!result.pillars.find((p) => p.label === "Giờ") && (
                  <p className="text-xs text-white/40 italic">
                    Chưa nhập Trụ Giờ — kết quả vẫn tính được nhưng sẽ chính xác hơn nếu biết giờ sinh của đối tác.
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
