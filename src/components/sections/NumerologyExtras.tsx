import {
  arrows,
  pinnacles,
  challenges,
  numerologyProfile,
  currentPersonalCycle,
} from "../../data/numerologyProfile";
import {
  PINNACLE_MEANING,
  CHALLENGE_MEANING,
  HIDDEN_PASSION_MEANING,
  BALANCE_MEANING,
  KARMIC_DEBT_MEANING,
  KARMIC_LESSON_MEANING,
} from "../../lib/numerology";

const STATUS_LABEL: Record<string, string> = {
  filled: "Đường hình thành",
  empty: "Đường trống",
  partial: "Chưa trọn vẹn",
};
const STATUS_BADGE: Record<string, string> = {
  filled: "border-moc/50 bg-moc/15 text-moc",
  empty: "border-hoa/50 bg-hoa/15 text-hoa",
  partial: "border-tho/50 bg-tho/15 text-tho",
};
const STATUS_CARD: Record<string, string> = {
  filled: "border-moc/25 bg-moc/5",
  empty: "border-hoa/25 bg-hoa/5",
  partial: "border-tho/25 bg-tho/5",
};

export function ArrowsContent() {
  const filled = arrows.filter((a) => a.status === "filled");
  const empty = arrows.filter((a) => a.status === "empty");
  const partial = arrows.filter((a) => a.status === "partial");
  const ordered = [...filled, ...empty, ...partial];

  return (
    <div>
      <p className="text-white/55 text-sm mb-6">
        Bảng đồ số Pythagoras chia thành 8 "Đường" (3 hàng, 3 cột, 2 đường chéo). Một Đường{" "}
        <span className="text-moc font-medium">hình thành</span> (xanh) khi cả 3 vị trí đều xuất hiện trong ngày
        sinh — biểu thị điểm mạnh bẩm sinh. Một Đường <span className="text-tho font-medium">chưa trọn vẹn</span>{" "}
        (vàng cam) khi chỉ 1–2 vị trí có mặt. Một Đường <span className="text-hoa font-medium">trống</span> (đỏ) khi
        cả 3 vị trí đều vắng mặt — biểu thị khía cạnh cần chủ động rèn luyện thay vì có sẵn.
      </p>
      <div className="space-y-4">
        {ordered.map((a) => (
          <div key={a.key} className={`rounded-2xl p-5 border ${STATUS_CARD[a.status]}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <p className="font-display text-base text-gold-soft">{a.name}</p>
              <span className={`text-xs rounded-full border px-3 py-1 font-medium ${STATUS_BADGE[a.status]}`}>
                {STATUS_LABEL[a.status]} ({a.numbers.join("-")})
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {a.status === "empty" ? a.emptyMeaning : a.filledMeaning}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const CX = 160;
const APEX_Y = 30;
const BASE_Y = 210;
const BASE_HALF_WIDTH = 150;

function halfWidthAtY(y: number) {
  return (BASE_HALF_WIDTH * Math.abs(y - APEX_Y)) / (BASE_Y - APEX_Y);
}

/** 4 tầng hình thang chồng lên nhau tạo thành kim tự tháp — orientation "up": đáy rộng dưới, đỉnh nhọn trên (Đỉnh Cao); "down": lật ngược, đáy rộng trên, đáy nhọn dưới (Thử Thách/Trũng). */
function pyramidTiers(orientation: "up" | "down") {
  const boundaries = [BASE_Y, 165, 120, 75, APEX_Y]; // 5 mốc y => 4 tầng
  return boundaries.slice(0, 4).map((yWide, i) => {
    const yNarrow = boundaries[i + 1];
    const hwWide = halfWidthAtY(yWide);
    const hwNarrow = halfWidthAtY(yNarrow);
    const yW = orientation === "up" ? yWide : APEX_Y + BASE_Y - yWide;
    const yN = orientation === "up" ? yNarrow : APEX_Y + BASE_Y - yNarrow;
    const midY = (yW + yN) / 2;
    if (i === 3) {
      // tầng cuối cùng thu về một điểm — hình tam giác
      return { points: `${CX - hwWide},${yW} ${CX + hwWide},${yW} ${CX},${yN}`, labelY: yW + (yN - yW) * 0.35 };
    }
    return {
      points: `${CX - hwWide},${yW} ${CX + hwWide},${yW} ${CX + hwNarrow},${yN} ${CX - hwNarrow},${yN}`,
      labelY: midY,
    };
  });
}

function PyramidDiagram({
  items,
  meaningMap,
  orientation,
  color,
}: {
  items: typeof pinnacles;
  meaningMap: Record<number, string>;
  orientation: "up" | "down";
  color: string;
}) {
  const tiers = pyramidTiers(orientation);
  return (
    <div>
      <svg viewBox="0 0 320 240" className="w-full max-w-xs mx-auto h-auto mb-4">
        {tiers.map((tier, i) => (
          <g key={i}>
            <polygon
              points={tier.points}
              fill={color}
              fillOpacity={0.08 + i * 0.05}
              stroke={color}
              strokeOpacity={0.5}
              strokeWidth={1.2}
            />
            <text x={CX} y={tier.labelY - 6} textAnchor="middle" fontSize={16} fontWeight={600} fill={color} className="font-display">
              {items[i].number}
            </text>
            <text x={CX} y={tier.labelY + 12} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.45)">
              {items[i].startAge === 0 ? "Từ sinh" : `${items[i].startAge}t`} –{" "}
              {items[i].endAge === null ? "về sau" : `${items[i].endAge}t`}
            </text>
          </g>
        ))}
      </svg>
      <div className="space-y-2">
        {items.map((p) => (
          <p key={p.index} className="text-white/65 text-xs leading-relaxed">
            <span className="text-gold-soft font-medium">{p.number}</span> ({p.startAge === 0 ? "từ sinh" : `${p.startAge}t`}–
            {p.endAge === null ? "về sau" : `${p.endAge}t`}): {meaningMap[p.number] ?? ""}
          </p>
        ))}
      </div>
    </div>
  );
}

function NineYearCycleWheel() {
  const R = 90;
  const CXW = 110;
  const CYW = 110;
  const current = currentPersonalCycle.year;
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Chu Kỳ 9 Năm (Số Năm Cá Nhân)</p>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <svg viewBox="0 0 220 220" className="w-48 h-48 shrink-0 mx-auto">
          <circle cx={CXW} cy={CYW} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          {Array.from({ length: 9 }, (_, i) => {
            const n = i + 1;
            const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
            const x = CXW + Math.cos(angle) * R;
            const y = CYW + Math.sin(angle) * R;
            const active = n === current;
            return (
              <g key={n}>
                <line x1={CXW} y1={CYW} x2={x} y2={y} stroke="rgba(212,175,55,0.15)" strokeWidth={1} />
                <circle cx={x} cy={y} r={active ? 16 : 12} fill={active ? "#d4af37" : "rgba(255,255,255,0.06)"} stroke="#d4af37" strokeOpacity={active ? 1 : 0.35} strokeWidth={1.2} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={active ? 13 : 11} fontWeight={active ? 700 : 400} fill={active ? "#1a1408" : "rgba(255,255,255,0.55)"} className="font-display">
                  {n}
                </text>
              </g>
            );
          })}
          <text x={CXW} y={CYW - 4} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)">
            Năm nay
          </text>
          <text x={CXW} y={CYW + 10} textAnchor="middle" fontSize={16} fontWeight={700} fill="#f1d98b" className="font-display">
            {current}
          </text>
        </svg>
        <p className="text-white/70 text-sm leading-relaxed">
          Số Năm Cá Nhân lặp lại theo chu kỳ 9 năm (1→9 rồi quay lại 1) — mỗi năm mang một chủ đề rung động khác
          nhau. Năm nay bạn đang ở Số <span className="text-gold-soft font-medium">{current}</span>:{" "}
          {CYCLE_NUMBER_MEANING_SHORT[current] ?? ""}
        </p>
      </div>
    </div>
  );
}

const CYCLE_NUMBER_MEANING_SHORT: Record<number, string> = {
  1: "một chu kỳ mới bắt đầu — thời điểm gieo hạt, khởi sự.",
  2: "chu kỳ hợp tác, kiên nhẫn xây dựng nền móng cho những gì vừa gieo.",
  3: "chu kỳ nở rộ, kết nối, thể hiện bản thân nhiều hơn.",
  4: "chu kỳ củng cố, làm việc chăm chỉ, xây nền vững chắc.",
  5: "chu kỳ biến động, thay đổi lớn, bước ngoặt giữa chu kỳ.",
  6: "chu kỳ trách nhiệm, gia đình, hài hòa các mối quan hệ.",
  7: "chu kỳ nhìn lại nội tâm, nghỉ ngơi, chuẩn bị cho giai đoạn cuối.",
  8: "chu kỳ gặt hái thành quả vật chất của cả 9 năm qua.",
  9: "chu kỳ hoàn tất, buông bỏ, chuẩn bị bước sang chu kỳ mới.",
};

export function PinnaclesChallengesContent() {
  return (
    <div>
      <p className="text-white/55 text-sm mb-6">
        Cuộc đời chia thành 4 giai đoạn lớn, hình dung như một kim tự tháp: nền móng ở giai đoạn đầu đời, thu hẹp dần
        lên đỉnh ở giai đoạn cuối. "Đỉnh" (Pinnacle) là cơ hội/năng lượng chủ đạo mỗi giai đoạn; "Thử thách"
        (Challenge) là bài học/trở ngại song hành, hình dung như một vùng trũng ngược lại.
      </p>

      <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Kim Tự Tháp Đỉnh Cao (Pinnacles)</p>
      <PyramidDiagram items={pinnacles} meaningMap={PINNACLE_MEANING} orientation="up" color="#d4af37" />

      <p className="text-xs uppercase tracking-widest text-white/40 mt-8 mb-3">Vùng Trũng Thử Thách (Challenges)</p>
      <PyramidDiagram items={challenges} meaningMap={CHALLENGE_MEANING} orientation="down" color="#ff5f5f" />

      <div className="mt-8 pt-6 border-t border-white/10">
        <NineYearCycleWheel />
      </div>
    </div>
  );
}

export function BonusNumbersContent() {
  const { hiddenPassion, balance, subconsciousSelf, karmicLessons, karmicDebts } = numerologyProfile;
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold-soft">
            {hiddenPassion}
          </span>
          <p className="text-xs uppercase tracking-widest text-white/40">Đam Mê Tiềm Ẩn (Hidden Passion)</p>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{HIDDEN_PASSION_MEANING[hiddenPassion]}</p>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full border border-gold/40 bg-gold/10 font-display text-lg text-gold-soft">
            {balance}
          </span>
          <p className="text-xs uppercase tracking-widest text-white/40">Số Cân Bằng (Balance Number)</p>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{BALANCE_MEANING[balance]}</p>
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
          Con Số Tiềm Thức (Subconscious Self) — {subconsciousSelf}/9
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          Đo mức độ tự tin ứng biến trước tình huống bất ngờ, dựa trên số "Đường" đầy đủ trong bảng đồ số. Điểm càng
          cao (gần 9) càng phản xạ bình tĩnh, tự tin; điểm thấp hơn cho thấy xu hướng cần thời gian chuẩn bị trước khi
          hành động.
        </p>
      </div>

      {karmicDebts.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Nợ Nghiệp Quả (Karmic Debt)</p>
          <div className="space-y-3">
            {karmicDebts.map((k) => (
              <div key={k} className="rounded-xl bg-black/20 border border-white/5 p-4">
                <p className="font-display text-sm text-gold-soft mb-1">{KARMIC_DEBT_MEANING[k]?.title}</p>
                <p className="text-white/70 text-sm leading-relaxed">{KARMIC_DEBT_MEANING[k]?.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {karmicLessons.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Bài Học Nghiệp Quả (Karmic Lessons)</p>
          <p className="text-white/50 text-xs mb-3">
            Các con số hoàn toàn vắng mặt trong tên (bỏ dấu) — khía cạnh không có sẵn nên cần chủ động rèn luyện.
          </p>
          <div className="space-y-3">
            {karmicLessons.map((k) => (
              <div key={k} className="rounded-xl bg-black/20 border border-white/5 p-4 flex gap-3">
                <span className="shrink-0 grid place-items-center w-8 h-8 rounded-full border border-white/20 font-display text-sm text-white/60">
                  {k}
                </span>
                <p className="min-w-0 text-white/70 text-sm leading-relaxed">{KARMIC_LESSON_MEANING[k]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
