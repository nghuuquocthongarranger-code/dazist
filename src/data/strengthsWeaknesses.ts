export type Source = "bazi" | "western" | "numerology" | "tuvi" | "both" | "all";

export interface SwItem {
  text: string;
  source: Source;
}

export const strengths: SwItem[] = [
  {
    text: "Năng lực tư duy/nghiên cứu độc lập mạnh, phù hợp vai trò cố vấn hậu trường hơn là phô trương trước đám đông — thế mạnh có thật nhưng cần chủ động khơi mở thay vì chờ tự lộ ra (Quan Sát ẩn tàng ↔ cụm Thủy–Mộc–Thổ Nhà 12 ↔ Karmic Lesson thiếu số 1).",
    source: "all",
  },
  {
    text: "Vòng quan hệ xã hội rất rộng, nhiều bạn bè/đồng nghiệp/cộng đồng xuất hiện xuyên suốt — mạng lưới hỗ trợ dồi dào nếu biết chọn lọc.",
    source: "both",
  },
  {
    text: "Khả năng tạo và thu hút tài chính tốt, đặc biệt qua kênh tài chính lưu động, giao thương, hợp tác quốc tế (Thủy Hỷ Thần).",
    source: "bazi",
  },
  {
    text: "Tài lẻ, khả năng diễn đạt và sáng tạo dùng để tiết chế bớt sự bảo thủ (Kim Hỷ Thần phụ, Thương Quan).",
    source: "bazi",
  },
  {
    text: "Duyên kết nối tình cảm tự nhiên, chủ động qua bạn bè/cộng đồng, dễ tạo thiện cảm ban đầu (Kim Tinh Bạch Dương Nhà 11).",
    source: "western",
  },
  {
    text: "Khéo léo ngoại giao, biết dung hòa và giữ hòa khí trong gia đình/nhóm nhỏ (Mặt Trăng Thiên Bình Nhà 4).",
    source: "western",
  },
  {
    text: "Giao tiếp linh hoạt, thích nghi nhanh với nhiều kiểu người và hoàn cảnh (Cung Mọc Song Tử).",
    source: "western",
  },
  {
    text: "Số Linh Hồn và Số Nhân Cách đều là Số Chủ 11 — trực giác mạnh, khả năng truyền cảm hứng và thu hút sự chú ý dù chưa chủ động thể hiện.",
    source: "numerology",
  },
  {
    text: "Số Ngày Sinh 5 mang tài lẻ thích nghi nhanh, bổ trợ tốt cho nền tảng ổn định của Số Chủ Đạo, giúp không quá cứng nhắc.",
    source: "numerology",
  },
  {
    text: "Cung Quan Lộc có Thiên Cơ vượng — trí tuệ linh hoạt, giỏi mưu tính, thích nghi nhanh trong công việc, phù hợp vai trò tư duy/cố vấn.",
    source: "tuvi",
  },
  {
    text: "Cung Phụ Mẫu (Vũ Khúc, Thiên Tướng đều miếu vượng) và Tử Tức (Liêm Trinh miếu, Thiên Phủ vượng) — nền tảng gia đình và quan hệ với con cái đều vững chắc, hai chiều trên dưới thuận hòa.",
    source: "tuvi",
  },
];

export const weaknesses: SwItem[] = [
  {
    text: "Dễ rơi vào áp lực/mâu thuẫn tự thân lặp đi lặp lại theo thời gian, gắn với bài học kỷ luật/trách nhiệm bị trì hoãn từ trước — cần chủ động xây kỷ luật thay vì chờ áp lực tự hết (Tam Thìn Tự Hình ↔ Mặt Trời quincunx Diêm Vương ↔ Nợ Nghiệp Quả 13/4).",
    source: "all",
  },
  {
    text: "Quan hệ đối tác/hùn vốn tiềm ẩn cạnh tranh ngầm hoặc dễ khơi lại xung đột cũ — cần hợp đồng rõ ràng, tách bạch tài chính khi hợp tác (Tỉ Kiếp cực vượng ↔ Sao Hỏa hợp Chiron trên cung Phu Thê).",
    source: "both",
  },
  {
    text: "Thổ dư thừa nghiêm trọng dễ gây bảo thủ, ỳ trệ, khó tiếp thu cái mới nếu không có đủ lực Khắc–Tiết–Hao cân bằng.",
    source: "bazi",
  },
  {
    text: "Thiên Ấn Hỏa dư dễ tạo áp lực/kỳ vọng nặng nề từ người thân, củng cố thêm sự trì trệ.",
    source: "bazi",
  },
  {
    text: "Sức khỏe/thói quen sinh hoạt dễ trải qua biến động mạnh, cần chuyển hóa tận gốc thay vì xử lý tạm thời (Diêm Vương nghịch hành Nhà 6).",
    source: "western",
  },
  {
    text: "Tư duy dễ nặng nề, lo âu, đặc biệt trong giai đoạn Thủy Tinh nghịch hành (cụm Thủy Tinh hợp Thổ Tinh quincunx Sao Hỏa, Nhà 12).",
    source: "western",
  },
  {
    text: "Số Chủ Đạo 4 dễ đi kèm sự cứng nhắc, ngại thay đổi — cộng hưởng thêm với xu hướng bảo thủ đã thấy rõ bên Bát Tự (Thổ dư thừa).",
    source: "numerology",
  },
  {
    text: "Bài Học Nghiệp Quả thiếu số 4 (chưa quen kỷ luật/tổ chức) và số 9 (chưa quen buông bỏ vì lợi ích chung) — cần chủ động rèn luyện thay vì chờ tự nhiên có được.",
    source: "numerology",
  },
  {
    text: "Cung Mệnh (Thiên Đồng, Cự Môn đều hãm) — nội tâm nhạy cảm, dễ lo xa/đa nghi, đường đời giai đoạn đầu phải tự thân vận động, chật vật hơn để khẳng định bản thân.",
    source: "tuvi",
  },
  {
    text: "Cung Tật Ách có Phá Quân hãm — sức khoẻ/thói quen sinh hoạt dễ biến động thất thường, cần tránh làm việc quá sức và giữ nhịp độ điều hoà.",
    source: "tuvi",
  },
];
