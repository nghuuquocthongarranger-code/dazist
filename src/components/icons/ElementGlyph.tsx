import type { ReactElement } from "react";
import type { Element } from "../../lib/elements";
import { ELEMENT_COLOR } from "../../lib/elements";

interface Props {
  element: Element;
  polarity?: "duong" | "am";
  size?: number;
  className?: string;
}

/**
 * Biểu tượng ngũ hành đồng bộ: mỗi hành có 1 hình khối riêng (lá Mộc, ngọn Hỏa,
 * núi Thổ, hạt Kim, sóng Thủy). Dương = khối đặc, Âm = khối viền — để phân biệt
 * 10 Thiên Can trong khi vẫn giữ đồng bộ màu theo hành.
 */
export function ElementGlyph({ element, polarity = "duong", size = 28, className }: Props) {
  const color = ELEMENT_COLOR[element];
  const fill = polarity === "duong" ? color : "none";
  const stroke = color;
  const common = {
    stroke,
    fill,
    strokeWidth: polarity === "duong" ? 1.5 : 2,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  const paths: Record<Element, ReactElement> = {
    moc: (
      <path
        {...common}
        d="M14 25V13.5C14 8 9 5 4 4.5C4.5 10 6.5 16 12.5 18.5M14 17C14 12.5 17.5 9.5 24 9C23 13.5 20 17.5 14 19.5"
      />
    ),
    hoa: (
      <path
        {...common}
        d="M14 25c-5 0-8-3.3-8-7.3 0-3.6 2.6-5.6 3.6-9.4.7 2 1.7 3 2.7 3.3-.5-4 1-8 5.7-10.6-1 4.3 1 6.6 3.3 9.3 2 2.3 3.7 4.6 3.7 7.4 0 4-3 7.3-8 7.3-1.5 0-2.5-1-2.5-2.3 0-1.6 1.4-2.4 2-4-2.6.6-4.6 3-4.6 6.1 0 3.6 3 6.5 6.6 6.5"
      />
    ),
    tho: <path {...common} d="M14 4L25 24H3L14 4Z M14 12L20 24H8L14 12Z" fillRule="evenodd" />,
    kim: (
      <path
        {...common}
        d="M14 3L23.5 8.5V19.5L14 25L4.5 19.5V8.5L14 3Z M14 3V25 M4.5 8.5L23.5 19.5 M23.5 8.5L4.5 19.5"
      />
    ),
    thuy: (
      <path
        {...common}
        d="M6 12C8 10 10 10 12 12C14 14 16 14 18 12C20 10 22 10 24 12 M6 18C8 16 10 16 12 18C14 20 16 20 18 18C20 16 22 16 24 18 M14 3C10 8 6 13 6 17.5C6 22 9.5 25 14 25C18.5 25 22 22 22 17.5C22 13 18 8 14 3Z"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[element]}
    </svg>
  );
}
