/**
 * Thần số học (numerology) kiểu Pythagoras — áp dụng cho tên đã bỏ dấu (chuyển về chữ cái Latin gốc)
 * và ngày sinh Dương lịch. Số chủ (11, 22, 33) được giữ nguyên, không rút gọn tiếp ở các chỉ số cốt lõi.
 */

const LETTER_VALUE: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};
const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const MASTER_NUMBERS = new Set([11, 22, 33]);
const KARMIC_DEBT_NUMBERS = new Set([13, 14, 16, 19]);

/** Bỏ dấu tiếng Việt, chỉ giữ lại chữ cái a-z (dùng cho quy đổi số học theo tên). */
export function stripDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function digitSum(n: number): number {
  return String(n)
    .split("")
    .reduce((a, d) => a + Number(d), 0);
}

function reduceFull(n: number): number {
  let x = n;
  while (x > 9) x = digitSum(x);
  return x;
}

/** Rút gọn về 1 chữ số nhưng giữ nguyên Số Chủ (11/22/33); đồng thời phát hiện Nợ Nghiệp Quả (13/14/16/19) nếu xuất hiện trên đường rút gọn. */
function reduceTrackKarmic(n: number): { result: number; karmicDebt: number | null } {
  let x = n;
  let karmicDebt: number | null = null;
  while (x > 9 && !MASTER_NUMBERS.has(x)) {
    if (KARMIC_DEBT_NUMBERS.has(x)) karmicDebt = x;
    x = digitSum(x);
  }
  return { result: x, karmicDebt };
}

function sumLetters(letters: string): number {
  return letters.split("").reduce((s, ch) => s + (LETTER_VALUE[ch] ?? 0), 0);
}

function letterCounts(letters: string): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  letters.split("").forEach((ch) => {
    const v = LETTER_VALUE[ch];
    if (v) counts[v]++;
  });
  return counts;
}

export interface CoreNumber {
  key: string;
  label: string;
  value: number;
  isMaster: boolean;
  karmicDebt: number | null;
}

export interface NumerologyProfile {
  lifePath: CoreNumber;
  expression: CoreNumber;
  soulUrge: CoreNumber;
  personality: CoreNumber;
  birthday: CoreNumber;
  maturity: CoreNumber;
  attitude: CoreNumber;
  hiddenPassion: number;
  balance: number;
  subconsciousSelf: number;
  karmicLessons: number[];
  karmicDebts: number[];
}

function toCore(key: string, label: string, r: { result: number; karmicDebt: number | null }): CoreNumber {
  return { key, label, value: r.result, isMaster: MASTER_NUMBERS.has(r.result), karmicDebt: r.karmicDebt };
}

/** Tính trọn bộ các chỉ số thần số học cốt lõi từ họ tên đầy đủ (có dấu) và ngày sinh Dương lịch. */
export function computeNumerologyProfile(fullName: string, day: number, month: number, year: number): NumerologyProfile {
  const name = stripDiacritics(fullName);
  const vowelSum = name
    .split("")
    .filter((ch) => VOWELS.has(ch))
    .reduce((s, ch) => s + (LETTER_VALUE[ch] ?? 0), 0);
  const consonantSum = sumLetters(name) - vowelSum;

  const dayR = reduceTrackKarmic(day);
  const monthR = reduceTrackKarmic(month);
  const yearR = reduceTrackKarmic(digitSum(year));
  const lifePath = reduceTrackKarmic(dayR.result + monthR.result + yearR.result);

  const expression = reduceTrackKarmic(sumLetters(name));
  const soulUrge = reduceTrackKarmic(vowelSum);
  const personality = reduceTrackKarmic(consonantSum);
  const birthday = reduceTrackKarmic(day);
  const maturity = reduceTrackKarmic(reduceFull(lifePath.result) + reduceFull(expression.result));
  const attitude = reduceTrackKarmic(reduceFull(day) + reduceFull(month));

  const counts = letterCounts(name);
  const karmicLessons = Object.entries(counts)
    .filter(([, c]) => c === 0)
    .map(([k]) => Number(k));
  let hiddenPassion = 1;
  let bestCount = 0;
  for (const [k, c] of Object.entries(counts)) {
    if (c > bestCount) {
      bestCount = c;
      hiddenPassion = Number(k);
    }
  }
  const subconsciousSelf = 9 - karmicLessons.length;

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((p) => stripDiacritics(p)[0])
    .filter(Boolean);
  const balance = reduceFull(initials.reduce((s, ch) => s + (LETTER_VALUE[ch] ?? 0), 0)) || 9;

  const coreList = [lifePath, expression, soulUrge, personality, birthday, maturity, attitude];
  const karmicDebts = Array.from(new Set(coreList.map((c) => c.karmicDebt).filter((v): v is number => v !== null)));

  return {
    lifePath: toCore("lifePath", "Số Chủ Đạo", lifePath),
    expression: toCore("expression", "Số Sứ Mệnh", expression),
    soulUrge: toCore("soulUrge", "Số Linh Hồn", soulUrge),
    personality: toCore("personality", "Số Nhân Cách", personality),
    birthday: toCore("birthday", "Số Ngày Sinh", birthday),
    maturity: toCore("maturity", "Số Trưởng Thành", maturity),
    attitude: toCore("attitude", "Số Thái Độ", attitude),
    hiddenPassion,
    balance,
    subconsciousSelf,
    karmicLessons,
    karmicDebts,
  };
}

