import type { DayVerdict } from "./canChi";
import type { WesternAstroResult } from "./westernAstro";
import { ROLE_LABEL } from "./elements";

function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export interface ActivityCategory {
  id: string;
  label: string;
  keywords: string[];
  focus: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: "hop-dong",
    label: "Ký kết / Hợp đồng / Giao dịch",
    keywords: ["ky hop dong", "hop dong", "giao dich", "thoa thuan", "ky ket", "ky giay to", "cong chung", "dat coc", "ky ten hop dong"],
    focus: "Nhạy cảm nhất với Thủy Tinh nghịch hành và Mặt Trăng Void-of-Course — hai yếu tố hay gây sai sót giấy tờ.",
  },
  {
    id: "dau-tu",
    label: "Đầu tư / Tài chính / Mua bán lớn",
    keywords: ["dau tu", "mua nha", "mua dat", "mua xe hoi", "gop von", "chung khoan", "mua ban lon", "vay von", "cho vay", "mo tai khoan ngan hang", "bat dong san"],
    focus: "Chịu ảnh hưởng của Tài Tinh (Bát Tự) và Thủy Tinh nghịch hành (rủi ro giấy tờ tài chính).",
  },
  {
    id: "khoi-su",
    label: "Khởi sự / Khai trương / Dự án mới",
    keywords: ["khai truong", "khoi su", "khoi nghiep", "bat dau du an", "ra mat san pham", "mo cua hang", "mo cong ty", "thanh lap"],
    focus: "Mặt Trăng Void-of-Course là yếu tố cản trở lớn nhất cho việc khởi đầu bất cứ điều gì.",
  },
  {
    id: "cuoi-hoi",
    label: "Cưới hỏi / Đính hôn / Tình cảm quan trọng",
    keywords: ["dam cuoi", "dinh hon", "ket hon", "to tinh", "cau hon", "hon le", "an hoi", "ra mat gia dinh", "hen ho lan dau"],
    focus: "Soi theo cung Phu Thê (Bát Tự) và góc chiếu Kim Tinh/Sao Hỏa transit (Chiêm tinh).",
  },
  {
    id: "suc-khoe",
    label: "Phẫu thuật / Khám & điều trị sức khỏe",
    keywords: ["phau thuat", "kham benh", "dieu tri benh", "kham suc khoe", "nha khoa", "nhap vien", "tiem chung", "xet nghiem", "chua benh"],
    focus: "Nên tránh thủ thuật không khẩn cấp khi Thủy Tinh nghịch hành hoặc ngày thiên về Kỵ Thần Thổ/Hỏa.",
  },
  {
    id: "di-chuyen",
    label: "Du lịch / Di chuyển xa",
    keywords: ["du lich", "di xa", "di may bay", "chuyen di xa", "xuat canh", "ve may bay", "lai xe duong dai", "di cong tac"],
    focus: "Thủy Tinh nghịch hành cổ điển gắn với trễ chuyến, thất lạc giấy tờ/hành lý.",
  },
  {
    id: "hoc-tap",
    label: "Học tập / Thi cử / Phỏng vấn xin việc",
    keywords: ["thi cu", "phong van xin viec", "on thi", "nop ho so", "ung tuyen", "bao ve luan van", "thi bang lai", "hoc thi", "phong van"],
    focus: "Gắn với Mộc (Dụng Thần) bên Bát Tự — ngày Dụng/Hỷ Thần chiếm ưu thế sẽ thuận cho tư duy/trình bày.",
  },
  {
    id: "dam-phan",
    label: "Đàm phán / Gặp đối tác, khách hàng / Thương lượng",
    keywords: ["dam phan", "thuong luong", "gap doi tac", "gap khach hang", "thuong thao", "xin tang luong", "dam phan luong"],
    focus: "Cần Thủy Tinh thuận (giao tiếp rõ ràng) và tránh góc chiếu căng thẳng của Sao Hỏa/Kim Tinh.",
  },
  {
    id: "hop-thuyet-trinh",
    label: "Họp quan trọng / Thuyết trình / Ra mắt",
    keywords: ["thuyet trinh", "hop quan trong", "ra mat san pham moi", "trinh bay du an", "hop ban"],
    focus: "Mặt Trời và Thủy Tinh transit ảnh hưởng trực tiếp đến sự tự tin và mạch lạc khi trình bày.",
  },
  {
    id: "phap-ly",
    label: "Pháp lý / Kiện tụng / Tranh chấp",
    keywords: ["kien tung", "tranh chap", "ra toa", "kien cao", "tu van phap ly", "khoi kien"],
    focus: "Nhóm việc căng thẳng nhất — cần tránh cả Thủy Tinh nghịch hành lẫn góc chiếu xấu của Sao Hỏa.",
  },
  {
    id: "hoa-giai",
    label: "Xin lỗi / Hòa giải / Nói chuyện thẳng thắn",
    keywords: ["xin loi", "hoa giai", "noi chuyen thang than", "chia tay", "ly hon", "giai quyet mau thuan"],
    focus: "Mặt Trăng transit (cảm xúc trong ngày) và góc chiếu Kim Tinh/Sao Hỏa quyết định mức độ êm thấm.",
  },
  {
    id: "chuyen-nha",
    label: "Chuyển nhà / Nhập trạch / Động thổ / Sửa nhà",
    keywords: ["chuyen nha moi", "nhap trach", "dong tho", "sua nha", "xay nha", "tan trang nha", "ve nha moi"],
    focus: "Nhóm việc khởi đầu lớn — nhạy với Void-of-Course và Thủy Tinh nghịch hành tương tự khai trương.",
  },
  {
    id: "tang-le",
    label: "Tang lễ / Cúng bái / Giỗ chạp",
    keywords: ["dam tang", "tang le", "gio chap", "cung bai", "le cung", "vieng tang"],
    focus: "Đây là việc mang tính tình cảm/nghĩa vụ, không phụ thuộc lựa chọn theo vận trình.",
  },
  {
    id: "the-thao",
    label: "Thể thao / Vận động mạnh",
    keywords: ["tap gym", "choi the thao", "chay bo duong dai", "thi dau the thao", "leo nui", "tap luyen"],
    focus: "Liên quan thể chất — đáng chú ý khi Thổ (tiêu hóa) hoặc Mộc (gân cốt/thần kinh) đang là Kỵ Thần.",
  },
  {
    id: "lam-dep",
    label: "Làm đẹp / Thẩm mỹ / Xăm hình",
    keywords: ["xam hinh", "phun xam", "tham my", "cat toc", "nhuom toc", "lam mong", "phau thuat tham my"],
    focus: "Với thủ thuật mang tính lâu dài (xăm, thẩm mỹ), nên tránh lúc Thủy Tinh nghịch hành (dễ hối tiếc/lỗi kỹ thuật).",
  },
  {
    id: "mua-sam",
    label: "Mua sắm đồ dùng / Công nghệ",
    keywords: ["mua sam", "mua do dien tu", "mua dien thoai", "mua laptop", "mua sam online"],
    focus: "Ở quy mô nhỏ hơn đầu tư — vẫn nên lưu ý Thủy Tinh nghịch hành vì dễ lỗi bảo hành/đổi trả.",
  },
  {
    id: "giai-tri",
    label: "Giải trí / Gặp gỡ bạn bè / Tiệc tùng",
    keywords: ["di choi", "gap ban be", "tiec tung", "xem phim", "du tiec"],
    focus: "Nhóm việc nhẹ nhàng, ít bị chi phối bởi các góc chiếu — chủ yếu theo tâm trạng chung của ngày.",
  },
];

