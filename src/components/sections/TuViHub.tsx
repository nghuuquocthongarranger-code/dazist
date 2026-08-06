import { useState } from "react";
import { TopicCard } from "../TopicCard";
import { ReadingModal } from "../ReadingModal";
import { tuViInfo, tuViPalaces, TRUONG_SINH_TONE, type TruongSinhStage } from "../../data/tuViProfile";
import { getLuuNienPalace, getTuViYearPercent } from "../../lib/tuViScore";
import { tierFromPercent } from "../../lib/canChi";

const TRUONG_SINH_ORDER: TruongSinhStage[] = [
  "Trường Sinh",
  "Mộc Dục",
  "Quan Đới",
  "Lâm Quan",
  "Đế Vượng",
  "Suy",
  "Bệnh",
  "Tử",
  "Mộ",
  "Tuyệt",
  "Thai",
  "Dưỡng",
];

const TRUONG_SINH_MEANING: Record<TruongSinhStage, string> = {
  "Trường Sinh": "Khởi sinh — mầm mống mới, sức sống bắt đầu, thường ứng việc khởi sự thuận lợi.",
  "Mộc Dục": "Tắm gội — giai đoạn non nớt, dễ xao động, cần thời gian rèn giũa.",
  "Quan Đới": "Trưởng thành, bắt đầu vào đời — năng lực được công nhận, có vị trí bước đầu.",
  "Lâm Quan": "Sung mãn, cận kề đỉnh cao — chủ động, có thực lực, sắp gặt hái.",
  "Đế Vượng": "Đỉnh cao — vượng khí cực thịnh, thành tựu rõ rệt nhất trong vòng đời cung đó.",
  Suy: "Bắt đầu thoái trào — vẫn còn dư lực nhưng cần thu bớt, tránh mở rộng quá đà.",
  Bệnh: "Suy yếu — dễ trục trặc, nên phòng bị hơn tấn công.",
  Tử: "Điểm chững lại — mọi việc có xu hướng dừng, cần tĩnh tâm nhìn lại.",
  Mộ: "Tàng ẩn, tích luỹ ngầm — bề ngoài lặng nhưng bên trong đang chuẩn bị cho chu kỳ mới.",
  Tuyệt: "Đáy của chu kỳ — buông bỏ cái cũ hoàn toàn để mở đường cho khởi đầu kế tiếp.",
  Thai: "Thai nghén — ý tưởng/mầm mống mới hình thành nhưng chưa lộ diện.",
  Dưỡng: "Nuôi dưỡng — tích luỹ âm thầm, chuẩn bị nền tảng trước khi bước vào Trường Sinh.",
};

function HoSoContent() {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Đương số</p>
          <p className="font-display text-gold-soft">{tuViInfo.name}</p>
          <p className="text-white/50 text-sm">{tuViInfo.gender}</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Ngày sinh (Âm lịch)</p>
          <p className="text-white/70 text-sm">{tuViInfo.birthLunar}</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Cục số</p>
          <p className="font-display text-gold-soft">{tuViInfo.cuc}</p>
          <p className="text-white/50 text-xs mt-1">Quyết định tốc độ an Đại Vận và nhịp độ cuộc đời.</p>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Mệnh chủ</p>
          <p className="font-display text-gold-soft">{tuViInfo.menhChu}</p>
        </div>
      </div>
      <p className="text-white/40 text-xs italic">An theo {tuViInfo.source}.</p>
    </div>
  );
}

