import { health, healthGeneral, wealth, career } from "../../data/baziProfile";
import { ELEMENT_COLOR } from "../../lib/elements";
import { ElementGlyph } from "../icons/ElementGlyph";

export function HealthWealthCareerContent() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Sức khỏe</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {health.map((h) => (
            <div key={h.organ} className="rounded-xl bg-black/20 border border-white/5 p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="grid place-items-center rounded-full glass shrink-0 w-9 h-9">
                  <ElementGlyph element={h.element} size={19} />
                </span>
                <p className="font-display text-sm" style={{ color: ELEMENT_COLOR[h.element] }}>
                  {h.organ}
                </p>
              </div>
              <p className="text-white/65 text-sm leading-relaxed text-left">{h.note}</p>
            </div>
          ))}
        </div>
        <p className="text-gold-soft text-sm leading-relaxed text-left rounded-xl bg-black/20 border border-white/5 p-4">
          <span className="uppercase tracking-wider text-xs text-white/40 block mb-1">Khuyến nghị chung</span>
          {healthGeneral}
        </p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Tiền bạc</p>
        <div className="space-y-3">
          <div className="rounded-xl bg-black/20 border border-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Tài tinh trong lá số</p>
            <p className="text-white/70 text-sm leading-relaxed text-left">{wealth.taiTinh}</p>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-hoa mb-2">Rủi ro lớn nhất</p>
            <p className="text-white/70 text-sm leading-relaxed text-left">{wealth.risk}</p>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-moc mb-2">Gợi ý cụ thể</p>
            <p className="text-white/70 text-sm leading-relaxed text-left">{wealth.suggestion}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Sự nghiệp</p>
        <div className="space-y-4 text-white/70 text-sm sm:text-base leading-relaxed text-left">
          {career.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