export function matchActivityCategory(input: string): ActivityCategory | null {
  const norm = stripDiacritics(input);
  for (const cat of ACTIVITY_CATEGORIES) {
    if (cat.keywords.some((k) => norm.includes(k))) return cat;
  }
  return null;
}

export interface ActivityVerdict {
  category: ActivityCategory | null;
  tier: "nen" | "can-nhac" | "khong-nen";
  label: string;
  score: number;
  reasons: string[];
}

const WESTERN_COMPONENTS = (western: WesternAstroResult) => [
  { name: "Mặt Trăng transit", score: western.moon.score },
  { name: "Thủy Tinh transit", score: western.mercury.score },
  { name: "Hỏa–Kim transit", score: western.marsVenus.score },
  { name: "Mặt Trời transit", score: western.sun.score },
];

/**
 * Đánh giá một việc cụ thể có nên làm trong ngày hay không: lấy Điểm tổng hợp 2 hệ thống làm nền,
 * rồi cộng/trừ theo mức độ liên quan thực tế của loại việc đó với các thành phần/cờ cảnh báo hiện có.
 * Khi không khớp nhóm việc nào, thay vì chỉ lặp lại điểm ngày, vẫn trích ra nguyên nhân cụ thể nhất
 * (thành phần Chiêm tinh nổi bật nhất + tóm tắt Bát Tự) để câu trả lời luôn có căn cứ rõ ràng.
 */
