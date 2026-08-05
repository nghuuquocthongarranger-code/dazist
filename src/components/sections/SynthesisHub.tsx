import { useState } from "react";
import { TopicCard } from "../TopicCard";
import { ReadingModal } from "../ReadingModal";
import { StrengthsWeaknessesContent } from "./StrengthsWeaknesses";
import { SummaryContent } from "./Summary";

const TOPICS = [
  {
    key: "sw",
    eyebrow: "Tổng hợp Bát Tự · Chiêm tinh · Thần số học",
    title: "Điểm mạnh — Điểm yếu",
    teaser: "Gộp chung tín hiệu từ cả 3 hệ thống — Bát Tự, Chiêm tinh Tây phương và Thần số học — đánh dấu rõ nguồn.",
    Content: StrengthsWeaknessesContent,
  },
  {
    key: "summary",
    eyebrow: "XIV. Tổng kết",
    title: "Điểm hội tụ giữa Bát Tự · Chiêm tinh · Thần số học",
    teaser: "Những chủ đề mà cả 3 hệ thống độc lập cùng chỉ ra — tín hiệu đáng tin cậy nhất của lá số.",
    Content: SummaryContent,
  },
];

export function SynthesisHub() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const active = TOPICS.find((t) => t.key === openKey);

  return (
    <section className="pt-4 pb-20 sm:pb-28 px-6">
      <div className="max-w-3xl mx-auto">
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
