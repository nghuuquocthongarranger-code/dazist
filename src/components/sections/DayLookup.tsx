import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tierFromPercent, getHiddenStems, type HiddenStemDetail } from "../../lib/canChi";
import { formatDegInSign, type WesternAstroResult } from "../../lib/westernAstro";
import { evaluateActivity, type ActivityVerdict } from "../../lib/activityAdvisor";
import { computeDayScoreBundle, type ColumnScore, type DayScoreBundle } from "../../lib/dayScore";
import { CYCLE_NUMBER_MEANING } from "../../lib/numerology";
import { CanBadge, ChiBadge } from "../CanChiBadge";
import { SectionHeading } from "../GlassCard";
import { ReadingModal } from "../ReadingModal";
import { ROLE_LABEL } from "../../lib/elements";

const ACTIVITY_TIER_STYLE: Record<ActivityVerdict["tier"], { bg: string; border: string; text: string; hex: string }> = {
  nen: { bg: "from-moc/20 to-moc/5", border: "border-moc/30", text: "text-moc", hex: "#3ddc84" },
  "can-nhac": { bg: "from-tho/20 to-tho/5", border: "border-tho/30", text: "text-tho", hex: "#e0a94a" },
  "khong-nen": { bg: "from-hoa/20 to-hoa/5", border: "border-hoa/30", text: "text-hoa", hex: "#ff5f5f" },
};

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shiftDateStr(dateStr: string, deltaDays: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return toISODate(dt);
}

const TIER_STYLE: Record<string, { bg: string; text: string; ring: string; hex: string }> = {
  "rat-tot": { bg: "from-gold-soft/25 to-gold/10", text: "text-gold-soft", ring: "shadow-[0_0_40px_-8px_#d4af37aa]", hex: "#f1d98b" },
  tot: { bg: "from-moc/20 to-moc/5", text: "text-moc", ring: "shadow-[0_0_40px_-10px_#3ddc8488]", hex: "#3ddc84" },
  "binh-thuong": { bg: "from-white/10 to-white/0", text: "text-white/80", ring: "", hex: "#cbd5e1" },
  xau: { bg: "from-tho/20 to-tho/5", text: "text-tho", ring: "shadow-[0_0_40px_-10px_#e0a94a88]", hex: "#e0a94a" },
  "rat-xau": { bg: "from-hoa/25 to-hoa/5", text: "text-hoa", ring: "shadow-[0_0_40px_-8px_#ff5f5faa]", hex: "#ff5f5f" },
};

function PercentGauge({ percent, color, size = "lg" }: { percent: number; color: string; size?: "lg" | "sm" | "xs" }) {
  const dim = size === "lg" ? "w-24 h-24 sm:w-28 sm:h-28" : size === "sm" ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14";
  const font = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-lg sm:text-xl" : "text-base";
  return (
    <div
      className={`relative ${dim} shrink-0 rounded-full mx-auto`}
      style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, rgba(255,255,255,0.1) 0deg)` }}
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Điểm: ${percent} trên 100`}
    >
      <div className="absolute inset-[4px] rounded-full bg-cosmic/90 backdrop-blur-sm grid place-items-center border border-white/10">
        <span className={`font-display ${font} font-semibold leading-none`} style={{ color }}>
          {percent}
        </span>
      </div>
    </div>
  );
}