export function evaluateActivity(
  input: string,
  bazi: DayVerdict,
  western: WesternAstroResult,
  combinedPercent: number,
): ActivityVerdict {
  const category = matchActivityCategory(input);
  const reasons: string[] = [];
  let score = combinedPercent;
  const covered = new Set<string>();

  const positiveBaziRole = bazi.canRole === "dung-than" || bazi.canRole === "hy-than" || bazi.canRole === "hy-than-phu";
  const baziIsPoor = bazi.tier === "xau" || bazi.tier === "rat-xau";

  if (category) reasons.push(category.focus);

  switch (category?.id) {
    case "hop-dong":
    case "dau-tu":
    case "chuyen-nha":
      covered.add("mercury");
      covered.add("voc");
      if (western.mercury.retrograde) {
        score -= 25;
        reasons.push("Thủy Tinh đang nghịch hành — dễ sai sót giấy tờ, hiểu lầm điều khoản, nên hoãn nếu không thật gấp.");
      } else if (western.mercury.shadow) {
        score -= 8;
        reasons.push("Đang trong vùng bóng nghịch hành Thủy Tinh — nên đọc kỹ điều khoản trước khi quyết định.");
      } else {
        reasons.push("Thủy Tinh không nghịch hành — thuận lợi hơn cho giấy tờ, đàm phán, ký kết.");
      }
      if (western.flags.voidOfCourse) {
        score -= 15;
        reasons.push("Mặt Trăng Void-of-Course — quyết định hôm nay dễ phải thay đổi hoặc làm lại sau đó.");
      }
      if (category.id === "dau-tu") {
        reasons.push(
          bazi.canRole === "hy-than"
            ? "Can ngày thuộc Hỷ Thần (Tài Tinh) — có yếu tố thuận cho dòng tiền."
            : "Đối chiếu thêm mục Tài lộc bên Bát Tự (Thủy là Hỷ Thần) trước khi quyết định số tiền lớn.",
        );
      }
      break;
    case "khoi-su":
      covered.add("voc");
      if (western.flags.voidOfCourse) {
        score -= 28;
        reasons.push("Mặt Trăng Void-of-Course — theo kinh nghiệm chiêm tinh cổ điển, đây là điều tối kỵ nhất khi khởi đầu việc mới.");
      }
      if (positiveBaziRole) {
        score += 8;
        reasons.push(`Can ngày ${bazi.pillar.can.name} thuộc ${ROLE_LABEL[bazi.canRole]} — có yếu tố thuận để khởi sự.`);
      } else {
        reasons.push(`Can ngày ${bazi.pillar.can.name} thuộc ${ROLE_LABEL[bazi.canRole]} — cân nhắc dời sang ngày Dụng/Hỷ Thần nếu không gấp.`);
      }
      break;
    case "cuoi-hoi":
    case "hoa-giai":
      score = score * 0.5 + ((western.marsVenus.score + 100) / 2) * 0.3 + score * 0.2;
      if (western.marsVenus.details.some((d) => d.contribution < 0)) {
        score -= 8;
        reasons.push("Có góc chiếu căng thẳng từ Sao Hỏa/Kim Tinh trong ngày — ưu tiên giữ bình tĩnh, tránh nói trong lúc nóng giận.");
      } else if (western.marsVenus.details.some((d) => d.contribution > 0)) {
        reasons.push("Góc chiếu Sao Hỏa/Kim Tinh trong ngày khá hài hòa — thuận lợi cho các cuộc trò chuyện tình cảm quan trọng.");
      }
      reasons.push(
        `Mặt Trăng transit (không khí cảm xúc chung của ngày) hiện ở mức điểm ${Math.round(western.moon.score)}.`,
      );
      break;
    case "suc-khoe":
    case "the-thao":
      covered.add("mercury");
      if (western.mercury.retrograde) {
        score -= 10;
        reasons.push("Nên tránh thủ thuật/điều trị không khẩn cấp trong giai đoạn Thủy Tinh nghịch hành nếu có thể dời lịch.");
      }
      if (baziIsPoor) {
        score -= 10;
        reasons.push("Ngày thiên về Kỵ Thần (Thổ/Hỏa) bên Bát Tự — nhóm hành liên quan tiêu hóa/thần kinh trong lá số, nên ưu tiên nhẹ nhàng, không nên ép sức.");
      }
      if (category.id === "suc-khoe") {
        reasons.push("Việc khám/điều trị khẩn cấp luôn nên ưu tiên theo chỉ định y tế, không phụ thuộc vào điểm ngày.");
      }
      break;
    case "di-chuyen":
      covered.add("mercury");
      covered.add("voc");
      if (western.mercury.retrograde) {
        score -= 20;
        reasons.push("Thủy Tinh nghịch hành — dễ trễ chuyến, thất lạc giấy tờ/hành lý, nên kiểm tra kỹ lịch trình và đến sớm hơn thường lệ.");
      }
      if (western.flags.voidOfCourse) {
        score -= 10;
        reasons.push("Mặt Trăng Void-of-Course — kế hoạch di chuyển dễ đổi lịch vào phút chót.");
      }
      break;
    case "hoc-tap":
      if (positiveBaziRole) {
        score += 6;
        reasons.push(`Can ngày ${bazi.pillar.can.name} thuộc ${ROLE_LABEL[bazi.canRole]} — thuận cho tư duy/tiếp thu.`);
      }
      break;
    case "dam-phan":
    case "hop-thuyet-trinh":
      covered.add("mercury");
      if (western.mercury.retrograde) {
        score -= 15;
        reasons.push("Thủy Tinh nghịch hành — lời nói dễ bị hiểu sai, nên chuẩn bị kỹ nội dung bằng văn bản trước.");
      }
      if (western.marsVenus.details.some((d) => d.contribution < 0)) {
        score -= 8;
        reasons.push("Góc chiếu căng thẳng từ Sao Hỏa/Kim Tinh — dễ nảy sinh tranh cãi ngoài ý muốn, nên giữ thái độ mềm mỏng.");
      }
      reasons.push(`Mặt Trời transit (sự tự tin/rõ ràng khi trình bày) đang ở mức điểm ${Math.round(western.sun.score)}.`);
      break;
    case "phap-ly":
      covered.add("mercury");
      covered.add("voc");
      score -= 5;
      reasons.push("Nhóm việc vốn nhiều căng thẳng — nên tham vấn kỹ chuyên môn pháp lý độc lập với điểm ngày.");
      if (western.mercury.retrograde) {
        score -= 15;
        reasons.push("Thủy Tinh nghịch hành — hồ sơ/giấy tờ dễ sai sót, nên rà soát kỹ trước khi nộp.");
      }
      break;
    case "tang-le":
      reasons.push("Điểm dưới đây chỉ mang tính tham khảo cho tâm trạng/sức khỏe cá nhân trong ngày, không phải lời khuyên nên/không nên tham dự.");
      if (western.mercury.retrograde) reasons.push("Nếu cần di chuyển xa để dự lễ, Thủy Tinh nghịch hành — nên kiểm tra kỹ lịch trình.");
      break;
    case "lam-dep":
      covered.add("mercury");
      if (western.mercury.retrograde) {
        score -= 18;
        reasons.push("Thủy Tinh nghịch hành — với thủ thuật khó sửa lại (xăm, thẩm mỹ), nguy cơ hối tiếc hoặc lỗi kỹ thuật cao hơn bình thường, nên cân nhắc dời lịch.");
      }
      break;
    case "mua-sam":
      covered.add("mercury");
      if (western.mercury.retrograde) {
        score -= 12;
        reasons.push("Thủy Tinh nghịch hành — dễ mua nhầm, lỗi đổi trả/bảo hành, nên kiểm tra kỹ thông tin sản phẩm.");
      }
      break;
    case "giai-tri":
      reasons.push(`Mặt Trăng transit (không khí chung của ngày) hiện ở mức điểm ${Math.round(western.moon.score)}.`);
      break;
    default: {
      const components = WESTERN_COMPONENTS(western);
      const best = components.reduce((a, b) => (b.score > a.score ? b : a));
      const worst = components.reduce((a, b) => (b.score < a.score ? b : a));
      reasons.push("Chưa khớp nhóm việc cụ thể nào trong câu bạn nhập — dưới đây là các yếu tố đang chi phối ngày hôm nay:");
      reasons.push(`Bát Tự: ${bazi.summary}`);
      if (best.score > 15) {
        reasons.push(`Chiêm tinh: yếu tố thuận lợi nhất hôm nay là ${best.name} (điểm ${Math.round(best.score)}).`);
      }
      if (worst.score < -15) {
        reasons.push(`Chiêm tinh: yếu tố cần lưu ý nhất hôm nay là ${worst.name} (điểm ${Math.round(worst.score)}).`);
      }
    }
  }

  if (!covered.has("voc") && western.flags.voidOfCourse) {
    score -= 10;
    reasons.push("Mặt Trăng Void-of-Course trong ngày — nhìn chung không phải thời điểm mạnh mẽ để chốt việc quan trọng.");
  }
  if (!covered.has("mercury")) {
    if (western.mercury.retrograde) {
      score -= 12;
      reasons.push("Thủy Tinh đang nghịch hành trong ngày — nên rà soát kỹ thông tin/giao tiếp liên quan trước khi tiến hành.");
    } else if (western.mercury.shadow) {
      score -= 4;
      reasons.push("Đang trong vùng bóng nghịch hành Thủy Tinh — mức ảnh hưởng nhẹ, vẫn nên cẩn trọng thông tin.");
    }
  }
  if (western.flags.solarReturn) {
    reasons.push("Đang trong giai đoạn Solar Return — phù hợp hơn cho quyết định mang tính định hướng dài hạn thay vì việc vụn vặt trong ngày.");
  }

  score = clamp(Math.round(score), 0, 100);
  const tier: ActivityVerdict["tier"] = score >= 60 ? "nen" : score >= 40 ? "can-nhac" : "khong-nen";
  const label = tier === "nen" ? "Nên làm hôm nay" : tier === "can-nhac" ? "Có thể làm, nhưng cân nhắc" : "Không nên làm hôm nay";

  return { category, tier, label, score, reasons };
}
