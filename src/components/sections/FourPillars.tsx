import { fourPillars, nhatChu, tenGodRatios } from "../../data/baziProfile";

// Map màu sắc theo Ngũ Hành
const elementColorMap: Record<string, string> = {
  // Kim (trắng)
  "Tân": "text-white",
  "Canh": "text-white",
  // Thủy (xanh dương)
  "Nhâm": "text-blue-400",
  "Quý": "text-blue-400",
  "Hợi": "text-blue-400",
  "Tý": "text-blue-400",
  // Mộc (xanh lá)
  "Giáp": "text-green-500",
  "Ất": "text-green-500",
  "Dần": "text-green-500",
  "Mão": "text-green-500",
  // Thổ (vàng nâu)
  "Mậu": "text-amber-600",
  "Kỷ": "text-amber-600",
  "Thìn": "text-amber-600",
  "Tuất": "text-amber-600",
  "Sửu": "text-amber-600",
  "Mùi": "text-amber-600",
  // Hỏa (đỏ)
  "Bính": "text-red-500",
  "Đinh": "text-red-500",
  "Tỵ": "text-red-500",
  "Ngọ": "text-red-500",
};

// Hàm lấy màu
const getColor = (name: string): string => {
  return elementColorMap[name] || "text-white/70";
};

export function FourPillarsContent() {
  return (
    <div>
      <p className="text-white/60 text-sm mb-6">
        Nhật Chủ: <span className="text-amber-600 font-medium">{nhatChu.can}</span> — {nhatChu.note}.
      </p>

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
            {/* Hàng 1: Thiên Can - CÓ MÀU */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Thiên Can</td>
              {fourPillars.map((p) => (
                <td key={`can-${p.position}`} className="py-2 px-3 border-b border-white/5 text-center">
                  <span className={`font-medium text-base ${getColor(p.can)}`}>
                    {p.can}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hàng 2: Thập Thần */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Thập Thần</td>
              {fourPillars.map((p) => (
                <td key={`god-${p.position}`} className="py-2 px-3 border-b border-white/5 text-center">
                  <span className="text-amber-400/80 font-medium">
                    {p.position === "Ngày" ? "Nhật Chủ" : p.canTenGod}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hàng 3: Địa Chi - CÓ MÀU */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium border-b border-white/5">Địa Chi</td>
              {fourPillars.map((p) => (
                <td key={`chi-${p.position}`} className="py-2 px-3 border-b border-white/5 text-center">
                  <span className={`font-medium ${getColor(p.chi)}`}>
                    {p.chi}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hàng 4: Tàng Can - CÓ MÀU */}
            <tr>
              <td className="py-2 px-3 text-gold-soft font-medium">Tàng Can</td>
              {fourPillars.map((p) => (
                <td key={`tang-${p.position}`} className="py-2 px-3">
                  <div className="flex flex-col items-center gap-0.5">
                    {p.tangCan.map((t, i) => (
                      <span key={i} className={`text-xs ${getColor(t.can)}`}>
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

      {/* Chú thích màu sắc */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
        <span className="text-white">● Kim</span>
        <span className="text-blue-400">● Thủy</span>
        <span className="text-green-500">● Mộc</span>
        <span className="text-amber-600">● Thổ</span>
        <span className="text-red-500">● Hỏa</span>
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