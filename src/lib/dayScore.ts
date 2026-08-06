import { evaluateDayFull, getBaziYearNumber, pillarPercent, CAN, type FullDayVerdict } from "./canChi";
import { computeWesternAstroScore, type WesternAstroResult } from "./westernAstro";
import { getTuViDayColumnPercent, getTuViMonthColumnPercent, getTuViYearColumnPercent } from "./tuViScore";
import { daiVan } from "../data/baziProfile";
import type { DungHyKy } from "./elements";

export interface DaiVanPeriod {
  ganChi: string;
  canRole: DungHyKy;
  percent: number;
  age: number;
  startYear: number;
}

/** Chặng Đại Vận (10 năm) mà một năm Bát Tự rơi vào — dùng cùng bảng `daiVan` đã có ở mục Bát Tự > XIII. Đại Vận. */
export function getDaiVanForYear(baziYear: number): DaiVanPeriod | null {
  let match: (typeof daiVan)[number] | null = null;
  for (const stage of daiVan) {
    if (stage.startYear <= baziYear) match = stage;
    else break;
  }
  if (!match) return null;
  const [canName, chiName] = match.ganChi.split(" ");
  const can = CAN.find((c) => c.name === canName)!;
  const { percent, canRole } = pillarPercent(can.element, chiName, 1, 0.9);
  return { ganChi: match.ganChi, canRole, percent, age: match.age, startYear: match.startYear };
}

export interface ColumnScore {
  label: string;
  combined: number;
  bazi: number;
  western: number;
  tuVi: number;
}

export interface DayScoreBundle {
  date: Date;
  bazi: FullDayVerdict;
  western: WesternAstroResult;
  westernMonth: WesternAstroResult;
  westernYear: WesternAstroResult;
  daiVan: DaiVanPeriod | null;
  day: ColumnScore;
  month: ColumnScore;
  year: ColumnScore;
}

function combine(label: string, bazi: number, western: number, tuVi: number): ColumnScore {
  const combined = Math.round((bazi + western + tuVi) / 3);
  return { label, combined, bazi, western, tuVi };
}

function blend(parts: { percent: number; weight: number }[]): number {
  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const sum = parts.reduce((s, p) => s + p.percent * p.weight, 0);
  return Math.round(sum / totalWeight);
}

/**
 * Tổng hợp điểm 3 hệ thống (Bát Tự + Chiêm tinh Tây phương + Tử Vi) theo 3 mốc thời gian: Ngày, Tháng, Năm.
 * Phần Bát Tự của mỗi mốc hòa trộn nhiều tầng thời gian theo đúng cách luận Bát Tự truyền thống:
 *  - Ngày: Đại Vận + Lưu Niên (Trụ Năm) + Trụ Tháng (tiết khí thực) + Trụ Ngày.
 *  - Tháng: Đại Vận + Lưu Niên + Trụ Tháng (tiết khí thực).
 *  - Năm: Đại Vận + Lưu Niên (Trụ Năm).
 * Phần Tử Vi dùng 3 cơ chế "an lưu" RIÊNG cho từng cấp thời gian — không phải cùng một con số của năm dùng lại
 * cho cả ngày/tháng: Lưu Nhật (ngày) cho cột Ngày, Lưu Nguyệt (tháng) cho cột Tháng, Lưu Niên (năm) cho cột Năm,
 * mỗi cột có thêm Đại Vận làm nền — xem lib/tuViScore.ts.
 *
 * Phần Chiêm Tinh: cột Ngày dùng transit đúng ngày đang xem; cột Tháng/Năm KHÔNG được đổi theo từng ngày —
 * dùng transit tại một mốc cố định (đầu tháng / đầu năm dương lịch chứa ngày đang xem) để điểm hai cột này
 * chỉ thay đổi khi thực sự sang tháng/năm khác, không nhảy số mỗi lần bấm lùi/tiến 1 ngày.
 */
export function computeDayScoreBundle(date: Date): DayScoreBundle {
  const bazi = evaluateDayFull(date);
  const western = computeWesternAstroScore(date);
  const westernMonth = computeWesternAstroScore(new Date(date.getFullYear(), date.getMonth(), 1));
  const westernYear = computeWesternAstroScore(new Date(date.getFullYear(), 0, 1));
  const tuViDayPercent = getTuViDayColumnPercent(date);
  const tuViMonthPercent = getTuViMonthColumnPercent(date);
  const tuViYearPercent = getTuViYearColumnPercent(date.getFullYear());
  const daiVanPeriod = getDaiVanForYear(getBaziYearNumber(date));
  const daiVanPercent = daiVanPeriod?.percent ?? 50;

  const dayBazi = blend([
    { percent: bazi.day.percent, weight: 0.4 },
    { percent: bazi.monthPercent, weight: 0.25 },
    { percent: bazi.yearPercent, weight: 0.2 },
    { percent: daiVanPercent, weight: 0.15 },
  ]);
  const monthBazi = blend([
    { percent: bazi.monthPercent, weight: 0.5 },
    { percent: bazi.yearPercent, weight: 0.3 },
    { percent: daiVanPercent, weight: 0.2 },
  ]);
  const yearBazi = blend([
    { percent: bazi.yearPercent, weight: 0.6 },
    { percent: daiVanPercent, weight: 0.4 },
  ]);

  const day = combine("Ngày", dayBazi, western.percent, tuViDayPercent);
  const month = combine("Tháng", monthBazi, westernMonth.percent, tuViMonthPercent);
  const year = combine("Năm", yearBazi, westernYear.percent, tuViYearPercent);

  return { date, bazi, western, westernMonth, westernYear, daiVan: daiVanPeriod, day, month, year };
}
