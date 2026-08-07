import * as Astronomy from "astronomy-engine";
import type { Element, DungHyKy } from "./elements";
import { ELEMENT_ROLE, ELEMENT_LABEL, ROLE_SCORE, ROLE_LABEL, SINH, KHAC } from "./elements";

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
  if (percent >= 70) return { tier: "rat-tot", label: "Rất tốt" };
  if (percent >= 50) return { tier: "tot", label: "Tốt" };
  if (percent >= 30) return { tier: "binh-thuong", label: "Bình thường" };
  return { tier: "xau", label: "Xấu" };
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

// ---------------------------------------------------------------------------
// Trụ Giờ — dùng cho tính năng xem Bát Tự đối tác (Năm/Tháng/Ngày bắt buộc,
// Giờ tùy chọn). Quy tắc "Ngũ Thử Độn": Can Giờ Tý suy từ Can Ngày.
// ---------------------------------------------------------------------------

/** Can của Giờ Tý ứng với từng Can Ngày (Ngũ Thử Độn): Giáp/Kỷ→Giáp, Ất/Canh→Bính,
 * Bính/Tân→Mậu, Đinh/Nhâm→Canh, Mậu/Quý→Nhâm. */
const TY_HOUR_CAN_START: Record<number, number> = { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 };

export interface HourPillar {
  canIndex: number;
  chiIndex: number;
  can: CanInfo;
  chi: ChiInfo;
  label: string;
}

/** Trụ Giờ từ Can Ngày (canIndex 0-9, xem CAN) và Chi Giờ (một trong 12 CHI, ví dụ "Thân" cho 15h-17h). */
export function getHourPillar(dayCanIndex: number, hourChiName: string): HourPillar {
  const chiIndex = CHI.findIndex((c) => c.name === hourChiName);
  if (chiIndex === -1) throw new Error(`Chi giờ không hợp lệ: ${hourChiName}`);
  const tyCanIndex = TY_HOUR_CAN_START[((dayCanIndex % 10) + 10) % 10];
  const canIndex = (tyCanIndex + chiIndex) % 10;
  const can = CAN[canIndex];
  const chi = CHI[chiIndex];
  return { canIndex, chiIndex, can, chi, label: `${can.name} ${chi.name}` };
}

/** 12 khung giờ Địa Chi truyền thống, dùng cho ô chọn giờ sinh (giờ địa phương). */
export const HOUR_CHI_RANGES: { chi: string; range: string }[] = [
  { chi: "Tý", range: "23h–1h" },
  { chi: "Sửu", range: "1h–3h" },
  { chi: "Dần", range: "3h–5h" },
  { chi: "Mão", range: "5h–7h" },
  { chi: "Thìn", range: "7h–9h" },
  { chi: "Tỵ", range: "9h–11h" },
  { chi: "Ngọ", range: "11h–13h" },
  { chi: "Mùi", range: "13h–15h" },
  { chi: "Thân", range: "15h–17h" },
  { chi: "Dậu", range: "17h–19h" },
  { chi: "Tuất", range: "19h–21h" },
  { chi: "Hợi", range: "21h–23h" },
];

// ---------------------------------------------------------------------------
// Quan hệ 12 Địa Chi — Lục Hợp / Tam Hợp cục / Lục Xung / Lục Hại — dùng để
// xem tuổi hợp/khắc giữa hai người (ví dụ Ngày Chi bản thân với Ngày Chi đối tác).
// ---------------------------------------------------------------------------

export const LUC_HOP: Record<string, string> = {
  Tý: "Sửu", Sửu: "Tý", Dần: "Hợi", Hợi: "Dần", Mão: "Tuất", Tuất: "Mão",
  Thìn: "Dậu", Dậu: "Thìn", Tỵ: "Thân", Thân: "Tỵ", Ngọ: "Mùi", Mùi: "Ngọ",
};

export const TAM_HOP: { group: string[]; element: Element; label: string }[] = [
  { group: ["Thân", "Tý", "Thìn"], element: "thuy", label: "Thủy cục" },
  { group: ["Tỵ", "Dậu", "Sửu"], element: "kim", label: "Kim cục" },
  { group: ["Dần", "Ngọ", "Tuất"], element: "hoa", label: "Hỏa cục" },
  { group: ["Hợi", "Mão", "Mùi"], element: "moc", label: "Mộc cục" },
];

export const LUC_XUNG: Record<string, string> = {
  Tý: "Ngọ", Ngọ: "Tý", Sửu: "Mùi", Mùi: "Sửu", Dần: "Thân", Thân: "Dần",
  Mão: "Dậu", Dậu: "Mão", Thìn: "Tuất", Tuất: "Thìn", Tỵ: "Hợi", Hợi: "Tỵ",
};

export const LUC_HAI: Record<string, string> = {
  Tý: "Mùi", Mùi: "Tý", Sửu: "Ngọ", Ngọ: "Sửu", Dần: "Tỵ", Tỵ: "Dần",
  Mão: "Thìn", Thìn: "Mão", Thân: "Hợi", Hợi: "Thân", Dậu: "Tuất", Tuất: "Dậu",
};

export type ChiRelationType = "luc-hop" | "tam-hop" | "luc-xung" | "luc-hai" | "khong-ro-ret";

export interface ChiRelationship {
  type: ChiRelationType;
  label: string;
  desc: string;
}

