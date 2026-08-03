interface Props {
  animal: string;
  size?: number;
  color?: string;
  className?: string;
}

const S = 1.6; // độ dày nét chuẩn

/** Bộ icon 12 con giáp — line-art rõ nét, mỗi con có tai/sừng/mõm riêng để dễ nhận diện, tô điểm bằng vài chấm đặc (mắt/mũi) theo màu ngũ hành. */
function ZodiacShape({ animal, color }: { animal: string; color: string }) {
  const stroke = { stroke: color, fill: "none", strokeWidth: S, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const dot = { fill: color, stroke: "none" };

  switch (animal) {
    case "Chuột": // rat
      return (
        <g>
          <circle cx="10.5" cy="10.5" r="3" {...stroke} />
          <circle cx="21.5" cy="10.5" r="3" {...stroke} />
          <circle cx="16" cy="17" r="7" {...stroke} />
          <path d="M23 20c3 .5 5.5 2.5 5.5 5.5-2 .5-4-1-5-3" {...stroke} />
          <circle cx="13.2" cy="15.5" r="0.9" {...dot} />
          <circle cx="18.8" cy="15.5" r="0.9" {...dot} />
          <path d="M15 19.5h2l-1 1.3z" {...dot} />
          <path d="M10 20l-3-1M10 21.5l-3 .5" {...stroke} strokeWidth={1} />
          <path d="M22 20l3-1M22 21.5l3 .5" {...stroke} strokeWidth={1} />
        </g>
      );
    case "Trâu": // ox
      return (
        <g>
          <path d="M8 11c-1.5-1-2-3-1-4.5" {...stroke} />
          <path d="M24 11c1.5-1 2-3 1-4.5" {...stroke} />
          <path d="M9 12c0-3 3-5.5 7-5.5s7 2.5 7 5.5" {...stroke} />
          <path d="M8 12c-1.5 1-2 3-1 5.5 1 2.5 3 3.5 3 3.5" {...stroke} />
          <path d="M24 12c1.5 1 2 3 1 5.5-1 2.5-3 3.5-3 3.5" {...stroke} />
          <rect x="9" y="12" width="14" height="10" rx="5" {...stroke} />
          <circle cx="13" cy="17" r="0.9" {...dot} />
          <circle cx="19" cy="17" r="0.9" {...dot} />
          <ellipse cx="16" cy="20.5" rx="2.4" ry="1.4" {...stroke} />
          <path d="M14.5 20.8h.01M17.5 20.8h.01" {...stroke} />
        </g>
      );
    case "Hổ": // tiger
      return (
        <g>
          <path d="M9 9l2 3M23 9l-2 3" {...stroke} />
          <circle cx="16" cy="17" r="8" {...stroke} />
          <circle cx="12.5" cy="15" r="0.9" {...dot} />
          <circle cx="19.5" cy="15" r="0.9" {...dot} />
          <path d="M15 18.5h2l-1 1.4z" {...dot} />
          <path d="M11 19.5c1.6 1.6 8.4 1.6 10 0" {...stroke} />
          <path d="M10 12.5l2.5 1M22 12.5l-2.5 1M9.5 17l2 .6M22.5 17l-2 .6" {...stroke} strokeWidth={1.1} />
        </g>
      );
    case "Mèo": // cat (Vietnamese zodiac)
      return (
        <g>
          <path d="M9.5 8.5l2 4M22.5 8.5l-2 4" {...stroke} />
          <circle cx="16" cy="17.5" r="7.5" {...stroke} />
          <circle cx="13" cy="16" r="0.9" {...dot} />
          <circle cx="19" cy="16" r="0.9" {...dot} />
          <path d="M15.1 19h1.8l-.9 1.2z" {...dot} />
          <path d="M12 20.5c1.4 1.1 6.6 1.1 8 0" {...stroke} />
          <path d="M9 18l-3-.5M9 19.5l-3 1M23 18l3-.5M23 19.5l3 1" {...stroke} strokeWidth={1} />
        </g>
      );
    case "Rồng": // dragon
      return (
        <g>
          <path d="M7 15c1-4 4-7 8-7s6 2 7 5c1.5-1 3-1 4 .3-1.8.4-2.6 1.4-2.6 2.7" {...stroke} />
          <path d="M9.5 9c-1-1-1-2.4 0-3.4M13 7c-.4-1.3 0-2.4 1-3" {...stroke} />
          <circle cx="21" cy="15" r="5.5" {...stroke} />
          <circle cx="19.5" cy="13.5" r="0.9" {...dot} />
          <path d="M24.5 16c1.4.3 2.4 1.3 2.4 2.6" {...stroke} />
          <path d="M15.5 17c-2.8 1-4.5 3.4-4.5 6" {...stroke} />
        </g>
      );
    case "Rắn": // snake
      return (
        <g>
          <path d="M8 24c3 2 6-1 5-4s-5-3-5-6.5 4-5 7-3.5" {...stroke} />
          <circle cx="20" cy="10.5" r="3.2" {...stroke} />
          <circle cx="19" cy="9.6" r="0.8" {...dot} />
          <path d="M22.6 11l2.4.6" {...stroke} strokeWidth={1.1} />
        </g>
      );
    case "Ngựa": // horse
      return (
        <g>
          <path d="M12 24V14c0-3.5 1.8-6 5-6 2.6 0 4.5 1.6 4.8 4" {...stroke} />
          <path d="M17 8c1.3-1.6 3-2.2 4.5-1.6-.6 1.4-1.8 2-3 2.2" {...stroke} />
          <circle cx="19.5" cy="10.5" r="0.9" {...dot} />
          <path d="M14 12c-1.6-.6-2.6-.4-3.4.6" {...stroke} />
          <path d="M12 24h7" {...stroke} />
        </g>
      );
    case "Dê": // goat
      return (
        <g>
          <path d="M9 9c-2-.5-3.4-2.4-3-4.6 2.2.2 3.6 1.6 4 3.4" {...stroke} />
          <path d="M23 9c2-.5 3.4-2.4 3-4.6-2.2.2-3.6 1.6-4 3.4" {...stroke} />
          <circle cx="16" cy="16.5" r="7" {...stroke} />
          <circle cx="13.2" cy="15" r="0.9" {...dot} />
          <circle cx="18.8" cy="15" r="0.9" {...dot} />
          <path d="M14.5 21c1 1 2.5 1 3 0" {...stroke} />
          <path d="M15.3 21.2l.4 2.3.4-2.3" {...stroke} />
        </g>
      );
    case "Khỉ": // monkey
      return (
        <g>
          <circle cx="9.5" cy="13" r="3" {...stroke} />
          <circle cx="22.5" cy="13" r="3" {...stroke} />
          <circle cx="16" cy="17" r="7.5" {...stroke} />
          <path d="M12 18.5c1.3 1.4 6.7 1.4 8 0" {...stroke} />
          <circle cx="13" cy="15" r="0.9" {...dot} />
          <circle cx="19" cy="15" r="0.9" {...dot} />
          <ellipse cx="16" cy="19" rx="2.6" ry="2" {...stroke} />
        </g>
      );
    case "Gà": // rooster
      return (
        <g>
          <path d="M12 9c-.5-2.4 1-4.4 3-4.6-.4 1.6 0 2.8 1 3.6-1 .3-2.6 1-4 1" {...stroke} />
          <path d="M15.5 8.4c1.4-.2 2.6.3 3 1.6-1.2.3-2.2 0-3-1" {...stroke} />
          <circle cx="16.5" cy="15" r="6.5" {...stroke} />
          <circle cx="14.5" cy="13.5" r="0.9" {...dot} />
          <path d="M22.5 15l3.5 1.2-3.5 1.5z" {...dot} />
          <path d="M14 19c1 2.4 1.8 4 1 5.5" {...stroke} />
        </g>
      );
    case "Chó": // dog
      return (
        <g>
          <path d="M10 9c-2 .3-3.4 2-3.4 4.2 0 1.6.8 2.6 2 3" {...stroke} />
          <path d="M22 9c2 .3 3.4 2 3.4 4.2 0 1.6-.8 2.6-2 3" {...stroke} />
          <circle cx="16" cy="17" r="7.5" {...stroke} />
          <circle cx="13.2" cy="15.5" r="0.9" {...dot} />
          <circle cx="18.8" cy="15.5" r="0.9" {...dot} />
          <ellipse cx="16" cy="19.5" rx="2.2" ry="1.6" {...dot} />
          <path d="M12 22c2.6 1.4 5.4 1.4 8 0" {...stroke} />
        </g>
      );
    case "Lợn": // pig
      return (
        <g>
          <circle cx="10" cy="12.5" r="2.6" {...stroke} />
          <circle cx="22" cy="12.5" r="2.6" {...stroke} />
          <circle cx="16" cy="17.5" r="7.5" {...stroke} />
          <circle cx="13.2" cy="15.5" r="0.9" {...dot} />
          <circle cx="18.8" cy="15.5" r="0.9" {...dot} />
          <ellipse cx="16" cy="20" rx="3.2" ry="2.2" {...stroke} />
          <circle cx="14.7" cy="20" r="0.6" {...dot} />
          <circle cx="17.3" cy="20" r="0.6" {...dot} />
        </g>
      );
    default:
      return <circle cx="16" cy="16" r="7" {...stroke} />;
  }
}

export function ZodiacGlyph({ animal, size = 24, color = "currentColor", className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <ZodiacShape animal={animal} color={color} />
    </svg>
  );
}
