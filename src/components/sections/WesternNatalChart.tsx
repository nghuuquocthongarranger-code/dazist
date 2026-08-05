import {
  birthInfo,
  natalPlanets,
  natalAngles,
  natalHouseCusps,
  sensitivePoints,
} from "../../data/westernNatalProfile";

export function WesternNatalChartContent() {
  return (
    <div>
      <p className="text-white/55 text-sm mb-6">
        Dữ liệu cố định dùng để đối chiếu với vị trí hành tinh transit mỗi ngày trong công cụ Tra cứu ngày.
      </p>

      <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5 mb-4">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-5">Thông tin sinh</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/40 text-xs mb-1">Ngày giờ sinh</p>
            <p className="text-white/85">{birthInfo.date} — {birthInfo.time}</p>
            <p className="text-white/50 text-xs mt-0.5">{birthInfo.universalTime}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Nơi sinh</p>
            <p className="text-white/85">{birthInfo.place}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-1">Hệ thống tính</p>
            <p className="text-white/85">Hệ nhà: {birthInfo.houseSystem}</p>
            <p className="text-white/85">Hoàng đạo: {birthInfo.zodiac}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Vị trí hành tinh</p>
          <ul className="divide-y divide-white/5">
            {natalPlanets.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="flex items-center gap-2.5 text-white/80">
                  <span className="text-gold-soft w-5 text-center font-display">{p.symbol}</span>
                  {p.name}
                  {p.retrograde && <span className="text-hoa text-xs">℞</span>}
                </span>
                <span className="text-white/55 text-right">
                  {p.degree} {p.sign} <span className="text-white/35">· {p.house}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Điểm góc (Angles)</p>
            <div className="grid grid-cols-2 gap-3">
              {natalAngles.map((a) => (
                <div key={a.symbol} className="rounded-xl bg-black/20 border border-white/5 p-3">
                  <p className="text-gold-soft font-display text-sm mb-1">{a.symbol}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{a.name}</p>
                  <p className="text-white/85 text-sm mt-1">
                    {a.degree} {a.sign}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-black/20 border border-white/5 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Cusp các Nhà chính</p>
            <ul className="space-y-2 text-sm">
              {natalHouseCusps.map((h) => (
                <li key={h.house} className="flex justify-between text-white/70">
                  <span>{h.house}</span>
                  <span className="text-white/85">
                    {h.degree} {h.sign}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest text-white/40 mb-4 px-1">Điểm nhạy cảm ưu tiên theo dõi</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {sensitivePoints.map((s) => (
          <div key={s.title} className="rounded-xl bg-black/20 border border-gold/20 p-4">
            <p className="font-display text-gold-soft text-base mb-2">{s.title}</p>
            <p className="text-white/65 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
