import { evaluateDayFull, getBaziYearNumber, pillarPercent, CAN, CHI, type FullDayVerdict } from "./canChi";
import { computeWesternAstroScore, type WesternAstroResult } from "./westernAstro";
import { computePersonalCycle, cycleScore, type PersonalCycle } from "./numerology";
import { personalInfo, daiVan } from "../data/baziProfile";
import type { DungHyKy } from "./elements";

// "05/05/2001 (Dương lịch)" — bóc ngày/tháng sinh dùng cho chu kỳ cá nhân thần số học.
const [BIRTH_DAY, BIRTH_MONTH] = personalInfo.birthDate.split(" ")[0].split("/").map(Number);

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
  numerology: number;
  diverges: boolean;
}

export interface DayScoreBundle {
  date: Date;
  bazi: FullDayVerdict;
  western: WesternAstroResult;
  cycle: PersonalCycle;
  daiVan: DaiVanPeriod | null;
  day: ColumnScore;
  month: ColumnScore;
  year: ColumnScore;
}

function combine(label: string, bazi: number, western: number, numerology: number): ColumnScore {
  const combined = Math.round((bazi + western + numerology) / 3);
  const vals = [bazi, western, numerology];
  const diverges = Math.max(...vals) - Math.min(...vals) > 35;
  return { label, combined, bazi, western, numerology, diverges };
}

function blend(parts: { percent: number; weight: number }[]): number {
  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const sum = parts.reduce((s, p) => s + p.percent * p.weight, 0);
  return Math.round(sum / totalWeight);
}

/**
 * Tổng hợp điểm 3 hệ thống (Bát Tự + Chiêm tinh Tây phương + Thần số học) theo 3 mốc thời gian: Ngày, Tháng, Năm.
 * Phần Bát Tự của mỗi mốc hòa trộn nhiều tầng thời gian theo đúng cách luận Bát Tự truyền thống:
 *  - Ngày: Đại Vận + Lưu Niên (Trụ Năm) + Trụ Tháng (tiết khí thực) + Trụ Ngày.
 *  - Tháng: Đại Vận + Lưu Niên + Trụ Tháng (tiết khí thực).
 *  - Năm: Đại Vận + Lưu Niên (Trụ Năm).
 */
export function computeDayScoreBundle(date: Date): DayScoreBundle {
  const bazi = evaluateDayFull(date);
  const western = computeWesternAstroScore(date);
  const cycle = computePersonalCycle(BIRTH_DAY, BIRTH_MONTH, date);
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

  const day = combine("Ngày", dayBazi, western.percent, cycleScore(cycle.day));
  const month = combine("Tháng", monthBazi, western.percent, cycleScore(cycle.month));
  const year = combine("Năm", yearBazi, western.percent, cycleScore(cycle.year));

  return { date, bazi, western, cycle, daiVan: daiVanPeriod, day, month, year };
}
