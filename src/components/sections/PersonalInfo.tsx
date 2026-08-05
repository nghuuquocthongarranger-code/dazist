import { personalInfo } from "../../data/baziProfile";
import { ElementGlyph } from "../icons/ElementGlyph";

export function PersonalInfoContent() {
  return (
    <div>
      <dl className="grid sm:grid-cols-3 gap-6 text-left mb-8">
        <div>
          <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Họ tên</dt>
          <dd className="font-display text-xl text-white">{personalInfo.name}</dd>
        </div>
        <div>
          <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Ngày sinh</dt>
          <dd className="font-display text-xl text-white">{personalInfo.birthDate}</dd>
          <dd className="text-gold-soft text-sm mt-0.5">{personalInfo.gender}</dd>
        </div>
        <div>
          <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">
            Ngũ hành bản mệnh (Nạp Âm)
          </dt>
          <dd className="font-display text-xl text-gradient-gold">{personalInfo.napAm}</dd>
        </div>
      </dl>

      <div className="border-t border-white/10 pt-6 flex gap-4 items-start">
        <div className="shrink-0 mt-1 rounded-full glass p-2.5">
          <ElementGlyph element="kim" polarity="am" size={22} />
        </div>
        <div className="text-left">
          <p className="font-display text-lg text-kim mb-2">Bạch Lạp Kim là gì?</p>
          <div className="space-y-3 text-white/65 text-sm leading-relaxed">
            {personalInfo.napAmDesc.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
