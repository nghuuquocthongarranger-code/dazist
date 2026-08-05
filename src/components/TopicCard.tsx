import { motion } from "framer-motion";
import { Link } from "react-router";

interface Props {
  eyebrow: string;
  title: string;
  teaser: string;
  onClick?: () => void;
  to?: string;
  delay?: number;
}

export function TopicCard({ eyebrow, title, teaser, onClick, to, delay = 0 }: Props) {
  const content = (
    <>
      <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">{eyebrow}</p>
      <p className="font-display text-lg text-gradient-gold font-semibold mb-2">{title}</p>
      <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{teaser}</p>
      <span className="inline-flex items-center gap-1.5 text-xs text-gold-soft group-hover:gap-2.5 transition-all">
        Xem chi tiết <span aria-hidden>→</span>
      </span>
    </>
  );

  const className =
    "glass glass-gold-edge rounded-2xl p-5 sm:p-6 text-left w-full h-full flex flex-col hover:border-gold/50 hover:brightness-110 transition group";

  if (to) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to={to} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {content}
    </motion.button>
  );
}
