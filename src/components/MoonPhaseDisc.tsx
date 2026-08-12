import { useEffect, useRef } from "react";
import moonImg from "../assets/textures/moon.jpg";

let cachedMoonImage: HTMLImageElement | null = null;
function loadMoonImage(): Promise<HTMLImageElement> {
  if (cachedMoonImage) return Promise.resolve(cachedMoonImage);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      cachedMoonImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = moonImg;
  });
}

/**
 * Vẽ Mặt Trăng bằng ảnh bề mặt thật (NASA / Solar System Scope, CC BY 4.0 — cùng nguồn Sao Kim/Sao
 * Hỏa... ở trang chủ) trên Canvas 2D thường (không dùng WebGL) — tránh rủi ro hết ngữ cảnh WebGL khi
 * trang đã có sẵn cảnh 3D khác. Vùng tối/sáng vẽ theo đúng hình học pha Mặt Trăng thật (kỹ thuật nửa
 * hình tròn + ellipse ranh giới sáng tối), khớp với độ che phủ (illuminated fraction) thiên văn thật.
 */
function drawMoon(canvas: HTMLCanvasElement, img: HTMLImageElement, illuminatedFraction: number, waxing: boolean) {
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 104;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 1;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Ảnh bề mặt thật, hơi tối đi để hợp tông với nền vũ trụ của trang.
  ctx.filter = "brightness(0.92) contrast(1.05)";
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.filter = "none";

  const k = Math.max(0, Math.min(1, illuminatedFraction));
  const rx = r * (1 - 2 * k);

  ctx.beginPath();
  ctx.fillStyle = "rgba(6,8,18,0.86)";
  if (waxing) {
    // Vùng tối bên trái, ánh sáng "lớn dần" từ bên phải khi k tăng.
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false);
    ctx.ellipse(cx, cy, Math.abs(rx), r, 0, (3 * Math.PI) / 2, Math.PI / 2, rx <= 0);
  } else {
    // Vùng tối bên phải, ánh sáng "nhỏ dần" khi k giảm về Sóc.
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.ellipse(cx, cy, Math.abs(rx), r, 0, Math.PI / 2, (3 * Math.PI) / 2, rx <= 0);
  }
  ctx.closePath();
  ctx.fill();

  // Viền sáng mảnh quanh rìa để tăng cảm giác khối cầu.
  ctx.restore();
  const rim = ctx.createRadialGradient(cx, cy, r * 0.86, cx, cy, r);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(255,255,255,0.08)");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();
}

/** Hiển thị Mặt Trăng với đúng pha sáng/tối thật tại một thời điểm — đồng bộ với độ che phủ Âm lịch
 * của ngày đang xem, dùng ảnh bề mặt Mặt Trăng thật thay vì hình vẽ minh hoạ. */
export function MoonPhaseDisc({
  illuminatedFraction,
  waxing,
  size = 104,
}: {
  illuminatedFraction: number;
  waxing: boolean;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadMoonImage()
      .then((img) => {
        if (cancelled || !canvasRef.current) return;
        drawMoon(canvasRef.current, img, illuminatedFraction, waxing);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [illuminatedFraction, waxing, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="mx-auto shrink-0 rounded-full"
      aria-hidden="true"
    />
  );
}
