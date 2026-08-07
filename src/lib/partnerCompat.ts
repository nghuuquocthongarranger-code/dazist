import {
  CAN,
  CHI,
  CHI_HIDDEN_CAN,
  chiRelationship,
  tenGodOf,
  TEN_GOD_GROUP,
  stepPillar,
  getYearPillar,
  getBaziYearNumber,
  getTietKhiDetail,
  type CanChiPair,
  type ChiRelationship,
  type TietKhiDetail,
} from "./canChi";
import { ELEMENT_ROLE, ELEMENT_LABEL, ROLE_LABEL, SINH, KHAC, type Element, type DungHyKy } from "./elements";
import { fourPillars } from "../data/baziProfile";

export type Gender = "nam" | "nu";

export interface PartnerInput {
  gender: Gender;
  /** Năm sinh Dương lịch của đối tác — dùng để tự tính tuổi hiện tại, xác định họ đang ở giai đoạn Đại Vận nào. */
  birthYear: number;
  /** Tuổi nhập Đại Vận đầu tiên (khởi vận) theo lá số gốc của đối tác — người dùng tự biết/tự tra,
   * KHÔNG suy ước lượng từ tuổi 1 vì mỗi người nhập vận ở tuổi khác nhau tùy khoảng cách tới tiết khí lúc sinh.
   * Có cả phần năm và phần tháng vì cách nói truyền thống luôn là "X tuổi Y tháng" (ví dụ 7 tuổi 6 tháng). */
  startAgeYears: number;
  startAgeMonths: number;
  /** Ngày giờ sinh chính xác (không bắt buộc) — CHỈ dùng để tính Tiết Khí lúc sinh (đầu/giữa/cuối tiết),
   * không dùng để suy ra Can Chi (Can Chi luôn lấy từ 4 trụ người dùng tự nhập ở trên để đảm bảo chính xác). */
  preciseBirthDateTime?: Date;
  year: CanChiPair;
  month: CanChiPair;
  day: CanChiPair;
  hour?: CanChiPair;
}

type TenGodGroup = "ty-kiep" | "an" | "thuc-thuong" | "tai" | "quan-sat";
const ELEMENTS: Element[] = ["moc", "hoa", "tho", "kim", "thuy"];
function sinhSourceOf(el: Element): Element {
  return ELEMENTS.find((e) => SINH[e] === el)!;
}
function khacSourceOf(el: Element): Element {
  return ELEMENTS.find((e) => KHAC[e] === el)!;
}
function canElement(name: string): Element {
  return CAN.find((c) => c.name === name)!.element;
}
function chiElement(name: string): Element {
  return CHI.find((c) => c.name === name)!.element;
}

export interface OwnChartAnalysis {
  nhatChu: string;
  nhatChuElement: Element;
  verdict: "vuong" | "nhuoc";
  supportPercent: number;
  dungElement: Element;
  hyElement: Element;
  kyElements: Element[];
}

/** Tự luận Thân Vượng/Nhược và Dụng/Hỷ/Kỵ Thần cho MỘT lá số bất kỳ (không phải lá số cố định của
 * chủ trang) — dùng heuristic đơn giản hoá: đếm trọng số Thiên Can + Tàng Can theo Thập Thần tổng quát,
 * cộng thêm "thưởng điểm đắc lệnh" nếu Chi Tháng cùng hành hoặc sinh Nhật Chủ. Đây là ước tính hợp lý,
 * không thay thế hoàn toàn cho một thầy Bát Tự luận chi tiết tay. */
