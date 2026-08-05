import {
  computeNumerologyProfile,
  computeNumberGrid,
  computeArrows,
  computePinnacles,
  computeChallenges,
  computePersonalCycle,
} from "../lib/numerology";
import { personalInfo } from "./baziProfile";

export const [birthDay, birthMonth, birthYear] = personalInfo.birthDate.split(" ")[0].split("/").map(Number);

export const numerologyProfile = computeNumerologyProfile(personalInfo.name, birthDay, birthMonth, birthYear);
export const numberGrid = computeNumberGrid(birthDay, birthMonth, birthYear);
export const arrows = computeArrows(numberGrid);
export const pinnacles = computePinnacles(birthDay, birthMonth, birthYear);
export const challenges = computeChallenges(birthDay, birthMonth, birthYear);
export const currentPersonalCycle = computePersonalCycle(birthDay, birthMonth, new Date());

export const numerologyMeaning: Record<string, { headline: string; paragraphs: string[] }> = {
  lifePath: {
    headline: "Số Chủ Đạo 4 — Người xây nền bằng sự kiên trì",
    paragraphs: [
      "Số Chủ Đạo (Life Path) là con số quan trọng nhất trong thần số học, mô tả bài học lớn và hướng đi xuyên suốt cuộc đời. Số 4 gắn với nền tảng, trật tự, kỷ luật và tinh thần làm việc bền bỉ — bạn tiến bộ chậm mà chắc, xây dựng mọi thứ trên nền móng vững chắc thay vì đi đường tắt.",
      "Người số 4 thường được tin cậy vì tính thực tế, có tổ chức và trách nhiệm cao; điểm cần lưu tâm là dễ trở nên cứng nhắc, ngại thay đổi hoặc ôm đồm quá nhiều việc vì tâm lý phải tự tay kiểm soát mọi chi tiết.",
    ],
  },
  expression: {
    headline: "Số Sứ Mệnh 4 — Thể hiện ra ngoài bằng sự đáng tin cậy",
    paragraphs: [
      "Số Sứ Mệnh (Expression/Destiny) — suy ra từ toàn bộ họ tên — cho biết tài năng và cách bạn thể hiện bản thân ra thế giới bên ngoài. Trùng với Số Chủ Đạo ở số 4 càng nhấn mạnh thêm bản chất thực tế, có tổ chức: người khác nhìn vào bạn như một điểm tựa đáng tin, luôn hoàn thành việc được giao đúng hẹn.",
      "Tài năng thiên về quản lý quy trình, xây dựng hệ thống, hoặc các công việc đòi hỏi độ chính xác và kiên nhẫn cao.",
    ],
  },
  soulUrge: {
    headline: "Số Linh Hồn 11 (Số Chủ) — Khao khát truyền cảm hứng",
    paragraphs: [
      "Số Linh Hồn (Soul Urge) — suy từ các nguyên âm trong tên — phản ánh động lực sâu bên trong, điều bạn thực sự khao khát dù không luôn thể hiện ra ngoài. Số 11 là một Số Chủ (Master Number): bên dưới vẻ ngoài thực tế của số 4, nội tâm lại khao khát điều gì đó lớn lao hơn — cảm hứng, trực giác, ý nghĩa tinh thần, mong muốn tạo ảnh hưởng tích cực đến người khác.",
      "Số Chủ 11 mang nhiều tiềm năng nhưng cũng đi kèm áp lực nội tâm cao hơn số 2 thường (11 rút gọn) — dễ nhạy cảm, lo âu hoặc tự đặt kỳ vọng quá cao cho chính mình.",
    ],
  },
  personality: {
    headline: "Số Nhân Cách 11 (Số Chủ) — Vẻ ngoài cuốn hút, có phần bí ẩn",
    paragraphs: [
      "Số Nhân Cách (Personality) — suy từ các phụ âm trong tên — là ấn tượng đầu tiên người khác cảm nhận về bạn. Cũng là một Số Chủ 11, vẻ ngoài của bạn toát ra điều gì đó đặc biệt, truyền cảm hứng hoặc hơi khó đoán, khiến người khác chú ý dù chưa hiểu rõ con người thật bên trong.",
      "Việc cả Linh Hồn lẫn Nhân Cách đều là số Chủ 11 là một sự cộng hưởng đáng chú ý — năng lượng trực giác/truyền cảm hứng vừa là động lực nội tâm thật sự, vừa là điều thể hiện khá rõ ra bên ngoài, không bị che giấu nhiều bởi lớp vỏ số 4 thực tế.",
    ],
  },
  birthday: {
    headline: "Số Ngày Sinh 5 — Tài lẻ thích nghi, ham khám phá",
    paragraphs: [
      "Số Ngày Sinh là tài năng bổ trợ, đến từ đúng ngày bạn chào đời (mùng 5). Số 5 mang năng lượng linh hoạt, thích tự do, ham tìm hiểu cái mới — bổ sung một nét động, thích nghi nhanh bên cạnh nền tảng ổn định của Số Chủ Đạo 4, giúp bạn không bị quá cứng nhắc trong cách tiếp cận vấn đề.",
    ],
  },
  maturity: {
    headline: "Số Trưởng Thành 8 — Giai đoạn sau hướng về thành tựu, quyền lực",
    paragraphs: [
      "Số Trưởng Thành (Maturity) — tổng của Số Chủ Đạo và Số Sứ Mệnh — mô tả xu hướng chuyển dịch dần theo thời gian, thường rõ nét hơn từ độ tuổi trung niên trở đi. Số 8 hướng về thành tựu vật chất, năng lực quản lý/lãnh đạo và sự tự tin trong các quyết định lớn — cho thấy nền tảng kiên trì (số 4) của giai đoạn đầu đời sẽ dần kết trái thành thành quả cụ thể, hữu hình hơn khi về sau.",
    ],
  },
  attitude: {
    headline: "Số Thái Độ 1 — Ấn tượng ban đầu: chủ động, độc lập",
    paragraphs: [
      "Số Thái Độ (Attitude) — từ ngày và tháng sinh — là cách bạn tiếp cận thế giới trong những khoảnh khắc đầu tiên, phản xạ tự nhiên trước một tình huống mới. Số 1 cho thấy phản xạ ban đầu là chủ động, độc lập, thích tự mình xử lý vấn đề — đôi khi có thể bị hiểu là hơi cứng đầu hoặc ngại nhờ giúp đỡ.",
    ],
  },
};

export const numerologyIntro =
  "Thần số học Pythagoras quy đổi họ tên (bỏ dấu) và ngày sinh Dương lịch thành các con số mang ý nghĩa biểu tượng. Đây là góc nhìn thứ ba, độc lập với Bát Tự và Chiêm tinh học Tây phương, dùng để đối chiếu chéo và bổ sung chiều sâu cho các nhận định cá nhân.";