// ---------------------------------------------------------------------------
// Bảng đồ số Pythagoras (Number Grid) — 9 ô từ 1-9, đếm số lần mỗi chữ số xuất
// hiện trong ngày sinh đầy đủ (DDMMYYYY), suy ra các "Đường" (Arrow) hình
// thành khi cả 3 ô trên một hàng/cột/đường chéo đều có mặt, hoặc "Đường trống"
// khi cả 3 ô đều vắng mặt.
// ---------------------------------------------------------------------------

export interface NumberGrid {
  counts: Record<number, number>;
}

export function computeNumberGrid(day: number, month: number, year: number): NumberGrid {
  const digits = `${day}${month}${year}`
    .split("")
    .map(Number)
    .filter((d) => d >= 1 && d <= 9);
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  digits.forEach((d) => (counts[d] = (counts[d] ?? 0) + 1));
  return { counts };
}

export interface ArrowLine {
  key: string;
  numbers: [number, number, number];
  name: string;
  filledMeaning: string;
  emptyMeaning: string;
}

export const ARROW_LINES: ArrowLine[] = [
  {
    key: "row-369",
    numbers: [3, 6, 9],
    name: "Đường Trí Tuệ",
    filledMeaning: "Tư duy logic, khả năng học hỏi, ghi nhớ và diễn đạt tốt — dễ tiếp thu kiến thức mới, thích tranh luận và phân tích.",
    emptyMeaning: "Cần nỗ lực nhiều hơn trong học thuật/lý luận, dễ thiếu tự tin khi phải trình bày ý tưởng phức tạp — nên rèn luyện qua đọc và viết thường xuyên.",
  },
  {
    key: "row-258",
    numbers: [2, 5, 8],
    name: "Đường Cảm Xúc",
    filledMeaning: "Cân bằng cảm xúc tốt, nhạy bén trong giao tiếp tình cảm, dễ đồng cảm và thích nghi với thay đổi.",
    emptyMeaning: "Dễ khó khăn khi thể hiện hoặc kiểm soát cảm xúc, có thể thất thường hoặc kìm nén — nên chủ động luyện tập chia sẻ cảm xúc thay vì giữ trong lòng.",
  },
  {
    key: "row-147",
    numbers: [1, 4, 7],
    name: "Đường Thực Hành",
    filledMeaning: "Khả năng làm việc chăm chỉ, thực tế, đáng tin cậy — giỏi biến ý tưởng thành hành động cụ thể.",
    emptyMeaning: "Dễ thiếu kiên nhẫn với công việc tay chân/chi tiết, khó duy trì kỷ luật lâu dài — cần xây dựng thói quen và quy trình rõ ràng để bù đắp.",
  },
  {
    key: "col-123",
    numbers: [1, 2, 3],
    name: "Đường Ý Chí",
    filledMeaning: "Ý chí mạnh, khả năng lên kế hoạch và tự tạo động lực tốt, biết mình muốn gì.",
    emptyMeaning: "Dễ thiếu quyết đoán, cần động lực hoặc áp lực từ bên ngoài mới hành động — nên tập đặt mục tiêu nhỏ, cụ thể để rèn ý chí dần.",
  },
  {
    key: "col-456",
    numbers: [4, 5, 6],
    name: "Đường Hành Động",
    filledMeaning: "Gắn bó, có trách nhiệm với gia đình/tập thể, hành động nhất quán và đáng tin cậy trong cam kết dài hạn.",
    emptyMeaning: "Dễ ngại trách nhiệm gắn bó lâu dài, hay đổi hướng giữa chừng — nên ý thức rèn luyện sự kiên định trong các mối quan hệ và dự án.",
  },
  {
    key: "col-789",
    numbers: [7, 8, 9],
    name: "Đường Tinh Thần",
    filledMeaning: "Có chiều sâu tâm linh, quan tâm ý nghĩa lớn lao, di sản để lại — không chỉ sống vì lợi ích trước mắt.",
    emptyMeaning: "Dễ thiên về vật chất/thực tế trước mắt, ít chú trọng khía cạnh tâm linh hoặc ý nghĩa dài hạn — nên dành thời gian chiêm nghiệm định kỳ.",
  },
  {
    key: "diag-159",
    numbers: [1, 5, 9],
    name: "Đường Quyết Tâm",
    filledMeaning: "Quyết tâm cao, kiên định theo đuổi mục tiêu đến cùng dù gặp trở ngại — một trong những Đường mạnh nhất khi đầy đủ.",
    emptyMeaning: "Dễ nản chí giữa chừng, thiếu sự bền bỉ khi gặp khó khăn kéo dài — cần rèn luyện tính kiên trì qua các mục tiêu dài hơi.",
  },
  {
    key: "diag-357",
    numbers: [3, 5, 7],
    name: "Đường Tâm Linh",
    filledMeaning: "Nhạy cảm, giàu trực giác và lòng trắc ẩn, dễ đồng cảm sâu sắc với người khác.",
    emptyMeaning: "Cần chủ động rèn luyện sự đồng cảm và trực giác, dễ hoài nghi hoặc giữ khoảng cách cảm xúc với người xung quanh.",
  },
];

