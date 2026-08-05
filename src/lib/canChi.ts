import * as Astronomy from "astronomy-engine";
import type { Element, DungHyKy } from "./elements";
import { ELEMENT_ROLE, ELEMENT_LABEL, ROLE_SCORE, ROLE_LABEL } from "./elements";

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export type Polarity = "duong" | "am";

export interface CanInfo {
  name: string;
  element: Element;
  polarity: Polarity;
}

export interface ChiInfo {
  name: string;
  element: Element;
  animal: string;
}

// 10 Thiên Can, index 0..9
export const CAN: CanInfo[] = [
  { name: "Giáp", element: "moc", polarity: "duong" },
  { name: "Ất", element: "moc", polarity: "am" },
  { name: "Bính", element: "hoa", polarity: "duong" },
  { name: "Đinh", element: "hoa", polarity: "am" },
  { name: "Mậu", element: "tho", polarity: "duong" },
  { name: "Kỷ", element: "tho", polarity: "am" },
  { name: "Canh", element: "kim", polarity: "duong" },
  { name: "Tân", element: "kim", polarity: "am" },
  { name: "Nhâm", element: "thuy", polarity: "duong" },
  { name: "Quý", element: "thuy", polarity: "am" },
];

// 12 Địa Chi, index 0..11
export const CHI: ChiInfo[] = [
  { name: "Tý", element: "thuy", animal: "Chuột" },
  { name: "Sửu", element: "tho", animal: "Trâu" },
  { name: "Dần", element: "moc", animal: "Hổ" },
  { name: "Mão", element: "moc", animal: "Mèo" },
  { name: "Thìn", element: "tho", animal: "Rồng" },
  { name: "Tỵ", element: "hoa", animal: "Rắn" },
  { name: "Ngọ", element: "hoa", animal: "Ngựa" },
  { name: "Mùi", element: "tho", animal: "Dê" },
  { name: "Thân", element: "kim", animal: "Khỉ" },
  { name: "Dậu", element: "kim", animal: "Gà" },
  { name: "Tuất", element: "tho", animal: "Chó" },
  { name: "Hợi", element: "thuy", animal: "Lợn" },
];

/** Tàng Can của 12 Địa Chi kèm trọng số (chính khí / trung khí / dư khí) — thứ tự khớp cách dùng trong Tứ Trụ ở trên. */
export const CHI_HIDDEN_CAN: Record<string, { can: string; weight: number }[]> = {
  Tý: [{ can: "Quý", weight: 1.0 }],
  Sửu: [
    { can: "Kỷ", weight: 0.6 },
    { can: "Quý", weight: 0.3 },
    { can: "Tân", weight: 0.1 },
  ],
  Dần: [
    { can: "Giáp", weight: 0.6 },
    { can: "Bính", weight: 0.3 },
    { can: "Mậu", weight: 0.1 },
  ],
  Mão: [{ can: "Ất", weight: 1.0 }],
  Thìn: [
    { can: "Mậu", weight: 0.6 },
    { can: "Ất", weight: 0.3 },
    { can: "Quý", weight: 0.1 },
  ],
  Tỵ: [
    { can: "Bính", weight: 0.6 },
    { can: "Mậu", weight: 0.3 },
    { can: "Canh", weight: 0.1 },
  ],
  Ngọ: [
    { can: "Đinh", weight: 0.7 },
    { can: "Kỷ", weight: 0.3 },
  ],
  Mùi: [
    { can: "Kỷ", weight: 0.6 },
    { can: "Đinh", weight: 0.3 },
    { can: "Ất", weight: 0.1 },
  ],
  Thân: [
    { can: "Canh", weight: 0.6 },
    { can: "Nhâm", weight: 0.3 },
    { can: "Mậu", weight: 0.1 },
  ],
  Dậu: [{ can: "Tân", weight: 1.0 }],
  Tuất: [
    { can: "Mậu", weight: 0.6 },
    { can: "Tân", weight: 0.3 },
    { can: "Đinh", weight: 0.1 },
  ],
  Hợi: [
    { can: "Nhâm", weight: 0.7 },
    { can: "Giáp", weight: 0.3 },
  ],
};

/** Thập Thần cố định theo Nhật Chủ Mậu (Dương Thổ) — dùng cho hồ sơ DaZiST demo */
export const TEN_GOD_BY_CAN_INDEX_FOR_MAU: string[] = [
  "Thất Sát", // Giáp - Dương Mộc khắc Mậu
  "Chính Quan", // Ất - Âm Mộc khắc Mậu
  "Thiên Ấn", // Bính - Dương Hỏa sinh Mậu
  "Chính Ấn", // Đinh - Âm Hỏa sinh Mậu
  "Tỉ Kiên", // Mậu - Dương Thổ
  "Kiếp Tài", // Kỷ - Âm Thổ
  "Thực Thần", // Canh - Dương Kim, Mậu sinh
  "Thương Quan", // Tân - Âm Kim, Mậu sinh
  "Thiên Tài", // Nhâm - Dương Thủy, Mậu khắc
  "Chính Tài", // Quý - Âm Thủy, Mậu khắc
];

