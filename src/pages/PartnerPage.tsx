import { PageIntro } from "../components/PageIntro";
import { PartnerCheck } from "../components/sections/PartnerCheck";

export function PartnerPage() {
  return (
    <>
      <PageIntro
        eyebrow="Công cụ"
        title="Xem Bát Tự Đối Tác"
        subtitle="Kiểm tra nhanh mức độ hợp/khắc giữa bạn và một người khác trước khi hợp tác, làm ăn hay gắn bó lâu dài."
      />
      <PartnerCheck />
    </>
  );
}
