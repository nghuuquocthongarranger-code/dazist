import { motion } from "framer-motion";
import { summary } from "../../data/baziProfile";

export function Summary() {
  return (
    <section className="py-24 sm:py-32 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.08), transparent 60%)",
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="uppercase tracking-[0.3em] text-xs sm:text-sm text-gold mb-4"
        >
          XIV. Tổng kết
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/90"
        >
          {summary}
        </motion.p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/10 text-center">
      <p className="font-display text-gradient-gold text-lg mb-1">DaZiST</p>
      <p className="text-white/35 text-xs">
        Lá số Bát Tự cá nhân hóa — nội dung mang tính tham khảo văn hóa - chiêm tinh phương Đông.
      </p>
    </footer>
  );
}
