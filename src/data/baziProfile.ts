export interface PillarData {
  position: "Năm" | "Tháng" | "Ngày" | "Giờ";
  can: string;
  canNote: string;
  chi: string;
  tangCan: { can: string; tenGod: string }[];
  canTenGod: string;
}

export const personalInfo = {
  name: "Nguyễn Hữu Quốc Thống",
  birthDate: "05/05/2001 (Dương lịch)",
  gender: "Nam mệnh",
  napAm: "Bạch Lạp Kim (白蠟金)",
  napAmDesc: [
    "Đây là một trong 30 Nạp Âm Ngũ Hành của hệ Lục Thập Hoa Giáp, ứng với cặp năm Canh Thìn – Tân Tỵ (năm sinh Tân Tỵ của bạn).",
    "Khác với Ngũ Hành của Nhật Chủ (Mậu Thổ — dùng để luận toàn bộ Bát Tự), Nạp Âm là ngũ hành tính riêng theo trụ Năm, thường dùng để xem tuổi hợp/khắc, chọn ngày cưới hỏi, phong thủy nhà cửa.",
    "Bạch Lạp Kim mang hình ảnh kim loại còn ở dạng thô mềm (như sáp nến), chưa được tôi luyện thành khí cụ — biểu trưng cho tiềm năng cần thời gian mài giũa, tính cách linh hoạt, thích nghi tốt nhưng cần \"lửa\" (thử thách, rèn luyện) để trở nên sắc bén và vững vàng hơn.",
  ],
};

export const fourPillars: PillarData[] = [
  {
    position: "Năm",
    can: "Tân",
    canNote: "Âm Kim",
    chi: "Tỵ",
    canTenGod: "Thương Quan",
    tangCan: [
      { can: "Bính", tenGod: "Thiên Ấn" },
      { can: "Mậu", tenGod: "Tỉ Kiên" },
      { can: "Canh", tenGod: "Thực Thần" },
    ],
  },
  {
    position: "Tháng",
    can: "Nhâm",
    canNote: "Dương Thủy",
    chi: "Thìn",
    canTenGod: "Thiên Tài",
    tangCan: [
      { can: "Mậu", tenGod: "Tỉ Kiên" },
      { can: "Ất", tenGod: "Chính Quan" },
      { can: "Quý", tenGod: "Chính Tài" },
    ],
  },
  {
    position: "Ngày",
    can: "Mậu",
    canNote: "Dương Thổ",
    chi: "Thìn",
    canTenGod: "Nhật Chủ",
    tangCan: [
      { can: "Mậu", tenGod: "Tỉ Kiên" },
      { can: "Ất", tenGod: "Chính Quan" },
      { can: "Quý", tenGod: "Chính Tài" },
    ],
  },
  {
    position: "Giờ",
    can: "Bính",
    canNote: "Dương Hỏa",
    chi: "Thìn",
    canTenGod: "Thiên Ấn",
    tangCan: [
      { can: "Mậu", tenGod: "Tỉ Kiên" },
      { can: "Ất", tenGod: "Chính Quan" },
      { can: "Quý", tenGod: "Chính Tài" },
    ],
  },
];

export const nhatChu = { can: "Mậu", note: "Dương Thổ" };

export const tenGodRatios = [
  { name: "Tỉ Kiên", percent: 38.8 },
  { name: "Thiên Ấn", percent: 20 },
  { name: "Thương Quan", percent: 12.5 },
  { name: "Thiên Tài", percent: 12.5 },
  { name: "Chính Quan", percent: 11.3 },
  { name: "Chính Tài", percent: 3.7 },
  { name: "Thực Thần", percent: 1.2 },
  { name: "Kiếp Tài", percent: 0 },
  { name: "Thất Sát", percent: 0 },
  { name: "Chính Ấn", percent: 0 },
];

