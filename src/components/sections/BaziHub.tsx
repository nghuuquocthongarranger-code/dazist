import { useState } from "react";
import { TopicCard } from "../TopicCard";
import { ReadingModal } from "../ReadingModal";
import { PersonalInfoContent } from "./PersonalInfo";
import { FourPillarsContent } from "./FourPillars";
import { ConstitutionContent } from "./Constitution";
import { ElementChartContent } from "./ElementChart";
import { FamilyMarriageContent } from "./FamilyMarriage";
import { HealthWealthCareerContent } from "./HealthWealthCareer";
import { ThanSatContent } from "./ThanSat";
import { DaiVanContent } from "./DaiVan";

const TOPICS = [
  {
    key: "info",
    eyebrow: "I. Hồ sơ",
    title: "Thông tin cá nhân",
    teaser: "Họ tên, ngày sinh và Ngũ Hành bản mệnh (Nạp Âm) của bạn.",
    Content: PersonalInfoContent,
  },
  {
    key: "pillars",
    eyebrow: "I & II. Lá số gốc",
    title: "Tứ Trụ & Thập Thần",
    teaser: "Bốn trụ Năm – Tháng – Ngày – Giờ và tỉ lệ 10 Thập Thần toàn cục.",
    Content: FourPillarsContent,
  },
  {
    key: "constitution",
    eyebrow: "III, IV & V. Cốt lõi lá số",
    title: "Thân Vượng — Dụng Thần — Tự Hình",
    teaser: "Thân Vượng, Dụng/Hỷ/Kỵ Thần và thế Tam Thìn Tự Hình.",
    Content: ConstitutionContent,
  },
  {
    key: "elements",
    eyebrow: "VI. Ngũ Hành",
    title: "Tỉ lệ Ngũ Hành toàn cục",
    teaser: "Tỉ lệ Kim – Mộc – Thủy – Hỏa – Thổ trong lá số.",
    Content: ElementChartContent,
  },
  {
    key: "family",
    eyebrow: "VII & VIII. Lục thân · Lương duyên",
    title: "Gia đình & Hôn nhân",
    teaser: "Vai trò lục thân theo Thập Thần và chủ đề hôn nhân qua cung Phu Thê.",
    Content: FamilyMarriageContent,
  },
  {
    key: "hwc",
    eyebrow: "IX, X & XI. Cơ thể · Tài lộc · Con đường",
    title: "Sức khỏe, Tiền bạc & Sự nghiệp",
    teaser: "Ba mảng đời sống soi theo Ngũ Hành và Thập Thần của lá số.",
    Content: HealthWealthCareerContent,
  },
  {
    key: "thansat",
    eyebrow: "XII. Thần Sát",
    title: "Luận đầy đủ Thần Sát",
    teaser: "Các sao tốt/xấu xuất hiện trong lá số và ý nghĩa của từng sao.",
    Content: ThanSatContent,
  },
  {
    key: "daivan",
    eyebrow: "XIII. Đại Vận",
    title: "Hành trình 10 năm một chặng",
    teaser: "8 chặng Đại Vận trọn đời, chọn xem Lưu Niên (từng năm) bên trong.",
    Content: DaiVanContent,
  },
];

export function BaziHub() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const active = TOPICS.find((t) => t.key === openKey);

  return (
    <section className="pt-4 pb-20 sm:pb-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
