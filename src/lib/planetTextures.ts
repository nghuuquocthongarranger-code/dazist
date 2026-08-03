import * as THREE from "three";

type RNG = () => number;

function mulberry32(seed: number): RNG {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

/** Sao Thủy — Mercury: mặt đá xám nâu, đầy hố thiên thạch */
export function mercuryTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(11);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#8f8a85");
  grad.addColorStop(0.5, "#736d68");
  grad.addColorStop(1, "#524d4a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 220; i++) {
    const x = rng() * 512;
    const y = rng() * 256;
    const r = rng() * 5 + 0.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(30,26,22,${0.15 + rng() * 0.25})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,250,240,${0.08 + rng() * 0.1})`;
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Sao Kim — Venus: mây dày xoáy vàng nhạt, phản chiếu sáng */
export function venusTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(22);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#fff3d1");
  grad.addColorStop(0.5, "#f2dd9e");
  grad.addColorStop(1, "#e0c27a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * 256 + rng() * 8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 10 * rng());
    }
    ctx.strokeStyle = `rgba(210,170,90,${0.15 + rng() * 0.2})`;
    ctx.lineWidth = 6 + rng() * 10;
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Sao Hỏa — Mars: bề mặt đỏ cam gỉ sắt, mảng tối, chỏm băng cực */
export function marsTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(33);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#e07a4e");
  grad.addColorStop(0.5, "#c1502c");
  grad.addColorStop(1, "#8f3418");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 60; i++) {
    const x = rng() * 512;
    const y = rng() * 256;
    const r = rng() * 26 + 6;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.6, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(90,35,18,${0.12 + rng() * 0.18})`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(256, 18, 90, 16, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,246,235,0.55)";
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Sao Mộc — Jupiter: các dải mây song song cam/be + Vết Đỏ Lớn */
export function jupiterTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(44);
  const bands = ["#e9d3ad", "#d8b788", "#c99a68", "#e3c99a", "#b9855a", "#efe0c0", "#cf9f6f"];
  let y = 0;
  while (y < 256) {
    const h = 14 + rng() * 26;
    ctx.fillStyle = bands[Math.floor(rng() * bands.length)];
    ctx.fillRect(0, y, 512, h);
    y += h;
  }
  for (let i = 0; i < 40; i++) {
    const x = rng() * 512;
    const yy = rng() * 256;
    ctx.beginPath();
    ctx.ellipse(x, yy, rng() * 30 + 8, rng() * 6 + 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.05 + rng() * 0.08})`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(150, 165, 34, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#c1532f";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(150, 165, 34, 18, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(120,40,20,0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Sao Thổ — Saturn: dải màu vàng nhạt êm dịu */
export function saturnTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(55);
  const bands = ["#f4e3b8", "#ead2a0", "#e0c48a", "#f0dcaa", "#d8b87e"];
  let y = 0;
  while (y < 256) {
    const h = 16 + rng() * 22;
    ctx.fillStyle = bands[Math.floor(rng() * bands.length)];
    ctx.fillRect(0, y, 512, h);
    y += h;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Vành đai Sao Thổ: các dải trong suốt xen kẽ theo bán kính */
export function saturnRingTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 32);
  const rng = mulberry32(66);
  ctx.clearRect(0, 0, 512, 32);
  for (let x = 0; x < 512; x++) {
    const alpha = 0.25 + 0.5 * Math.abs(Math.sin(x * 0.05)) * rng() + 0.15;
    ctx.fillStyle = `rgba(226,204,160,${Math.min(alpha, 0.85)})`;
    ctx.fillRect(x, 0, 1, 32);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Mặt Trời — bề mặt plasma nhiễu động */
export function sunTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512, 256);
  const rng = mulberry32(77);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#fff6d6");
  grad.addColorStop(0.5, "#ffd97a");
  grad.addColorStop(1, "#f0a83c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 90; i++) {
    const x = rng() * 512;
    const y = rng() * 256;
    const r = rng() * 18 + 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,240,200,${0.08 + rng() * 0.12})`;
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
