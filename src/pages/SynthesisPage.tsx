import { PageIntro } from "../components/PageIntro";
import { SynthesisHub } from "../components/sections/SynthesisHub";

export function SynthesisPage() {
  return (
    <>
      <PageIntro
        eyebrow="Phần V"
        title="Tổng Hợp Ba Hệ Thống"
        subtitle="Điểm mạnh, điểm yếu và các chủ đề hội tụ giữa Bát Tự, Chiêm tinh học Tây phương & Thần số học."
      />
      <SynthesisHub />
    </>
  );
}
