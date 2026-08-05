import { personality, relationships, careerWealth, health } from "../../data/westernInterpretation";

export function WesternInterpretationContent() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Tính cách cốt lõi</p>
        <p className="font-display text-gold-soft text-base mb-3">{personality.headline}</p>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {personality.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Tình duyên & Đối tác</p>
        <p className="font-display text-gold-soft text-base mb-3">{relationships.headline}</p>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {relationships.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Sự nghiệp & Tài chính</p>
        <p className="font-display text-gold-soft text-base mb-3">{careerWealth.headline}</p>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {careerWealth.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Sức khỏe</p>
        <p className="font-display text-gold-soft text-base mb-3">{health.headline}</p>
        <div className="space-y-3 text-white/70 text-sm leading-relaxed text-left">
          {health.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
