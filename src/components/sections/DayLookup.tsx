import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tierFromPercent, getHiddenStems, type HiddenStemDetail } from "../../lib/canChi";
import { formatDegInSign, type WesternAstroResult } from "../../lib/westernAstro";
import { computeDayScoreBundle, type ColumnScore, type DayScoreBundle } from "../../lib/dayScore";
import { getLuuNhatPalace, getLuuNguyetPalace, getLuuNienPalace } from "../../lib/tuViScore";
import { solarDateToLunar, lunarYearCanChi, moonPhaseInfo } from "../../lib/lunarCalendar";
import { TRUONG_SINH_TONE, type TuViPalace } from "../../data/tuViProfile";
import { CanBadge, ChiBadge } from "../CanChiBadge";
import { SectionHeading } from "../GlassCard";
import { MoonPhaseDisc } from "../MoonPhaseDisc";
import { ReadingModal } from "../ReadingModal";
import { ChatPanel } from "../ChatPanel";
import { ROLE_LABEL } from "../../lib/elements";

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

/** Hiển thị ngày/tháng/năm cố định — không phụ thuộc định dạng locale mặc định của trình duyệt
 * (input[type=date] gốc có thể hiện tháng/ngày/năm tuỳ trình duyệt/hệ điều hành). */
function formatDMY(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

/** Tóm tắt lá số + điểm ngày/tháng/năm đang xem thành văn bản gửi kèm cho AI — để AI trả lời bám sát dữ liệu
 * thật của người dùng thay vì đoán chung chung. */
function buildDayChatContext(bundle: DayScoreBundle, dateStr: string): string {
  const dayTier = tierFromPercent(bundle.day.combined);
  const monthTier = tierFromPercent(bundle.month.combined);
  const yearTier = tierFromPercent(bundle.year.combined);
  const luuNhat = getLuuNhatPalace(bundle.date);
  const luuNguyet = getLuuNguyetPalace(bundle.date);
  const luuNien = getLuuNienPalace(bundle.date.getFullYear());

  const lines = [
    `Ngày đang xem: ${formatDMY(dateStr)}.`,
    `Điểm tổng hợp (thang 0-100, 0-30 Xấu / 30-50 Bình thường / 50-70 Tốt / 70-100 Rất tốt): Ngày ${bundle.day.combined} (${dayTier.label}), Tháng ${bundle.month.combined} (${monthTier.label}), Năm ${bundle.year.combined} (${yearTier.label}).`,
    `Bát Tự — Trụ ngày ${bundle.bazi.day.pillar.label}, Thập Thần ${bundle.bazi.day.tenGod}, vai trò ${ROLE_LABEL[bundle.bazi.day.canRole]}. ${bundle.bazi.day.summary}`,
    `Bát Tự — Trụ tháng ${bundle.bazi.monthPillar.label} (tiết khí ${bundle.bazi.monthPillar.solarTerm.name}). Trụ năm/Lưu Niên ${bundle.bazi.yearPillar.label}.`,
    `Chiêm tinh hôm nay: Mặt Trăng ${formatDegInSign(bundle.western.moon.lon)}, Mặt Trời ${formatDegInSign(bundle.western.sun.lon)}.`,
  ];
  if (bundle.western.flags.voidOfCourse) lines.push("Lưu ý: Mặt Trăng đang Void-of-Course (năng lượng trôi nổi).");
  if (bundle.western.flags.mercuryRetrograde) lines.push("Lưu ý: Thuỷ Tinh đang nghịch hành (giao tiếp/hợp đồng dễ trục trặc).");
  if (luuNhat) lines.push(`Tử Vi — cung Lưu Nhật (ngày): ${luuNhat.chi} (${luuNhat.cungName}), Vòng Trường Sinh: ${luuNhat.truongSinh}${luuNhat.trietTuan ? `, có ${luuNhat.trietTuan}` : ""}.`);
  if (luuNguyet) lines.push(`Tử Vi — cung Lưu Nguyệt (tháng): ${luuNguyet.chi} (${luuNguyet.cungName}), ${luuNguyet.truongSinh}.`);
  if (luuNien) lines.push(`Tử Vi — cung Lưu Niên (năm): ${luuNien.chi} (${luuNien.cungName}), ${luuNien.truongSinh}.`);
  return lines.join("\n");
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
  { key: "day", label: "Ngày", hint: "Đại Vận + Lưu Niên + Trụ Tháng + Trụ Ngày + transit hôm nay" },
  { key: "month", label: "Tháng", hint: "Đại Vận + Lưu Niên + Trụ Tháng (tiết khí thực)" },
  { key: "year", label: "Năm", hint: "Đại Vận + Lưu Niên (Trụ Năm, ranh giới Lập Xuân)" },
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

function WesternBlock({
  western,
  advice,
  label,
}: {
  western: WesternAstroResult;
  advice: ReturnType<typeof westernAdvice>;
  label: string;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Chiêm tinh — {label}</p>
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

const TUVI_ANCHOR: Record<ColumnKey, { pick: (date: Date) => TuViPalace | undefined; label: string }> = {
  day: { pick: (d) => getLuuNhatPalace(d), label: "cung Lưu Nhật (ngày)" },
  month: { pick: (d) => getLuuNguyetPalace(d), label: "cung Lưu Nguyệt (tháng)" },
  year: { pick: (d) => getLuuNienPalace(d.getFullYear()), label: "cung Lưu Niên (năm)" },
};

function TuViBlock({ columnKey, date }: { columnKey: ColumnKey; date: Date }) {
  const anchor = TUVI_ANCHOR[columnKey];
  const palace = anchor.pick(date);
  if (!palace) return null;
  const tone = TRUONG_SINH_TONE[palace.truongSinh];
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Tử Vi — {anchor.label}</p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-display text-gold-soft text-base">
          {palace.chi} · {palace.cungName}
        </span>
        <span
          className={`text-xs rounded-full border px-2.5 py-1 ${
            tone === "tot" ? "border-moc/40 text-moc" : tone === "xau" ? "border-hoa/40 text-hoa" : "border-white/20 text-white/60"
          }`}
        >
          {palace.truongSinh}
        </span>
        {palace.trietTuan && (
          <span className="text-xs rounded-full border border-hoa/40 text-hoa px-2.5 py-1">{palace.trietTuan}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {palace.mainStars.length > 0 ? (
          palace.mainStars.map((s) => (
            <span key={s.name} className="text-xs rounded-full bg-gold/10 border border-gold/25 text-gold-soft px-2.5 py-1">
              {s.name}
              {s.state ? ` (${s.state})` : ""}
            </span>
          ))
        ) : (
          <span className="text-xs rounded-full bg-white/5 border border-white/10 text-white/40 px-2.5 py-1">Vô chính diệu</span>
        )}
      </div>
      <p className="text-white/70 text-sm leading-relaxed">{palace.summary}</p>
    </div>
  );
}

const WESTERN_ANCHOR: Record<ColumnKey, { pick: (b: DayScoreBundle) => WesternAstroResult; label: string }> = {
  day: { pick: (b) => b.western, label: "transit của ngày đang xem" },
  month: { pick: (b) => b.westernMonth, label: "transit đầu tháng (cố định trong tháng)" },
  year: { pick: (b) => b.westernYear, label: "transit đầu năm (cố định trong năm)" },
};

function ColumnDetailModal({
  columnKey,
  bundle,
  onClose,
}: {
  columnKey: ColumnKey;
  bundle: DayScoreBundle;
  onClose: () => void;
}) {
  const col = bundle[columnKey];
  const meta = COLUMNS.find((c) => c.key === columnKey)!;
  const anchor = WESTERN_ANCHOR[columnKey];
  const western = anchor.pick(bundle);
  const advice = westernAdvice(western);

  return (
    <ReadingModal eyebrow="Chi tiết" title={`Cột ${meta.label}`} subtitle={meta.hint} onClose={onClose}>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <SystemMiniScore label="Bát Tự" percent={col.bazi} />
          <SystemMiniScore label="Chiêm tinh" percent={col.western} />
          <SystemMiniScore label="Tử Vi" percent={col.tuVi} />
        </div>

        <BaziBlock columnKey={columnKey} bundle={bundle} />
        <WesternBlock western={western} advice={advice} label={anchor.label} />
        <TuViBlock columnKey={columnKey} date={bundle.date} />
      </div>
    </ReadingModal>
  );
}

export function DayLookup() {
  const [dateStr, setDateStr] = useState(() => toISODate(new Date()));
  const [detailKey, setDetailKey] = useState<ColumnKey | null>(null);

  const bundle = useMemo<DayScoreBundle | null>(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return computeDayScoreBundle(new Date(y, m - 1, d));
  }, [dateStr]);

  const lunar = useMemo(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return solarDateToLunar(new Date(y, m - 1, d));
  }, [dateStr]);

  const moonPhase = useMemo(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return null;
    return moonPhaseInfo(new Date(y, m - 1, d, 12));
  }, [dateStr]);

  const today = toISODate(new Date());
  const overallTier = bundle ? tierFromPercent(bundle.day.combined) : null;
  const overallStyle = overallTier ? TIER_STYLE[overallTier.tier] : TIER_STYLE["binh-thuong"];

  return (
    <section id="tra-cuu" className="relative py-20 sm:py-28 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Công cụ cá nhân hóa"
          title="Hôm nay là ngày tốt hay xấu?"
          subtitle="Tổng hợp 3 hệ thống độc lập: Bát Tự (Dụng/Hỷ/Kỵ Thần + tiết khí), Chiêm tinh học Tây phương (transit) và Tử Vi (cung Lưu Niên)."
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
              <div className="relative flex-1 sm:w-auto min-h-[44px]">
                {/* Input gốc ẩn nhưng vẫn nhận click/nhập để mở lịch chọn ngày của trình duyệt — phần chữ
                    hiển thị dùng định dạng ngày/tháng/năm riêng, không phụ thuộc locale trình duyệt. */}
                <input
                  id="day-lookup-date"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value || today)}
                  className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none flex items-center h-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white min-h-[44px] transition peer-focus:border-gold peer-focus:ring-2 peer-focus:ring-gold/40">
                  {formatDMY(dateStr)}
                </div>
              </div>
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

          {lunar && moonPhase && (
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-2xl bg-black/20 border border-white/5 p-4">
              <MoonPhaseDisc illuminatedFraction={moonPhase.illumination} waxing={moonPhase.phaseAngle < 180} size={104} />
              <div className="text-center sm:text-left">
                <p className="text-sm text-gold-soft font-medium">
                  Âm lịch: {lunar.leap ? "Nhuận " : ""}
                  {lunar.day}/{lunar.month} năm {lunarYearCanChi(lunar.year)}
                </p>
                <p className="text-xs text-white/60 mt-1">{moonPhase.phaseName}</p>
                <p className="text-xs text-white/40 mt-0.5">Độ che phủ: {Math.round(moonPhase.illumination * 100)}%</p>
              </div>
            </div>
          )}

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
                </div>

                {/* 4 cột Ngày / Tuần / Tháng / Năm */}
                <div className="grid grid-cols-3 gap-3">
                  {COLUMNS.map((c) => (
                    <ColumnCard key={c.key} col={bundle[c.key]} hint={c.hint} onOpen={() => setDetailKey(c.key)} />
                  ))}
                </div>

                {/* Hỏi đáp AI về ngày đang xem */}
                <ChatPanel
                  key={dateStr}
                  eyebrow="Trợ lý AI"
                  title="Hỏi đáp huyền học"
                  placeholder="Hỏi về hôm nay: có nên ký hợp đồng không, ngày này hợp việc gì..."
                  context={buildDayChatContext(bundle, dateStr)}
                  suggestions={[
                    "Hôm nay có hợp ký hợp đồng, khai trương không?",
                    "Tôi nên tập trung vào việc gì hôm nay?",
                    "Có điều gì cần tránh hôm nay không?",
                  ]}
                />

                <p className="text-xs text-white/35 leading-relaxed text-center px-4">
                  Điểm số là tổng hợp tham khảo từ ba hệ thống chiêm tinh/mệnh lý độc lập (Bát Tự, Chiêm tinh học Tây
                  phương & Tử Vi), mang tính định hướng, không phải khẳng định tuyệt đối.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {detailKey && bundle && (
        <ColumnDetailModal columnKey={detailKey} bundle={bundle} onClose={() => setDetailKey(null)} />
      )}
    </section>
  );
}
