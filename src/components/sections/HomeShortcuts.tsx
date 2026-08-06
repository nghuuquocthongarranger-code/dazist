import { SectionHeading } from "../GlassCard";
import { TopicCard } from "../TopicCard";

const SHORTCUTS = [
  {
    eyebrow: "Phần I",
    title: "Bát Tự — Tứ Trụ Mệnh Lý",
    teaser: "Tứ Trụ, Thập Thần, Dụng/Hỷ/Kỵ Thần, Thần Sát, Đại Vận và trọn bộ luận giải mệnh lý phương Đông.",
    to: "/bat-tu",
  },
  {
    eyebrow: "Phần II",
    title: "Chiêm Tinh Học Tây Phương",
    teaser: "Bản đồ sao (Natal Chart) đầy đủ cùng diễn giải tính cách, tình duyên, sự nghiệp & sức khỏe.",
    to: "/chiem-tinh",
  },
  {
    eyebrow: "Phần III",
    title: "Thần Số Học",
    teaser: "Bảng đồ số Pythagoras, Đường hình thành/trống, Đỉnh cao & Thử thách suy từ họ tên và ngày sinh.",
    to: "/than-so-hoc",
  },
  {
    eyebrow: "Phần IV",
    title: "Tarot — Trải Bài Đa Dạng",
    teaser: "Rút bài trực tuyến theo nhiều kiểu trải, hoặc tra soát ý nghĩa nếu bạn đã bốc bài ngoài đời.",
    to: "/tarot",
  },
  {
    eyebrow: "Phần V",
    title: "Tử Vi Đẩu Số",
    teaser: "Lá số 12 cung, chính tinh, phụ tinh và Vòng Trường Sinh — chạm vào từng cung để xem chi tiết.",
    to: "/tu-vi",
  },
  {
    eyebrow: "Phần VI",
    title: "Tổng Hợp Bốn Hệ Thống",
    teaser: "Điểm mạnh, điểm yếu và các chủ đề hội tụ giữa Bát Tự, Chiêm tinh Tây phương, Thần số học & Tử Vi.",
    to: "/tong-hop",
  },
];

export function HomeShortcuts() {
  return (
    <section className="py-16 sm:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Lối tắt"
          title="Khám phá từng phần"
          subtitle="Mỗi hệ thống có một không gian riêng — cuộn xuống để tra cứu ngày tốt xấu hôm nay."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHORTCUTS.map((s, i) => (
            <TopicCard key={s.to} eyebrow={s.eyebrow} title={s.title} teaser={s.teaser} to={s.to} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
