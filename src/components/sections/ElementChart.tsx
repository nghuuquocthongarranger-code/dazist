import { motion } from "framer-motion";
import { elementRatios } from "../../data/baziProfile";
import { ELEMENT_COLOR, ELEMENT_ROLE, ROLE_LABEL } from "../../lib/elements";
import { ElementGlyph } from "../icons/ElementGlyph";

export function ElementChartContent() {
  return (
    <div>
      <p className="text-white/55 text-sm mb-6">
        Can gốc + Tàng Can có trọng số — kích thước hành tinh ở phần đầu trang phản ánh đúng tỉ lệ này.
      </p>
      <div className="space-y-5">
        {elementRatios.map((e, i) => {
          const color = ELEMENT_COLOR[e.element];
          const role = ELEMENT_ROLE[e.element];
          return (
            <div key={e.element} className="flex items-center gap-4">
              <span
                className="grid place-items-center rounded-full glass shrink-0"
                style={{ width: 44, height: 44, boxShadow: `0 0 16px -4px ${color}88` }}
              >
                <ElementGlyph element={e.element} size={24} />
              </span>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="font-display text-base" style={{ color }}>
                    {e.label}
                  </span>
                  <span className="text-sm text-white/50">
                    {ROLE_LABEL[role]} · {e.percent}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(e.percent / 38.8) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}55, ${color})` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