export const bodyStrength = {
  verdict: "THÂN CỰC VƯỢNG",
  cachCuc: "Kiến Lộc",
  paragraphs: [
    "Nhật Chủ Mậu (Thổ) ở thế THÂN CỰC VƯỢNG: lực phe sinh/trợ (Tỉ Kiếp + Ấn) chiếm tới ~58.8% tổng khí toàn cục — chủ yếu do ba trụ Thìn liên tiếp cộng dồn khối Thổ rất lớn, cộng thêm Bính Hỏa (Thiên Ấn) sinh trợ thêm.",
    "Cách cục: Kiến Lộc — Tàng Can chính khí của Chi Tháng (Thìn) là Mậu, trùng Tỉ Kiên với Nhật Chủ. Thân vượng ở mức cực cao đòi hỏi phải có lực Khắc–Tiết–Hao đủ mạnh mới cân bằng được cách cục, nếu không dễ rơi vào thế \"vượng cực vô dụng\": bảo thủ, ỳ trệ, khó tiếp thu.",
  ],
};

export const dungHyKy = [
  {
    role: "dung-than" as const,
    colorElement: "moc" as const,
    title: "Dụng Thần",
    element: "Mộc (Quan Sát)",
    tenGod: "Chính Quan (Ất Mộc)",
    desc: "Lực duy nhất đủ sức khắc chế trực tiếp khối Thổ quá vượng, cắt được thế bảo thủ/tranh giành của Tỉ Kiếp. (Ất Mộc — chỉ ẩn tàng trong 3 Thìn, chưa thấu can)",
  },
  {
    role: "hy-than" as const,
    colorElement: "thuy" as const,
    title: "Hỷ Thần",
    element: "Thủy",
    tenGod: "Thiên Tài (Nhâm) & Chính Tài (Quý)",
    desc: "Đi đôi với Mộc theo nguyên lý Thủy sinh Mộc, nuôi dưỡng và tiếp sức để Mộc đủ lực phát huy. (Nhâm Thủy thấu can ở Tháng; Quý Thủy ẩn tàng cả 3 Thìn)",
  },
  {
    role: "hy-than-phu" as const,
    colorElement: "kim" as const,
    title: "Hỷ Thần phụ",
    element: "Kim",
    tenGod: "Thương Quan (Tân)",
    desc: "Chỉ có tác dụng tiết bớt Thổ, không trực tiếp khắc chế được, và còn khắc ngược lại Mộc nếu quá vượng nên chỉ dùng ở mức bổ trợ. (Tân Kim thấu can ở Năm)",
  },
  {
    role: "ky-than" as const,
    colorElement: "tho" as const,
    title: "Kỵ Thần",
    element: "Thổ",
    tenGod: "Tỉ Kiên (Mậu) & Kiếp Tài (Kỷ)",
    desc: "Vốn đã dư thừa nghiêm trọng (Tỉ Kiên, Kiếp Tài chiếm ~38.8%) — tối kỵ gặp thêm, càng khiến Thân vượng cực đoan, dễ bảo thủ, ỳ trệ, tranh giành.",
  },
  {
    role: "ky-than" as const,
    colorElement: "hoa" as const,
    title: "Kỵ Thần",
    element: "Hỏa",
    tenGod: "Thiên Ấn (Bính)",
    desc: "Thiên Ấn Hỏa sinh thêm cho khối Thổ vốn đã dư — tối kỵ gặp thêm, dễ tạo áp lực/kỳ vọng nặng nề và củng cố thêm thế ỳ trệ của Thổ.",
  },
];

export const tamThinTuHinh = {
  title: "Tam Thìn Tự Hình",
  paragraphs: [
    "Ba trụ Thìn liên tiếp ở Tháng – Ngày – Giờ tạo thành thế Tam Thìn Tự Hình — không phải xung đối kháng từ bên ngoài mà là kiểu \"tự mình tạo áp lực cho chính mình\", lặp đi lặp lại theo thời gian.",
    "Thế này còn được củng cố thêm bởi Thần Sát Thiên La xuất hiện đủ cả 4/4 trụ — chủ đề xuyên suốt cuộc đời là học cách vượt qua những giới hạn, bó buộc mà phần nhiều đến từ chính cách bản thân phản ứng với hoàn cảnh.",
  ],
};

