import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tuViPalaces, tuViInfo, TRUONG_SINH_TONE, type TuViPalace } from "../../data/tuViProfile";
import { STAR_MEANINGS } from "../../data/tuViStarMeanings";
import { ReadingModal } from "../ReadingModal";

/** Popup nhỏ gọn giải thích 1 sao — nổi TRÊN modal cung (không dùng ReadingModal đầy đủ để tránh 2 khung to đè lên nhau). */
function StarPopup({ name, onClose }: { name: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.2 }}
          className="glass glass-gold-edge relative rounded-2xl max-w-xs w-full p-5"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 min-w-[36px] min-h-[36px] grid place-items-center rounded-full border border-white/15 text-white/60 hover:text-gold-soft hover:border-gold/50 transition"
          >
            ✕
          </button>
          <p className="uppercase tracking-[0.2em] text-[10px] text-gold mb-1.5">Ý nghĩa sao</p>
          <h4 className="font-display text-lg text-gradient-gold font-semibold mb-2">{name}</h4>
          <p className="text-white/75 text-sm leading-relaxed">{STAR_MEANINGS[name] ?? "Chưa có mô tả cho sao này."}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Bố cục 12 cung theo đúng vị trí trên lá số gốc (khối giữa 2x2 là bảng thông tin mệnh chủ).
const GRID_AREAS = `
  "ty ngo mui than"
  "thin ctr ctr dau"
  "mao ctr ctr tuat"
  "dan suu ty2 hoi"
`;

const CHI_TO_AREA: Record<string, string> = {
  Tỵ: "ty",
  Ngọ: "ngo",
  Mùi: "mui",
  Thân: "than",
  Thìn: "thin",
  Dậu: "dau",
  Mão: "mao",
  Tuất: "tuat",
  Dần: "dan",
  Sửu: "suu",
  Tý: "ty2",
  Hợi: "hoi",
};

const TONE_STYLE: Record<"tot" | "trung-binh" | "xau", string> = {
  tot: "border-moc/35 hover:border-moc/60",
  "trung-binh": "border-white/15 hover:border-gold/40",
  xau: "border-hoa/30 hover:border-hoa/55",
};