function FlagBadge({ tone, children }: { tone: "warn" | "info" | "good" | "neutral"; children: React.ReactNode }) {
  const toneClass =
    tone === "warn"
      ? "border-hoa/40 text-hoa bg-hoa/10"
      : tone === "info"
        ? "border-gold/40 text-gold-soft bg-gold/10"
        : tone === "good"
          ? "border-moc/40 text-moc bg-moc/10"
          : "border-white/15 text-white/60 bg-white/5";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs leading-tight ${toneClass}`}>
      {children}
    </span>
  );
}

function westernAdvice(western: WesternAstroResult): { tone: "warn" | "info" | "good" | "neutral"; icon: string; title: string; advice: string }[] {
  const items: { tone: "warn" | "info" | "good" | "neutral"; icon: string; title: string; advice: string }[] = [];

  if (western.flags.voidOfCourse) {
    items.push({
      tone: "warn",
      icon: "🌑",
      title: "Mặt Trăng Void-of-Course",
      advice:
        "Năng lượng ngày trôi nổi, thiếu điểm tựa — việc khởi sự dễ không đi đến đâu hoặc phải làm lại. Lời khuyên: ưu tiên nghỉ ngơi, dọn dẹp, hoàn tất việc dở dang; tránh ký hợp đồng hay ra quyết định quan trọng.",
    });
  }
  if (western.flags.mercuryRetrograde) {
    items.push({
      tone: "warn",
      icon: "☿",
      title: "Thủy Tinh nghịch hành",
      advice:
        "Giao tiếp, di chuyển, hợp đồng dễ trục trặc hoặc hiểu lầm. Lời khuyên: ưu tiên rà soát — xem lại, chỉnh sửa, hoàn thiện việc cũ — hơn là khởi động dự án mới hay ký kết quan trọng.",
    });
  } else if (western.flags.mercuryShadow) {
    items.push({
      tone: "neutral",
      icon: "☿",
      title: "Vùng bóng nghịch hành Thủy Tinh",
      advice: "Dư âm của giai đoạn nghịch hành gần đó. Lời khuyên: vẫn nên kiểm tra kỹ thông tin, hợp đồng trước khi chốt.",
    });
  }
  if (western.flags.solarReturn) {
    items.push({
      tone: "info",
      icon: "☉",
      title: "Giai đoạn Solar Return",
      advice:
        "Mặt Trời transit quay về đúng vị trí gốc, kích hoạt lại toàn bộ lá số trong năm cá nhân mới, đặc biệt trục Mặt Trời–Diêm Vương. Lời khuyên: đây là lúc phù hợp để nhìn lại năm qua và đặt định hướng cho năm tới.",
    });
  }
  for (const a of western.flags.exactAspects) {
    items.push({
      tone: a.kind === "positive" ? "good" : "warn",
      icon: a.kind === "positive" ? "✦" : "⚠",
      title: `${a.text} (orb ${a.orb.toFixed(2)}°)`,
      advice:
        a.kind === "positive"
          ? "Góc chiếu hài hòa và gần như chính xác tuyệt đối — có thể tận dụng năng lượng thuận lợi này cho chủ đề liên quan điểm nhạy cảm trên."
          : "Góc chiếu căng thẳng và gần như chính xác tuyệt đối — nên thận trọng hơn với chủ đề liên quan điểm nhạy cảm trên trong ngày.",
    });
  }
  return items;
}

type ColumnKey = "day" | "month" | "year";
const COLUMNS: { key: ColumnKey; label: string; hint: string }[] = [
  { key: "day", label: "Ngày", hint: "Đại Vận + Lưu Niên + Trụ Tháng + Trụ Ngày + transit hôm nay + số ngày cá nhân" },
  { key: "month", label: "Tháng", hint: "Đại Vận + Lưu Niên + Trụ Tháng (tiết khí thực) + số tháng cá nhân" },
  { key: "year", label: "Năm", hint: "Đại Vận + Lưu Niên (Trụ Năm, ranh giới Lập Xuân) + số năm cá nhân" },
];

function ColumnCard({ col, hint, onOpen }: { col: ColumnScore; hint: string; onOpen: () => void }) {
  const tier = tierFromPercent(col.combined);
  const style = TIER_STYLE[tier.tier];
  return (
    <button
      type="button"
      onClick={onOpen}
      title={hint}
      className={`glass rounded-2xl p-4 text-center hover:border-gold/40 hover:brightness-110 transition border border-white/10 ${style.ring}`}
    >
      <p className="text-xs uppercase tracking-wider text-white/40 mb-3">{col.label}</p>
      <PercentGauge percent={col.combined} color={style.hex} size="sm" />
      <p className={`mt-3 font-display text-sm font-semibold ${style.text}`}>{tier.label}</p>
      {col.diverges && <p className="text-[10px] text-hoa mt-1">⚠ 3 hệ thống trái chiều</p>}
      <span className="text-[11px] text-gold-soft/70 mt-2 inline-block">Xem chi tiết →</span>
    </button>
  );
}

function SystemMiniScore({ label, percent }: { label: string; percent: number }) {
  const tier = tierFromPercent(percent);
  const style = TIER_STYLE[tier.tier];
  return (
    <div className="rounded-xl bg-black/20 border border-white/5 p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">{label}</p>
      <PercentGauge percent={percent} color={style.hex} size="xs" />
    </div>
  );
}

function HiddenStemsList({ stems }: { stems: HiddenStemDetail[] }) {
  if (stems.length === 0) return null;
  return (
    <p className="text-xs text-white/55">
      Tàng can:{" "}
      {stems.map((h, i) => (
        <span key={h.can}>
          <span className="text-gold-soft">{h.can}</span> ({ROLE_LABEL[h.role]})
          {i < stems.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

function PillarLayerRow({
  label,
  canName,
  chiName,
  roleLabel,
  hiddenStems,
}: {
  label: string;
  canName: string;
  chiName: string;
  roleLabel?: string;
  hiddenStems: HiddenStemDetail[];
}) {
  return (
    <div className="rounded-xl bg-black/20 border border-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="text-xs uppercase tracking-wider text-gold/70">{label}</p>
        {roleLabel && <span className="text-[11px] text-gold-soft text-right">{roleLabel}</span>}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <CanBadge name={canName} size="sm" />
        <ChiBadge name={chiName} size="sm" />
      </div>
      <HiddenStemsList stems={hiddenStems} />
    </div>
  );
}

/** Gộp mọi tầng Bát Tự (Đại Vận + Lưu Niên + Trụ Tháng + Trụ Ngày) liên quan tới cột đang xem vào MỘT khối duy nhất,
 * đúng những tầng đã được hoà trộn vào điểm số của cột đó trong computeDayScoreBundle. */
function BaziBlock({ columnKey, bundle }: { columnKey: ColumnKey; bundle: DayScoreBundle }) {
  const yearHidden = useMemo(() => getHiddenStems(bundle.bazi.yearPillar.chi.name), [bundle.bazi.yearPillar.chi.name]);
  const monthHidden = useMemo(() => getHiddenStems(bundle.bazi.monthPillar.chi.name), [bundle.bazi.monthPillar.chi.name]);
  const daiVan = bundle.daiVan;
  const [dvCan, dvChi] = daiVan ? daiVan.ganChi.split(" ") : [null, null];
  const daiVanHidden = useMemo(() => (dvChi ? getHiddenStems(dvChi) : []), [dvChi]);

  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Bát Tự — các tầng thời gian đã tính vào điểm</p>
      <div className="space-y-3">
        {daiVan ? (
          <PillarLayerRow
            label={`Đại Vận (từ ${daiVan.age} tuổi, từ năm ${daiVan.startYear})`}
            canName={dvCan!}
            chiName={dvChi!}
            roleLabel={ROLE_LABEL[daiVan.canRole]}
            hiddenStems={daiVanHidden}
          />
        ) : (
          <div className="rounded-xl bg-black/20 border border-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">Đại Vận</p>
            <p className="text-white/50 text-sm">Chưa nhập Đại Vận tại thời điểm này.</p>
          </div>
        )}

        <PillarLayerRow
          label={`Trụ Năm — Lưu Niên (${bundle.bazi.baziYear})`}
          canName={bundle.bazi.yearPillar.can.name}
          chiName={bundle.bazi.yearPillar.chi.name}
          roleLabel={ROLE_LABEL[bundle.bazi.yearCanRole]}
          hiddenStems={yearHidden}
        />

        {(columnKey === "day" || columnKey === "month") && (
          <PillarLayerRow
            label={`Trụ Tháng — tiết khí ${bundle.bazi.monthPillar.solarTerm.name}`}
            canName={bundle.bazi.monthPillar.can.name}
            chiName={bundle.bazi.monthPillar.chi.name}
            roleLabel={ROLE_LABEL[bundle.bazi.monthCanRole]}
            hiddenStems={monthHidden}
          />
        )}

        {columnKey === "day" && (
          <PillarLayerRow
            label="Trụ Ngày"
            canName={bundle.bazi.day.pillar.can.name}
            chiName={bundle.bazi.day.pillar.chi.name}
            roleLabel={`${ROLE_LABEL[bundle.bazi.day.canRole]} · Thập Thần ${bundle.bazi.day.tenGod}`}
            hiddenStems={bundle.bazi.day.hiddenStems}
          />
        )}
      </div>

      {columnKey === "day" && (
        <p className="text-white/70 text-sm leading-relaxed mt-4">{bundle.bazi.day.summary}</p>
      )}
    </div>
  );
}

function WesternBlock({ western, advice }: { western: WesternAstroResult; advice: ReturnType<typeof westernAdvice> }) {
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Chiêm tinh — transit của ngày đang xem</p>
      <p className="text-sm text-white/70 mb-1">☽ Mặt Trăng: {formatDegInSign(western.moon.lon)}</p>
      <p className="text-sm text-white/70 mb-3">☉ Mặt Trời: {formatDegInSign(western.sun.lon)}</p>
      {advice.length > 0 ? (
        <div className="space-y-2">
          {advice.map((a) => (
            <div key={a.title} className="rounded-xl bg-black/20 border border-white/5 p-3">
              <FlagBadge tone={a.tone}>
                {a.icon} {a.title}
              </FlagBadge>
              <p className="text-white/60 text-xs leading-relaxed mt-2">{a.advice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/40 italic">Không có tín hiệu transit đặc biệt nào cần lưu ý cho ngày này.</p>
      )}
    </div>
  );
}

const CYCLE_LABEL: Record<ColumnKey, string> = {
  day: "Số ngày cá nhân",
  month: "Số tháng cá nhân",
  year: "Số năm cá nhân",
};

function ColumnDetailModal({
  columnKey,
  bundle,
  advice,
  onClose,
}: {
  columnKey: ColumnKey;
  bundle: DayScoreBundle;
  advice: ReturnType<typeof westernAdvice>;
  onClose: () => void;
}) {
  const col = bundle[columnKey];
  const meta = COLUMNS.find((c) => c.key === columnKey)!;

  return (
    <ReadingModal eyebrow="Chi tiết" title={`Cột ${meta.label}`} subtitle={meta.hint} onClose={onClose}>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <SystemMiniScore label="Bát Tự" percent={col.bazi} />
          <SystemMiniScore label="Chiêm tinh" percent={col.western} />
          <SystemMiniScore label="Thần số học" percent={col.numerology} />
        </div>

        <BaziBlock columnKey={columnKey} bundle={bundle} />
        <WesternBlock western={bundle.western} advice={advice} />
        <NumerologyCycleBlock label={CYCLE_LABEL[columnKey]} value={bundle.cycle[columnKey]} />
      </div>
    </ReadingModal>
  );
}

function NumerologyCycleBlock({ label, value }: { label: string; value: number }) {
  const meaning = CYCLE_NUMBER_MEANING[value];
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Thần số học — {label}</p>
      <div className="flex items-center gap-3 mb-3">
        <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold-soft">
          {value}
        </span>
        <p className="font-display text-base text-gold-soft">{meaning?.label ?? ""}</p>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">{meaning?.advice ?? ""}</p>
    </div>
  );
}

export function DayLookup() {
  const [dateStr, setDateStr] = useState(() => toISODate(new Date()));
  const [activityInput, setActivityInput] = useState("");
  const [detailKey, setDetailKey] = useState<ColumnKey | null>(null);

  const bundle = useMemo<DayScoreBundle | null>(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return computeDayScoreBundle(new Date(y, m - 1, d));
  }, [dateStr]);

  const today = toISODate(new Date());
  const overallTier = bundle ? tierFromPercent(bundle.day.combined) : null;
  const overallStyle = overallTier ? TIER_STYLE[overallTier.tier] : TIER_STYLE["binh-thuong"];
  const advice = bundle ? westernAdvice(bundle.western) : [];

  const activityVerdict = useMemo(() => {
    if (!bundle || !activityInput.trim()) return null;
    return evaluateActivity(activityInput, bundle.bazi.day, bundle.western, bundle.day.combined);
  }, [activityInput, bundle]);
  const activityStyle = activityVerdict ? ACTIVITY_TIER_STYLE[activityVerdict.tier] : null;

  return (
    <section id="tra-cuu" className="relative py-20 sm:py-28 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Công cụ cá nhân hóa"
          title="Hôm nay là ngày tốt hay xấu?"
          subtitle="Tổng hợp 3 hệ thống độc lập: Bát Tự (Dụng/Hỷ/Kỵ Thần + tiết khí), Chiêm tinh học Tây phương (transit) và Thần số học (chu kỳ cá nhân)."
        />

        <div className="glass glass-gold-edge rounded-3xl p-6 sm:p-10">
          <label htmlFor="day-lookup-date" className="block text-sm text-white/70 mb-2 font-medium">
            Chọn ngày cần xem
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setDateStr((d) => shiftDateStr(d, -1))}
                aria-label="Lùi một ngày"
                className="shrink-0 grid place-items-center w-11 h-11 rounded-xl border border-white/15 hover:border-gold/60 hover:text-gold-soft transition"
              >
                ‹
              </button>
              <input
                id="day-lookup-date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value || today)}
                className="flex-1 sm:w-auto bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setDateStr((d) => shiftDateStr(d, 1))}
                aria-label="Tiến một ngày"
                className="shrink-0 grid place-items-center w-11 h-11 rounded-xl border border-white/15 hover:border-gold/60 hover:text-gold-soft transition"
              >
                ›
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDateStr(today)}
              className="min-h-[44px] rounded-xl px-4 py-3 text-sm border border-white/15 hover:border-gold/60 hover:text-gold-soft transition"
            >
              Hôm nay
            </button>
          </div>

          <AnimatePresence mode="wait">
            {bundle && overallTier && (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mt-8 space-y-6"
              >
                {/* Điểm tổng hợp ngày */}
                <div className={`rounded-2xl p-6 sm:p-8 bg-linear-to-br ${overallStyle.bg} border border-white/10 ${overallStyle.ring}`}>
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Điểm tổng hợp 3 hệ thống — hôm nay</p>
                      <span className={`font-display text-2xl sm:text-3xl font-semibold ${overallStyle.text}`}>
                        {overallTier.label}
                      </span>
                    </div>
                    <PercentGauge percent={bundle.day.combined} color={overallStyle.hex} />
                  </div>

                  {bundle.day.diverges && (
                    <p className="mt-4 text-sm text-hoa bg-hoa/10 border border-hoa/30 rounded-xl px-4 py-3">
                      ⚠ Ba hệ thống có tín hiệu khá trái chiều cho ngày này — nên cân nhắc kỹ trước khi quyết định
                      việc quan trọng.
                    </p>
                  )}
                </div>

                {/* 4 cột Ngày / Tuần / Tháng / Năm */}
                <div className="grid grid-cols-3 gap-3">
                  {COLUMNS.map((c) => (
                    <ColumnCard key={c.key} col={bundle[c.key]} hint={c.hint} onOpen={() => setDetailKey(c.key)} />
                  ))}
                </div>

                {/* Hỏi việc nên làm trong ngày */}
                <div className="rounded-2xl p-5 sm:p-6 bg-white/5 border border-white/10">
                  <label htmlFor="activity-input" className="block text-sm text-white/70 mb-2 font-medium">
                    Hôm nay bạn định làm việc gì? Để xem có nên làm không.
                  </label>
                  <input
                    id="activity-input"
                    type="text"
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    placeholder="Vd: ký hợp đồng, cưới hỏi, đầu tư, khai trương, du lịch, phỏng vấn..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px]"
                  />

                  <AnimatePresence mode="wait">
                    {activityVerdict && activityStyle && (
                      <motion.div
                        key={activityInput}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className={`mt-5 rounded-xl p-5 bg-linear-to-br ${activityStyle.bg} border ${activityStyle.border}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
                          <span className={`font-display text-xl font-semibold ${activityStyle.text}`}>
                            {activityVerdict.label}
                          </span>
                          <PercentGauge percent={activityVerdict.score} color={activityStyle.hex} size="sm" />
                        </div>
                        {activityVerdict.category && (
                          <p className="text-xs text-white/40 mb-3">Nhóm việc: {activityVerdict.category.label}</p>
                        )}
                        <ul className="space-y-1.5 text-sm text-white/70 mt-3">
                          {activityVerdict.reasons.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-gold-soft shrink-0">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-xs text-white/35 leading-relaxed text-center px-4">
                  Điểm số là tổng hợp tham khảo từ ba hệ thống chiêm tinh/số học độc lập (Bát Tự, Chiêm tinh học Tây
                  phương & Thần số học), mang tính định hướng, không phải khẳng định tuyệt đối.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {detailKey && bundle && (
        <ColumnDetailModal columnKey={detailKey} bundle={bundle} advice={advice} onClose={() => setDetailKey(null)} />
      )}
    </section>
  );
}
