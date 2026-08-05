import { ReadingModal } from "../ReadingModal";
import { WesternNatalChartContent } from "./WesternNatalChart";
import { personality, relationships, careerWealth, health } from "../../data/westernInterpretation";

function ParagraphSection({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export const WESTERN_TOPICS = [
  {
    key: "natal",
    eyebrow: "Bản đồ sao",
    title: "Lá số gốc (Natal Chart)",
    Content: WesternNatalChartContent,
  },
  {
    key: "personality",
    eyebrow: "Tính cách cốt lõi",
    title: personality.headline,
    Content: () => <ParagraphSection paragraphs={personality.paragraphs} />,
  },
  {
    key: "relationships",
    eyebrow: "Tình duyên & Đối tác",
    title: relationships.headline,
    Content: () => <ParagraphSection paragraphs={relationships.paragraphs} />,
  },
  {
    key: "careerWealth",
    eyebrow: "Sự nghiệp & Tài chính",
    title: careerWealth.headline,
    Content: () => <ParagraphSection paragraphs={careerWealth.paragraphs} />,
  },
  {
    key: "health",
    eyebrow: "Sức khỏe",
    title: health.headline,
    Content: () => <ParagraphSection paragraphs={health.paragraphs} />,
  },
];

export function WesternTopicModal({ openKey, onClose }: { openKey: string | null; onClose: () => void }) {
  const active = WESTERN_TOPICS.find((t) => t.key === openKey);
  if (!active) return null;
  return (
    <ReadingModal eyebrow={active.eyebrow} title={active.title} onClose={onClose}>
      <active.Content />
    </ReadingModal>
  );
}