function PalaceCell({ palace, current, onOpen }: { palace: TuViPalace; current: boolean; onOpen: () => void }) {
  const tone = TRUONG_SINH_TONE[palace.truongSinh];
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ gridArea: CHI_TO_AREA[palace.chi] }}
      className={`glass rounded-xl border p-2 sm:p-3 text-left flex flex-col gap-1 transition hover:brightness-110 min-h-[92px] sm:min-h-[110px] ${TONE_STYLE[tone]} ${
        current ? "ring-2 ring-gold shadow-[0_0_24px_-6px_#d4af37aa]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[9px] sm:text-[10px] text-white/40">
          {palace.chi} [{palace.ageRange[0]}-{palace.ageRange[1]}]
        </span>
        {palace.trietTuan && (
          <span className="text-[9px] rounded-full border border-hoa/40 text-hoa px-1.5 leading-tight shrink-0">
            {palace.trietTuan}
          </span>
        )}
      </div>
      <p className="font-display text-xs sm:text-sm text-gradient-gold font-semibold leading-tight">
        {palace.cungName}
        {palace.isThan && <span className="text-gold-soft"> · Thân</span>}
      </p>
      <div className="flex flex-wrap gap-1 mt-auto">
        {palace.mainStars.length > 0 ? (
          palace.mainStars.map((s) => (
            <span key={s.name} className="text-[9px] sm:text-[10px] rounded-full bg-gold/10 border border-gold/25 text-gold-soft px-1.5 py-0.5">
              {s.name}
              {s.state ? ` (${s.state})` : ""}
            </span>
          ))
        ) : (
          <span className="text-[9px] sm:text-[10px] rounded-full bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5">
            Vô chính diệu
          </span>
        )}
      </div>
    </button>
  );
}

function PalaceDetail({ palace, onStarClick }: { palace: TuViPalace; onStarClick: (name: string) => void }) {
  const tone = TRUONG_SINH_TONE[palace.truongSinh];
  const toneLabel = tone === "tot" ? "Tốt" : tone === "xau" ? "Cần lưu ý" : "Trung bình";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/40">
          {palace.chi} · Đại Vận {palace.ageRange[0]}–{palace.ageRange[1]} tuổi
        </span>
        {palace.trietTuan && (
          <span className="text-xs rounded-full border border-hoa/40 text-hoa px-2.5 py-1">{palace.trietTuan}</span>
        )}
        <span
          className={`text-xs rounded-full border px-2.5 py-1 ${
            tone === "tot" ? "border-moc/40 text-moc" : tone === "xau" ? "border-hoa/40 text-hoa" : "border-white/20 text-white/60"
          }`}
        >
          {palace.truongSinh} · {toneLabel}
        </span>
      </div>

      <p className="text-white/40 text-xs italic">Chạm vào tên sao để xem ý nghĩa.</p>

      <div>
        <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Chính tinh</p>
        <div className="flex flex-wrap gap-2">
          {palace.mainStars.length > 0 ? (
            palace.mainStars.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => onStarClick(s.name)}
                className="rounded-full bg-gold/10 border border-gold/30 text-gold-soft px-3 py-1.5 text-sm hover:border-gold/60 hover:bg-gold/20 transition"
              >
                {s.name} {s.state && <span className="text-white/50">({s.state})</span>}
              </button>
            ))
          ) : (
            <span className="text-white/50 text-sm italic">Vô chính diệu — mượn sao cung xung chiếu để luận.</span>
          )}
        </div>
      </div>

      {palace.auxStars.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Phụ tinh</p>
          <div className="flex flex-wrap gap-1.5">
            {palace.auxStars.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStarClick(s)}
                className="rounded-full bg-white/5 border border-white/10 text-white/55 px-2.5 py-1 text-xs hover:border-gold/40 hover:text-gold-soft transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {palace.luuStars.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Lưu tinh (niên hạn {tuViInfo.luuNienYear})</p>
          <div className="flex flex-wrap gap-1.5">
            {palace.luuStars.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStarClick(s)}
                className="rounded-full bg-black/20 border border-white/10 text-white/45 px-2.5 py-1 text-xs hover:border-gold/40 hover:text-gold-soft transition"
              >
                L.{s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-white/75 text-sm leading-relaxed">{palace.summary}</p>
    </div>
  );
}

const CURRENT_AGE = new Date().getFullYear() - tuViInfo.birthYear;

export function TuViChart() {
  const [openChi, setOpenChi] = useState<string | null>(null);
  const [openStar, setOpenStar] = useState<string | null>(null);
  const active = tuViPalaces.find((p) => p.chi === openChi);

  return (
    <section className="pt-4 pb-10 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-2 sm:gap-3"
          style={{ gridTemplateAreas: GRID_AREAS, gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)" }}
        >
          {tuViPalaces.map((p) => (
            <PalaceCell
              key={p.chi}
              palace={p}
              current={CURRENT_AGE >= p.ageRange[0] && CURRENT_AGE <= p.ageRange[1]}
              onOpen={() => setOpenChi(p.chi)}
            />
          ))}
          <div
            style={{ gridArea: "ctr" }}
            className="glass glass-gold-edge rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-1"
          >
            <p className="text-[10px] uppercase tracking-wider text-gold">{tuViInfo.gender}</p>
            <p className="font-display text-sm sm:text-base text-gradient-gold font-semibold">{tuViInfo.name}</p>
            <p className="text-[10px] text-white/45">{tuViInfo.birthLunar}</p>
            <p className="text-[10px] text-gold-soft mt-1">{tuViInfo.cuc}</p>
            <p className="text-[10px] text-white/45">Mệnh: {tuViInfo.menhChu}</p>
          </div>
        </motion.div>
        <p className="text-center text-white/40 text-xs mt-4">
          Chạm vào một cung để xem chi tiết sao và luận giải · Viền vàng = Đại Vận hiện tại
        </p>
      </div>

      {active && (
        <ReadingModal
          eyebrow={`${active.chi} · ${active.ageRange[0]}–${active.ageRange[1]} tuổi`}
          title={active.cungName}
          onClose={() => setOpenChi(null)}
        >
          <PalaceDetail palace={active} onStarClick={setOpenStar} />
        </ReadingModal>
      )}

      {openStar && <StarPopup name={openStar} onClose={() => setOpenStar(null)} />}
    </section>
  );
}