export interface ArrowResult extends ArrowLine {
  status: "filled" | "empty" | "partial";
}

export function computeArrows(grid: NumberGrid): ArrowResult[] {
  return ARROW_LINES.map((line) => {
    const present = line.numbers.filter((n) => grid.counts[n] > 0).length;
    const status: ArrowResult["status"] = present === 3 ? "filled" : present === 0 ? "empty" : "partial";
    return { ...line, status };
  });
}

// ---------------------------------------------------------------------------
// Đỉnh (Pinnacles) và Trũng/Thử thách (Challenges) — 4 giai đoạn lớn của cuộc đời.
// ---------------------------------------------------------------------------

export interface LifePeriod {
  index: 1 | 2 | 3 | 4;
  number: number;
  startAge: number;
  endAge: number | null;
}

function pinnacleAgeBounds(day: number, month: number, year: number): number {
  const lifePathFull = reduceFull(reduceFull(day) + reduceFull(month) + reduceFull(digitSum(year)));
  return 36 - lifePathFull;
}

export function computePinnacles(day: number, month: number, year: number): LifePeriod[] {
  const d = reduceFull(day);
  const m = reduceFull(month);
  const y = reduceFull(digitSum(year));
  const p1 = reduceFull(m + d);
  const p2 = reduceFull(d + y);
  const p3 = reduceFull(p1 + p2);
  const p4 = reduceFull(m + y);
  const firstEnd = pinnacleAgeBounds(day, month, year);
  return [
    { index: 1, number: p1, startAge: 0, endAge: firstEnd },
    { index: 2, number: p2, startAge: firstEnd, endAge: firstEnd + 9 },
    { index: 3, number: p3, startAge: firstEnd + 9, endAge: firstEnd + 18 },
    { index: 4, number: p4, startAge: firstEnd + 18, endAge: null },
  ];
}

export function computeChallenges(day: number, month: number, year: number): LifePeriod[] {
  const d = reduceFull(day);
  const m = reduceFull(month);
  const y = reduceFull(digitSum(year));
  const c1 = reduceFull(Math.abs(m - d));
  const c2 = reduceFull(Math.abs(d - y));
  const c3 = reduceFull(Math.abs(c1 - c2));
  const c4 = reduceFull(Math.abs(m - y));
  const firstEnd = pinnacleAgeBounds(day, month, year);
  return [
    { index: 1, number: c1, startAge: 0, endAge: firstEnd },
    { index: 2, number: c2, startAge: firstEnd, endAge: firstEnd + 9 },
    { index: 3, number: c3, startAge: firstEnd + 9, endAge: firstEnd + 18 },
    { index: 4, number: c4, startAge: firstEnd + 18, endAge: null },
  ];
}