export function analyzeOwnChart(input: PartnerInput): OwnChartAnalysis {
  const nhatChu = input.day.can;
  const ncElement = canElement(nhatChu);

  const canEntries = [input.year.can, input.month.can, ...(input.hour ? [input.hour.can] : [])];
  const chiList = [input.year.chi, input.month.chi, input.day.chi, ...(input.hour ? [input.hour.chi] : [])];

  const groupWeight: Record<TenGodGroup, number> = { "ty-kiep": 0, an: 0, "thuc-thuong": 0, tai: 0, "quan-sat": 0 };
  let total = 0;
  for (const can of canEntries) {
    const group = TEN_GOD_GROUP[tenGodOf(nhatChu, can)];
    groupWeight[group] += 1.0;
    total += 1.0;
  }
  for (const chi of chiList) {
    for (const h of CHI_HIDDEN_CAN[chi] ?? []) {
      const group = TEN_GOD_GROUP[tenGodOf(nhatChu, h.can)];
      groupWeight[group] += h.weight;
      total += h.weight;
    }
  }

  const support = groupWeight["ty-kiep"] + groupWeight.an;
  const supportPercent = total > 0 ? Math.round((support / total) * 1000) / 10 : 50;

  const monthElement = chiElement(input.month.chi);
  let dacLenhBonus = 0;
  if (monthElement === ncElement) dacLenhBonus = 12;
  else if (SINH[monthElement] === ncElement) dacLenhBonus = 6;

  const verdict: "vuong" | "nhuoc" = supportPercent + dacLenhBonus >= 50 ? "vuong" : "nhuoc";

  const groupElement = (g: TenGodGroup): Element => {
    switch (g) {
      case "ty-kiep": return ncElement;
      case "an": return sinhSourceOf(ncElement);
      case "thuc-thuong": return SINH[ncElement];
      case "tai": return KHAC[ncElement];
      case "quan-sat": return khacSourceOf(ncElement);
    }
  };

  let dungElement: Element, hyElement: Element, kyElements: Element[];
  if (verdict === "vuong") {
    const ranked = (["thuc-thuong", "tai", "quan-sat"] as TenGodGroup[]).sort((a, b) => groupWeight[b] - groupWeight[a]);
    dungElement = groupElement(ranked[0]);
    hyElement = groupElement(ranked[1]);
    kyElements = [ncElement, sinhSourceOf(ncElement)];
  } else {
    const ranked = (["an", "ty-kiep"] as TenGodGroup[]).sort((a, b) => groupWeight[b] - groupWeight[a]);
    dungElement = groupElement(ranked[0]);
    hyElement = groupElement(ranked[1]);
    kyElements = [SINH[ncElement], KHAC[ncElement], khacSourceOf(ncElement)];
  }

  return { nhatChu, nhatChuElement: ncElement, verdict, supportPercent, dungElement, hyElement, kyElements };
}

function roleOfElement(el: Element, own: OwnChartAnalysis): "dung" | "hy" | "ky" | "binh-thuong" {
  if (el === own.dungElement) return "dung";
  if (el === own.hyElement) return "hy";
  if (own.kyElements.includes(el)) return "ky";
  return "binh-thuong";
}

const PERIOD_LABEL: Record<"dung" | "hy" | "ky" | "binh-thuong", string> = {
  dung: "Rất thuận lợi", hy: "Thuận lợi", "binh-thuong": "Bình thường", ky: "Bất lợi",
};

export interface DaiVanPeriod {
  pillar: string;
  ageRange: [number, number];
  /** Tuổi bắt đầu giai đoạn tính chính xác theo tháng (dùng nội bộ để xác định giai đoạn hiện tại), ví dụ 7.5 = 7 tuổi 6 tháng. */
  periodStart: number;
  role: "dung" | "hy" | "ky" | "binh-thuong";
}

export interface ProsCons {
  strengths: string[];
  weaknesses: string[];
}