/** Julian Day Number tại 12:00 trưa cho một ngày Dương lịch (thuật toán Fliegel–Van Flandern) */
export function jdnFromDate(date: Date): number {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  // Ngày trước 15/10/1582 dùng lịch Julius
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

export interface DayPillar {
  jdn: number;
  canIndex: number;
  chiIndex: number;
  can: CanInfo;
  chi: ChiInfo;
  label: string; // "Mậu Thìn"
}

export function getDayPillar(date: Date): DayPillar {
  const jdn = jdnFromDate(date);
  const canIndex = (((jdn + 9) % 10) + 10) % 10;
  const chiIndex = (((jdn + 1) % 12) + 12) % 12;
  const can = CAN[canIndex];
  const chi = CHI[chiIndex];
  return { jdn, canIndex, chiIndex, can, chi, label: `${can.name} ${chi.name}` };
}

export interface YearPillar {
  year: number;
  canIndex: number;
  chiIndex: number;
  can: CanInfo;
  chi: ChiInfo;
  label: string;
}

/**
 * Can Chi năm Dương lịch (xấp xỉ theo năm dương lịch, mốc chuẩn 1984 = Giáp Tý).
 * Lưu Niên luôn chạy thuận chiều 60 Giáp Tý bất kể Đại Vận thuận hay nghịch.
 */
export function getYearPillar(year: number): YearPillar {
  const offset = year - 4;
  const canIndex = (((offset % 10) + 10) % 10);
  const chiIndex = (((offset % 12) + 12) % 12);
  const can = CAN[canIndex];
  const chi = CHI[chiIndex];
  return { year, canIndex, chiIndex, can, chi, label: `${can.name} ${chi.name}` };
}

export interface HiddenStemDetail {
  can: string;
  element: Element;
  weight: number;
  role: DungHyKy;
  tenGod: string;
}

/** Tàng Can của một Địa Chi kèm Thập Thần + vai trò Dụng/Hỷ/Kỵ (so với Nhật Chủ Mậu) */
export function getHiddenStems(chiName: string): HiddenStemDetail[] {
  const entries = CHI_HIDDEN_CAN[chiName] ?? [];
  return entries.map(({ can, weight }) => {
    const canIndex = CAN.findIndex((c) => c.name === can);
    const canInfo = CAN[canIndex];
    return {
      can,
      element: canInfo.element,
      weight,
      role: ELEMENT_ROLE[canInfo.element],
      tenGod: TEN_GOD_BY_CAN_INDEX_FOR_MAU[canIndex],
    };
  });
}

export interface DayVerdict {
  pillar: DayPillar;
  tenGod: string;
  canRole: DungHyKy;
  chiMainRole: DungHyKy;
  hiddenStems: HiddenStemDetail[];
  score: number;
  percent: number;
  tier: "rat-tot" | "tot" | "binh-thuong" | "xau" | "rat-xau";
  tierLabel: string;
  summary: string;
  detail: string[];
}

const CAN_WEIGHT = 1.2;
const CHI_WEIGHT = 1.0;
// Biên điểm lý thuyết: cả Can lẫn Chi đều là Dụng Thần (tốt nhất) hoặc đều là Kỵ Thần (xấu nhất).
// Tổng trọng số Tàng Can trong CHI_HIDDEN_CAN luôn bằng 1 nên biên này không đổi dù tính theo Tàng Can.
const MAX_SCORE = ROLE_SCORE["dung-than"] * CAN_WEIGHT + ROLE_SCORE["dung-than"] * CHI_WEIGHT;
const MIN_SCORE = ROLE_SCORE["ky-than"] * CAN_WEIGHT + ROLE_SCORE["ky-than"] * CHI_WEIGHT;

function scoreToPercent(score: number): number {
  const pct = ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function tierFromPercent(percent: number): { tier: DayVerdict["tier"]; label: string } {
  if (percent >= 80) return { tier: "rat-tot", label: "Rất tốt" };
  if (percent >= 60) return { tier: "tot", label: "Tốt" };
  if (percent >= 40) return { tier: "binh-thuong", label: "Bình thường" };
  if (percent >= 20) return { tier: "xau", label: "Xấu" };
  return { tier: "rat-xau", label: "Rất xấu" };
}

/**
 * Đánh giá ngày theo Dụng/Hỷ/Kỵ Thần của hồ sơ Mậu Thổ (Thân cực vượng, Dụng Thần Mộc, Hỷ Thần Thủy).
 * Trọng số Can 1.2 / Chi 1.0 vì Can lộ ra ngoài có ảnh hưởng trực tiếp hơn Chi tàng.
 * Phần đóng góp của Chi được tính theo TỪNG Tàng Can (chính khí/trung khí/dư khí) thay vì chỉ
 * dùng hành chủ của Chi, để bám sát cách luận Tàng Can thực tế trong Bát Tự.
 * Điểm quy đổi thang 0-100: 0 = cả Can/Chi đều Kỵ Thần, 100 = cả Can/Chi đều Dụng Thần.
 */
export function evaluateDay(date: Date): DayVerdict {
  const pillar = getDayPillar(date);
  const tenGod = TEN_GOD_BY_CAN_INDEX_FOR_MAU[pillar.canIndex];
  const canRole = ELEMENT_ROLE[pillar.can.element];
  const chiMainRole = ELEMENT_ROLE[pillar.chi.element];
  const hiddenStems = getHiddenStems(pillar.chi.name);

  const chiScore = hiddenStems.reduce((sum, h) => sum + ROLE_SCORE[h.role] * h.weight, 0);
  const score = ROLE_SCORE[canRole] * CAN_WEIGHT + chiScore * CHI_WEIGHT;
  const percent = scoreToPercent(score);

  const { tier, label } = tierFromPercent(percent);

  const detail: string[] = [
    `Can ngày ${pillar.can.name} (${ROLE_LABEL[canRole]}, hành ${ELEMENT_LABEL[pillar.can.element]}) — ứng Thập Thần ${tenGod}.`,
    `Chi ngày ${pillar.chi.name} tàng ${hiddenStems.map((h) => `${h.can} (${ROLE_LABEL[h.role]})`).join(", ")}.`,
  ];

  let summary = "";
  switch (tier) {
    case "rat-tot":
      summary =
        "Ngày hội tụ cả Can và Chi thuộc Dụng/Hỷ Thần — thuận lợi để khởi sự việc lớn, ký kết, ra quyết định quan trọng.";
      break;
    case "tot":
      summary = "Ngày có yếu tố Dụng/Hỷ Thần chiếm ưu thế — thuận lợi cho công việc cần chủ động, kết nối, học hỏi.";
      break;
    case "binh-thuong":
      summary = "Ngày trung tính — không đặc biệt thuận lợi cũng không bất lợi, nên giữ nhịp độ ổn định, tránh quyết định lớn.";
      break;
    case "xau":
      summary = "Ngày thiên về Kỵ Thần (Thổ/Hỏa) — dễ trì trệ, cố chấp hoặc phát sinh áp lực, tránh tranh luận và ký kết quan trọng.";
      break;
    case "rat-xau":
      summary =
        "Ngày cả Can lẫn Chi đều là Kỵ Thần — năng lượng Thổ/Hỏa dư thừa dễ gây bảo thủ, nóng nảy, hao tài; nên tĩnh tâm, tránh việc trọng đại.";
      break;
  }

  return { pillar, tenGod, canRole, chiMainRole, hiddenStems, score, percent, tier, tierLabel: label, summary, detail };
}

// ---------------------------------------------------------------------------
// Tiết khí, Trụ Tháng (theo tiết khí thực) và Trụ Năm (ranh giới Lập Xuân) —
// bổ sung để luận ngày tốt/xấu chính xác hơn thay vì chỉ dựa vào Trụ Ngày.
// ---------------------------------------------------------------------------

const SOLAR_TERMS = [
  "Xuân Phân", "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng", "Hạ Chí", "Tiểu Thử", "Đại Thử",
  "Lập Thu", "Xử Thử", "Bạch Lộ", "Thu Phân", "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết",
  "Đông Chí", "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập",
];

export interface SolarTermInfo {
  name: string;
  longitude: number;
  index: number;
}

/** Tiết khí hiện tại của một ngày, suy từ kinh độ hoàng đạo thật của Mặt Trời (mỗi tiết cách nhau 15°). */
export function getSolarTerm(date: Date): SolarTermInfo {
  const elon = normalizeDeg(Astronomy.SunPosition(date).elon);
  const index = Math.floor(elon / 15) % 24;
  return { name: SOLAR_TERMS[index], longitude: elon, index };
}

function lapXuanOf(calendarYear: number): Date {
  const searchStart = new Date(Date.UTC(calendarYear, 0, 15));
  const result = Astronomy.SearchSunLongitude(315, searchStart, 40);
  if (!result) throw new Error(`Không tìm được Lập Xuân cho năm ${calendarYear}`);
  return result.date;
}

/** Năm Bát Tự thực — ranh giới là tiết Lập Xuân (~4/2 Dương lịch), không phải mốc 1/1. */
export function getBaziYearNumber(date: Date): number {
  const calYear = date.getFullYear();
  const lapXuan = lapXuanOf(calYear);
  return date.getTime() < lapXuan.getTime() ? calYear - 1 : calYear;
}

const MONTH_CHI_FROM_DAN = ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu"];

export interface MonthPillar {
  canIndex: number;
  chiIndex: number;
  can: CanInfo;
  chi: ChiInfo;
  label: string;
  solarTerm: SolarTermInfo;
}

/** Trụ Tháng theo tiết khí thực; Can tháng suy từ Can năm theo quy tắc Ngũ Hổ Độn. */
export function getMonthPillar(date: Date): MonthPillar {
  const solarTerm = getSolarTerm(date);
  const adjusted = normalizeDeg(solarTerm.longitude - 315);
  const monthIdxFromDan = Math.floor(adjusted / 30) % 12;
  const chiName = MONTH_CHI_FROM_DAN[monthIdxFromDan];
  const chiIndex = CHI.findIndex((c) => c.name === chiName);
  const chi = CHI[chiIndex];

  const yearPillar = getYearPillar(getBaziYearNumber(date));
  const startCanForDan = (2 * (yearPillar.canIndex % 5) + 2) % 10;
  const canIndex = (startCanForDan + monthIdxFromDan) % 10;
  const can = CAN[canIndex];

  return { canIndex, chiIndex, can, chi, label: `${can.name} ${chi.name}`, solarTerm };
}

const MONTH_CAN_WEIGHT = 1.0;
const MONTH_CHI_WEIGHT = 0.9;
const YEAR_CAN_WEIGHT = 0.7;
const YEAR_CHI_WEIGHT = 0.6;
const DAY_BLEND = 0.5;
const MONTH_BLEND = 0.32;
const YEAR_BLEND = 0.18;

export function pillarPercent(canElement: Element, chiName: string, canWeight: number, chiWeight: number) {
  const canRole = ELEMENT_ROLE[canElement];
  const hiddenStems = getHiddenStems(chiName);
  const chiScore = hiddenStems.reduce((sum, h) => sum + ROLE_SCORE[h.role] * h.weight, 0);
  const score = ROLE_SCORE[canRole] * canWeight + chiScore * chiWeight;
  const max = ROLE_SCORE["dung-than"] * canWeight + ROLE_SCORE["dung-than"] * chiWeight;
  const min = ROLE_SCORE["ky-than"] * canWeight + ROLE_SCORE["ky-than"] * chiWeight;
  const percent = Math.max(0, Math.min(100, Math.round(((score - min) / (max - min)) * 100)));
  return { percent, canRole, hiddenStems };
}

export interface FullDayVerdict {
  date: Date;
  day: DayVerdict;
  monthPillar: MonthPillar;
  monthPercent: number;
  monthCanRole: DungHyKy;
  yearPillar: YearPillar;
  yearPercent: number;
  yearCanRole: DungHyKy;
  baziYear: number;
  percent: number;
  tier: DayVerdict["tier"];
  tierLabel: string;
  summary: string;
}

/**
 * Đánh giá ngày đầy đủ — hòa trộn Trụ Ngày (50%), Trụ Tháng theo tiết khí thực (32%) và Trụ Năm
 * theo ranh giới Lập Xuân (18%) so với Dụng/Hỷ/Kỵ Thần của lá số gốc, cho kết quả sát thực tế hơn
 * so với chỉ xét riêng Can Chi ngày.
 */
export function evaluateDayFull(date: Date): FullDayVerdict {
  const day = evaluateDay(date);
  const monthPillar = getMonthPillar(date);
  const { percent: monthPercent, canRole: monthCanRole } = pillarPercent(
    monthPillar.can.element,
    monthPillar.chi.name,
    MONTH_CAN_WEIGHT,
    MONTH_CHI_WEIGHT,
  );
  const baziYear = getBaziYearNumber(date);
  const yearPillar = getYearPillar(baziYear);
  const { percent: yearPercent, canRole: yearCanRole } = pillarPercent(
    yearPillar.can.element,
    yearPillar.chi.name,
    YEAR_CAN_WEIGHT,
    YEAR_CHI_WEIGHT,
  );

  const blended = day.percent * DAY_BLEND + monthPercent * MONTH_BLEND + yearPercent * YEAR_BLEND;
  const percent = Math.max(0, Math.min(100, Math.round(blended)));
  const { tier, label } = tierFromPercent(percent);

  return {
    date,
    day,
    monthPillar,
    monthPercent,
    monthCanRole,
    yearPillar,
    yearPercent,
    yearCanRole,
    baziYear,
    percent,
    tier,
    tierLabel: label,
    summary: day.summary,
  };
}
