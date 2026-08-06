import { fourPillars, nhatChu, tenGodRatios } from "../../data/baziProfile";

export function FourPillarsContent() {
  return (
    <div>
      <p className="text-white/60 text-sm mb-6">
        Nhật Chủ: {nhatChu.can} — {nhatChu.note}. Điểm đặc biệt nhất của lá số: ba trụ Thìn liên tiếp ở Tháng – Ngày – Giờ.
      </p>

      {/* Bảng Tứ Trụ */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-gold-soft border-b border-white/10">Trụ</th>
              <th className="text-left py-2 px-3 text-gold-soft border-b border-white/10">Năm</th>
              <th className="text-left py-2 px-3 text-gold-soft border-b border-white/10">Tháng</th>
              <th className="text-left py-2 px-3 text-gold-soft border-b border-white/10">Ngày</th>
              <th className="text-left py-2 px-3 text-gold-soft border-b border-white/10">Giờ</th>
            </tr>
          </thead>
          <tbody>
            {/* Hàng 1: Thiên Can */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Thiên Can</td>
              {fourPillars.map((p) => (
                <td key={`can-${p.position}`} className="py-2 px-3 border-b border-white/5">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{p.can}</span>
                    <span className="text-xs text-white/50">{p.canNote}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Hàng 2: Thập Thần - NẰM DƯỚI THIÊN CAN */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Thập Thần</td>
              {fourPillars.map((p) => (
                <td key={`god-${p.position}`} className="py-2 px-3 border-b border-white/5">
                  <span className="text-amber-400/80 font-medium">
                    {p.position === "Ngày" ? "Nhật Chủ" : p.canTenGod}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hàng 3: Địa Chi */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Địa Chi</td>
              {fourPillars.map((p) => (
                <td key={`chi-${p.position}`} className="py-2 px-3 border-b border-white/5">
                  <span className="text-white font-medium">{p.chi}</span>
                </td>
              ))}
            </tr>

            {/* Hàng 4: Tàng Can */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium">Tàng Can</td>
              {fourPillars.map((p) => (
                <td key={`tang-${p.position}`} className="py-2 px-3">
                  <div className="flex flex-col gap-0.5">
                    {p.tangCan.map((t, i) => (
                      <span key={i} className="text-xs text-white/60">
                        {t.can} ({t.tenGod})
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tỷ lệ Thập Thần */}
      <div className="mt-6">
        <h4 className="text-gold-soft font-medium mb-3">Tỷ lệ 10 Thập Thần toàn cục</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {tenGodRatios.map((item) => (
            <div key={item.name} className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-white/70 text-sm">{item.name}</div>
              <div className="text-amber-400 font-bold text-lg">{item.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}