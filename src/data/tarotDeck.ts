export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  arcana: Arcana;
  suit?: Suit;
  number: number;
  keywords: string[];
  upright: string;
  reversed: string;
}

export const SUIT_LABEL: Record<Suit, string> = {
  wands: "Gậy",
  cups: "Cốc",
  swords: "Kiếm",
  pentacles: "Xu",
};

export const SUIT_THEME: Record<Suit, string> = {
  wands: "Hành động, đam mê, sáng tạo, sự nghiệp",
  cups: "Cảm xúc, tình cảm, các mối quan hệ, trực giác",
  swords: "Tư duy, giao tiếp, xung đột, sự thật",
  pentacles: "Vật chất, tài chính, công việc, sức khỏe thân thể",
};

export const MAJOR_ARCANA: TarotCard[] = [
  { id: "fool", name: "Kẻ Khờ", nameEn: "The Fool", arcana: "major", number: 0, keywords: ["khởi đầu", "tự do", "ngây thơ"], upright: "Một khởi đầu mới đầy tự do, sẵn sàng bước vào điều chưa biết với niềm tin ngây thơ.", reversed: "Bốc đồng, thiếu chuẩn bị, hoặc sợ hãi khiến bạn chần chừ trước một khởi đầu cần thiết." },
  { id: "magician", name: "Pháp Sư", nameEn: "The Magician", arcana: "major", number: 1, keywords: ["ý chí", "sáng tạo", "nguồn lực"], upright: "Bạn có đủ công cụ và ý chí để biến ý tưởng thành hiện thực ngay lúc này.", reversed: "Năng lực bị dùng sai mục đích, thao túng, hoặc tiềm năng chưa được khai thác đúng cách." },
  { id: "high-priestess", name: "Nữ Tư Tế", nameEn: "The High Priestess", arcana: "major", number: 2, keywords: ["trực giác", "bí ẩn", "tiềm thức"], upright: "Hãy lắng nghe trực giác và những gì chưa được nói ra thay vì vội vàng hành động.", reversed: "Mất kết nối với trực giác, bí mật bị che giấu quá mức, hoặc thông tin bị bóp méo." },
  { id: "empress", name: "Nữ Hoàng", nameEn: "The Empress", arcana: "major", number: 3, keywords: ["sung túc", "nuôi dưỡng", "sáng tạo"], upright: "Sự sung túc, sáng tạo và nuôi dưỡng đang nảy nở trong cuộc sống của bạn.", reversed: "Phụ thuộc quá mức, thiếu chăm sóc bản thân, hoặc sáng tạo bị đình trệ." },
  { id: "emperor", name: "Hoàng Đế", nameEn: "The Emperor", arcana: "major", number: 4, keywords: ["trật tự", "quyền lực", "kỷ luật"], upright: "Cấu trúc, kỷ luật và vai trò lãnh đạo vững chắc giúp bạn đạt được mục tiêu.", reversed: "Độc đoán, cứng nhắc, hoặc mất kiểm soát trước áp lực quyền lực." },
  { id: "hierophant", name: "Giáo Hoàng", nameEn: "The Hierophant", arcana: "major", number: 5, keywords: ["truyền thống", "giáo dục", "quy chuẩn"], upright: "Tôn trọng truyền thống, tìm kiếm sự hướng dẫn từ người có kinh nghiệm sẽ mang lại giá trị.", reversed: "Nổi loạn chống lại quy chuẩn, hoặc giáo điều cứng nhắc kìm hãm sự phát triển." },
  { id: "lovers", name: "Tình Nhân", nameEn: "The Lovers", arcana: "major", number: 6, keywords: ["tình yêu", "lựa chọn", "hòa hợp"], upright: "Một lựa chọn quan trọng dựa trên giá trị thật và sự hòa hợp sâu sắc trong quan hệ.", reversed: "Mất cân bằng trong quan hệ, lựa chọn sai lầm, hoặc thiếu chân thành." },
  { id: "chariot", name: "Cỗ Xe", nameEn: "The Chariot", arcana: "major", number: 7, keywords: ["ý chí", "chiến thắng", "kiểm soát"], upright: "Ý chí mạnh mẽ và sự tập trung giúp bạn vượt qua trở ngại để chiến thắng.", reversed: "Mất phương hướng, thiếu kiểm soát, hoặc xung đột nội tâm cản trở tiến trình." },
  { id: "strength", name: "Sức Mạnh", nameEn: "Strength", arcana: "major", number: 8, keywords: ["can đảm", "kiên nhẫn", "nội lực"], upright: "Sức mạnh nội tâm, sự kiên nhẫn và lòng trắc ẩn chế ngự được nghịch cảnh.", reversed: "Nghi ngờ bản thân, mất kiên nhẫn, hoặc để cảm xúc tiêu cực lấn át." },
  { id: "hermit", name: "Ẩn Sĩ", nameEn: "The Hermit", arcana: "major", number: 9, keywords: ["nội tâm", "tìm kiếm", "cô độc"], upright: "Đây là lúc lui về nội tâm, tự chiêm nghiệm để tìm ra câu trả lời thật sự.", reversed: "Cô lập quá mức, cô đơn không mong muốn, hoặc từ chối tìm kiếm sự giúp đỡ." },
  { id: "wheel-of-fortune", name: "Bánh Xe Số Mệnh", nameEn: "Wheel of Fortune", arcana: "major", number: 10, keywords: ["vận may", "chu kỳ", "thay đổi"], upright: "Một bước ngoặt của số phận đang đến, chu kỳ mới mở ra nhiều cơ hội.", reversed: "Vận rủi tạm thời, kháng cự sự thay đổi, hoặc chu kỳ xấu lặp lại." },
  { id: "justice", name: "Công Lý", nameEn: "Justice", arcana: "major", number: 11, keywords: ["công bằng", "sự thật", "nhân quả"], upright: "Sự công bằng và trách nhiệm rõ ràng — điều gì bạn gieo sẽ là điều bạn gặt.", reversed: "Bất công, thiếu trung thực, hoặc trốn tránh trách nhiệm về hậu quả." },
  { id: "hanged-man", name: "Người Treo Ngược", nameEn: "The Hanged Man", arcana: "major", number: 12, keywords: ["buông bỏ", "góc nhìn mới", "tạm dừng"], upright: "Tạm dừng và nhìn vấn đề từ góc độ khác sẽ mang lại hiểu biết mới.", reversed: "Trì hoãn vô ích, hy sinh không cần thiết, hoặc mắc kẹt vì sợ thay đổi." },
  { id: "death", name: "Tử Thần", nameEn: "Death", arcana: "major", number: 13, keywords: ["kết thúc", "chuyển hóa", "tái sinh"], upright: "Một giai đoạn kết thúc để nhường chỗ cho sự chuyển hóa và khởi đầu mới.", reversed: "Sợ hãi thay đổi, bám víu vào điều đã lỗi thời, hoặc chuyển hóa bị trì hoãn." },
  { id: "temperance", name: "Tiết Chế", nameEn: "Temperance", arcana: "major", number: 14, keywords: ["cân bằng", "điều độ", "hòa hợp"], upright: "Sự cân bằng, kiên nhẫn và pha trộn hài hòa các thái cực mang lại bình an.", reversed: "Mất cân bằng, thái quá, hoặc thiếu kiên nhẫn để dung hòa các mặt đối lập." },
  { id: "devil", name: "Ác Quỷ", nameEn: "The Devil", arcana: "major", number: 15, keywords: ["ràng buộc", "cám dỗ", "chấp niệm"], upright: "Những ràng buộc, thói quen xấu hoặc cám dỗ vật chất đang kìm giữ bạn.", reversed: "Bạn đang nhận ra và bắt đầu giải phóng bản thân khỏi những ràng buộc độc hại." },
  { id: "tower", name: "Tòa Tháp", nameEn: "The Tower", arcana: "major", number: 16, keywords: ["biến động", "đổ vỡ", "thức tỉnh"], upright: "Một biến cố đột ngột phá vỡ nền tảng cũ, gây xáo trộn nhưng mở đường cho sự thật.", reversed: "Khủng hoảng được né tránh trong gang tấc, hoặc sợ hãi thay đổi cần thiết." },
  { id: "star", name: "Ngôi Sao", nameEn: "The Star", arcana: "major", number: 17, keywords: ["hy vọng", "chữa lành", "niềm tin"], upright: "Hy vọng, cảm hứng và sự chữa lành đang soi sáng con đường phía trước.", reversed: "Mất niềm tin, tuyệt vọng tạm thời, hoặc kỳ vọng không thực tế." },
  { id: "moon", name: "Mặt Trăng", nameEn: "The Moon", arcana: "major", number: 18, keywords: ["mơ hồ", "sợ hãi", "tiềm thức"], upright: "Sự mơ hồ, ảo giác hoặc nỗi sợ tiềm ẩn khiến con đường phía trước chưa rõ ràng.", reversed: "Sự thật dần sáng tỏ, hoặc bạn đang vượt qua giai đoạn hoang mang, lo lắng." },
  { id: "sun", name: "Mặt Trời", nameEn: "The Sun", arcana: "major", number: 19, keywords: ["niềm vui", "thành công", "sức sống"], upright: "Niềm vui, sự rõ ràng và thành công rạng rỡ đang hiện diện.", reversed: "Thành công bị trì hoãn, lạc quan thái quá, hoặc niềm vui bị che khuất tạm thời." },
  { id: "judgement", name: "Phán Xét", nameEn: "Judgement", arcana: "major", number: 20, keywords: ["thức tỉnh", "tha thứ", "lời gọi"], upright: "Một lời gọi thức tỉnh để nhìn lại, tha thứ và bước sang một chương mới.", reversed: "Tự phán xét bản thân quá khắt khe, hoặc chưa sẵn sàng đối diện với sự thật." },
  { id: "world", name: "Thế Giới", nameEn: "The World", arcana: "major", number: 21, keywords: ["hoàn thành", "viên mãn", "hợp nhất"], upright: "Một chu kỳ hoàn thành trọn vẹn, thành tựu và sự viên mãn đã đạt được.", reversed: "Cảm giác dang dở, thiếu một bước cuối để hoàn tất mục tiêu." },
];