export const PINNACLE_MEANING: Record<number, string> = {
  1: "Giai đoạn đề cao tính độc lập, chủ động xây dựng bản sắc riêng, thường phải tự mở đường thay vì dựa vào người khác.",
  2: "Giai đoạn thiên về hợp tác, ngoại giao, xây dựng quan hệ — thành quả đến từ làm việc cùng người khác hơn là một mình.",
  3: "Giai đoạn thuận cho sáng tạo, giao tiếp, mở rộng quan hệ xã hội và thể hiện bản thân ra công chúng.",
  4: "Giai đoạn cần xây nền tảng vững chắc bằng kỷ luật và làm việc chăm chỉ — thành quả đến chậm nhưng bền.",
  5: "Giai đoạn nhiều biến động, thay đổi, cơ hội bất ngờ — đòi hỏi sự linh hoạt và sẵn sàng bước ra khỏi vùng an toàn.",
  6: "Giai đoạn trọng tâm là trách nhiệm gia đình, các mối quan hệ và phụng sự cộng đồng xung quanh.",
  7: "Giai đoạn hướng nội, tìm kiếm chiều sâu tri thức/tâm linh — thích hợp để chuyên môn hóa, nghiên cứu sâu một lĩnh vực.",
  8: "Giai đoạn tập trung vào thành tựu vật chất, tài chính, quyền lực và vị thế — cơ hội lớn nếu biết nắm bắt.",
  9: "Giai đoạn hoàn tất một chu kỳ lớn, thiên về cho đi, buông bỏ điều không còn phù hợp để chuẩn bị cho chương mới.",
  11: "Giai đoạn Số Chủ — tiềm năng truyền cảm hứng, trực giác mạnh, nhưng đi kèm áp lực và kỳ vọng nội tâm cao hơn bình thường.",
  22: "Giai đoạn Số Chủ — khả năng hiện thực hóa những dự định lớn, mang tầm ảnh hưởng vượt xa quy mô cá nhân.",
};

export const CHALLENGE_MEANING: Record<number, string> = {
  0: "Thử thách của sự lựa chọn — có nhiều ngã rẽ khả thi, khó khăn nằm ở việc phải tự chọn hướng đi và chịu trách nhiệm với lựa chọn đó.",
  1: "Thử thách về sự tự tin và độc lập — dễ phụ thuộc hoặc so sánh bản thân với người khác, cần học cách tin vào chính mình.",
  2: "Thử thách về sự nhạy cảm quá mức — dễ tổn thương trước lời nhận xét, cần rèn bản lĩnh mà không đánh mất sự tinh tế.",
  3: "Thử thách về việc thể hiện bản thân — dễ phân tán, nói nhiều làm ít hoặc ngại bộc lộ cảm xúc thật.",
  4: "Thử thách về kỷ luật và giới hạn — dễ cảm thấy gò bó bởi quy tắc, cần học cách làm việc có hệ thống mà không thấy ngột ngạt.",
  5: "Thử thách về sự tự do quá mức — dễ nóng vội, thiếu kiên định, cần học cân bằng giữa khám phá và cam kết.",
  6: "Thử thách về trách nhiệm và hoàn hảo — dễ ôm đồm, khắt khe với bản thân/người thân, cần học buông bớt kỳ vọng.",
  7: "Thử thách về niềm tin — dễ hoài nghi, khép kín, khó mở lòng tin tưởng người khác hoặc chính trực giác của mình.",
  8: "Thử thách về quyền lực và tiền bạc — dễ gặp thăng trầm tài chính hoặc mâu thuẫn quan điểm về thành công, cần học cách dùng quyền lực một cách cân bằng.",
};

// ---------------------------------------------------------------------------
// Năm / Tháng / Ngày cá nhân — chu kỳ rung động ngắn hạn.
// ---------------------------------------------------------------------------

export interface PersonalCycle {
  year: number;
  month: number;
  day: number;
}

export function computePersonalCycle(birthDay: number, birthMonth: number, targetDate: Date): PersonalCycle {
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  const yearDigitSum = digitSum(targetYear);
  const personalYear = reduceFull(reduceFull(birthDay) + reduceFull(birthMonth) + reduceFull(yearDigitSum)) || 9;
  const personalMonth = reduceFull(personalYear + targetMonth) || 9;
  const personalDay = reduceFull(personalMonth + targetDay) || 9;

  return { year: personalYear, month: personalMonth, day: personalDay };
}

