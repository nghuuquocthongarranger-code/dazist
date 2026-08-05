import type { DrawnCard } from "./tarot";
import type { SpreadPosition } from "../data/tarotSpreads";
import { SUIT_LABEL, SUIT_THEME, type Suit } from "../data/tarotDeck";

const HEAVY_IDS = new Set(["death", "tower", "devil", "hanged-man", "moon"]);
const LIGHT_IDS = new Set(["sun", "star", "world", "temperance", "wheel-of-fortune", "justice"]);

const ALL_SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

const NUMEROLOGY: Record<number, string> = {
  0: "tiềm năng vô hạn chưa định hình — một khởi đầu hoàn toàn mới, chưa bị ràng buộc bởi bất kỳ khuôn khổ cũ nào",
  1: "ý chí cá nhân và tính tiên phong — năng lượng chủ đạo là chủ động hành động, không phải ngồi chờ đợi",
  2: "sự lựa chọn, hợp tác và cân bằng giữa hai thái cực — bạn đang đứng giữa một ngã rẽ cần được dung hòa",
  3: "sự sáng tạo, kết nối và biểu đạt — mọi thứ đang trong giai đoạn nảy nở, cần thêm thời gian để định hình rõ",
  4: "nền tảng, cấu trúc và sự ổn định — đây là lúc củng cố những gì đã có thay vì mở rộng thêm",
  5: "biến động, thử thách và điều chỉnh — một giai đoạn không thoải mái nhưng cần thiết để trưởng thành",
  6: "sự hài hòa, chữa lành và các mối quan hệ — cán cân đang dần được khôi phục sau xáo trộn",
  7: "sự nội tâm, đánh giá lại và tìm kiếm sự thật — câu trả lời nằm ở việc lắng nghe chính mình nhiều hơn",
  8: "sức mạnh nội lực và khả năng làm chủ — thành quả đến từ nỗ lực bền bỉ, không phải may mắn nhất thời",
  9: "một chặng đường sắp đi đến điểm gần cuối — đây là giai đoạn chiêm nghiệm trước khi bước sang chu kỳ mới",
};

