import { getYearPillar } from "./canChi";
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

function palacePercent(palace: TuViPalace | undefined): number {
  if (!palace) return 50;
  let score = TONE_BASE[TRUONG_SINH_TONE[palace.truongSinh]];
  for (const s of palace.mainStars) {
    if (s.state) score += STATE_ADJUST[s.state] ?? 0;
  }
  if (palace.trietTuan) score -= 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Cung Lưu Niên của một năm dương lịch — Chi của năm đó trùng Chi của cung nào thì Lưu Niên "ghé" cung ấy. */
export function getLuuNienPalace(year: number): TuViPalace | undefined {
  const chi = getYearPillar(year).chi.name;
  return palaceForChi(chi);
}

/** Cung Đại Vận (chặng 10 năm) mà tuổi của đương số tại năm dương lịch đó rơi vào. */
export function getDaiVanPalace(year: number): TuViPalace | undefined {
  const age = year - tuViInfo.birthYear;
  return currentPalace(age) ?? currentPalace(5);
}

/** Điểm tham khảo 0-100 suy từ cung Lưu Niên của một năm — dùng riêng để hiển thị trong khối "Tử Vi — cung Lưu Niên". */
export function getTuViYearPercent(year: number): number {
  return palacePercent(getLuuNienPalace(year));
}

/**
 * Điểm Tử Vi hoà trộn Đại Vận (10 năm, biến động chậm) + Lưu Niên (1 năm, biến động theo từng năm) —
 * trọng số Đại Vận tăng dần từ cột Ngày → Tháng → Năm, đúng tinh thần "nhìn xa hơn khi xét mốc thời gian dài hơn"
 * đã áp dụng cho phần Bát Tự, để 3 cột không còn cho cùng một điểm số.
 */
export function getTuViColumnPercent(year: number, daiVanWeight: number): number {
  const luuNienPercent = palacePercent(getLuuNienPalace(year));
  const daiVanPercent = palacePercent(getDaiVanPalace(year));
  return Math.round(luuNienPercent * (1 - daiVanWeight) + daiVanPercent * daiVanWeight);
}
