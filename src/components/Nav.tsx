import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-lg text-gradient-gold tracking-wide">
          DaZiST
        </a>
        <a
          href="#tra-cuu"
          className="text-sm rounded-full px-4 py-2 border border-gold/40 text-gold-soft hover:bg-gold/10 transition min-h-[40px] flex items-center"
        >
          Tra cứu ngày
        </a>
      </div>
    </nav>
  );
}