export const elementRatios = [
  { element: "tho" as const, label: "Thổ", percent: 38.8 },
  { element: "hoa" as const, label: "Hỏa", percent: 20 },
  { element: "thuy" as const, label: "Thủy", percent: 16.3 },
  { element: "kim" as const, label: "Kim", percent: 13.8 },
  { element: "moc" as const, label: "Mộc", percent: 11.2 },
];

export const family = [
  {
    role: "Cha",
    tenGod: "Thiên Tài (Nhâm Thủy, thấu can ở trụ Tháng)",
    desc: "Hình ảnh người cha khá rõ nét, có ảnh hưởng lớn đến bạn đặc biệt trong giai đoạn thanh thiếu niên. Thiên Tài là Hỷ Thần nên nhìn chung cha là người có năng lực tài chính/xoay xở tốt, có thể là chỗ dựa vật chất; tuy vậy Thiên Tài cũng mang tính \"quảng giao, không chỉ lo cho một mình gia đình\" nên đôi lúc cảm giác cha không dành trọn thời gian cho riêng bạn.",
  },
  {
    role: "Mẹ",
    tenGod: "Thiên Ấn (Bính Hỏa, ở trụ Giờ)",
    desc: "Khác với cha xuất hiện sớm ở cung Tháng, hình ảnh mẹ lại nằm ở cung Giờ — cung muộn nhất trong 4 trụ. Gợi ý ảnh hưởng của mẹ có thể đến muộn hơn hoặc mối gắn kết sâu sắc dần về sau. Thiên Ấn là Kỵ Thần nên đôi lúc sự quan tâm/bảo bọc của mẹ vô tình lại trở thành một dạng áp lực hoặc kỳ vọng nặng nề hơn là nâng đỡ nhẹ nhàng.",
  },
  {
    role: "Anh chị em, bạn bè, đồng nghiệp",
    tenGod: "Tỉ Kiếp (cực kỳ dày đặc, ~38.8%)",
    desc: "Nhóm lục thân chiếm tỉ trọng lớn nhất trong cả lá số. Vòng quan hệ xã hội rất rộng, nhiều anh em/bạn bè/đồng nghiệp xuất hiện xuyên suốt cuộc đời, nhưng vì đây là Kỵ Thần nên cũng tiềm ẩn cạnh tranh ngầm, dễ bị so bì hơn thiệt, hoặc san sẻ công sức/lợi ích không đều — cần tỉnh táo khi hợp tác kinh doanh hay góp vốn chung.",
  },
  {
    role: "Vợ",
    tenGod: "Chính Tài (Quý Thủy, ẩn tàng trong cả 3 Thìn — Tháng, Ngày, Giờ)",
    desc: "Vợ hiện diện rất nhiều trong lá số, đặc biệt nằm ngay trong Chi Ngày (cung Phu Thê) — nhưng ở dạng ẩn tàng, không thấu lộ ra Thiên Can. Giá trị thật của người vợ (sự chu đáo, đảm đang, là Hỷ Thần thật sự tốt cho bạn) cần thời gian, sự tinh tế và chân thành mới \"nhìn thấy\" được, chứ không phô bày ngay từ đầu.",
  },
];

export const marriage = [
  "Cung Phu Thê (Chi Ngày = Thìn) nằm ngay trong thế Tam Thìn Tự Hình với cả cung Tháng và cung Giờ — hôn nhân dễ trải qua giai đoạn căng thẳng, mâu thuẫn có tính lặp lại, nhiều khả năng do cả hai vô tình tạo áp lực cho nhau hơn là do tác động từ bên ngoài.",
  "Tài tinh (Cha, Nhâm Thủy) khắc Ấn tinh (Mẹ, Bính Hỏa) — cha mẹ có thể không hoàn toàn hòa hợp quan điểm, phần nào ảnh hưởng đến hình mẫu hôn nhân bạn tiếp thu từ nhỏ.",
  "Vỏ ngoài cung Phu Thê (Thổ) là Kỵ Thần — hôn nhân có thể mang cảm giác nặng nề, trách nhiệm, ràng buộc. Nhưng lõi bên trong (Quý Thủy — bản chất người vợ) lại là Hỷ Thần: cần thời gian để hai người thấu hiểu nhau qua lớp áp lực bên ngoài, càng về sau hôn nhân càng có xu hướng ổn định và là điểm tựa thật sự.",
];

