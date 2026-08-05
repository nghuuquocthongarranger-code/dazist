import * as Astronomy from "astronomy-engine";

/** Vị trí lá số gốc (Natal Chart) — cố định, 05/05/2001 08:20 GMT+7, Hồ Chí Minh. Kinh độ hoàng đạo tuyệt đối 0-360°, 0° = đầu Bạch Dương. */
export const NATAL = {
  sun: 30 + dms(14, 37), // 14°37' Kim Ngưu
  moon: 180 + dms(12, 6), // 12°06' Thiên Bình
  mercury: 30 + dms(27, 46), // 27°46' Kim Ngưu
  venus: 0 + dms(5, 19), // 5°19' Bạch Dương
  mars: 240 + dms(28, 47), // 28°47' Nhân Mã
  jupiter: 60 + dms(14, 21), // 14°21' Song Tử
  saturn: 60 + dms(1, 44), // 1°44' Song Tử
  uranus: 300 + dms(24, 35), // 24°35' Bảo Bình
  neptune: 300 + dms(8, 46), // 8°46' Bảo Bình
  pluto: 240 + dms(14, 41), // 14°41' Nhân Mã
  chiron: 240 + dms(28, 22), // 28°22' Nhân Mã
  northNode: 90 + dms(7, 44), // 7°44' Cự Giải
  ac: 60 + dms(24, 52), // 24°52' Song Tử
  mc: 330 + dms(18, 45), // 18°45' Song Ngư
  dc: 240 + dms(24, 52), // 24°52' Nhân Mã
  ic: 150 + dms(18, 45), // 18°45' Xử Nữ
};

export const ZODIAC_SIGNS = [
  "Bạch Dương",
  "Kim Ngưu",
  "Song Tử",
  "Cự Giải",
  "Sư Tử",
  "Xử Nữ",
  "Thiên Bình",
  "Bọ Cạp",
  "Nhân Mã",
  "Ma Kết",
  "Bảo Bình",
  "Song Ngư",
];

function dms(deg: number, min: number): number {
  return deg + min / 60;
}

function normalizeDeg(x: number): number {
  return ((x % 360) + 360) % 360;
}

/** Khoảng cách góc ngắn nhất giữa hai kinh độ, luôn trong [0, 180]. */
function angDiff(a: number, b: number): number {
  const d = Math.abs(normalizeDeg(a) - normalizeDeg(b)) % 360;
  return d > 180 ? 360 - d : d;
}