export const CYCLE_NUMBER_MEANING: Record<number, { label: string; score: number; advice: string }> = {
  1: { label: "Khởi đầu", score: 74, advice: "Năng lượng tiên phong, thích hợp bắt đầu việc mới, thể hiện chủ kiến, hành động độc lập." },
  2: { label: "Hợp tác", score: 62, advice: "Thiên về kết nối, lắng nghe, làm việc nhóm — không phải lúc để đơn phương quyết định lớn." },
  3: { label: "Sáng tạo", score: 80, advice: "Giao tiếp, biểu đạt, kết nối xã hội thuận lợi — tốt cho gặp gỡ, trình bày ý tưởng, sáng tạo nội dung." },
  4: { label: "Nền tảng", score: 52, advice: "Cần sự kỷ luật, tỉ mỉ, xây nền — không phải ngày để nóng vội, dễ trì trệ nếu thiếu kiên nhẫn." },
  5: { label: "Biến động", score: 58, advice: "Thay đổi, tự do, những việc bất ngờ dễ xảy ra — linh hoạt thích nghi tốt hơn là bám cứng kế hoạch." },
  6: { label: "Hài hòa", score: 71, advice: "Thuận cho gia đình, trách nhiệm, chăm sóc các mối quan hệ — năng lượng ấm áp, cân bằng." },
  7: { label: "Nội tâm", score: 47, advice: "Thiên về suy ngẫm, nghiên cứu, ở một mình — không lý tưởng cho giao dịch lớn hoặc ra mắt công khai." },
  8: { label: "Quyền lực & Tài chính", score: 79, advice: "Thuận lợi cho tiền bạc, đàm phán, quyết định mang tính chiến lược — năng lượng thành quả rõ rệt." },
  9: { label: "Hoàn thành", score: 55, advice: "Thích hợp để kết thúc, buông bỏ, tổng kết một chu kỳ — không phải thời điểm tốt để khởi sự cái mới." },
};

export function cycleScore(n: number): number {
  const reduced = n > 9 ? reduceFull(n) : n;
  return CYCLE_NUMBER_MEANING[reduced]?.score ?? 60;
}

// ---------------------------------------------------------------------------
// Các chỉ số bổ sung: Đam mê tiềm ẩn, Số Cân Bằng, Nợ Nghiệp Quả, Bài học Nghiệp Quả.
// ---------------------------------------------------------------------------

export const HIDDEN_PASSION_MEANING: Record<number, string> = {
  1: "Khao khát ngầm được dẫn đầu, tự lập và khẳng định bản thân — tài năng thật sự tỏa sáng khi được trao quyền chủ động.",
  2: "Khao khát ngầm được kết nối, hòa hợp — tài năng thiên về ngoại giao, lắng nghe và làm cầu nối giữa mọi người.",
  3: "Khao khát ngầm được thể hiện và sáng tạo — tài năng thiên về nghệ thuật, ngôn từ, truyền đạt cảm xúc.",
  4: "Khao khát ngầm được xây dựng nền tảng vững chắc — tài năng thiên về tổ chức, quản lý chi tiết, đáng tin cậy.",
  5: "Khao khát ngầm được tự do, trải nghiệm cái mới — tài năng thiên về thích nghi nhanh, giao tiếp linh hoạt.",
  6: "Khao khát ngầm được chăm sóc, tạo hài hòa — tài năng thiên về nuôi dưỡng, thẩm mỹ, trách nhiệm với người thân.",
  7: "Khao khát ngầm được thấu hiểu bản chất sâu xa — tài năng thiên về phân tích, nghiên cứu, tư duy độc lập.",
  8: "Khao khát ngầm được công nhận thành tựu — tài năng thiên về quản lý nguồn lực, chiến lược, kinh doanh.",
  9: "Khao khát ngầm được cống hiến cho điều lớn lao hơn bản thân — tài năng thiên về lòng trắc ẩn, tầm nhìn rộng.",
};