export const health = [
  {
    organ: "Hệ tiêu hóa — dạ dày, tì vị",
    element: "tho" as const,
    note: "Thổ quá vượng (38.8%) — bộ phận cần chú ý nhất. Dễ ăn uống chậm tiêu, đầy bụng, tích mỡ/tích nước vùng bụng; nên tầm soát định kỳ (viêm loét, trào ngược) nếu ăn uống thất thường.",
  },
  {
    organ: "Gan, mật",
    element: "moc" as const,
    note: "Mộc bị vây khắc, chỉ 11.2% — đáng lưu tâm hàng đầu vì đây chính là Dụng Thần nhưng bị Thổ bủa vây tứ phía. Biểu hiện: căng thẳng thần kinh, khó ngủ, nóng trong người — Đông y gọi là can khí uất kết. Ưu tiên vận động ngoài trời, hạn chế rượu bia, thiền/đi bộ trong thiên nhiên chính là cách nuôi dưỡng Dụng Thần thiết thực nhất.",
  },
  {
    organ: "Thận, hệ tiết niệu",
    element: "thuy" as const,
    note: "Thủy bị chế — dù Nhâm Thủy thấu can vẫn bị Thổ bao vây — chú ý vùng thắt lưng, tránh thức khuya, uống đủ nước, tầm soát sỏi thận nếu có tiền sử gia đình.",
  },
  {
    organ: "Xương khớp & tai nạn nhỏ lặp lại",
    element: "tho" as const,
    note: "Tam Thìn Tự Hình — tổ hợp Tự Hình lặp lại thường gắn với va vấp/chấn thương nhỏ có tính lặp lại, hoặc bệnh có yếu tố tâm lý tự tạo — nên chủ động quản lý stress.",
  },
];

export const healthGeneral =
  "Vận động đều đặn (tiết bớt khí Thổ dư qua đường Kim), ăn uống điều độ, tiếp xúc thiên nhiên/cây xanh có lợi hơn hẳn so với ở trong không gian bí bách lâu ngày.";

export const wealth = {
  taiTinh:
    "Nhâm Thủy (Thiên Tài) thấu can ở Tháng, cộng Quý Thủy (Chính Tài) ẩn tàng cả 3 Thìn — Thủy là Hỷ Thần nên khả năng tạo ra/thu hút tiền bạc khá tốt, đặc biệt qua kênh liên quan Thủy (tài chính lưu động, giao thương, hợp tác quốc tế), và được kích hoạt tốt nhất khi có Mộc đi kèm (Dụng Thần) — tiền đến thuận lợi nhất khi gắn với chuyên môn/năng lực thực chất, không phải may rủi thuần túy.",
  risk:
    "Rủi ro lớn nhất — \"phá tài\" từ Tỉ Kiếp cực vượng: dễ gặp hao tài qua bạn bè/đối tác/anh em — cho vay khó đòi, hùn vốn không rõ ràng dễ mất phần, chi tiêu theo cảm tính vì nể nang. Tài chính cá nhân nên tách bạch rõ ràng với tài chính chung khi hợp tác.",
  suggestion:
    "Ưu tiên tích lũy có tính thanh khoản (Thủy) hơn là chôn vốn vào tài sản cố định (Thổ, vốn đã dư); nếu kinh doanh nên chọn mô hình ít phụ thuộc số đông cộng sự, hợp đồng minh bạch; giai đoạn Đại Vận có Mộc/Thủy (như Tân Mão 11–20 tuổi, Đinh Hợi 51–60 tuổi) thường là lúc tài chính có cơ hội bứt phá rõ rệt hơn.",
};

