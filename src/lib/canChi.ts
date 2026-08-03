import type { Element, DungHyKy } from "./elements";
import { ELEMENT_ROLE, ROLE_SCORE, ROLE_LABEL } from "./elements";

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

export interface DayVerdict {
  pillar: DayPillar;
  tenGod: string;
  canRole: DungHyKy;
  chiRole: DungHyKy;
  score: number;
  tier: "rat-tot" | "tot" | "binh-thuong" | "xau" | "rat-xau";
  tierLabel: string;
  summary: string;
  detail: string[];
}

function tierFromScore(score: number): { tier: DayVerdict["tier"]; label: string } {
  if (score >= 2.5) return { tier: "rat-tot", label: "Rất tốt" };
  if (score >= 1) return { tier: "tot", label: "Tốt" };
  if (score > -1) return { tier: "binh-thuong", label: "Bình thường" };
  if (score > -2.5) return { tier: "xau", label: "Xấu" };
  return { tier: "rat-xau", label: "Rất xấu" };
}

/**
 * Đánh giá ngày theo Dụng/Hỷ/Kỵ Thần của hồ sơ Mậu Thổ (Thân cực vượng, Dụng Thần Mộc, Hỷ Thần Thủy).
 * Trọng số Can 1.2 / Chi 1.0 vì Can lộ ra ngoài có ảnh hưởng trực tiếp hơn Chi tàng.
 */
export function evaluateDay(date: Date): DayVerdict {
  const pillar = getDayPillar(date);
  const tenGod = TEN_GOD_BY_CAN_INDEX_FOR_MAU[pillar.canIndex];
  const canRole = ELEMENT_ROLE[pillar.can.element];
  const chiRole = ELEMENT_ROLE[pillar.chi.element];

  const canWeight = 1.2;
  const chiWeight = 1.0;
  const score = ROLE_SCORE[canRole] * canWeight + ROLE_SCORE[chiRole] * chiWeight;

  const { tier, label } = tierFromScore(score);

  const detail: string[] = [
    `Can ngày ${pillar.can.name} (${ROLE_LABEL[canRole]}, hành ${pillar.can.element === "moc" ? "Mộc" : pillar.can.element === "hoa" ? "Hỏa" : pillar.can.element === "tho" ? "Thổ" : pillar.can.element === "kim" ? "Kim" : "Thủy"}) — ứng Thập Thần ${tenGod}.`,
    `Chi ngày ${pillar.chi.name} (${ROLE_LABEL[chiRole]}, hành ${pillar.chi.element === "moc" ? "Mộc" : pillar.chi.element === "hoa" ? "Hỏa" : pillar.chi.element === "tho" ? "Thổ" : pillar.chi.element === "kim" ? "Kim" : "Thủy"}).`,
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

  return { pillar, tenGod, canRole, chiRole, score, tier, tierLabel: label, summary, detail };
}