/** So sánh quan hệ giữa hai Địa Chi (ví dụ Ngày Chi của hai người) theo Lục Hợp/Tam Hợp/Lục Xung/Lục Hại. */
export function chiRelationship(chiA: string, chiB: string): ChiRelationship {
  if (LUC_HOP[chiA] === chiB) {
    return { type: "luc-hop", label: "Lục Hợp", desc: "Hai Chi hợp thành một cặp gắn kết tự nhiên — dễ đồng cảm, hỗ trợ nhau nhịp nhàng như một cặp đôi ăn ý." };
  }
  if (LUC_XUNG[chiA] === chiB) {
    return { type: "luc-xung", label: "Lục Xung (Tứ Hành Xung)", desc: "Hai Chi đối xung trực tiếp — quan điểm/tính cách dễ va chạm, cần thẳng thắn trao đổi và tôn trọng khác biệt để tránh xung đột kéo dài." };
  }
  if (LUC_HAI[chiA] === chiB) {
    return { type: "luc-hai", label: "Lục Hại", desc: "Quan hệ có phần \"hại\" ngầm — hợp tác bề ngoài có thể ổn nhưng dễ nảy sinh hiểu lầm/rạn nứt âm thầm nếu thiếu minh bạch." };
  }
  const tamHop = TAM_HOP.find((t) => t.group.includes(chiA) && t.group.includes(chiB));
  if (tamHop) {
    return { type: "tam-hop", label: `Tam Hợp (${tamHop.label})`, desc: `Cùng nằm trong bộ Tam Hợp hóa ${ELEMENT_LABEL[tamHop.element]} — hợp nhau ở mục tiêu/chí hướng dài hạn, phối hợp tốt trong công việc nhóm.` };
  }
  return { type: "khong-ro-ret", label: "Không hợp/xung rõ rệt", desc: "Không rơi vào tổ hợp Hợp/Xung/Hại kinh điển nào — quan hệ trung tính, tốt/xấu phụ thuộc chủ yếu vào Ngũ Hành Dụng/Hỷ/Kỵ của từng người." };
}

// ---------------------------------------------------------------------------
// Nhập Can Chi thủ công (không suy từ ngày Dương lịch) — dùng cho tính năng
// xem Bát Tự người khác khi người dùng đã biết sẵn Tứ Trụ chính xác.
// ---------------------------------------------------------------------------

export interface CanChiPair {
  can: string;
  chi: string;
}

/** 60 tổ hợp Giáp Tý hợp lệ theo đúng chu kỳ Lục Thập Hoa Giáp (Can index % 10 == Chi index % 12,
 * cùng chẵn/lẻ) — dùng để tạo danh sách lựa chọn Can Chi cho người dùng, tránh chọn được tổ hợp sai. */
export const SIXTY_CYCLE: { can: string; chi: string; label: string; canIndex: number; chiIndex: number }[] = Array.from(
  { length: 60 },
  (_, i) => {
    const canIndex = i % 10;
    const chiIndex = i % 12;
    return { can: CAN[canIndex].name, chi: CHI[chiIndex].name, label: `${CAN[canIndex].name} ${CHI[chiIndex].name}`, canIndex, chiIndex };
  },
);

function findCanIndex(name: string): number {
  const i = CAN.findIndex((c) => c.name === name);
  if (i === -1) throw new Error(`Can không hợp lệ: ${name}`);
  return i;
}

function findChiIndex(name: string): number {
  const i = CHI.findIndex((c) => c.name === name);
  if (i === -1) throw new Error(`Chi không hợp lệ: ${name}`);
  return i;
}

/** Bước tới (steps > 0, thuận) hoặc lùi (steps < 0, nghịch) N vị trí trong chu kỳ 60 Giáp Tý từ một cặp Can Chi. */
export function stepPillar(pair: CanChiPair, steps: number): CanChiPair {
  const canIndex = (((findCanIndex(pair.can) + steps) % 10) + 10) % 10;
  const chiIndex = (((findChiIndex(pair.chi) + steps) % 12) + 12) % 12;
  return { can: CAN[canIndex].name, chi: CHI[chiIndex].name };
}

export type TenGodType = "Tỷ Kiên" | "Kiếp Tài" | "Thực Thần" | "Thương Quan" | "Chính Tài" | "Thiên Tài" | "Chính Quan" | "Thất Sát" | "Chính Ấn" | "Thiên Ấn";

/** Thập Thần tổng quát của một Can bất kỳ so với Nhật Chủ bất kỳ (không cố định theo 1 lá số như
 * TEN_GOD_BY_CAN_INDEX_FOR_MAU) — dùng để tự luận Bát Tự cho một người bất kỳ mà người dùng nhập tay. */
export function tenGodOf(nhatChuCan: string, otherCan: string): TenGodType {
  const nc = CAN[findCanIndex(nhatChuCan)];
  const other = CAN[findCanIndex(otherCan)];
  const samePolarity = nc.polarity === other.polarity;
  if (other.element === nc.element) return samePolarity ? "Tỷ Kiên" : "Kiếp Tài";
  if (SINH[other.element] === nc.element) return samePolarity ? "Thiên Ấn" : "Chính Ấn";
  if (SINH[nc.element] === other.element) return samePolarity ? "Thực Thần" : "Thương Quan";
  if (KHAC[nc.element] === other.element) return samePolarity ? "Thiên Tài" : "Chính Tài";
  return samePolarity ? "Thất Sát" : "Chính Quan"; // KHAC[other.element] === nc.element
}

export const TEN_GOD_GROUP: Record<TenGodType, "ty-kiep" | "an" | "thuc-thuong" | "tai" | "quan-sat"> = {
  "Tỷ Kiên": "ty-kiep", "Kiếp Tài": "ty-kiep",
  "Chính Ấn": "an", "Thiên Ấn": "an",
  "Thực Thần": "thuc-thuong", "Thương Quan": "thuc-thuong",
  "Chính Tài": "tai", "Thiên Tài": "tai",
  "Chính Quan": "quan-sat", "Thất Sát": "quan-sat",
};