export const career = [
  "Nghề nghiệp phù hợp nhất thiên về hành Mộc (giáo dục, y tế, sách vở-xuất bản, thiết kế) kết hợp Thủy (truyền thông, tư vấn, du lịch, giao thương). Kim chỉ nên là kỹ năng bổ trợ, không nên làm trục chính vì khắc ngược Dụng Thần.",
  "Quan Sát (Ất Mộc) là Dụng Thần nhưng chỉ ẩn tàng — tiềm năng lãnh đạo rất thật nhưng cần chủ động khơi mở qua nỗ lực và vận trình phù hợp, không tự nhiên mà có.",
  "Tỉ Kiếp cực vượng (Kỵ Thần) khiến dễ gặp cạnh tranh gay gắt từ đồng nghiệp/đối tác — nếu hùn vốn kinh doanh, cần hợp đồng rõ ràng.",
];

export const thanSatByPillar = [
  {
    pillar: "Năm (Tân Tỵ)",
    list: ["Học Đường", "Kiếp Sát", "Lộc Thần", "Lưu Hà Sát", "Phúc Tinh", "Quốc Ấn", "Thiên La", "Tú Quý Nhân"],
  },
  {
    pillar: "Tháng (Nhâm Thìn)",
    list: ["Đức Quý Nhân", "Hoa Cái", "Hồng Diễm", "Khôi Canh", "Nguyệt Đức", "Quả Tú", "Thái Cực", "Thiên Đức", "Thiên La"],
  },
  {
    pillar: "Ngày (Mậu Thìn)",
    list: ["Đức Quý Nhân", "Hồng Diễm", "Quả Tú", "Thái Cực", "Thiên La"],
  },
  {
    pillar: "Giờ (Bính Thìn)",
    list: ["Hoa Cái", "Hồng Diễm", "Quả Tú", "Thái Cực", "Thiên La", "Tú Quý Nhân"],
  },
];

export type ThanSatNature = "tot" | "xau" | "trung-tinh";

export const thanSatMeanings: { name: string; freq: string; desc: string; nature: ThanSatNature }[] = [
  { name: "Thiên La", freq: "4/4 trụ", desc: "Sao hung bậc nhất — chủ về bó buộc, trắc trở, hay gặp cản trở/thị phi/kiện tụng; cộng hưởng trực tiếp với Tam Thìn Tự Hình, cũng gắn với ý nghĩa tu tâm/khắc kỷ nếu biết chuyển hóa.", nature: "xau" },
  { name: "Thái Cực", freq: "3/4 trụ", desc: "Sao quý liên quan học thuật, triết lý, tôn giáo, Dịch lý — duyên với nghiên cứu chuyên sâu, minh triết.", nature: "tot" },
  { name: "Quả Tú", freq: "3/4 trụ (Ngày và Giờ)", desc: "Sao chủ cô đơn — nhắc nhở cần chủ động vun đắp, tránh khép kín trong tình cảm và quan hệ con cái.", nature: "xau" },
  { name: "Hồng Diễm", freq: "3/4 trụ", desc: "Sao đào hoa phụ, sức hút ngoại hình, dễ có duyên tình cảm — cần tiết chế để tránh thị phi khi kết hợp cùng Quả Tú.", nature: "trung-tinh" },
  { name: "Hoa Cái", freq: "2/4 trụ", desc: "Duyên nghệ thuật, tâm linh, đời sống nội tâm sâu — cùng nhóm ý nghĩa với Thái Cực.", nature: "tot" },
  { name: "Đức Quý Nhân", freq: "2/4 trụ", desc: "Sao lành — thường được người khác giúp đỡ, gặp dữ hóa lành.", nature: "tot" },
  { name: "Tú Quý Nhân", freq: "2/4 trụ", desc: "Một loại quý nhân khác — sao lành, gặp dữ hóa lành.", nature: "tot" },
  { name: "Học Đường", freq: "Năm", desc: "Thông minh, hiếu học.", nature: "tot" },
  { name: "Lộc Thần", freq: "Năm", desc: "Ứng đúng cách Kiến Lộc — tài lộc ổn định.", nature: "tot" },
  { name: "Quốc Ấn", freq: "Năm", desc: "Duyên quyền lực, địa vị \"chính danh\".", nature: "tot" },
  { name: "Kiếp Sát", freq: "Năm", desc: "Đề phòng mất mát/hao tài/tai họa bất ngờ.", nature: "xau" },
  { name: "Lưu Hà Sát", freq: "Năm", desc: "Cẩn trọng tai nạn liên quan nước, dao kéo, phẫu thuật.", nature: "xau" },
  { name: "Phúc Tinh", freq: "Năm", desc: "Phúc đức, hóa giải hung sát.", nature: "tot" },
  { name: "Khôi Canh", freq: "Tháng", desc: "Cương trực, quyết đoán, đôi khi cứng nhắc.", nature: "trung-tinh" },
  { name: "Nguyệt Đức, Thiên Đức", freq: "Tháng", desc: "Hai sao lành bậc nhất, giảm nhẹ đáng kể ảnh hưởng tiêu cực từ Kiếp Sát, Lưu Hà Sát.", nature: "tot" },
];

