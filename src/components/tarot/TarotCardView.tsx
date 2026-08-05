import type { TarotCard } from "../../data/tarotDeck";
import { getCardImage } from "../../lib/tarotImages";

export function CardBack() {
  return (
    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-[#1a1530] to-[#0b0a18] border border-gold/30 grid place-items-center overflow-hidden">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-25">
        <defs>
          <pattern id="tarot-back-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="#d4af37" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#tarot-back-pattern)" />
      </svg>
      <svg viewBox="0 0 32 32" className="w-10 h-10 relative">
        <circle cx="16" cy="16" r="9" fill="none" stroke="#f1d98b" strokeWidth="1.2" />
        <path d="M20 9a8 8 0 100 14 6.5 6.5 0 010-14z" fill="#f1d98b" opacity="0.85" />
      </svg>
    </div>
  );
}

export function TarotCardView({
  card,
  reversed,
  faceDown,
  size = "md",
}: {
  card?: TarotCard;
  reversed?: boolean;
  faceDown?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "w-32 sm:w-40 aspect-2/3" : size === "sm" ? "w-20 aspect-2/3" : "w-24 sm:w-28 aspect-2/3";
  const img = card ? getCardImage(card.id) : undefined;

  return (
    <div className={`relative ${dim} shrink-0 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] overflow-hidden`}>
      {faceDown || !card ? (
        <CardBack />
      ) : (
        <div
          className={`absolute inset-0 rounded-xl bg-[#f4ecd8] border border-gold/40 transition-transform ${
            reversed ? "rotate-180" : ""
          }`}
        >
          {img ? (
            <img src={img} alt={card.name} className="w-full h-full object-cover rounded-xl" draggable={false} />
          ) : (
            <div className="w-full h-full grid place-items-center text-center px-1">
              <span className="font-display text-xs text-[#151229]">{card.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
