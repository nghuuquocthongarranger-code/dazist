import { PageIntro } from "../components/PageIntro";
import { SynthesisHub } from "../components/sections/SynthesisHub";

export function SynthesisPage() {
  return (
    <>
      <PageIntro
        eyebrow="Phần VI"
        title="Tổng Hợp Bốn Hệ Thống"
        subtitle="Điểm mạnh, điểm yếu và các chủ đề hội tụ giữa Bát Tự, Chiêm tinh học Tây phương, Thần số học & Tử Vi."
      />
      <SynthesisHub />
    </>
  );
}
