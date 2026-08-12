import { CAN, CHI } from "./canChi";

/** 12 Cung của vòng Trường Sinh (Bát Tự) — thứ tự cố định, lặp lại theo chu kỳ 12 Địa Chi. */
export const TRUONG_SINH_CUNG = [
  "Trường Sinh",
  "Mộc Dục",
  "Quan Đới",
  "Lâm Quan",
  "Đế Vượng",
  "Suy",
  "Bệnh",
  "Tử",
  "Mộ",
  "Tuyệt",
  "Thai",
  "Dưỡng",
] as const;

export type TruongSinhCung = (typeof TRUONG_SINH_CUNG)[number];

export type TruongSinhTone = "tot" | "xau" | "trung-tinh";

export const TRUONG_SINH_TONE: Record<TruongSinhCung, TruongSinhTone> = {
  "Trường Sinh": "tot",
  "Quan Đới": "tot",
  "Lâm Quan": "tot",
  "Đế Vượng": "tot",
  Suy: "xau",
  Bệnh: "xau",
  Tử: "xau",
  "Tuyệt": "xau",
  "Mộc Dục": "trung-tinh",
  Mộ: "trung-tinh",
  Thai: "trung-tinh",
  Dưỡng: "trung-tinh",
};

export const TRUONG_SINH_DESC: Record<TruongSinhCung, string> = {
  "Trường Sinh": "Khởi đầu sinh khí — như đứa trẻ mới chào đời, tràn đầy sức sống, có quý nhân/cơ hội mới xuất hiện.",
  "Mộc Dục": "Tắm gội, chưa vững vàng — dễ đào hoa, bồng bột, thay đổi, cần thời gian trưởng thành.",
  "Quan Đới": "Trưởng thành, bắt đầu gánh vác trách nhiệm — thuận lợi cho học hành, khởi nghiệp, lập gia đình.",
  "Lâm Quan": "Sung sức, sắp đạt đỉnh cao — chủ động, có thực lực, thuận lợi cho sự nghiệp/công danh.",
  "Đế Vượng": "Đỉnh cao sức mạnh — bản lĩnh, quyết đoán, thành tựu rõ rệt nhưng cũng dễ cứng nhắc, cố chấp.",
  Suy: "Bắt đầu đi xuống sau đỉnh cao — nên giữ nhịp độ ổn định, tránh mạo hiểm lớn, thiên về nội tâm.",
  Bệnh: "Suy yếu rõ rệt — dễ mệt mỏi, sức khỏe/tinh thần cần chú ý, không thuận cho việc khởi sự lớn.",
  Tử: "Điểm tận cùng của một chu kỳ — biến động, kết thúc một giai đoạn, cần buông bỏ để chuẩn bị tái sinh.",
  "Mộ": "Thu tàng, cất giữ — tính toán, tích lũy, đôi khi bảo thủ/khép kín, phù hợp tích lũy hơn mở rộng.",
  "Tuyệt": "Đứt đoạn, chân không — biến động mạnh, dễ mất phương hướng nhưng cũng là lúc để làm lại từ đầu.",
  Thai: "Thai nghén, hình thành mầm mống mới — giai đoạn ấp ủ, chuẩn bị, chưa nên vội vàng hành động.",
  Dưỡng: "Nuôi dưỡng, tích lũy nội lực trước khi ra đời — được nâng đỡ, chở che, cần thời gian bồi dưỡng.",
};

/** Cung Trường Sinh khởi đầu (và chiều thuận/nghịch) của từng Thiên Can — Hỏa/Thổ đồng cung theo cổ pháp. */
const TRUONG_SINH_START: Record<string, { startChi: string; thuan: boolean }> = {
  Giáp: { startChi: "Hợi", thuan: true },
  Ất: { startChi: "Ngọ", thuan: false },
  Bính: { startChi: "Dần", thuan: true },
  Đinh: { startChi: "Dậu", thuan: false },
  Mậu: { startChi: "Dần", thuan: true },
  Kỷ: { startChi: "Dậu", thuan: false },
  Canh: { startChi: "Tỵ", thuan: true },
  Tân: { startChi: "Tý", thuan: false },
  Nhâm: { startChi: "Thân", thuan: true },
  Quý: { startChi: "Mão", thuan: false },
};

/** Xác định Cung Trường Sinh của một Địa Chi bất kỳ so với Nhật Chủ (Thiên Can) bất kỳ. */
export function truongSinhOf(nhatChuCan: string, chiName: string): TruongSinhCung {
  const cfg = TRUONG_SINH_START[nhatChuCan];
  if (!cfg) throw new Error(`Thiên Can không hợp lệ: ${nhatChuCan}`);
  const startIndex = CHI.findIndex((c) => c.name === cfg.startChi);
  const chiIndex = CHI.findIndex((c) => c.name === chiName);
  if (chiIndex === -1) throw new Error(`Địa Chi không hợp lệ: ${chiName}`);
  const offset = cfg.thuan ? (((chiIndex - startIndex) % 12) + 12) % 12 : (((startIndex - chiIndex) % 12) + 12) % 12;
  return TRUONG_SINH_CUNG[offset];
}

export { CAN };
