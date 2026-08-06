import { combinedSummaryIntro, convergentThemes } from "../../data/combinedSummary";

export function SummaryContent() {
  return (
    <div>
      <p className="text-white/60 text-sm mb-6">{combinedSummaryIntro}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {convergentThemes.map((t) => (
          <div key={t.title} className="rounded-xl bg-black/20 border border-gold/20 p-4 sm:p-5">
            <p className="font-display text-base text-gradient-gold font-semibold mb-3">{t.title}</p>
            {t.bazi && (
              <p className="text-xs text-white/45 mb-1.5">
                <span className="text-gold-soft">Bát Tự:</span> {t.bazi}
              </p>
            )}
            {t.western && (
              <p className="text-xs text-white/45 mb-1.5">
                <span className="text-thuy">Chiêm tinh:</span> {t.western}
              </p>
            )}
            {t.numerology && (
              <p className="text-xs text-white/45 mb-1.5">
                <span className="text-gold-soft">Thần số học:</span> {t.numerology}
              </p>
            )}
            {t.tuVi && (
              <p className="text-xs text-white/45 mb-3">
                <span className="text-hoa">Tử Vi:</span> {t.tuVi}
              </p>
            )}
            <p className="text-white/75 text-sm leading-relaxed text-left">{t.synthesis}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-white/50 text-sm mt-8 leading-relaxed">
        Khi nhiều hệ thống độc lập — Bát Tự và Tử Vi (Can Chi phương Đông, hai lối tính khác nhau), Chiêm tinh học
        (phương Tây) và Thần số học (toán học biểu tượng) — cùng chỉ về một chủ đề, đó là tín hiệu đáng cân nhắc
        nghiêm túc hơn so với khi chỉ một hệ thống đơn lẻ nêu ra.
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/10 text-center">
      <p className="font-display text-gradient-gold text-lg mb-1">DaZiST</p>
      <p className="text-white/35 text-xs">
        Tổng hợp Bát Tự, Chiêm tinh học Tây phương và Tarot — nội dung mang tính tham khảo văn hóa - chiêm tinh, không
        thay thế lời khuyên chuyên môn.
      </p>
    </footer>
  );
}
