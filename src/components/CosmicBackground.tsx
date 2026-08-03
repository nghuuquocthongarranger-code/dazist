import { useMemo } from "react";

function generateStars(count: number) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    const a = (0.35 + Math.random() * 0.65).toFixed(2);
    shadows.push(`${x}vw ${y}vh 0 rgba(255,255,255,${a})`);
  }
  return shadows.join(", ");
}

/**
 * Nền vũ trụ cố định (fixed, đứng yên khi cuộn trang) hiển thị xuyên suốt mọi
 * section — không chỉ riêng Hero — để toàn bộ website mang cảm giác "trôi giữa
 * không gian" thay vì chỉ có nền đen phẳng.
 */
export function CosmicBackground() {
  const small = useMemo(() => generateStars(160), []);
  const medium = useMemo(() => generateStars(70), []);
  const large = useMemo(() => generateStars(28), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 animate-[drift_60s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 15%, rgba(74,159,224,0.10), transparent 60%)," +
            "radial-gradient(ellipse 55% 45% at 85% 75%, rgba(122,70,200,0.12), transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(212,175,55,0.06), transparent 65%)",
        }}
      />
      <span
        className="absolute top-0 left-0 w-[1px] h-[1px] rounded-full animate-twinkle"
        style={{ boxShadow: small }}
      />
      <span
        className="absolute top-0 left-0 w-[1.8px] h-[1.8px] rounded-full animate-twinkle"
        style={{ boxShadow: medium, animationDelay: "1.1s", animationDuration: "4s" }}
      />
      <span
        className="absolute top-0 left-0 w-[2.6px] h-[2.6px] rounded-full animate-twinkle"
        style={{ boxShadow: large, animationDelay: "2.1s", animationDuration: "5s" }}
      />
    </div>
  );
}
