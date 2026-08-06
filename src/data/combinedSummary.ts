export const combinedSummaryIntro =
  "Bốn hệ thống dưới đây hình thành độc lập với nhau — Bát Tự và Tử Vi từ lịch Can Chi phương Đông (nhưng theo hai lối tính hoàn toàn khác nhau), Chiêm tinh học từ vị trí hành tinh phương Tây, Thần số học từ toán học biểu tượng của họ tên và ngày sinh — nên không hề \"vay mượn\" ý tưởng của nhau. Khi nhiều hệ thống cùng chỉ về một chủ đề, đó là tín hiệu đáng tin cậy hơn hẳn so với khi chỉ một hệ thống đơn lẻ nêu ra.";

export interface ConvergentTheme {
  title: string;
  bazi?: string;
  western?: string;
  numerology?: string;
  tuVi?: string;
  synthesis: string;
}

export const convergentThemes: ConvergentTheme[] = [
  {
    title: "Kỷ luật là bài học lặp lại, không phải một lần rồi thôi",
    bazi: "Tam Thìn Tự Hình (Tháng–Ngày–Giờ) — tự tạo áp lực cho chính mình, lặp đi lặp lại theo thời gian thay vì một biến cố dứt điểm.",
    western: "Mặt Trời quincunx Diêm Vương (150°, gần như chính xác tuyệt đối) — bản sắc liên tục phải điều chỉnh trước biến động từ bên ngoài lẫn bên trong.",
    numerology: "Nợ Nghiệp Quả 13/4 xuất hiện ngay trong Số Chủ Đạo — theo đúng nghĩa gốc, đây là con số chỉ bài học về kỷ luật và trách nhiệm bị trì hoãn, phải trả dần qua nhiều lần thay vì một lần.",
    tuVi: "Cung Mệnh (Thiên Đồng, Cự Môn hãm) đang ở trạng thái \"Tử\" trong Vòng Trường Sinh — đúng nghĩa là \"điểm chững lại, mọi việc có xu hướng dừng, cần tĩnh tâm nhìn lại\", không phải một dòng chảy liên tục.",
    synthesis:
      "Đây là chủ đề trùng khớp rõ nhất — không hệ thống nào mô tả một biến cố dứt điểm, mà cả bốn đều chỉ ra một chu kỳ tự tạo căng thẳng/chững lại lặp đi lặp lại suốt đời, gắn chặt với việc thiếu kỷ luật/tổ chức ở đâu đó trong quá khứ. Bài học chung: thay đổi thật sự đến từ việc chủ động xây dựng kỷ luật, không phải chờ áp lực tự hết.",
  },
  {
    title: "Năng lực dẫn dắt có thật nhưng không tự động bộc lộ",
    bazi: "Dụng Thần Mộc (Quan Sát) chỉ chiếm ~11%, ẩn tàng trong Tàng Can, chưa thấu lộ ra Thiên Can.",
    western: "Cụm Thủy Tinh – Sao Mộc – Thổ Tinh đóng kín ở Nhà 12 (cung ẩn giấu/hậu trường) — thế mạnh tư duy không tự nhiên phô bày ra ngoài.",
    numerology: "Bài Học Nghiệp Quả hoàn toàn thiếu số 1 (không xuất hiện một lần nào trong tên) — về đúng định nghĩa, đây là dấu hiệu năng lực dẫn dắt/chủ động không có sẵn, phải học lại từ đầu qua trải nghiệm.",
    synthesis:
      "Cả ba hệ thống, bằng ba cách tính hoàn toàn khác nhau, đều đi đến cùng một kết luận: năng lực định hướng/lãnh đạo là có thật nhưng nằm ở tầng sâu, không phải thứ tự động bộc lộ. Thành quả lớn nhất đến từ việc chủ động luyện tập và tạo môi trường phù hợp, không phải chờ thời cơ tự đến.",
  },
  {
    title: "Nền tảng thực tế bên ngoài, khao khát lớn lao bên trong",
    bazi: "Thân cực vượng với Tỉ Kiếp chiếm ~38.8% — bản chất thiên về tự lực, network rộng, nhưng Thổ dư thừa dễ khiến bảo thủ, bám giữ lối cũ.",
    western: "Mặt Trời Kim Ngưu (thực tế, bền bỉ) đóng ở Nhà 11 (cộng đồng, lý tưởng dài hạn) — vỏ bọc ổn định nhưng hướng đến điều lớn hơn bản thân.",
    numerology: "Số Chủ Đạo và Số Sứ Mệnh đều là 4 (nền tảng, kỷ luật, thực tế) nhưng Số Linh Hồn và Số Nhân Cách đều là Số Chủ 11 (khao khát truyền cảm hứng, trực giác mạnh) — hai lớp hoàn toàn đối lập trong cùng một lá số.",
    synthesis:
      "Cả ba hệ thống đều mô tả hai lớp năng lượng chồng lên nhau: một lớp vỏ thực tế, kiên trì, đáng tin cậy (Thân vượng, Kim Ngưu, số 4) và một lõi bên trong khao khát điều gì đó lớn lao, mang tính cảm hứng hơn (Nhà 11, Số Chủ 11). Cảm giác \"chưa đủ\" dù bên ngoài ổn định không phải ảo tưởng — đó là tín hiệu thật từ cả ba lá số, và hướng giải quyết là để phần thực tế phục vụ cho lý tưởng lớn hơn, thay vì chọn một trong hai.",
  },
  {
    title: "Tài chính bền vững gắn với kết nối, không phải tích trữ",
    bazi: "Thủy (Hỷ Thần) là Tài Tinh — khả năng tạo/thu hút tiền tốt nhất qua kênh lưu động, giao thương, hợp tác.",
    western: "Kim Tinh ở Nhà 11 (bạn bè/cộng đồng) và Nút Bắc ở Nhà 2 (Tài Bạch) — giá trị bản thân và tài chính phát triển qua mạng lưới xã hội và việc tự nuôi dưỡng nội lực.",
    numerology: "Đường Tinh Thần (7-8-9) trong bảng đồ số hoàn toàn trống — không có sẵn bản năng tích trữ/vật chất đơn thuần; Số Trưởng Thành 8 (thành tựu vật chất) chỉ trở nên rõ nét từ trung niên, nghĩa là của cải không phải điểm khởi đầu tự nhiên.",
    tuVi: "Cung Thân đóng tại Tài Bạch (vô chính diệu, có Lộc Tồn) — trọng tâm cả đời nghiêng hẳn về tài chính, và Tử Vi miếu địa tại Nô Bộc cho thấy nguồn lực đó gắn chặt với bạn bè/đối tác có vị thế chứ không phải tự thân tích luỹ đơn độc.",
    synthesis:
      "Cả bốn hệ thống đều không ủng hộ việc chôn vốn tĩnh hay làm việc đơn độc vì tiền — dòng chảy tài chính thuận nhất khi gắn với kết nối, chuyên môn thực chất và cộng đồng xung quanh, và bản thân xu hướng tích lũy vật chất cũng chỉ chín muồi dần theo thời gian chứ không phải bản năng có sẵn từ đầu.",
  },
  {
    title: "Sự nghiệp là nơi phát huy thế mạnh rõ rệt nhất",
    bazi: "Thương Quan/Thực Thần dùng tài lẻ, khả năng diễn đạt và sáng tạo để tiết chế bớt sự bảo thủ của Thân vượng.",
    tuVi: "Cung Quan Lộc có Thiên Cơ vượng (trí tuệ linh hoạt, giỏi mưu tính, thích nghi) — một trong số ít cung chính tinh vượng địa của cả lá số, lại nằm đúng vào tam hợp với Mệnh và Tài Bạch.",
    synthesis:
      "Bát Tự và Tử Vi — hai hệ thống Đông phương hình thành theo hai lối tính hoàn toàn khác nhau — cùng chỉ ra sự nghiệp/công việc trí óc là nơi năng lực được phát huy rõ ràng nhất, rõ hơn hẳn so với các mảng đời sống khác của lá số.",
  },
];