function TruongSinhContent() {
  return (
    <div className="space-y-3">
      <p className="text-white/60 text-sm leading-relaxed mb-2">
        Vòng Trường Sinh gồm 12 trạng thái vận động của khí, an theo từng cung dựa trên Cục số — mô tả "sức sống"
        của cung đó đang ở giai đoạn nào trong một chu kỳ sinh–vượng–suy–tuyệt.
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {TRUONG_SINH_ORDER.map((stage) => {
          const tone = TRUONG_SINH_TONE[stage];
          const palace = tuViPalaces.find((p) => p.truongSinh === stage);
          return (
            <div
              key={stage}
              className={`rounded-xl p-3 border ${
                tone === "tot" ? "border-moc/30 bg-moc/5" : tone === "xau" ? "border-hoa/25 bg-hoa/5" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-display text-sm text-gradient-gold font-semibold">{stage}</p>
                {palace && <span className="text-[10px] text-white/35">Cung {palace.cungName}</span>}
              </div>
              <p className="text-white/60 text-xs leading-relaxed">{TRUONG_SINH_MEANING[stage]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PalaceMiniCard({ cungName }: { cungName: string }) {
  const p = tuViPalaces.find((x) => x.cungName === cungName)!;
  return (
    <div className="rounded-xl bg-black/20 border border-white/5 p-3">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-xs uppercase tracking-wider text-gold/70">{p.cungName}</p>
        <span className="text-[10px] text-white/35">{p.chi}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {p.mainStars.length > 0 ? (
          p.mainStars.map((s) => (
            <span key={s.name} className="text-[11px] rounded-full bg-gold/10 border border-gold/25 text-gold-soft px-2 py-0.5">
              {s.name}
              {s.state ? ` (${s.state})` : ""}
            </span>
          ))
        ) : (
          <span className="text-[11px] rounded-full bg-white/5 border border-white/10 text-white/40 px-2 py-0.5">Vô chính diệu</span>
        )}
      </div>
    </div>
  );
}

function TamPhuongTuChinhContent() {
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        "Tam Phương Tứ Chính" là bộ 4 cung tam hợp + đối cung với Mệnh — Mệnh, Quan Lộc, Tài Bạch (tam hợp) và Thiên
        Di (đối cung) — nhìn chung cả 4 cho bức tranh tổng thể nhất về vận mệnh, sự nghiệp và tài lộc cả đời.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <PalaceMiniCard cungName="Mệnh" />
        <PalaceMiniCard cungName="Quan Lộc" />
        <PalaceMiniCard cungName="Tài Bạch" />
        <PalaceMiniCard cungName="Thiên Di" />
      </div>
      <p className="text-white/75 text-sm leading-relaxed">
        Mệnh Đồng Cự hãm cho nội tâm sâu, khởi đầu chật vật, phải tự thân vận động; nhưng Quan Lộc có Thiên Cơ vượng
        (trí tuệ, mưu tính linh hoạt) và Tài Bạch có Lộc Tồn (tài lộc ổn định dài hạn) — hai cung tam hợp bù đắp rất
        tốt cho điểm yếu của Mệnh: sự nghiệp và tiền bạc là nơi phát huy thế mạnh thực sự, kéo vận trình đi lên dù
        khởi đầu không dễ. Thiên Di vô chính diệu, mượn tính từ Mệnh khi đối chiếu, nên việc ra ngoài/đi xa không có
        màu sắc riêng nổi bật mà phản chiếu đúng tinh thần của bản Mệnh lúc đó.
      </p>
    </div>
  );
}

function LucThanContent() {
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        Tổng hợp 4 cung liên quan người thân: Phụ Mẫu (cha mẹ), Huynh Đệ (anh chị em), Phu Thê (bạn đời), Tử Tức
        (con cái).
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <PalaceMiniCard cungName="Phụ Mẫu" />
        <PalaceMiniCard cungName="Huynh Đệ" />
        <PalaceMiniCard cungName="Phu Thê" />
        <PalaceMiniCard cungName="Tử Tức" />
      </div>
      <p className="text-white/75 text-sm leading-relaxed">
        Phụ Mẫu và Tử Tức đều miếu vượng (Vũ Tướng, Liêm Phủ) — quan hệ với cha mẹ và con cái là điểm tựa vững chắc,
        cả hai chiều trên dưới đều thuận. Huynh Đệ (Tham Lang hãm) là điểm cần lưu ý nhất trong nhóm lục thân — anh
        chị em dễ mỗi người một hướng, cần chủ động vun đắp mới gắn kết. Phu Thê được Thái Âm miếu — hôn nhân là
        mảng đời sống nhẹ nhàng, được nâng đỡ nhất trong 4 cung này.
      </p>
    </div>
  );
}

function SucKhoeTaiLocContent() {
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm leading-relaxed">
        Tổng hợp 3 cung Quan Lộc (sự nghiệp), Tài Bạch (tiền bạc), Tật Ách (sức khoẻ).
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <PalaceMiniCard cungName="Quan Lộc" />
        <PalaceMiniCard cungName="Tài Bạch" />
        <PalaceMiniCard cungName="Tật Ách" />
      </div>
      <p className="text-white/75 text-sm leading-relaxed">
        Sự nghiệp (Thiên Cơ vượng) và tài lộc (Lộc Tồn) là hai điểm mạnh rõ rệt nhất của lá số — hợp các công việc
        cần tư duy linh hoạt, mưu tính, với nguồn thu ổn định dài hạn. Ngược lại Tật Ách có Phá Quân hãm — sức khoẻ
        là mặt cần chủ động chăm sóc nhất trong ba mảng này, đặc biệt tránh làm việc quá sức khi sự nghiệp đang
        thuận lợi, giữ nhịp độ điều hoà thay vì dồn hết năng lượng vào công việc.
      </p>
    </div>
  );
}

const TIER_TEXT: Record<string, string> = {
  "rat-tot": "text-gold-soft",
  tot: "text-moc",
  "binh-thuong": "text-white/70",
  xau: "text-tho",
  "rat-xau": "text-hoa",
};

function VanTrinhContent() {
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => thisYear - 1 + i);

  return (
    <div className="space-y-3">
      <p className="text-white/60 text-sm leading-relaxed mb-2">
        Mỗi năm dương lịch ứng với 1 cung theo Chi của năm đó (cung Lưu Niên) — điểm tốt/xấu suy từ trạng thái Vòng
        Trường Sinh, chính tinh và Triệt/Tuần của cung năm đó. Đủ 1 vòng 12 năm sẽ lặp lại qua đúng 12 cung.
      </p>
      <div className="space-y-1.5">
        {years.map((year) => {
          const palace = getLuuNienPalace(year);
          const percent = getTuViYearPercent(year);
          const tier = tierFromPercent(percent);
          if (!palace) return null;
          return (
            <div
              key={year}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border ${
                year === thisYear ? "border-gold/50 bg-gold/10" : "border-white/5 bg-black/20"
              }`}
            >
              <span className="text-sm text-white/60 w-14 shrink-0">{year}</span>
              <span className="text-xs text-white/40 w-28 shrink-0">
                {palace.chi} · {palace.cungName}
              </span>
              <span className={`font-display text-sm font-semibold ml-auto ${TIER_TEXT[tier.tier]}`}>{tier.label}</span>
              <span className="text-xs text-white/35 w-10 text-right shrink-0">{percent}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TOPICS = [
  {
    key: "hoso",
    eyebrow: "Hồ sơ",
    title: "Mệnh chủ & Cục số",
    teaser: "Cục, Mệnh chủ và ngày sinh Âm lịch của lá số.",
    Content: HoSoContent,
  },
  {
    key: "vantrinh",
    eyebrow: "Vận Trình Theo Năm",
    title: "Năm nào tốt, năm nào xấu?",
    teaser: "12 năm liên tiếp, mỗi năm ứng 1 cung Lưu Niên — xem trước xu hướng tốt/xấu theo từng năm.",
    Content: VanTrinhContent,
  },
  {
    key: "tamphuong",
    eyebrow: "Tam Phương Tứ Chính",
    title: "Mệnh — Quan — Tài — Di",
    teaser: "4 cung trọng yếu nhất, cho bức tranh tổng thể về vận mệnh cả đời.",
    Content: TamPhuongTuChinhContent,
  },
  {
    key: "lucthanh",
    eyebrow: "Lục Thân",
    title: "Cha mẹ — Anh chị em — Vợ chồng — Con cái",
    teaser: "4 cung người thân nhìn chung để thấy các mối quan hệ gia đình.",
    Content: LucThanContent,
  },
  {
    key: "suckhoe",
    eyebrow: "Sự nghiệp · Tài lộc · Sức khoẻ",
    title: "Quan Lộc — Tài Bạch — Tật Ách",
    teaser: "3 mảng đời sống thiết thực nhất soi theo lá số Tử Vi.",
    Content: SucKhoeTaiLocContent,
  },
  {
    key: "truongsinh",
    eyebrow: "Vòng Trường Sinh",
    title: "12 trạng thái của khí",
    teaser: "Trường Sinh → Đế Vượng → Suy → Tuyệt — ý nghĩa từng giai đoạn và cung nào đang ở đó.",
    Content: TruongSinhContent,
  },
];

export function TuViHub() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const active = TOPICS.find((t) => t.key === openKey);

  return (
    <section className="pb-20 sm:pb-28 px-6">
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
