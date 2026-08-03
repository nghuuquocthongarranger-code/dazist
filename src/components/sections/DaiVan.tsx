import { motion } from "framer-motion";
import { GlassCard, SectionHeading } from "../GlassCard";
import { daiVan, daiVanNote, daiVanMeta } from "../../data/baziProfile";
import { CanBadge, ChiBadge } from "../CanChiBadge";

export function DaiVan() {
  return (
    <section className="py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="XIII. Đại Vận" title="Hành trình 10 năm một chặng" subtitle={daiVanMeta} />

        <div className="relative pl-6 sm:pl-10">
          <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-linear-to-b from-gold via-white/15 to-transparent" />
          <div className="space-y-4">
            {daiVan.map((v, i) => (
              <motion.div
                key={v.ganChi}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative"
              >
                <span
                  className="absolute -left-6 sm:-left-10 top-5 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    borderColor: v.current ? "#d4af37" : v.favorable ? "#3ddc84" : "rgba(255,255,255,0.25)",
                    background: v.current ? "#d4af37" : "#0b0a18",
                    boxShadow: v.current ? "0 0 14px #d4af37" : undefined,
                  }}
                />
                <div
                  className={`glass rounded-xl p-4 sm:p-5 flex flex-wrap items-center gap-x-6 gap-y-2 ${
                    v.current ? "glass-gold-edge" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <CanBadge name={v.ganChi.split(" ")[0]} size="sm" />
                    <ChiBadge name={v.ganChi.split(" ")[1]} size="sm" />
                  </div>
                  <span className="text-white/45 text-sm">{v.start}</span>
                  <span className="text-white/45 text-sm">{v.age} tuổi</span>
                  <span
                    className={`text-sm ${v.favorable ? "text-moc" : "text-white/55"}`}
                  >
                    {v.tenGod}
                  </span>
                  {v.current && (
                    <span className="ml-auto text-xs uppercase tracking-wider text-gold-soft">
                      Đang trải qua
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <GlassCard className="mt-8" delay={0.2}>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed text-left">{daiVanNote}</p>
        </GlassCard>
      </div>
    </section>
  );
}