function reduceNumber(n: number): number {
  let x = Math.abs(n);
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

export interface PositionNote {
  label: string;
  text: string;
}

export interface ReadingSynthesis {
  tone: "thuan-loi" | "can-nhac" | "can-bang";
  toneLabel: string;
  overview: string;
  points: string[];
  positionNotes: PositionNote[];
  numerologyNote: string;
  finalVerdict: string;
}

export function synthesizeReading(cards: DrawnCard[], positions?: SpreadPosition[]): ReadingSynthesis {
  const total = cards.length;
  const reversedCount = cards.filter((c) => c.reversed).length;
  const uprightCount = total - reversedCount;
  const reversedRatio = reversedCount / total;

  const majorCount = cards.filter((c) => c.card.arcana === "major").length;
  const minorCount = total - majorCount;
  const heavyCount = cards.filter((c) => HEAVY_IDS.has(c.card.id)).length;
  const lightCount = cards.filter((c) => LIGHT_IDS.has(c.card.id)).length;
  const courtCount = cards.filter((c) => c.card.arcana === "minor" && c.card.number >= 11).length;
  const aceCount = cards.filter((c) => c.card.arcana === "minor" && c.card.number === 1).length;

  const suitCounts: Partial<Record<Suit, number>> = {};
  cards.forEach((c) => {
    if (c.card.suit) suitCounts[c.card.suit] = (suitCounts[c.card.suit] ?? 0) + 1;
  });
  const presentSuits = Object.keys(suitCounts) as Suit[];
  const missingSuits = ALL_SUITS.filter((s) => !presentSuits.includes(s));
  const dominantSuitEntry = Object.entries(suitCounts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0] as
    | [Suit, number]
    | undefined;

  const majorAvgStage = majorCount > 0 ? cards.filter((c) => c.card.arcana === "major").reduce((s, c) => s + c.card.number, 0) / majorCount : 0;

  const numberSum = cards.reduce((s, c) => s + c.card.number, 0);
  const reducedNumber = reduceNumber(numberSum);

  const numberFreq: Record<number, number> = {};
  cards.forEach((c) => {
    numberFreq[c.card.number] = (numberFreq[c.card.number] ?? 0) + 1;
  });
  const repeatedNumbers = Object.entries(numberFreq).filter(([, count]) => count >= 2);

  // ---------- Overview ----------
  const overviewParts: string[] = [];
  overviewParts.push(
    `Trải bài gồm ${total} lá vẽ nên một bức tranh ${
      majorCount > minorCount
        ? "mang tính bước ngoặt, chịu ảnh hưởng bởi những chủ đề lớn, mang tính bài học trong hành trình của bạn"
        : majorCount === 0
          ? "xoay quanh những diễn biến cụ thể, thực tế trong đời sống hàng ngày, ít mang tính định mệnh"
          : "đan xen giữa những chủ đề lớn mang tính bài học và các chi tiết cụ thể, đời thường"
    }.`,
  );
  if (reversedRatio >= 0.6) {
    overviewParts.push(
      `Với ${reversedCount}/${total} lá xuất hiện ở thế ngược, năng lượng chủ đạo của trải bài hướng nội — nhiều điều đang bị kìm nén, trì hoãn hoặc cần được nhìn lại từ bên trong trước khi có thể biểu hiện trọn vẹn ra bên ngoài. Đây là giai đoạn thích hợp để tự vấn hơn là hành động vội vàng.`,
    );
  } else if (reversedRatio <= 0.15) {
    overviewParts.push(
      `Với ${uprightCount}/${total} lá ở thế xuôi, năng lượng của trải bài khá thông suốt và hướng ngoại — các sự việc có xu hướng diễn ra rõ ràng, đúng với ý nghĩa nguyên bản, ít bị cản trở bởi các yếu tố nội tâm phức tạp.`,
    );
  } else {
    overviewParts.push(
      `Tỉ lệ xuôi/ngược khá cân bằng (${uprightCount} xuôi, ${reversedCount} ngược), cho thấy tình huống hiện tại có cả những phần đã rõ ràng lẫn những phần vẫn còn khuất lấp, cần thêm thời gian và sự quan sát để bộc lộ đầy đủ.`,
    );
  }
  if (majorCount >= 2) {
    const stageLabel = majorAvgStage <= 7 ? "giai đoạn đầu — hình thành bản ngã và ý chí cá nhân" : majorAvgStage <= 14 ? "giai đoạn giữa — trưởng thành nội tâm và làm chủ bản thân" : "giai đoạn cuối — chuyển hóa, buông bỏ và hoàn thiện";
    overviewParts.push(
      `Các lá Ẩn Chính xuất hiện tập trung quanh ${stageLabel} của hành trình Kẻ Khờ (The Fool's Journey), gợi ý rằng đây chính xác là loại bài học bạn đang trải qua ở thời điểm hiện tại.`,
    );
  }
  const overview = overviewParts.join(" ");

  // ---------- Points ----------
  const points: string[] = [];

  if (majorCount / total >= 0.5) {
    points.push(
      `${majorCount}/${total} lá thuộc bộ Ẩn Chính (Major Arcana) — dấu hiệu cho thấy chủ đề bạn đang hỏi không đơn thuần là chuyện nhỏ nhặt, mà liên quan đến những bài học hoặc bước ngoặt quan trọng trong hành trình trưởng thành. Các lá Ẩn Chính mang năng lượng mang tính chu kỳ lớn, ít chịu chi phối bởi những lựa chọn vụn vặt hàng ngày hơn so với Ẩn Phụ, nên kết quả có thể cần thời gian dài hơn để bộc lộ trọn vẹn.`,
    );
  } else if (majorCount === 0) {
    points.push(
      `Không có lá Ẩn Chính nào xuất hiện — toàn bộ trải bài nghiêng hẳn về Ẩn Phụ (Minor Arcana), cho thấy vấn đề bạn đang đối mặt gắn liền với những tình huống cụ thể, có thể điều chỉnh và kiểm soát được bằng hành động thực tế hàng ngày, thay vì một bài học định mệnh lớn lao nào đó.`,
    );
  } else {
    points.push(
      `${majorCount}/${total} lá Ẩn Chính xuất hiện bên cạnh ${minorCount} lá Ẩn Phụ — có sự đan xen giữa một chủ đề mang tính bài học lớn và những chi tiết cụ thể, đời thường cùng góp phần định hình tình huống của bạn ở hiện tại.`,
    );
  }

  if (dominantSuitEntry) {
    const [suitKey, count] = dominantSuitEntry;
    if (count >= 2 || (minorCount > 0 && count / minorCount >= 0.5)) {
      points.push(
        `Chất bài chiếm ưu thế trong phần Ẩn Phụ là ${SUIT_LABEL[suitKey]} (${count} lá) — khía cạnh "${SUIT_THEME[suitKey].toLowerCase()}" đang là điều chi phối tình huống của bạn nhiều nhất ở giai đoạn này, và nhiều khả năng cũng là nơi bạn cần tập trung sự chú ý.`,
      );
    }
  }
  if (missingSuits.length > 0 && missingSuits.length < 4 && minorCount > 0) {
    points.push(
      `Vắng bóng hoàn toàn chất ${missingSuits.map((s) => SUIT_LABEL[s]).join(", ")} — khía cạnh liên quan (${missingSuits
        .map((s) => SUIT_THEME[s].toLowerCase())
        .join("; ")}) dường như chưa được bạn chú ý đến hoặc đang bị gạt sang một bên trong giai đoạn này, dù đó có thể lại chính là điều đáng để cân nhắc thêm.`,
    );
  }

  if (heavyCount > 0 && lightCount === 0) {
    points.push(
      `${heavyCount} lá mang tính chuyển hóa mạnh (như Tử Thần, Tòa Tháp, Ác Quỷ, Người Treo Ngược hoặc Mặt Trăng) xuất hiện mà không có lá "ánh sáng" nào để cân bằng lại — đây thường là dấu hiệu của một giai đoạn buông bỏ cần thiết, có thể gây khó chịu trong ngắn hạn nhưng lại mở đường cho sự thay đổi tích cực về lâu dài. Đừng vội xem đây là điềm xấu tuyệt đối — hãy xem nó như một lời nhắc rằng có điều gì đó đã đến lúc cần kết thúc để nhường chỗ cho cái mới.`,
    );
  } else if (lightCount > 0 && heavyCount === 0) {
    points.push(
      `${lightCount} lá mang năng lượng sáng, hy vọng (như Mặt Trời, Ngôi Sao, Thế Giới, Tiết Chế, Bánh Xe Số Mệnh hoặc Công Lý) xuất hiện mà không đi kèm lá thử thách nặng nề nào — đây là tín hiệu khá tích cực, cho thấy mọi thứ đang có xu hướng thuận theo chiều bạn mong muốn, dù vẫn cần sự chủ động để hiện thực hóa.`,
    );
  } else if (heavyCount > 0 && lightCount > 0) {
    points.push(
      `Trải bài có cả tín hiệu thử thách (${heavyCount} lá) lẫn tín hiệu hy vọng (${lightCount} lá) đan xen nhau — kết quả cuối cùng phụ thuộc nhiều vào lựa chọn và thái độ của chính bạn trong giai đoạn này hơn là một điều gì đó đã được định sẵn từ trước.`,
    );
  }

  if (courtCount > 0) {
    points.push(
      `Có ${courtCount} lá triều thần (Nhí, Kỵ Sĩ, Hoàng Hậu hoặc Vua) xuất hiện — dấu hiệu cho thấy một hoặc nhiều người xung quanh bạn (hoặc chính những phẩm chất bạn cần thể hiện ở bản thân) đang đóng vai trò quan trọng, ảnh hưởng trực tiếp đến cách tình huống này sẽ diễn tiến.`,
    );
  }
  if (aceCount >= 2) {
    points.push(
      `${aceCount} lá Át cùng xuất hiện trong trải bài — nhiều hạt giống khởi đầu mới đang được gieo xuống cùng lúc ở nhiều khía cạnh khác nhau của cuộc sống. Đây là giai đoạn giàu tiềm năng, nhưng cũng cần chọn lọc để tránh dàn trải sự tập trung của bạn quá mỏng.`,
    );
  }
  repeatedNumbers.forEach(([num, count]) => {
    const meaning = NUMEROLOGY[reduceNumber(Number(num))] ?? "một bài học đang lặp lại nhiều lần";
    points.push(
      `Số ${num} xuất hiện lặp lại ${count} lần trong trải bài — nhấn mạnh chủ đề về ${meaning}, thể hiện ở nhiều khía cạnh khác nhau cùng một lúc. Đây không phải là sự trùng hợp ngẫu nhiên mà là điều đáng để bạn đặc biệt lưu tâm.`,
    );
  });

  // ---------- Position notes ----------
  const positionNotes: PositionNote[] = [];
  if (positions && positions.length === cards.length && cards.length > 1) {
    cards.forEach((c, i) => {
      const pos = positions[i];
      const meaning = c.reversed ? c.card.reversed : c.card.upright;
      positionNotes.push({
        label: pos.label,
        text: `${c.card.name}${c.reversed ? " (ngược)" : ""} xuất hiện ở vị trí này — ${pos.meaning} Cụ thể hơn: ${meaning}`,
      });
    });
  }

  // ---------- Numerology ----------
  const numerologyNote = `Tổng giá trị số học của toàn bộ các lá bài trong trải bài này là ${numberSum}, rút gọn theo quy tắc số học Pythagoras về con số ${reducedNumber} — biểu trưng cho ${
    NUMEROLOGY[reducedNumber] ?? "một chu kỳ mới đang bắt đầu chuyển động"
  }. Đây là dòng năng lượng nền âm thầm xuyên suốt toàn bộ trải bài, không thể hiện trực tiếp qua một lá bài riêng lẻ nào nhưng lại chi phối cách các lá bài khác cộng hưởng với nhau.`;

  // ---------- Tone & final verdict ----------
  const score = uprightCount - reversedCount + lightCount * 1.5 - heavyCount * 1.5;
  let tone: ReadingSynthesis["tone"] = "can-bang";
  let toneLabel = "Cân bằng — vừa thuận lợi vừa cần nỗ lực";
  let finalVerdict =
    "Nhìn tổng thể, trải bài lần này không nghiêng hẳn về phía nào. Kết quả cuối cùng phụ thuộc phần lớn vào lựa chọn và hành động của chính bạn kể từ thời điểm này trở đi — Tarot chỉ vạch ra xu hướng năng lượng đang hiện diện, chứ không định đoạt số phận thay bạn. Hãy xem những lá bài mang tính thử thách như một lời nhắc cần điều chỉnh cách tiếp cận, và những lá bài thuận lợi như sự xác nhận cho hướng đi đang đúng, thay vì diễn giải một chiều theo cảm tính nhất thời.";

  if (score >= total * 0.35) {
    tone = "thuan-loi";
    toneLabel = "Thuận lợi";
    finalVerdict =
      "Nhìn tổng thể, trải bài lần này nghiêng khá rõ về hướng thuận lợi. Đây là thời điểm phù hợp để chủ động hành động theo những gì các lá bài gợi ý, thay vì tiếp tục chần chừ chờ đợi thêm tín hiệu. Tuy nhiên, thuận lợi không đồng nghĩa với việc không cần nỗ lực — hãy tận dụng dòng năng lượng tích cực này bằng những bước đi cụ thể, rõ ràng, đồng thời tránh chủ quan trước những chi tiết nhỏ có thể bị bỏ sót trong lúc mọi việc đang suôn sẻ.";
  } else if (score <= -total * 0.35) {
    tone = "can-nhac";
    toneLabel = "Cần cân nhắc kỹ";
    finalVerdict =
      "Nhìn tổng thể, trải bài lần này có khá nhiều tín hiệu cần thận trọng. Đây không phải lúc để đưa ra quyết định vội vàng hay hành động theo cảm tính nhất thời — hãy dành thêm thời gian quan sát, tham khảo thêm những góc nhìn khác, và chuẩn bị tâm lý cho khả năng mọi việc không diễn ra suôn sẻ như kỳ vọng ban đầu. Những lá bài thử thách xuất hiện không phải để khiến bạn lo sợ, mà để bạn có sự chuẩn bị kỹ lưỡng và tỉnh táo hơn trước khi bước tiếp.";
  }

  return { tone, toneLabel, overview, points, positionNotes, numerologyNote, finalVerdict };
}
