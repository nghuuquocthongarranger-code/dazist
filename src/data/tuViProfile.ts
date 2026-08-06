// Lá số Tử Vi — chuyển thể từ lá số gốc (an theo http://www.phongthuymenhly.com)
// Đương số: Nguyễn Hữu Quốc Thống — Âm Nam — (ÂL) 13/4/2001, giờ Bính Thìn — Thổ Ngũ Cục — Mệnh: Bạch Lạp Kim.

export type TruongSinhStage =
  | "Trường Sinh"
  | "Mộc Dục"
  | "Quan Đới"
  | "Lâm Quan"
  | "Đế Vượng"
  | "Suy"
  | "Bệnh"
  | "Tử"
  | "Mộ"
  | "Tuyệt"
  | "Thai"
  | "Dưỡng";

export type SaoTrangThai = "Miếu" | "Vượng" | "Đắc" | "Hãm";

export const TRUONG_SINH_TONE: Record<TruongSinhStage, "tot" | "trung-binh" | "xau"> = {
  "Trường Sinh": "tot",
  "Đế Vượng": "tot",
  "Lâm Quan": "tot",
  "Quan Đới": "tot",
  "Mộc Dục": "trung-binh",
  Dưỡng: "trung-binh",
  Thai: "trung-binh",
  Suy: "xau",
  Bệnh: "xau",
  Tử: "xau",
  Mộ: "xau",
  Tuyệt: "xau",
};

export interface TuViStar {
  name: string;
  state?: SaoTrangThai;
}

export interface TuViPalace {
  chi: string;
  cungName: string;
  ageRange: [number, number];
  mainStars: TuViStar[];
  auxStars: string[];
  luuStars: string[];
  trietTuan?: "Triệt" | "Tuần";
  truongSinh: TruongSinhStage;
  isThan?: boolean;
  summary: string;
}

export const tuViInfo = {
  name: "Nguyễn Hữu Quốc Thống",
  gender: "Âm Nam",
  birthLunar: "(ÂL) 13/4/2001, giờ Bính Thìn",
  birthYear: 2001,
  cuc: "Thổ Ngũ Cục",
  menhChu: "Bạch Lạp Kim",
  luuNienYear: 2026,
  source: "phongthuymenhly.com",
};