export const thanSatSummary =
  "Nhóm hung (Thiên La, Quả Tú, Kiếp Sát, Lưu Hà Sát) xoay quanh bó buộc/hao tổn/cô đơn cần chủ động hóa giải; nhóm cát khá dồi dào, đóng vai trò nâng đỡ. Hoa Cái–Thái Cực là \"lối thoát\" tự nhiên: càng đi sâu tri thức/nội tâm/tâm linh càng dễ tìm cân bằng.";

export const daiVan = [
  { ganChi: "Tân Mão", start: "06/2011", startYear: 2011, age: 11, tenGod: "Thương Quan", favorable: true },
  { ganChi: "Canh Dần", start: "06/2021", startYear: 2021, age: 21, tenGod: "Thực Thần", favorable: true },
  { ganChi: "Kỷ Sửu", start: "06/2031", startYear: 2031, age: 31, tenGod: "Kiếp Tài", favorable: false },
  { ganChi: "Mậu Tý", start: "06/2041", startYear: 2041, age: 41, tenGod: "Tỉ Kiên", favorable: false },
  { ganChi: "Đinh Hợi", start: "06/2051", startYear: 2051, age: 51, tenGod: "Chính Ấn", favorable: true },
  { ganChi: "Bính Tuất", start: "05/2061", startYear: 2061, age: 61, tenGod: "Thiên Ấn", favorable: false },
  { ganChi: "Ất Dậu", start: "05/2071", startYear: 2071, age: 71, tenGod: "Chính Quan", favorable: true },
  { ganChi: "Giáp Thân", start: "05/2081", startYear: 2081, age: 81, tenGod: "Thất Sát", favorable: true },
];

export const daiVanNote =
  "Vận Tân Mão (11–20t) và Đinh Hợi (51–60t) có Mộc/Thủy — giai đoạn tiềm năng thuận lợi nhất để bứt phá. Vận Canh Dần hiện tại (21–30t) có Dần mang Mộc (Dụng Thần) nhưng đi kèm Canh (Kim khắc Dần) nên cơ hội có thật nhưng đòi hỏi chủ động, kiên trì hơn là chờ thời.";

export const daiVanMeta = "Nghịch hành từ Nhâm Thìn, nhập vận lúc 10 tuổi 1 tháng.";

export const summary =
  "Đây là lá số Thân cực Vượng, cách Kiến Lộc, với khối Thổ áp đảo (ba trụ Thìn liên tiếp) tạo nên thế Tam Thìn Tự Hình hiếm gặp — chủ đề xuyên suốt là áp lực/mâu thuẫn tự thân lặp lại. Mấu chốt nằm ở Dụng Thần Mộc (Quan Sát) — lực duy nhất đủ sức khắc chế khối Tỉ Kiếp/Thổ — đi cùng Hỷ Thần Thủy để nuôi dưỡng. Mộc chỉ chiếm khoảng 11% khí toàn cục nên cần chủ động khơi mở qua vận trình, môi trường, và lối sống mới thực sự phát huy được tiềm năng dẫn dắt, định hướng vốn có. Bộ Thần Sát Hoa Cái–Thái Cực gợi ý con đường tri thức/nội tâm/tâm linh chính là \"chìa khoá\" giúp cân bằng lại năng lượng bó buộc của Thiên La và Tam Thìn Tự Hình.";
