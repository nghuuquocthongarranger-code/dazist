import { getYearPillar, getMonthPillar } from "./canChi";
import { palaceForChi, currentPalace, tuViInfo, TRUONG_SINH_TONE, type TuViPalace } from "../data/tuViProfile";

const TONE_BASE: Record<"tot" | "trung-binh" | "xau", number> = {
  tot: 78,
  "trung-binh": 52,
  xau: 26,
};

const STATE_ADJUST: Record<string, number> = {
  Miếu: 14,
  Vượng: 14,
  Đắc: 5,
  Hãm: -18,
};

const NATURAL_CHI_ORDER = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

/** Đi thuận (hoặc nghịch, nếu steps âm) N bước quanh vòng 12 Địa Chi tự nhiên — dùng chung cho mọi kiểu "an lưu". */
function stepChi(fromChi: string, steps: number): string {
  const idx = NATURAL_CHI_ORDER.indexOf(fromChi);
  if (idx === -1) return fromChi;
  return NATURAL_CHI_ORDER[(((idx + steps) % 12) + 12) % 12];
}

function palacePercent(palace: TuViPalace | undefined): number {
  if (!palace) return 50;
  let score = TONE_BASE[TRUONG_SINH_TONE[palace.truongSinh]];
  for (const s of palace.mainStars) {
    if (s.state) score += STATE_ADJUST[s.state] ?? 0;
  }
  if (palace.trietTuan) score -= 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Cung Lưu Niên (năm) — Chi của năm dương lịch trùng Chi cung nào thì Lưu Niên "ghé" cung ấy. */
export function getLuuNienPalace(year: number): TuViPalace | undefined {
  const chi = getYearPillar(year).chi.name;
  return palaceForChi(chi);
}

/** Cung Đại Vận (chặng 10 năm) mà tuổi của đương số tại năm dương lịch đó rơi vào. */
export function getDaiVanPalace(year: number): TuViPalace | undefined {
  const age = year - tuViInfo.birthYear;
  return currentPalace(age) ?? currentPalace(5);
}

/**
 * Cung Lưu Nguyệt (tháng) — coi cung Lưu Niên của năm đó là "tháng Giêng" (tháng Dần), rồi đếm thuận theo
 * đúng số thứ tự tháng thực (suy từ tiết khí thật, cùng cách xác định Trụ Tháng bên Bát Tự) để ra cung của
 * tháng đang xem. Đây là cơ chế RIÊNG cho cấp tháng — không phải lấy lại số của Lưu Niên (năm).
 */
export function getLuuNguyetPalace(date: Date): TuViPalace | undefined {
  const luuNien = getLuuNienPalace(date.getFullYear());
  if (!luuNien) return undefined;
  const monthPillar = getMonthPillar(date);
  const monthIndexFromDan = ((monthPillar.chiIndex - 2) % 12 + 12) % 12; // 0 = tháng Dần = tháng Giêng
  return palaceForChi(stepChi(luuNien.chi, monthIndexFromDan));
}

/**
 * Cung Lưu Nhật (ngày) — coi cung Lưu Nguyệt của tháng đó là "ngày mùng 1", đếm thuận theo số ngày đã trôi
 * qua trong tháng dương lịch. Giản lược theo ngày dương lịch (thay vì ngày âm lịch thực) để không cần thêm bộ
 * chuyển đổi lịch âm riêng — vẫn là một mốc đếm RIÊNG cho cấp ngày, khác hẳn Lưu Niên/Lưu Nguyệt.
 */
export function getLuuNhatPalace(date: Date): TuViPalace | undefined {
  const luuNguyet = getLuuNguyetPalace(date);
  if (!luuNguyet) return undefined;
  const dayIndex = date.getDate() - 1; // 0 = mùng 1
  return palaceForChi(stepChi(luuNguyet.chi, dayIndex));
}

/** Điểm tham khảo 0-100 suy riêng từ cung Lưu Niên của một năm — dùng cho khối hiển thị & dự báo theo năm. */
export function getTuViYearPercent(year: number): number {
  return palacePercent(getLuuNienPalace(year));
}

/** Điểm cột Năm ở mục Tra cứu ngày — hoà Lưu Niên (chủ đạo) + Đại Vận (nền tảng dài hạn). */
export function getTuViYearColumnPercent(year: number): number {
  const luuNien = palacePercent(getLuuNienPalace(year));
  const daiVan = palacePercent(getDaiVanPalace(year));
  return Math.round(luuNien * 0.6 + daiVan * 0.4);
}

/** Điểm cột Tháng ở mục Tra cứu ngày — dùng cơ chế Lưu Nguyệt thật (khác Lưu Niên), có Lưu Niên/Đại Vận làm nền. */
export function getTuViMonthColumnPercent(date: Date): number {
  const luuNguyet = palacePercent(getLuuNguyetPalace(date));
  const luuNien = palacePercent(getLuuNienPalace(date.getFullYear()));
  const daiVan = palacePercent(getDaiVanPalace(date.getFullYear()));
  return Math.round(luuNguyet * 0.6 + luuNien * 0.25 + daiVan * 0.15);
}

/** Điểm cột Ngày ở mục Tra cứu ngày — dùng cơ chế Lưu Nhật thật (khác Lưu Nguyệt/Lưu Niên), có 2 tầng trên làm nền. */
export function getTuViDayColumnPercent(date: Date): number {
  const luuNhat = palacePercent(getLuuNhatPalace(date));
  const luuNguyet = palacePercent(getLuuNguyetPalace(date));
  const daiVan = palacePercent(getDaiVanPalace(date.getFullYear()));
  return Math.round(luuNhat * 0.55 + luuNguyet * 0.3 + daiVan * 0.15);
}
