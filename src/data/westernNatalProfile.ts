export const birthInfo = {
  date: "05/05/2001",
  time: "08:20 (giờ địa phương, GMT+7)",
  place: "Hồ Chí Minh, Việt Nam (106°43' Đông, 10°46' Bắc)",
  universalTime: "01:20 UT",
  houseSystem: "Placidus",
  zodiac: "Tropical (Nhiệt đới)",
};

export interface NatalPlanet {
  symbol: string;
  name: string;
  sign: string;
  degree: string;
  house: string;
  retrograde?: boolean;
}

export const natalPlanets: NatalPlanet[] = [
  { symbol: "☉", name: "Mặt Trời", sign: "Kim Ngưu", degree: "14°37'", house: "Nhà 11" },
  { symbol: "☽", name: "Mặt Trăng", sign: "Thiên Bình", degree: "12°06'", house: "Nhà 4" },
  { symbol: "☿", name: "Thủy Tinh", sign: "Kim Ngưu", degree: "27°46'", house: "Nhà 12" },
  { symbol: "♀", name: "Kim Tinh", sign: "Bạch Dương", degree: "5°19'", house: "Nhà 11" },
  { symbol: "♂", name: "Sao Hỏa", sign: "Nhân Mã", degree: "28°47'", house: "Nhà 7" },
  { symbol: "♃", name: "Sao Mộc", sign: "Song Tử", degree: "14°21'", house: "Nhà 12" },
  { symbol: "♄", name: "Thổ Tinh", sign: "Song Tử", degree: "1°44'", house: "Nhà 12" },
  { symbol: "♅", name: "Thiên Vương Tinh", sign: "Bảo Bình", degree: "24°35'", house: "Nhà 9" },
  { symbol: "♆", name: "Hải Vương Tinh", sign: "Bảo Bình", degree: "8°46'", house: "Nhà 9" },
  { symbol: "♇", name: "Diêm Vương Tinh", sign: "Nhân Mã", degree: "14°41'", house: "Nhà 6", retrograde: true },
  { symbol: "⚷", name: "Chiron", sign: "Nhân Mã", degree: "28°22'", house: "Nhà 7", retrograde: true },
  { symbol: "☊", name: "Nút Bắc (thực)", sign: "Cự Giải", degree: "7°44'", house: "Nhà 2" },
];

export interface NatalAngle {
  symbol: string;
  name: string;
  sign: string;
  degree: string;
}

export const natalAngles: NatalAngle[] = [
  { symbol: "AC", name: "Cung Mọc (Ascendant)", sign: "Song Tử", degree: "24°52'" },
  { symbol: "MC", name: "Thiên Đỉnh (Midheaven)", sign: "Song Ngư", degree: "18°45'" },
  { symbol: "DC", name: "Điểm Hạ Huyệt (đối AC)", sign: "Nhân Mã", degree: "24°52'" },
  { symbol: "IC", name: "Đáy Trời (đối MC)", sign: "Xử Nữ", degree: "18°45'" },
];

export const natalHouseCusps = [
  { house: "Nhà 2", sign: "Cự Giải", degree: "20°55'" },
  { house: "Nhà 3", sign: "Sư Tử", degree: "18°16'" },
  { house: "Nhà 11", sign: "Bạch Dương", degree: "21°54'" },
  { house: "Nhà 12", sign: "Kim Ngưu", degree: "24°33'" },
];

export interface SensitivePoint {
  title: string;
  desc: string;
}

export const sensitivePoints: SensitivePoint[] = [
  {
    title: "Sao Hỏa hợp Chiron trên trục DC (Nhà 7)",
    desc: "Sao Hỏa (28°47' Nhân Mã) hợp Chiron (28°22' Nhân Mã) ngay trên trục DC — điểm nhạy cảm NHẤT của lá số, liên quan quan hệ/đối tác/xung đột.",
  },
  {
    title: "Mặt Trời quincunx Diêm Vương",
    desc: "Mặt Trời (14°37' Kim Ngưu) quincunx Diêm Vương (14°41' Nhân Mã) — góc 150° gần như chính xác tuyệt đối.",
  },
  {
    title: "Cụm Thủy Tinh – Thổ Tinh – Sao Hỏa (Nhà 12)",
    desc: "Thủy Tinh (27°46' Kim Ngưu) hợp Thổ Tinh (1°44' Song Tử) và quincunx Sao Hỏa (28°47' Nhân Mã) — cụm Nhà 12, dễ bị khuếch đại khi Thủy Tinh nghịch hành.",
  },
  {
    title: "Solar Return hằng năm kích hoạt trục Mặt Trời – Diêm Vương",
    desc: "Mặt Trời (14°37' Kim Ngưu) — mỗi năm vào khoảng Lập Hạ (~5-7 tháng 5 dương lịch), Mặt Trời transit quay về hợp chính xác vị trí này (Solar Return), kích hoạt lại toàn bộ lá số gốc, đặc biệt góc Mặt Trời-Diêm Vương ở trên.",
  },
];
