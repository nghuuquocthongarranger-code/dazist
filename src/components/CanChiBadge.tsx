import { CAN, CHI } from "../lib/canChi";
import { ELEMENT_COLOR } from "../lib/elements";
import { ElementGlyph } from "./icons/ElementGlyph";
import { ZodiacGlyph } from "./icons/ZodiacGlyph";

export function CanBadge({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const info = CAN.find((c) => c.name === name);
  if (!info) return <span>{name}</span>;
  const px = size === "lg" ? 56 : size === "sm" ? 30 : 40;
  const glyphSize = size === "lg" ? 30 : size === "sm" ? 16 : 22;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid place-items-center rounded-full glass shrink-0"
        style={{
          width: px,
          height: px,
          boxShadow: `0 0 18px -4px ${ELEMENT_COLOR[info.element]}66`,
        }}
      >
        <ElementGlyph element={info.element} polarity={info.polarity} size={glyphSize} />
      </span>
      <span className="font-display" style={{ color: ELEMENT_COLOR[info.element] }}>
        {name}
      </span>
    </span>
  );
}

export function ChiBadge({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const info = CHI.find((c) => c.name === name);
  if (!info) return <span>{name}</span>;
  const px = size === "lg" ? 56 : size === "sm" ? 30 : 40;
  const glyphSize = size === "lg" ? 28 : size === "sm" ? 15 : 20;
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid place-items-center rounded-full glass shrink-0"
        style={{
          width: px,
          height: px,
          boxShadow: `0 0 18px -4px ${ELEMENT_COLOR[info.element]}66`,
        }}
      >
        <ZodiacGlyph animal={info.animal} size={glyphSize} color={ELEMENT_COLOR[info.element]} />
      </span>
      <span className="font-display" style={{ color: ELEMENT_COLOR[info.element] }}>
        {name}
      </span>
    </span>
  );
}
