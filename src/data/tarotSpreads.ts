export interface SpreadPosition {
  label: string;
  meaning: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  cardCount: number;
  description: string;
  bestFor: string;
  positions: SpreadPosition[];
}

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: "single",
    name: "Một lá — Lời khuyên nhanh",
    cardCount: 1,
    description: "Rút một lá duy nhất để có góc nhìn nhanh, rõ ràng cho một câu hỏi cụ thể trong đầu bạn.",
    bestFor: "Phù hợp khi bạn cần một lời khuyên tức thời, không quá phức tạp.",
    positions: [{ label: "Thông điệp", meaning: "Điều bạn cần biết hoặc lưu tâm nhất lúc này." }],
  },
  {
    id: "ppf",
    name: "Ba lá — Quá khứ · Hiện tại · Tương lai",
    cardCount: 3,
    description: "Trải bài kinh điển giúp nhìn rõ mạch chuyện: điều gì đã dẫn đến hiện tại, và xu hướng sắp tới.",
    bestFor: "Phù hợp cho câu hỏi tổng quát về một tình huống đang diễn ra.",
    positions: [
      { label: "Quá khứ", meaning: "Nền tảng hoặc nguyên nhân đã hình thành nên tình huống hiện tại." },
      { label: "Hiện tại", meaning: "Năng lượng, tâm thế hoặc thử thách bạn đang đối mặt ngay lúc này." },
      { label: "Tương lai", meaning: "Xu hướng có thể xảy ra nếu mọi thứ tiếp diễn theo chiều hướng hiện tại." },
    ],
  },
  {
    id: "love",
    name: "Ba lá — Tình yêu",
    cardCount: 3,
    description: "Soi chiếu một mối quan hệ tình cảm từ ba góc nhìn: bạn, đối phương, và bản chất mối quan hệ.",
    bestFor: "Phù hợp khi bạn muốn hiểu rõ hơn về một mối quan hệ hoặc người bạn đang để tâm.",
    positions: [
      { label: "Bạn", meaning: "Tâm thế, cảm xúc và nhu cầu thật sự của bạn trong mối quan hệ này." },
      { label: "Đối phương", meaning: "Tâm thế, cảm xúc hoặc góc nhìn của người kia (theo trực giác của bạn)." },
      { label: "Mối quan hệ", meaning: "Bản chất, động lực hoặc hướng đi chung giữa hai người." },
    ],
  },
  {
    id: "career",
    name: "Năm lá — Sự nghiệp",
    cardCount: 5,
    description: "Phân tích sâu một vấn đề công việc/sự nghiệp qua hiện trạng, thách thức, cơ hội, lời khuyên và kết quả.",
    bestFor: "Phù hợp khi cần quyết định hướng đi sự nghiệp hoặc đánh giá một cơ hội công việc.",
    positions: [
      { label: "Hiện trạng", meaning: "Bối cảnh công việc/sự nghiệp của bạn ngay lúc này." },
      { label: "Thách thức", meaning: "Trở ngại chính đang cản trở hoặc cần vượt qua." },
      { label: "Cơ hội", meaning: "Tiềm năng hoặc hướng đi tích cực đang mở ra." },
      { label: "Lời khuyên", meaning: "Điều lá bài gợi ý bạn nên làm hoặc thay đổi cách tiếp cận." },
      { label: "Kết quả", meaning: "Xu hướng kết quả nếu bạn đi theo con đường hiện tại." },
    ],
  },
  {
    id: "celtic-cross",
    name: "Mười lá — Celtic Cross",
    cardCount: 10,
    description: "Trải bài toàn diện và kinh điển nhất trong Tarot, phân tích sâu mọi khía cạnh của một vấn đề lớn.",
    bestFor: "Phù hợp cho câu hỏi phức tạp, quan trọng, cần cái nhìn đầy đủ nhiều chiều.",
    positions: [
      { label: "1. Hiện tại", meaning: "Trung tâm vấn đề — điều đang thực sự diễn ra." },
      { label: "2. Thử thách", meaning: "Trở ngại trực tiếp đang giao thoa với tình huống của bạn." },
      { label: "3. Nền tảng", meaning: "Gốc rễ, nguyên nhân sâu xa hoặc tiềm thức đằng sau vấn đề." },
      { label: "4. Quá khứ gần", meaning: "Sự kiện hoặc ảnh hưởng vừa qua vẫn còn tác động." },
      { label: "5. Mục tiêu/Ý thức", meaning: "Điều bạn đang hướng tới hoặc ý thức rõ mình muốn." },
      { label: "6. Tương lai gần", meaning: "Điều sắp xảy đến trong thời gian ngắn tới." },
      { label: "7. Bản thân bạn", meaning: "Thái độ, cảm xúc thật sự của bạn về vấn đề này." },
      { label: "8. Ảnh hưởng bên ngoài", meaning: "Người xung quanh hoặc hoàn cảnh môi trường tác động đến bạn." },
      { label: "9. Hy vọng & Nỗi sợ", meaning: "Điều bạn vừa hy vọng vừa lo sợ sẽ xảy ra." },
      { label: "10. Kết quả", meaning: "Xu hướng kết quả cuối cùng nếu mọi thứ tiếp diễn như vậy." },
    ],
  },
];

export function getSpreadById(id: string): TarotSpread | undefined {
  return TAROT_SPREADS.find((s) => s.id === id);
}