/** Chênh lệch có dấu a-b, trong [-180, 180] — dùng để xác định chiều chuyển động (thuận/nghịch). */
function signedDelta(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

export function formatDegInSign(lon: number): string {
  const l = normalizeDeg(lon);
  const signIndex = Math.floor(l / 30);
  const posInSign = l - signIndex * 30;
  const deg = Math.floor(posInSign);
  const min = Math.round((posInSign - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}' ${ZODIAC_SIGNS[signIndex]}`;
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/** Kinh độ hoàng đạo hình biểu kiến địa tâm (tropical, true equinox of date) — cùng hệ quy chiếu với dữ liệu lá số gốc. */
function eclipticLongitudeOf(body: Astronomy.Body, date: Date): number {
  if (body === Astronomy.Body.Sun) {
    return normalizeDeg(Astronomy.SunPosition(date).elon);
  }
  if (body === Astronomy.Body.Moon) {
    return normalizeDeg(Astronomy.EclipticGeoMoon(date).lon);
  }
  const eqj = Astronomy.GeoVector(body, date, true);
  const rot = Astronomy.Rotation_EQJ_ECT(date);
  const ect = Astronomy.RotateVector(rot, eqj);
  const sph = Astronomy.SphereFromVector(ect);
  return normalizeDeg(sph.lon);
}

interface AspectDef {
  name: string;
  angle: number;
  kind: "positive" | "negative";
  weight: number;
}

const ASPECT_DEFS: AspectDef[] = [
  { name: "Hợp", angle: 0, kind: "positive", weight: 1.0 },
  { name: "Tam hợp", angle: 120, kind: "positive", weight: 0.85 },
  { name: "Lục hợp", angle: 60, kind: "positive", weight: 0.6 },
  { name: "Vuông góc", angle: 90, kind: "negative", weight: 0.85 },
  { name: "Đối nhau", angle: 180, kind: "negative", weight: 1.0 },
  { name: "Bán lục hợp", angle: 30, kind: "negative", weight: 0.35 },
  { name: "Quincunx", angle: 150, kind: "negative", weight: 0.45 },
];

export interface AspectMatch {
  aspectName: string;
  orb: number;
  contribution: number;
}

/** Tìm góc chiếu khớp gần đúng nhất (orb nhỏ nhất) trong giới hạn orb cho phép giữa hai kinh độ transit/gốc. */
function matchAspect(transitLon: number, targetLon: number, orbLimit: number): AspectMatch | null {
  const sep = angDiff(transitLon, targetLon);
  let best: { def: AspectDef; orb: number } | null = null;
  for (const def of ASPECT_DEFS) {
    const orb = Math.abs(sep - def.angle);
    if (orb <= orbLimit && (!best || orb < best.orb)) best = { def, orb };
  }
  if (!best) return null;
  const strength = 1 - best.orb / orbLimit;
  const magnitude = best.def.kind === "positive" ? 100 : -100;
  return { aspectName: best.def.name, orb: best.orb, contribution: magnitude * best.def.weight * strength };
}

export interface ComponentDetail {
  from: string;
  to: string;
  aspect: string;
  orb: number;
  contribution: number;
  doubled?: boolean;
}

export interface MoonComponent {
  score: number;
  lon: number;
  details: ComponentDetail[];
}

function computeMoonScore(moonLon: number): MoonComponent {
  const targets = [
    { name: "Mặt Trời gốc", lon: NATAL.sun },
    { name: "Mặt Trăng gốc", lon: NATAL.moon },
    { name: "Cung Mọc gốc", lon: NATAL.ac },
    { name: "Sao Hỏa gốc", lon: NATAL.mars },
    { name: "Chiron gốc", lon: NATAL.chiron },
  ];
  const details: ComponentDetail[] = [];
  let total = 0;
  for (const t of targets) {
    const m = matchAspect(moonLon, t.lon, 6);
    if (m) {
      total += m.contribution;
      details.push({ from: "Mặt Trăng transit", to: t.name, aspect: m.aspectName, orb: m.orb, contribution: m.contribution });
    }
  }
  return { score: clamp(total, -100, 100), lon: moonLon, details };
}

export interface MercuryComponent {
  score: number;
  lon: number;
  retrograde: boolean;
  shadow: boolean;
  base: number;
  details: ComponentDetail[];
}

function mercurySpeedDegPerDay(date: Date): number {
  const t1 = new Date(date.getTime() - 6 * 3600 * 1000);
  const t2 = new Date(date.getTime() + 6 * 3600 * 1000);
  const l1 = eclipticLongitudeOf(Astronomy.Body.Mercury, t1);
  const l2 = eclipticLongitudeOf(Astronomy.Body.Mercury, t2);
  return signedDelta(l2, l1) * 2;
}

/** Quét ±60 ngày quanh mốc để tìm các khoảng nghịch hành gần nhất, suy ra trạng thái "bóng nghịch hành" (±2 tuần trước/sau). */
function mercuryRetrogradeStatus(date: Date): { retro: boolean; shadow: boolean } {
  const retroNow = mercurySpeedDegPerDay(date) < 0;
  if (retroNow) return { retro: true, shadow: false };

  const WINDOW = 60;
  let prevRetro = mercurySpeedDegPerDay(new Date(date.getTime() - (WINDOW + 1) * 86400000)) < 0;
  let intervalStart: number | null = null;
  const intervals: { start: number; end: number }[] = [];
  for (let d = -WINDOW; d <= WINDOW; d++) {
    const cur = mercurySpeedDegPerDay(new Date(date.getTime() + d * 86400000)) < 0;
    if (cur && !prevRetro) intervalStart = d;
    if (!cur && prevRetro && intervalStart !== null) {
      intervals.push({ start: intervalStart, end: d - 1 });
      intervalStart = null;
    }
    prevRetro = cur;
  }
  if (intervalStart !== null) intervals.push({ start: intervalStart, end: WINDOW });

  let shadow = false;
  for (const iv of intervals) {
    if (iv.start > 0 && iv.start <= 14) shadow = true;
    if (iv.end < 0 && Math.abs(iv.end) <= 14) shadow = true;
  }
  return { retro: false, shadow };
}

function computeMercuryScore(mercuryLon: number, retro: boolean, shadow: boolean): MercuryComponent {
  const base = retro ? -30 : shadow ? -10 : 0;
  const targets = [
    { name: "Thủy Tinh gốc", lon: NATAL.mercury },
    { name: "Thổ Tinh gốc", lon: NATAL.saturn },
  ];
  const details: ComponentDetail[] = [];
  let aspectTotal = 0;
  for (const t of targets) {
    const m = matchAspect(mercuryLon, t.lon, 3);
    if (m) {
      aspectTotal += m.contribution;
      details.push({ from: "Thủy Tinh transit", to: t.name, aspect: m.aspectName, orb: m.orb, contribution: m.contribution });
    }
  }
  return { score: clamp(base + aspectTotal, -100, 100), lon: mercuryLon, retrograde: retro, shadow, base, details };
}

export interface MarsVenusComponent {
  score: number;
  marsLon: number;
  venusLon: number;
  details: ComponentDetail[];
}

function computeMarsVenusScore(marsLon: number, venusLon: number): MarsVenusComponent {
  const targets = [
    { name: "Sao Hỏa gốc", lon: NATAL.mars },
    { name: "Chiron gốc", lon: NATAL.chiron },
  ];
  const transits = [
    { name: "Sao Hỏa transit", lon: marsLon },
    { name: "Kim Tinh transit", lon: venusLon },
  ];
  const details: ComponentDetail[] = [];
  let total = 0;
  for (const tr of transits) {
    for (const t of targets) {
      const m = matchAspect(tr.lon, t.lon, 3);
      if (m) {
        const doubled = m.orb < 1;
        const contribution = doubled ? m.contribution * 2 : m.contribution;
        total += contribution;
        details.push({ from: tr.name, to: t.name, aspect: m.aspectName, orb: m.orb, contribution, doubled });
      }
    }
  }
  return { score: clamp(total, -100, 100), marsLon, venusLon, details };
}

export interface SunComponent {
  score: number;
  lon: number;
  solarReturn: boolean;
  details: ComponentDetail[];
}

function computeSunScore(sunLon: number): SunComponent {
  const targets = [
    { name: "Mặt Trời gốc", lon: NATAL.sun },
    { name: "Diêm Vương gốc", lon: NATAL.pluto },
  ];
  const details: ComponentDetail[] = [];
  let total = 0;
  for (const t of targets) {
    const m = matchAspect(sunLon, t.lon, 2);
    if (m) {
      total += m.contribution;
      details.push({ from: "Mặt Trời transit", to: t.name, aspect: m.aspectName, orb: m.orb, contribution: m.contribution });
    }
  }
  // 12-17° Kim Ngưu = 42°-47° tuyệt đối
  const solarReturn = sunLon >= 42 && sunLon <= 47;
  return { score: clamp(total, -100, 100), lon: sunLon, solarReturn, details };
}

const VOC_BODIES: { name: string; body: Astronomy.Body }[] = [
  { name: "Mặt Trời", body: Astronomy.Body.Sun },
  { name: "Thủy Tinh", body: Astronomy.Body.Mercury },
  { name: "Kim Tinh", body: Astronomy.Body.Venus },
  { name: "Sao Hỏa", body: Astronomy.Body.Mars },
  { name: "Sao Mộc", body: Astronomy.Body.Jupiter },
  { name: "Thổ Tinh", body: Astronomy.Body.Saturn },
  { name: "Thiên Vương Tinh", body: Astronomy.Body.Uranus },
  { name: "Hải Vương Tinh", body: Astronomy.Body.Neptune },
  { name: "Diêm Vương Tinh", body: Astronomy.Body.Pluto },
];
const VOC_MAJOR_ANGLES = [0, 60, 90, 120, 180];

/**
 * Mặt Trăng Void-of-Course: không còn hợp góc chính (Hợp/Lục hợp/Vuông góc/Tam hợp/Đối nhau) nào
 * với các hành tinh khác trước khi đổi cung — kiểm tra bằng cách xem còn điểm góc chiếu chính xác nào
 * nằm phía trước Mặt Trăng trong cùng cung hoàng đạo hiện tại hay không.
 */
function isVoidOfCourse(date: Date, moonLon: number): boolean {
  const signStart = Math.floor(moonLon / 30) * 30;
  const signEnd = signStart + 30;
  for (const ob of VOC_BODIES) {
    const lon = eclipticLongitudeOf(ob.body, date);
    for (const angle of VOC_MAJOR_ANGLES) {
      for (const sign of angle === 0 || angle === 180 ? [1] : [1, -1]) {
        const p = normalizeDeg(lon + sign * angle);
        if (p >= moonLon && p < signEnd) return false;
      }
    }
  }
  return true;
}

export interface ExactAspectFlag {
  text: string;
  orb: number;
  aspectName: string;
  kind: "positive" | "negative";
}

const SENSITIVE_POINTS = [
  { name: "Sao Hỏa gốc (28°47' Nhân Mã, trục DC/Nhà 7)", lon: NATAL.mars },
  { name: "Chiron gốc (28°22' Nhân Mã, trục DC/Nhà 7)", lon: NATAL.chiron },
  { name: "Mặt Trời gốc (14°37' Kim Ngưu)", lon: NATAL.sun },
  { name: "Diêm Vương gốc (14°41' Nhân Mã)", lon: NATAL.pluto },
  { name: "Thủy Tinh gốc (27°46' Kim Ngưu, Nhà 12)", lon: NATAL.mercury },
  { name: "Thổ Tinh gốc (1°44' Song Tử, Nhà 12)", lon: NATAL.saturn },
];

const SLOW_ANGLES = [0, 30, 60, 90, 120, 150, 180];
const ASPECT_DEF_BY_ANGLE: Record<number, AspectDef> = Object.fromEntries(ASPECT_DEFS.map((d) => [d.angle, d]));

function findExactSlowAspects(lons: { saturn: number; uranus: number; neptune: number; pluto: number }): ExactAspectFlag[] {
  const transits = [
    { name: "Thổ Tinh transit", lon: lons.saturn },
    { name: "Thiên Vương Tinh transit", lon: lons.uranus },
    { name: "Hải Vương Tinh transit", lon: lons.neptune },
    { name: "Diêm Vương Tinh transit", lon: lons.pluto },
  ];
  const results: ExactAspectFlag[] = [];
  for (const tr of transits) {
    for (const p of SENSITIVE_POINTS) {
      const sep = angDiff(tr.lon, p.lon);
      for (const a of SLOW_ANGLES) {
        const orb = Math.abs(sep - a);
        if (orb < 1) {
          const def = ASPECT_DEF_BY_ANGLE[a];
          results.push({ text: `${tr.name} ${def.name} ${p.name}`, orb, aspectName: def.name, kind: def.kind });
        }
      }
    }
  }
  return results.sort((a, b) => a.orb - b.orb);
}

export interface WesternAstroResult {
  percent: number;
  rawScore: number;
  moon: MoonComponent;
  mercury: MercuryComponent;
  marsVenus: MarsVenusComponent;
  sun: SunComponent;
  flags: {
    voidOfCourse: boolean;
    mercuryRetrograde: boolean;
    mercuryShadow: boolean;
    solarReturn: boolean;
    exactAspects: ExactAspectFlag[];
  };
}

/**
 * Tính Điểm Chiêm Tinh Học Tây Phương theo ngày, đối chiếu vị trí hành tinh transit (giờ VN, GMT+7)
 * với lá số gốc cố định 05/05/2001 08:20 GMT+7. Snapshot vị trí lấy tại 00:00 UTC của ngày Dương lịch
 * được chọn (~07:00 giờ VN cùng ngày) làm đại diện cho cả ngày.
 */
export function computeWesternAstroScore(dateVN: Date): WesternAstroResult {
  const snapshotUTC = new Date(Date.UTC(dateVN.getFullYear(), dateVN.getMonth(), dateVN.getDate(), 0, 0, 0));

  const moonLon = eclipticLongitudeOf(Astronomy.Body.Moon, snapshotUTC);
  const sunLon = eclipticLongitudeOf(Astronomy.Body.Sun, snapshotUTC);
  const mercuryLon = eclipticLongitudeOf(Astronomy.Body.Mercury, snapshotUTC);
  const venusLon = eclipticLongitudeOf(Astronomy.Body.Venus, snapshotUTC);
  const marsLon = eclipticLongitudeOf(Astronomy.Body.Mars, snapshotUTC);
  const saturnLon = eclipticLongitudeOf(Astronomy.Body.Saturn, snapshotUTC);
  const uranusLon = eclipticLongitudeOf(Astronomy.Body.Uranus, snapshotUTC);
  const neptuneLon = eclipticLongitudeOf(Astronomy.Body.Neptune, snapshotUTC);
  const plutoLon = eclipticLongitudeOf(Astronomy.Body.Pluto, snapshotUTC);

  const { retro, shadow } = mercuryRetrogradeStatus(snapshotUTC);
  const moon = computeMoonScore(moonLon);
  const mercury = computeMercuryScore(mercuryLon, retro, shadow);
  const marsVenus = computeMarsVenusScore(marsLon, venusLon);
  const sun = computeSunScore(sunLon);
  const voc = isVoidOfCourse(snapshotUTC, moonLon);
  const exactAspects = findExactSlowAspects({ saturn: saturnLon, uranus: uranusLon, neptune: neptuneLon, pluto: plutoLon });

  const rawScore =
    50 + moon.score * 0.35 + mercury.score * 0.2 + marsVenus.score * 0.2 + sun.score * 0.15 - (voc ? 15 : 0);
  const percent = Math.round(clamp(rawScore, 0, 100));

  return {
    percent,
    rawScore,
    moon,
    mercury,
    marsVenus,
    sun,
    flags: {
      voidOfCourse: voc,
      mercuryRetrograde: retro,
      mercuryShadow: shadow,
      solarReturn: sun.solarReturn,
      exactAspects,
    },
  };
}

export function combineWithBaZi(baziPercent: number, westernPercent: number) {
  const combined = Math.round((baziPercent + westernPercent) / 2);
  const diverges = Math.abs(baziPercent - westernPercent) > 30;
  return { combined, diverges };
}