interface MinorTemplate {
  number: number;
  label: string;
  keywords: [string, string, string];
  upright: Record<Suit, string>;
  reversed: Record<Suit, string>;
}

const MINOR_TEMPLATES: MinorTemplate[] = [
  {
    number: 1, label: "Át", keywords: ["khởi đầu", "tiềm năng thuần khiết", "hạt giống"],
    upright: {
      wands: "Một tia lửa đam mê, cảm hứng và động lực hành động mới vừa nhen nhóm.",
      cups: "Một khởi đầu cảm xúc tràn đầy — tình yêu mới, niềm vui hoặc sự kết nối sâu sắc.",
      swords: "Một sự thật hoặc ý tưởng sắc bén vừa xuất hiện, mang lại sự rõ ràng đột phá.",
      pentacles: "Một cơ hội vật chất/tài chính mới, hạt giống thịnh vượng vừa được gieo xuống.",
    },
    reversed: {
      wands: "Cảm hứng bị dập tắt, khởi đầu trì hoãn hoặc thiếu định hướng rõ ràng.",
      cups: "Cảm xúc bị kìm nén, cơ hội tình cảm bị bỏ lỡ hoặc trống rỗng nội tâm.",
      swords: "Tư duy hỗn loạn, sự thật bị bóp méo hoặc quyết định vội vàng gây hại.",
      pentacles: "Cơ hội tài chính trượt qua tay, nền tảng vật chất chưa vững.",
    },
  },
  {
    number: 2, label: "Hai", keywords: ["lựa chọn", "cân bằng", "đối tác"],
    upright: {
      wands: "Đứng trước một quyết định về hướng đi tương lai, cân nhắc giữa an toàn và mạo hiểm.",
      cups: "Sự kết nối, hợp tác hoặc mối quan hệ đôi bên hài hòa đang hình thành.",
      swords: "Bế tắc trong quyết định, cần sự sáng suốt để không né tránh lựa chọn khó khăn.",
      pentacles: "Đang cố gắng cân bằng nhiều trách nhiệm tài chính hoặc công việc cùng lúc.",
    },
    reversed: {
      wands: "Do dự kéo dài, sợ cam kết với một hướng đi cụ thể.",
      cups: "Mất cân bằng trong quan hệ, hiểu lầm hoặc chia rẽ giữa hai bên.",
      swords: "Quyết định bị trì hoãn quá lâu, thông tin không đầy đủ gây bối rối.",
      pentacles: "Mất kiểm soát tài chính vì cố ôm đồm quá nhiều việc cùng lúc.",
    },
  },
  {
    number: 3, label: "Ba", keywords: ["mở rộng", "hợp tác", "biểu đạt"],
    upright: {
      wands: "Tầm nhìn đang mở rộng, kế hoạch bắt đầu sinh kết quả nhờ sự chuẩn bị kỹ lưỡng.",
      cups: "Niềm vui được chia sẻ cùng bạn bè, một dịp ăn mừng hoặc tình bạn gắn kết.",
      swords: "Đau lòng, chia ly hoặc sự thật gây tổn thương nhưng cần thiết để chữa lành.",
      pentacles: "Làm việc nhóm hiệu quả, kỹ năng được công nhận, nền móng công việc vững chắc.",
    },
    reversed: {
      wands: "Kế hoạch chậm tiến độ, thiếu sự phối hợp với người khác.",
      cups: "Nhóm bạn rạn nứt, ăn mừng thái quá hoặc cảm giác bị bỏ rơi.",
      swords: "Đang trong quá trình hồi phục sau tổn thương, học cách tha thứ.",
      pentacles: "Bất đồng trong nhóm làm việc, thiếu sự công nhận xứng đáng.",
    },
  },
  {
    number: 4, label: "Bốn", keywords: ["ổn định", "nền tảng", "tạm nghỉ"],
    upright: {
      wands: "Một nền tảng vững chắc, dịp ăn mừng thành quả hoặc mái ấm ổn định.",
      cups: "Sự thờ ơ hoặc trầm ngâm trước những gì đang có, cần mở lòng đón nhận điều mới.",
      swords: "Cần một khoảng lặng để nghỉ ngơi và phục hồi năng lượng sau căng thẳng.",
      pentacles: "Bám giữ chặt của cải/an toàn tài chính, có thể đang khép kín hoặc dè dặt.",
    },
    reversed: {
      wands: "Bất ổn trong gia đình/nền tảng, hoặc sắp có thay đổi nơi ở.",
      cups: "Bắt đầu nhận ra cơ hội đã bị bỏ lỡ vì quá thờ ơ.",
      swords: "Nghỉ ngơi bị gián đoạn, căng thẳng quay lại sớm hơn dự kiến.",
      pentacles: "Keo kiệt thái quá hoặc ngược lại, chi tiêu mất kiểm soát sau thời gian dè sẻn.",
    },
  },
  {
    number: 5, label: "Năm", keywords: ["thử thách", "xung đột", "mất mát"],
    upright: {
      wands: "Cạnh tranh, tranh cãi hoặc va chạm quan điểm cần được giải quyết khéo léo.",
      cups: "Thất vọng hoặc mất mát tình cảm, nhưng vẫn còn điều đáng trân trọng phía sau.",
      swords: "Xung đột gay gắt, chiến thắng bằng mọi giá có thể để lại hậu quả về sau.",
      pentacles: "Khó khăn tài chính hoặc cảm giác bị bỏ rơi, cần tìm kiếm sự hỗ trợ.",
    },
    reversed: {
      wands: "Xung đột dần lắng xuống, tìm được tiếng nói chung sau tranh cãi.",
      cups: "Bắt đầu buông bỏ tiếc nuối, nhìn thấy hy vọng phía trước.",
      swords: "Sẵn sàng hòa giải, buông bỏ nhu cầu phải luôn thắng.",
      pentacles: "Giai đoạn khó khăn tài chính sắp qua, sự giúp đỡ đang đến gần.",
    },
  },
  {
    number: 6, label: "Sáu", keywords: ["hài hòa", "cho và nhận", "hồi phục"],
    upright: {
      wands: "Thành công được công nhận công khai, chiến thắng sau nỗ lực bền bỉ.",
      cups: "Hoài niệm ngọt ngào, tái kết nối với quá khứ hoặc người thân quen.",
      swords: "Đang di chuyển ra khỏi giai đoạn khó khăn để đến vùng nước yên bình hơn.",
      pentacles: "Sự hào phóng, chia sẻ công bằng giữa cho và nhận trong tài chính.",
    },
    reversed: {
      wands: "Thành công bị trì hoãn hoặc không được ghi nhận đúng mức.",
      cups: "Sống quá nhiều trong quá khứ, khó chấp nhận hiện tại.",
      swords: "Khó rời khỏi hoàn cảnh khó khăn, quá trình chuyển tiếp bị mắc kẹt.",
      pentacles: "Mất cân bằng trong cho-nhận, phụ thuộc tài chính một chiều.",
    },
  },
  {
    number: 7, label: "Bảy", keywords: ["đánh giá", "kiên trì", "chiến lược"],
    upright: {
      wands: "Giữ vững lập trường trước thử thách hoặc cạnh tranh, cần sự kiên định.",
      cups: "Nhiều lựa chọn hấp dẫn nhưng cần tỉnh táo phân biệt ảo tưởng và thực tế.",
      swords: "Cẩn trọng với sự lừa dối hoặc chiến lược né tránh thay vì đối mặt trực tiếp.",
      pentacles: "Đánh giá lại thành quả đã gieo trồng, kiên nhẫn chờ đợi kết quả chín muồi.",
    },
    reversed: {
      wands: "Kiệt sức vì phòng thủ quá lâu, cân nhắc buông bỏ cuộc chiến không đáng.",
      cups: "Quyết định cuối cùng đã rõ ràng sau khi cân nhắc các lựa chọn.",
      swords: "Sự thật được phơi bày, không còn có thể né tránh trách nhiệm.",
      pentacles: "Nôn nóng muốn thấy kết quả ngay, thiếu kiên nhẫn đầu tư dài hạn.",
    },
  },
  {
    number: 8, label: "Tám", keywords: ["chuyển động", "tốc độ", "tập trung"],
    upright: {
      wands: "Mọi việc tăng tốc nhanh chóng, tin tức hoặc hành động đến dồn dập.",
      cups: "Rời bỏ điều không còn phù hợp để tìm kiếm ý nghĩa sâu sắc hơn.",
      swords: "Cảm giác bị trói buộc bởi chính nỗi sợ và suy nghĩ giới hạn của bản thân.",
      pentacles: "Tập trung cao độ trau dồi kỹ năng, làm việc chăm chỉ và tỉ mỉ.",
    },
    reversed: {
      wands: "Mọi thứ chậm lại đột ngột hoặc hỗn loạn vì thiếu kế hoạch.",
      cups: "Do dự rời đi dù đã biết rõ cần thay đổi.",
      swords: "Bắt đầu nhận ra giới hạn chỉ do tự mình đặt ra, tìm được lối thoát.",
      pentacles: "Thiếu tập trung, chất lượng công việc giảm sút vì làm ẩu.",
    },
  },
  {
    number: 9, label: "Chín", keywords: ["gần hoàn tất", "nội lực", "thận trọng"],
    upright: {
      wands: "Mệt mỏi nhưng kiên cường, chỉ còn một chặng cuối trước khi về đích.",
      cups: "Mãn nguyện, ước muốn được thỏa mãn — lá bài của sự hài lòng.",
      swords: "Lo âu, mất ngủ vì suy nghĩ tiêu cực phóng đại hơn thực tế.",
      pentacles: "Thành quả tự lập, tận hưởng sự sung túc do chính mình tạo dựng.",
    },
    reversed: {
      wands: "Kiệt sức, nghi ngờ liệu có nên tiếp tục cố gắng hay không.",
      cups: "Hài lòng hời hợt bên ngoài nhưng trống rỗng bên trong.",
      swords: "Bắt đầu buông bỏ được nỗi lo âu, nhìn nhận vấn đề thực tế hơn.",
      pentacles: "Lo lắng thái quá về tài chính dù nền tảng đã khá vững.",
    },
  },
  {
    number: 10, label: "Mười", keywords: ["hoàn thành", "đỉnh điểm", "chuyển giao"],
    upright: {
      wands: "Gánh nặng trách nhiệm chồng chất ở giai đoạn cuối của một chặng đường dài.",
      cups: "Hạnh phúc trọn vẹn, gia đình hòa thuận — đỉnh cao viên mãn về cảm xúc.",
      swords: "Một kết thúc đau đớn nhưng dứt điểm, chạm đáy để bắt đầu lại từ đầu.",
      pentacles: "Thịnh vượng bền vững, di sản được truyền lại qua nhiều thế hệ.",
    },
    reversed: {
      wands: "Học cách san sẻ gánh nặng thay vì ôm đồm một mình.",
      cups: "Rạn nứt trong gia đình, giá trị bề ngoài che giấu bất ổn bên trong.",
      swords: "Kết thúc bị kéo dài không cần thiết, khó buông bỏ hoàn toàn.",
      pentacles: "Bất ổn tài chính dài hạn, mâu thuẫn về thừa kế/tài sản chung.",
    },
  },
  {
    number: 11, label: "Nhí (Page)", keywords: ["học hỏi", "sứ giả", "khởi sự nhỏ"],
    upright: {
      wands: "Nhiệt huyết tuổi trẻ, tò mò muốn khám phá và thử nghiệm điều mới.",
      cups: "Một tin nhắn tình cảm bất ngờ, trực giác nhạy bén và trái tim rộng mở.",
      swords: "Ham học hỏi, quan sát tinh tường nhưng đôi khi vội vàng phán xét.",
      pentacles: "Cơ hội học tập/tài chính mới, cần sự chăm chỉ để nuôi dưỡng nó lớn lên.",
    },
    reversed: {
      wands: "Thiếu định hướng, nhiệt huyết bốc đồng không có kế hoạch cụ thể.",
      cups: "Cảm xúc bất ổn, tin tức tình cảm gây thất vọng hoặc hiểu lầm.",
      swords: "Tin đồn, lời nói thiếu suy nghĩ hoặc do thám không thiện chí.",
      pentacles: "Trì hoãn học tập, thiếu kỷ luật để hiện thực hóa cơ hội mới.",
    },
  },
  {
    number: 12, label: "Kỵ Sĩ (Knight)", keywords: ["hành động", "theo đuổi", "chuyển động"],
    upright: {
      wands: "Hành động táo bạo, đầy nhiệt huyết theo đuổi mục tiêu không ngại rủi ro.",
      cups: "Lãng mạn, theo đuổi tình cảm bằng sự chân thành và tinh tế.",
      swords: "Hành động nhanh, quyết đoán nhưng cần cẩn trọng kẻo hấp tấp.",
      pentacles: "Kiên trì, đáng tin cậy, làm việc chắc chắn từng bước để đạt mục tiêu dài hạn.",
    },
    reversed: {
      wands: "Hấp tấp, hành động thiếu suy nghĩ dẫn đến thất bại không đáng có.",
      cups: "Ghen tuông hoặc tán tỉnh không chân thành, cảm xúc thất thường.",
      swords: "Nóng vội, tranh luận gay gắt không cần thiết gây tổn thương người khác.",
      pentacles: "Trì trệ, ngại thay đổi dù hoàn cảnh đòi hỏi phải linh hoạt hơn.",
    },
  },
  {
    number: 13, label: "Hoàng Hậu (Queen)", keywords: ["làm chủ nội tâm", "nuôi dưỡng", "trưởng thành"],
    upright: {
      wands: "Tự tin, quyến rũ và độc lập — truyền cảm hứng cho người xung quanh bằng năng lượng ấm áp.",
      cups: "Thấu cảm sâu sắc, trực giác mạnh mẽ, biết cách chăm sóc cả bản thân lẫn người khác.",
      swords: "Sắc sảo, thẳng thắn, ra quyết định dựa trên lý trí đã được tôi luyện qua trải nghiệm.",
      pentacles: "Chu đáo, thực tế, khéo léo cân bằng giữa công việc và chăm sóc tổ ấm.",
    },
    reversed: {
      wands: "Ghen tị, đòi hỏi sự chú ý hoặc mất tự tin vào bản thân.",
      cups: "Cảm xúc bất ổn, quá nhạy cảm hoặc phụ thuộc cảm xúc vào người khác.",
      swords: "Lạnh lùng quá mức hoặc dùng lời nói sắc bén để gây tổn thương.",
      pentacles: "Lo lắng thái quá về vật chất, xao nhãng việc chăm sóc bản thân.",
    },
  },
  {
    number: 14, label: "Vua (King)", keywords: ["làm chủ hoàn toàn", "thể hiện", "quyền uy"],
    upright: {
      wands: "Tầm nhìn lãnh đạo, dám nghĩ dám làm, truyền cảm hứng để người khác cùng hành động.",
      cups: "Điềm tĩnh, khôn ngoan về cảm xúc, làm chủ được lòng mình lẫn các mối quan hệ.",
      swords: "Tư duy sắc bén, công tâm, ra quyết định dựa trên lý lẽ và đạo đức rõ ràng.",
      pentacles: "Thành đạt về vật chất, đáng tin cậy, xây dựng sự nghiệp/tài sản vững chắc.",
    },
    reversed: {
      wands: "Độc đoán, nóng nảy, dùng quyền lực để áp đặt thay vì truyền cảm hứng.",
      cups: "Kìm nén cảm xúc, thao túng tâm lý hoặc lạnh lùng vô cảm.",
      swords: "Lạm dụng trí tuệ để thao túng, khắc nghiệt hoặc độc tài trong tư duy.",
      pentacles: "Tham lam, coi trọng vật chất quá mức, cứng nhắc trong kiểm soát tài chính.",
    },
  },
];

const SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

export const MINOR_ARCANA: TarotCard[] = SUITS.flatMap((suit) =>
  MINOR_TEMPLATES.map((t) => ({
    id: `${suit}-${t.number}`,
    name: `${t.label} ${SUIT_LABEL[suit]}`,
    nameEn: `${t.number <= 10 ? t.number : { 11: "Page", 12: "Knight", 13: "Queen", 14: "King" }[t.number]} of ${suit[0].toUpperCase()}${suit.slice(1)}`,
    arcana: "minor" as const,
    suit,
    number: t.number,
    keywords: [...t.keywords],
    upright: t.upright[suit],
    reversed: t.reversed[suit],
  })),
);

export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export function getCardById(id: string): TarotCard | undefined {
  return TAROT_DECK.find((c) => c.id === id);
}
