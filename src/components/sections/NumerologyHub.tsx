import { useState } from "react";
import { TopicCard } from "../TopicCard";
import { ReadingModal } from "../ReadingModal";
import { NumerologyContent } from "./Numerology";
import { ArrowsContent, PinnaclesChallengesContent, BonusNumbersContent } from "./NumerologyExtras";

const TOPICS = [
  {
    key: "core",
    eyebrow: "7 chỉ số cốt lõi",
    title: "Số Chủ Đạo, Sứ Mệnh, Linh Hồn...",
    teaser: "Các con số nền tảng suy từ họ tên và ngày sinh — bài học lớn, tài năng, động lực nội tâm.",
    Content: NumerologyContent,
  },
  {
    key: "arrows",
    eyebrow: "Bảng đồ số Pythagoras",
    title: "Đường Hình Thành & Đường Trống",
    teaser: "8 \"Đường\" suy từ các chữ số ngày sinh — điểm mạnh bẩm sinh và khía cạnh cần rèn luyện thêm.",
    Content: ArrowsContent,
  },
  {
    key: "cycles",
    eyebrow: "4 giai đoạn cuộc đời",
    title: "Đỉnh Cao & Thử Thách",
    teaser: "Đỉnh (Pinnacle) và Thử thách (Challenge) theo từng mốc tuổi — cơ hội và bài học song hành.",
    Content: PinnaclesChallengesContent,
  },
  {
    key: "bonus",
    eyebrow: "Chỉ số bổ sung",
    title: "Đam Mê Tiềm Ẩn, Cân Bằng & Nghiệp Quả",
    teaser: "Tài năng ẩn giấu, cách lấy lại cân bằng, và các bài học/nợ nghiệp quả (nếu có).",
    Content: BonusNumbersContent,
  },
];

export function NumerologyHub() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const active = TOPICS.find((t) => t.key === openKey);

  return (
    <section className="pb-20 sm:pb-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          {TOPICS.map((t, i) => (
            <TopicCard
              key={t.key}
              eyebrow={t.eyebrow}
              title={t.title}
              teaser={t.teaser}
              delay={i * 0.05}
              onClick={() => setOpenKey(t.key)}
            />
          ))}
        </div>
      </div>

      {active && (
        <ReadingModal eyebrow={active.eyebrow} title={active.title} onClose={() => setOpenKey(null)}>
          <active.Content />
        </ReadingModal>
      )}
    </section>
  );
}
