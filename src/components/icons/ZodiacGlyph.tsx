interface Props {
  animal: string;
  size?: number;
  color?: string;
  className?: string;
}

/** Icon tối giản dạng nét vẽ (line-art) cho 12 con giáp Địa Chi — phong cách chòm sao, đồng bộ độ dày nét. */
const ZODIAC_PATHS: Record<string, string> = {
  Chuột:
    "M8 20c0-4 2.5-7 6-7s6 3 6 7c0 2-1.5 3.5-3 3.5h-6c-1.5 0-3-1.5-3-3.5Z M9 13l-3-4 M19 13l3-4 M11 17.2h.01 M17 17.2h.01 M14 20.5l3 2.5",
  Trâu:
    "M7 12c0-3 3-5 7-5s7 2 7 5c0 3-1 6-1 8-1 1-2 1-3 1s-1-2-3-2-2 2-3 2-2 0-3-1c0-2-1-5-1-8Z M6 9l-2-3 M22 9l2-3 M12 15h.01 M16 15h.01",
  Hổ: "M14 5c-5 0-8 3.5-8 8 0 5 3.5 8.5 8 8.5s8-3.5 8-8.5c0-4.5-3-8-8-8Z M9 7l-1.5-3 M19 7l1.5-3 M11.5 14.5h.01 M16.5 14.5h.01 M11 18c1 1.2 4 1.2 5 0 M9 12l3 1 M19 12l-3 1",
  Mèo: "M14 6c-4.5 0-7.5 3.5-7.5 8s3 8.5 7.5 8.5 7.5-4 7.5-8.5S18.5 6 14 6Z M9.5 8l-2-4 M18.5 8l2-4 M11.5 15h.01 M16.5 15h.01 M12 18.5c1.3 1 2.7 1 4 0 M9 12h2 M19 12h-2",
  Thìn:
    "M6 18c1-6 4-11 8-11s7 5 8 11c-1.5-1-3-1.5-4.5-1-1 .4-1.5 1.5-2.5 1.5s-1.5-1.1-2.5-1.5c-1.5-.5-3 0-4.5 1Z M14 7V4 M11 6l-1.5-2 M17 6l1.5-2 M12 16h.01 M16 16h.01",
  Tỵ: "M6 14c3-4 6-6 8-6 4 0 8 3 8 7 0 3-2.5 5.5-6 5.5-2.5 0-4-1.5-4-3 0-1.2 1-2 2-2s1.8.8 1.8 1.8 M10.5 12.2h.01",
  Ngọ: "M9 22V13c0-4 2-7 5-7s5 3 5 7v9 M9 13l-3-2 M19 13l3-2 M11.5 11h.01 M16.5 11h.01 M9 22h10",
  Mùi: "M14 8c-4 0-7 4-7 8.5 0 4 2.5 6.5 7 6.5s7-2.5 7-6.5C21 12 18 8 14 8Z M8 9l-3-2.5 M20 9l3-2.5 M11.5 16h.01 M16.5 16h.01 M11.5 19.5c1.5 1 3.5 1 5 0",
  Thân:
    "M14 6c-4.5 0-7.5 3.5-7.5 8s3 8.5 7.5 8.5 7.5-4 7.5-8.5S18.5 6 14 6Z M10 8l-2-3 M18 8l2-3 M11.5 15h.01 M16.5 15h.01 M11.5 18.5c1.3 1.2 3.7 1.2 5 0 M9.5 12.5l2 .8 M18.5 12.5l-2 .8",
  Dậu: "M14 6c-4 0-6.5 3-6.5 6.5 0 2 1 3.5 1 5.5 0 2.5 2 4 5.5 4s5.5-1.5 5.5-4c0-2 1-3.5 1-5.5C20.5 9 18 6 14 6Z M10 8l-2-3 M18 8l2-3 M11.5 12h.01 M16.5 12h.01 M12 15.5c1.3 1 2.7 1 4 0 M14 4v2",
  Tuất:
    "M8 21v-7c0-4 2.5-7 6-7s6 3 6 7v7 M8 21h12 M8 13l-3-3 M20 13l3-3 M11.5 12h.01 M16.5 12h.01 M12 17c.7.6 3.3.6 4 0",
  Lợn: "M14 8c-4.5 0-7.5 3.3-7.5 7.5S9.5 23 14 23s7.5-3.3 7.5-7.5S18.5 8 14 8Z M10 9l-2-3 M18 9l2-3 M11 15.8h.01 M17 15.8h.01 M12 18.5h4v2h-4z",
};

export function ZodiacGlyph({ animal, size = 24, color = "currentColor", className }: Props) {
  const d = ZODIAC_PATHS[animal];
  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        stroke={color}
        fill="none"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
