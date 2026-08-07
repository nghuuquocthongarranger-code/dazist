import {
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  getBaziYearNumber,
  pillarPercent,
  chiRelationship,
  tierFromPercent,
  type ChiRelationship,
} from "./canChi";
import { ROLE_LABEL, ELEMENT_LABEL, type DungHyKy } from "./elements";
import { fourPillars } from "../data/baziProfile";

export interface PartnerPillarResult {
  label: string;
  pillarLabel: string;
  element: string;
  percent: number;
  role: DungHyKy;
}

export interface PartnerEvaluation {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar?: string;
  pillars: PartnerPillarResult[];
  percent: number;
  tier: "rat-tot" | "tot" | "binh-thuong" | "xau";
  tierLabel: string;
  chiRelation: ChiRelationship;
  summary: string;
}

const VERDICT_LABEL: Record<PartnerEvaluation["tier"], string> = {
  "rat-tot": "Rất có lợi",
  tot: "Có lợi",
  "binh-thuong": "Trung tính — cần cẩn trọng",
  xau: "Bất lợi",
};

const VERDICT_SUMMARY: Record<PartnerEvaluation["tier"], string> = {
  "rat-tot": "Ngũ Hành của người này phần lớn rơi vào Dụng/Hỷ Thần của bạn — hợp tác/làm việc chung nhìn chung thuận lợi, dễ hỗ trợ nhau, nên chủ động gắn kết.",
  tot: "Ngũ Hành của người này thiên về Dụng/Hỷ Thần nhiều hơn Kỵ Thần — hợp tác nhìn chung có lợi, mang lại giá trị tích cực cho bạn.",
  "binh-thuong": "Ngũ Hành của người này khá cân bằng giữa lợi và hại — không rõ rệt nghiêng hẳn về phía nào, nên quan sát thêm qua thời gian và giữ ranh giới hợp lý khi hợp tác.",
  xau: "Ngũ Hành của người này thiên nhiều về Kỵ Thần — hợp tác/gắn bó lâu dài dễ mang lại hao tổn, áp lực hoặc bất lợi cho bạn, nên cân nhắc kỹ hoặc giữ khoảng cách vừa phải.",
};

const dayCanWeight = 1.2;
const dayChiWeight = 1.0;

/** Đánh giá mức độ lợi/hại của một người khác (đối tác, bạn bè, đồng nghiệp...) đối với bản thân,
 * dựa trên Ngũ Hành Dụng/Hỷ/Kỵ Thần của chính lá số chủ trang. Chỉ cần Năm/Tháng/Ngày Dương lịch;
 * Giờ sinh (Chi Giờ) là tùy chọn, nếu có sẽ cho kết quả chính xác hơn. */
export function evaluatePartner(year: number, month: number, day: number, hourChi?: string): PartnerEvaluation {
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0));

  const dayPillar = getDayPillar(date);
  const monthPillar = getMonthPillar(date);
  const baziYear = getBaziYearNumber(date);
  const yearPillar = getYearPillar(baziYear);
  const hourPillar = hourChi ? getHourPillar(dayPillar.canIndex, hourChi) : undefined;

  const dayResult = pillarPercent(dayPillar.can.element, dayPillar.chi.name, dayCanWeight, dayChiWeight);
  const monthResult = pillarPercent(monthPillar.can.element, monthPillar.chi.name, 1.0, 0.9);
  const yearResult = pillarPercent(yearPillar.can.element, yearPillar.chi.name, 0.7, 0.6);
  const hourResult = hourPillar ? pillarPercent(hourPillar.can.element, hourPillar.chi.name, 0.6, 0.5) : undefined;

  const pillars: PartnerPillarResult[] = [
    { label: "Ngày", pillarLabel: dayPillar.label, element: ELEMENT_LABEL[dayPillar.can.element], percent: dayResult.percent, role: dayResult.canRole },
    { label: "Tháng", pillarLabel: monthPillar.label, element: ELEMENT_LABEL[monthPillar.can.element], percent: monthResult.percent, role: monthResult.canRole },
    { label: "Năm", pillarLabel: yearPillar.label, element: ELEMENT_LABEL[yearPillar.can.element], percent: yearResult.percent, role: yearResult.canRole },
  ];
  if (hourPillar && hourResult) {
    pillars.push({ label: "Giờ", pillarLabel: hourPillar.label, element: ELEMENT_LABEL[hourPillar.can.element], percent: hourResult.percent, role: hourResult.canRole });
  }

  // Trọng số: Ngày (Nhật Chủ đối tác) nặng nhất, rồi Tháng, Năm, Giờ (nếu có).
  const weighted = hourResult
    ? dayResult.percent * 0.42 + monthResult.percent * 0.28 + yearResult.percent * 0.18 + hourResult.percent * 0.12
    : dayResult.percent * 0.48 + monthResult.percent * 0.32 + yearResult.percent * 0.2;
  const percent = Math.max(0, Math.min(100, Math.round(weighted)));
  const { tier } = tierFromPercent(percent);
  const verdictTier = tier === "rat-xau" ? "xau" : tier;

  const ownDayChi = fourPillars.find((p) => p.position === "Ngày")?.chi ?? "";
  const chiRelation = ownDayChi ? chiRelationship(ownDayChi, dayPillar.chi.name) : { type: "khong-ro-ret" as const, label: "Không rõ", desc: "" };

  return {
    yearPillar: yearPillar.label,
    monthPillar: monthPillar.label,
    dayPillar: dayPillar.label,
    hourPillar: hourPillar?.label,
    pillars,
    percent,
    tier: verdictTier,
    tierLabel: VERDICT_LABEL[verdictTier],
    chiRelation,
    summary: VERDICT_SUMMARY[verdictTier],
  };
}

export { ROLE_LABEL };