export const BALANCE_MEANING: Record<number, string> = {
  1: "Khi mất cân bằng, cách lấy lại bình tĩnh hiệu quả nhất là chủ động hành động độc lập, tự ra quyết định thay vì chờ đợi.",
  2: "Khi mất cân bằng, nên tìm đến người thân/bạn bè để chia sẻ và cân nhắc cùng nhau thay vì tự xử lý một mình.",
  3: "Khi mất cân bằng, hãy tìm cách biểu đạt cảm xúc ra ngoài (viết, nói chuyện, sáng tạo) thay vì giữ trong lòng.",
  4: "Khi mất cân bằng, hãy quay về với trật tự, lập kế hoạch cụ thể từng bước để lấy lại cảm giác kiểm soát.",
  5: "Khi mất cân bằng, cần thay đổi môi trường hoặc thử điều gì đó mới để giải tỏa thay vì ép mình đứng yên.",
  6: "Khi mất cân bằng, tìm về gia đình hoặc không gian quen thuộc, chăm sóc người khác cũng là cách tự chữa lành.",
  7: "Khi mất cân bằng, cần thời gian ở một mình để suy ngẫm, tránh đưa ra quyết định khi đang còn hoang mang.",
  8: "Khi mất cân bằng, hãy tập trung lại vào mục tiêu thực tế, cụ thể — hành động hướng đến kết quả giúp ổn định tâm lý.",
  9: "Khi mất cân bằng, hãy nhìn vấn đề ở bức tranh lớn hơn và thực hành buông bỏ điều không còn kiểm soát được.",
};

export const KARMIC_DEBT_MEANING: Record<number, { title: string; meaning: string }> = {
  13: {
    title: "Nợ Nghiệp Quả 13/4",
    meaning: "Liên quan đến sự lười biếng hoặc trốn tránh trách nhiệm trong một kiếp/giai đoạn trước — bài học kiếp này là rèn kỷ luật, làm việc có tổ chức và không tìm đường tắt.",
  },
  14: {
    title: "Nợ Nghiệp Quả 14/5",
    meaning: "Liên quan đến việc lạm dụng tự do trước đây — bài học kiếp này là học cách tiết chế, tránh sa đà vào những cám dỗ nhất thời và giữ kỷ luật trong tự do.",
  },
  16: {
    title: "Nợ Nghiệp Quả 16/7",
    meaning: "Liên quan đến cái tôi/kiêu ngạo trong quá khứ — bài học kiếp này thường đến qua những cú sốc/đổ vỡ bất ngờ buộc phải nhìn lại bản thân và tái thiết từ nền tảng khiêm tốn hơn.",
  },
  19: {
    title: "Nợ Nghiệp Quả 19/1",
    meaning: "Liên quan đến việc lạm dụng quyền lực hoặc quá độc lập một cách ích kỷ trước đây — bài học kiếp này là học cách vừa tự lực vừa biết dựa vào và giúp đỡ người khác.",
  },
};

export const KARMIC_LESSON_MEANING: Record<number, string> = {
  1: "Chưa quen chủ động dẫn dắt hoặc đứng mũi chịu sào — cần chủ động rèn luyện sự tự tin, dám quyết định và đứng đầu khi cần.",
  2: "Chưa quen hợp tác, nhạy cảm với cảm xúc người khác — cần chủ động luyện kỹ năng lắng nghe và làm việc nhóm.",
  3: "Chưa quen thể hiện bản thân, giao tiếp hoặc sáng tạo — cần chủ động luyện nói, viết, hoặc bất kỳ hình thức biểu đạt nào.",
  4: "Chưa quen với kỷ luật, tổ chức, sự kiên nhẫn xây nền — cần chủ động luyện thói quen làm việc có hệ thống.",
  5: "Chưa quen với thay đổi, thích nghi, chấp nhận rủi ro có tính toán — cần chủ động bước ra khỏi vùng an toàn.",
  6: "Chưa quen với trách nhiệm, chăm sóc người khác hoặc gánh vác gia đình — cần chủ động luyện tinh thần trách nhiệm.",
  7: "Chưa quen với việc suy ngẫm sâu, tin vào trực giác hoặc dành thời gian ở một mình — cần chủ động luyện tư duy phản tư.",
  8: "Chưa quen với việc quản lý tiền bạc, quyền lực hoặc tư duy chiến lược dài hạn — cần chủ động học về tài chính và quản trị.",
  9: "Chưa quen với lòng trắc ẩn diện rộng hoặc buông bỏ vì lợi ích chung — cần chủ động mở rộng tầm nhìn ra ngoài bản thân.",
};