export const tuViPalaces: TuViPalace[] = [
  {
    chi: "Tỵ",
    cungName: "Quan Lộc",
    ageRange: [85, 94],
    mainStars: [{ name: "Thiên Cơ", state: "Vượng" }],
    auxStars: ["Phượng Các", "Giải Thần", "Ân Quang", "Quốc Ấn", "Thiên Phúc", "Tướng Quân", "Thái Tuế", "Chỉ Bối"],
    luuStars: ["Trực Phù", "Vong Thần", "Lộc Tồn"],
    trietTuan: "Triệt",
    truongSinh: "Lâm Quan",
    summary:
      "Thiên Cơ vượng thủ Quan Lộc — trí tuệ linh hoạt, giỏi mưu tính và thích nghi trong công việc, hợp các ngành cần tư duy, phân tích, cố vấn. Có Ân Quang, Quốc Ấn hộ chiếu nên dễ được cấp trên tín nhiệm, nhưng gặp Triệt nên con đường sự nghiệp thường phải qua một giai đoạn chững lại/làm lại trước khi thành hình rõ rệt.",
  },
  {
    chi: "Ngọ",
    cungName: "Nô Bộc",
    ageRange: [75, 84],
    mainStars: [{ name: "Tử Vi", state: "Miếu" }],
    auxStars: ["Thiên Khôi", "Tiểu Hao", "Phong Cáo", "Văn Xương", "Hoá Kỵ", "Thiên Trù", "Thiên Thương", "Đấu Quân"],
    luuStars: ["Kình Dương", "Thái Tuế", "Tướng Tinh"],
    truongSinh: "Quan Đới",
    summary:
      "Tử Vi miếu địa tại cung Nô Bộc — bạn bè/đối tác/nhân viên xung quanh thường có người nổi trội, có vị thế, mang lại trợ lực lớn khi cần. Tuy vậy Hoá Kỵ đồng cung nên trong các mối quan hệ hợp tác dễ nảy sinh hiểu lầm hoặc bị người dưới/đối tác gây phiền toái nếu không khéo chọn người.",
  },
  {
    chi: "Mùi",
    cungName: "Thiên Di",
    ageRange: [65, 74],
    mainStars: [],
    auxStars: ["Thanh Long", "Tá Phù", "Hữu Bật", "Tam Thai", "Địa Không", "Tang Môn", "Nguyệt Sát", "Linh Tinh", "Bát Tọa"],
    luuStars: ["Hối Khí", "Phá Toái"],
    truongSinh: "Mộc Dục",
    summary:
      "Vô chính diệu tại Thiên Di — vận ra ngoài/đi xa phần nhiều phụ thuộc vào cung Mệnh đối chiếu. Có Tá Phù, Hữu Bật nên đi xa dễ gặp quý nhân giúp đỡ; nhưng Địa Không, Tang Môn nhắc nên cẩn trọng khi di chuyển, tránh quyết định vội vàng nơi đất khách.",
  },
  {
    chi: "Thân",
    cungName: "Tật Ách",
    ageRange: [55, 64],
    mainStars: [{ name: "Phá Quân", state: "Hãm" }],
    auxStars: ["Lực Sỹ", "Thiếu Âm", "Văn Khúc", "Hoá Khoa", "Kình Dương", "Vong Thần", "Cô Thần", "Âm Sát", "Thiên Sứ"],
    luuStars: ["Tuế Dịch", "Tang Môn", "Thiên Mã"],
    trietTuan: "Tuần",
    truongSinh: "Trường Sinh",
    summary:
      "Phá Quân hãm tại Tật Ách — cơ thể/sức khoẻ dễ biến động thất thường, nên chú ý hệ tiêu hoá và thần kinh, tránh làm việc quá sức theo kiểu 'được đà lao tới'. Văn Khúc, Hoá Khoa hộ giúp phục hồi nhanh khi biết điều chỉnh nhịp sống điều độ.",
  },
  {
    chi: "Thìn",
    cungName: "Điền Trạch",
    ageRange: [95, 104],
    mainStars: [{ name: "Thất Sát", state: "Hãm" }],
    auxStars: ["Tấu Thư", "Trực Phù", "Thiên Hỷ", "Thiên Sát", "Quả Tú", "Thiên Diêu", "Thiên Y", "Thiên La"],
    luuStars: ["Điếu Khách", "Nguyệt Sát", "Đà La"],
    trietTuan: "Triệt",
    truongSinh: "Đế Vượng",
    summary:
      "Thất Sát hãm tại Điền Trạch — chuyện nhà cửa, bất động sản thường trải qua biến động lớn (mua/bán/chuyển dời) hơn là ổn định êm đềm ngay từ đầu; thành quả về nhà đất thường đến muộn nhưng bền khi đã an cư.",
  },
  {
    chi: "Dậu",
    cungName: "Tài Bạch",
    ageRange: [45, 54],
    mainStars: [],
    auxStars: ["Lộc Tồn", "Bác Sỹ", "Tướng Tinh", "Long Trì", "Thiên Quý", "Thiên Quan", "Quan Phù", "Phá Toái", "Tiết Độ"],
    luuStars: ["Hồng Loan", "Tức Thần", "Thiên Việt"],
    truongSinh: "Dưỡng",
    isThan: true,
    summary:
      "Cung Thân đóng tại Tài Bạch (vô chính diệu, có Lộc Tồn) — trọng tâm cả đời nghiêng về tích luỹ, tạo dựng tài chính; tiền bạc là thước đo quan trọng trong cách nhìn nhận thành công của bản thân. Lộc Tồn đảm bảo nguồn thu ổn định về dài hạn dù khởi đầu có thể chưa nổi bật.",
  },
  {
    chi: "Tuất",
    cungName: "Tử Tức",
    ageRange: [35, 44],
    mainStars: [
      { name: "Liêm Trinh", state: "Miếu" },
      { name: "Thiên Phủ", state: "Vượng" },
    ],
    auxStars: ["Thai Phù", "Nguyệt Đức", "Nguyệt Giải", "Địa Giải", "Quan Phủ", "Đà La", "Tử Phù", "Hồng Loan", "Địa Vong"],
    luuStars: [],
    truongSinh: "Thai",
    summary:
      "Liêm Trinh miếu, Thiên Phủ vượng tại Tử Tức — quan hệ với con cái/thế hệ sau nhìn chung tốt đẹp, con cái có tính cách rõ ràng, biết giữ khuôn phép. Bộ đôi Liêm Phủ cũng thường ứng với việc đầu tư/dự án dài hơi mang lại thành quả bền vững.",
  },
  {
    chi: "Mão",
    cungName: "Phúc Đức",
    ageRange: [105, 114],
    mainStars: [
      { name: "Thái Dương", state: "Vượng" },
      { name: "Thiên Lương", state: "Vượng" },
    ],
    auxStars: ["Hoá Quyền", "Phi Liêm", "Địa Kiếp", "Điếu Khách", "Tai Sát", "Lưu Hà"],
    luuStars: ["Thiên Hỷ", "Hàm Trì", "Phúc Đức"],
    truongSinh: "Suy",
    summary:
      "Thái Dương, Thiên Lương đồng vượng tại Phúc Đức — tinh thần hào sảng, trọng danh dự, biết lo xa và thường được hưởng phúc phần từ dòng họ. Hoá Quyền tăng thêm uy tín, tinh thần chủ động lo toan cho người thân dù đôi lúc ôm việc hơi nhiều.",
  },
  {
    chi: "Dần",
    cungName: "Phụ Mẫu",
    ageRange: [115, 124],
    mainStars: [
      { name: "Vũ Khúc", state: "Vượng" },
      { name: "Thiên Tướng", state: "Miếu" },
    ],
    auxStars: ["Hỷ Thần", "Kiếp Sát", "Phúc Đức", "Thiên Đức"],
    luuStars: ["Bạch Hổ", "Chỉ Bối"],
    truongSinh: "Bệnh",
    summary:
      "Vũ Khúc, Thiên Tướng miếu vượng tại Phụ Mẫu — cha mẹ thường là người có bản lĩnh, nguyên tắc, có khả năng tài chính hoặc vị thế nhất định, là chỗ dựa vững chắc thời thơ ấu. Quan hệ với bậc trên nhìn chung thuận, dù Vũ Khúc cứng tính đôi khi cần thêm sự mềm mỏng hai chiều.",
  },
  {
    chi: "Sửu",
    cungName: "Mệnh",
    ageRange: [5, 14],
    mainStars: [
      { name: "Thiên Đồng", state: "Hãm" },
      { name: "Cự Môn", state: "Hãm" },
    ],
    auxStars: ["Hoa Cái", "Hoá Lộc", "Bệnh Phù", "Bạch Hổ", "Thiên Khốc"],
    luuStars: ["Thiên Sát", "Long Đức"],
    truongSinh: "Tử",
    summary:
      "Đồng Cự hãm thủ Mệnh — tính cách thiên về nội tâm, nhạy cảm, suy nghĩ sâu và đôi khi hay lo xa/đa nghi hơn người khác; đường đời thường phải tự thân vận động, chật vật hơn ở giai đoạn đầu để khẳng định bản thân. Hoá Lộc đồng cung là điểm sáng — có duyên ăn nói, khéo tạo thiện cảm và tự tìm được nguồn thu nhập riêng dù hoàn cảnh ban đầu không dễ dàng.",
  },
  {
    chi: "Tý",
    cungName: "Huynh Đệ",
    ageRange: [15, 24],
    mainStars: [{ name: "Tham Lang", state: "Hãm" }],
    auxStars: ["Long Đức", "Đại Hao", "Tức Thần", "Thiên Hình"],
    luuStars: ["Tuế Phá", "Tai Sát"],
    truongSinh: "Mộ",
    summary:
      "Tham Lang hãm tại Huynh Đệ — anh chị em có thể không thật gần gũi khăng khít hoặc mỗi người một hướng đi riêng khá sớm; tình cảm cần thời gian và sự chủ động vun đắp hai chiều mới bền.",
  },
  {
    chi: "Hợi",
    cungName: "Phu Thê",
    ageRange: [25, 34],
    mainStars: [{ name: "Thái Âm", state: "Miếu" }],
    auxStars: ["Thiên Giải", "Kim Dư", "Phục Binh", "Tuế Phá", "Thiên Hư", "Thiên Vu", "Thiên Khôi"],
    luuStars: ["Kiếp Sát", "Thiên Khôi", "Tử Phù"],
    truongSinh: "Tuyệt",
    summary:
      "Thái Âm miếu địa tại Phu Thê — bạn đời thường dịu dàng, tinh tế, chu đáo và có đời sống nội tâm phong phú, mang lại cảm giác an ổn trong hôn nhân. Đây cũng là Đại Vận hiện tại (25–34 tuổi, ứng Lưu Niên Bính Ngọ 2026) — giai đoạn các chủ đề tình cảm, hôn nhân trở thành tâm điểm nổi bật của cuộc sống.",
  },
];

export function currentPalace(age: number): TuViPalace | undefined {
  return tuViPalaces.find((p) => age >= p.ageRange[0] && age <= p.ageRange[1]);
}

export function palaceForChi(chi: string): TuViPalace | undefined {
  return tuViPalaces.find((p) => p.chi === chi);
}