export interface PartnerEvaluation {
  ownAnalysis: OwnChartAnalysis;
  pillars: { label: string; pillarLabel: string; element: string; role: DungHyKy }[];
  compatPercent: number;
  compatTier: "rat-tot" | "tot" | "binh-thuong" | "xau";
  compatTierLabel: string;
  compatSummary: string;
  chiRelation: ChiRelationship;
  currentYear: number;
  currentYearPillar: string;
  currentYearRole: "dung" | "hy" | "ky" | "binh-thuong";
  currentYearLabel: string;
  startAgeLabel: string;
  /** Chỉ có giá trị nếu người dùng nhập Ngày giờ sinh chính xác (tùy chọn). */
  tietKhi?: TietKhiDetail;
  daiVan: DaiVanPeriod[];
  /** -1 nghĩa là đối tác chưa nhập Đại Vận đầu tiên (còn nhỏ hơn tuổi khởi vận). */
  currentDaiVanIndex: number;
  daiVanThuan: boolean;
  prosCons: ProsCons;
}

const COMPAT_TIER_LABEL: Record<PartnerEvaluation["compatTier"], string> = {
  "rat-tot": "Rất có lợi cho bạn", tot: "Có lợi cho bạn", "binh-thuong": "Trung tính", xau: "Bất lợi cho bạn",
};
const COMPAT_SUMMARY: Record<PartnerEvaluation["compatTier"], string> = {
  "rat-tot": "Ngũ Hành của người này phần lớn rơi vào Dụng/Hỷ Thần của bạn — hợp tác nhìn chung thuận lợi, dễ hỗ trợ nhau.",
  tot: "Ngũ Hành của người này thiên về Dụng/Hỷ Thần nhiều hơn Kỵ Thần đối với bạn — hợp tác nhìn chung có lợi.",
  "binh-thuong": "Ngũ Hành của người này khá cân bằng giữa lợi và hại đối với bạn — nên quan sát thêm qua thời gian.",
  xau: "Ngũ Hành của người này thiên nhiều về Kỵ Thần đối với bạn — cần cân nhắc kỹ hoặc giữ khoảng cách vừa phải.",
};

function buildProsCons(params: {
  pillars: PartnerEvaluation["pillars"];
  chiRelation: ChiRelationship;
  currentYearRole: "dung" | "hy" | "ky" | "binh-thuong";
  currentYearPillar: string;
  daiVanCurrentRole: "dung" | "hy" | "ky" | "binh-thuong" | null;
  compatTier: PartnerEvaluation["compatTier"];
}): ProsCons {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const p of params.pillars) {
    if (p.role === "dung-than" || p.role === "hy-than") {
      strengths.push(
        `Trụ ${p.label} (${p.pillarLabel}, hành ${p.element}) là ${ROLE_LABEL[p.role]} của bạn — mang năng lượng hỗ trợ tích cực khi làm việc chung.`,
      );
    } else if (p.role === "ky-than") {
      weaknesses.push(
        `Trụ ${p.label} (${p.pillarLabel}, hành ${p.element}) là Kỵ Thần của bạn — dễ tạo áp lực/bất đồng, cần chú ý khi hợp tác liên quan tới hành này.`,
      );
    }
  }

  if (params.chiRelation.type === "luc-hop" || params.chiRelation.type === "tam-hop") {
    strengths.push(`Địa Chi ngày sinh hai bên thuộc ${params.chiRelation.label} — ${params.chiRelation.desc}`);
  } else if (params.chiRelation.type === "luc-xung" || params.chiRelation.type === "luc-hai") {
    weaknesses.push(`Địa Chi ngày sinh hai bên thuộc ${params.chiRelation.label} — ${params.chiRelation.desc}`);
  }

  if (params.currentYearRole === "dung" || params.currentYearRole === "hy") {
    strengths.push(
      `Năm ${params.currentYearPillar} là năm thuận lợi với chính bản thân đối tác — tinh thần/tài lực của họ đang tốt, dễ đưa ra quyết định đúng đắn.`,
    );
  } else if (params.currentYearRole === "ky") {
    weaknesses.push(
      `Năm ${params.currentYearPillar} là năm bất lợi với chính bản thân đối tác — họ dễ gặp trở ngại hoặc quyết định vội vàng, nên thận trọng khi hợp tác trong giai đoạn này.`,
    );
  }

  if (params.daiVanCurrentRole === "dung" || params.daiVanCurrentRole === "hy") {
    strengths.push(
      "Đối tác đang trong giai đoạn Đại Vận (10 năm) thuận lợi — nền tảng vận trình dài hạn đang hỗ trợ họ phát triển, phù hợp để đầu tư/hợp tác dài hạn.",
    );
  } else if (params.daiVanCurrentRole === "ky") {
    weaknesses.push(
      "Đối tác đang trong giai đoạn Đại Vận (10 năm) bất lợi — vận trình dài hạn đang gặp cản trở, nên cân nhắc kỹ trước khi đầu tư/hợp tác lớn trong giai đoạn này.",
    );
  } else if (params.daiVanCurrentRole === null) {
    weaknesses.push("Đối tác chưa nhập Đại Vận đầu tiên (còn nhỏ tuổi) — vận trình dài hạn chưa rõ ràng, cần thêm thời gian mới đánh giá được.");
  }

  if (params.compatTier === "rat-tot" || params.compatTier === "tot") {
    strengths.push(
      `Tổng thể Tứ Trụ của người này thiên về Dụng/Hỷ Thần đối với bạn — ${params.compatTier === "rat-tot" ? "rất" : "khá"} thuận lợi để hợp tác lâu dài.`,
    );
  } else if (params.compatTier === "xau") {
    weaknesses.push("Tổng thể Tứ Trụ của người này thiên về Kỵ Thần đối với bạn — nên cân nhắc kỹ vai trò hợp tác, tránh phụ thuộc tài chính lớn vào nhau.");
  }

  if (strengths.length === 0) {
    strengths.push("Không có yếu tố Ngũ Hành nào nổi bật thuộc Dụng/Hỷ Thần của bạn — mối quan hệ trung tính, không mang lại trợ lực rõ rệt nhưng cũng không quá bất lợi.");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Không phát hiện yếu tố Ngũ Hành hay Địa Chi bất lợi rõ rệt — tuy nhiên vẫn nên quan sát thêm qua thời gian hợp tác thực tế trước khi đầu tư lớn.");
  }

  return { strengths, weaknesses };
}

/** Đánh giá một người khác dựa trên Tứ Trụ do người dùng nhập tay (không suy từ ngày Dương lịch) —
 * gồm 2 lớp: (1) Ngũ Hành của họ có lợi/hại gì cho CHÍNH lá số chủ trang, và (2) bản thân người đó
 * năm nay và trong Đại Vận hiện tại (tính từ tuổi khởi vận do người dùng tự nhập) có đang thuận lợi
 * hay không — kèm tổng kết Ưu điểm/Khuyết điểm khi làm việc/hợp tác với người này. */
export function evaluatePartnerManual(input: PartnerInput): PartnerEvaluation {
  const own = analyzeOwnChart(input);

  // Lớp 1: so với Ngũ Hành Dụng/Hỷ/Kỵ của chủ trang (ELEMENT_ROLE cố định của lá số này)
  const pillarDefs = [
    { label: "Năm", pair: input.year },
    { label: "Tháng", pair: input.month },
    { label: "Ngày", pair: input.day },
    ...(input.hour ? [{ label: "Giờ", pair: input.hour }] : []),
  ];
  const ROLE_SCORE_MAP: Record<DungHyKy, number> = { "dung-than": 2, "hy-than": 1, "hy-than-phu": 0.5, "ky-than": -1.5, "trung-tinh": 0 };
  let sumScore = 0;
  const pillars = pillarDefs.map(({ label, pair }) => {
    const el = canElement(pair.can);
    const role = ELEMENT_ROLE[el];
    sumScore += ROLE_SCORE_MAP[role];
    return { label, pillarLabel: `${pair.can} ${pair.chi}`, element: ELEMENT_LABEL[el], role };
  });
  const maxScore = 2 * pillarDefs.length;
  const minScore = -1.5 * pillarDefs.length;
  const compatPercent = Math.max(0, Math.min(100, Math.round(((sumScore - minScore) / (maxScore - minScore)) * 100)));
  const compatTier: PartnerEvaluation["compatTier"] =
    compatPercent >= 70 ? "rat-tot" : compatPercent >= 50 ? "tot" : compatPercent >= 30 ? "binh-thuong" : "xau";

  const ownDayChi = fourPillars.find((p) => p.position === "Ngày")?.chi ?? "";
  const chiRelation = ownDayChi ? chiRelationship(ownDayChi, input.day.chi) : { type: "khong-ro-ret" as const, label: "Không rõ", desc: "" };

  // Lớp 2: vận trình của chính đối tác — năm nay
  const currentYear = getBaziYearNumber(new Date());
  const currentYearPillarObj = getYearPillar(currentYear);
  const currentYearRole = roleOfElement(currentYearPillarObj.can.element, own);

  // Lớp 2: Đại Vận — thuận/nghịch theo giới tính + âm dương Can Năm, tính từ Trụ Tháng.
  // Tuổi khởi vận (nhập đại vận) do người dùng tự nhập (startAge) thay vì mặc định từ tuổi 1,
  // vì mỗi người nhập vận ở độ tuổi khác nhau tuỳ khoảng cách từ lúc sinh tới tiết khí gần nhất.
  const yearPolarity = CAN.find((c) => c.name === input.year.can)!.polarity;
  const daiVanThuan = (input.gender === "nam" && yearPolarity === "duong") || (input.gender === "nu" && yearPolarity === "am");
  const step = daiVanThuan ? 1 : -1;
  const startAgeDecimal = Math.max(0, input.startAgeYears + input.startAgeMonths / 12);
  const daiVan: DaiVanPeriod[] = Array.from({ length: 8 }, (_, i) => {
    const p = stepPillar(input.month, step * (i + 1));
    const periodStart = startAgeDecimal + i * 10;
    const rangeStartDisplay = Math.round(periodStart);
    const role = roleOfElement(canElement(p.can), own);
    return { pillar: `${p.can} ${p.chi}`, ageRange: [rangeStartDisplay, rangeStartDisplay + 9] as [number, number], periodStart, role };
  });
  const age = currentYear - Math.round(input.birthYear) + 1;
  let currentDaiVanIndex: number;
  if (age < startAgeDecimal) {
    currentDaiVanIndex = -1;
  } else {
    const idx = daiVan.findIndex((dv) => age >= dv.periodStart && age < dv.periodStart + 10);
    currentDaiVanIndex = idx === -1 ? 7 : idx;
  }
  const daiVanCurrentRole = currentDaiVanIndex >= 0 ? daiVan[currentDaiVanIndex].role : null;
  const startAgeLabel = input.startAgeMonths > 0 ? `${input.startAgeYears} tuổi ${input.startAgeMonths} tháng` : `${input.startAgeYears} tuổi`;
  const tietKhi = input.preciseBirthDateTime ? getTietKhiDetail(input.preciseBirthDateTime) : undefined;

  const prosCons = buildProsCons({
    pillars,
    chiRelation,
    currentYearRole,
    currentYearPillar: currentYearPillarObj.label,
    daiVanCurrentRole,
    compatTier,
  });

  return {
    ownAnalysis: own,
    pillars,
    compatPercent,
    compatTier,
    compatTierLabel: COMPAT_TIER_LABEL[compatTier],
    compatSummary: COMPAT_SUMMARY[compatTier],
    chiRelation,
    currentYear,
    currentYearPillar: currentYearPillarObj.label,
    currentYearRole,
    currentYearLabel: PERIOD_LABEL[currentYearRole],
    startAgeLabel,
    tietKhi,
    daiVan,
    currentDaiVanIndex,
    daiVanThuan,
    prosCons,
  };
}

export { ROLE_LABEL, PERIOD_LABEL };
