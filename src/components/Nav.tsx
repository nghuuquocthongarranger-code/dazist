import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

const NAV_LINKS = [
  { to: "/bat-tu", label: "Bát Tự" },
  { to: "/chiem-tinh", label: "Chiêm Tinh" },
  { to: "/than-so-hoc", label: "Thần Số Học" },
  { to: "/tarot", label: "Tarot" },
  { to: "/tong-hop", label: "Tổng Hợp" },
];

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
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="font-display text-lg text-gradient-gold tracking-wide shrink-0">
          DaZiST
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `shrink-0 text-sm rounded-full px-3.5 sm:px-4 py-2 border transition min-h-[40px] flex items-center ${
                  isActive
                    ? "border-gold/50 text-gold-soft bg-gold/10"
                    : "border-white/15 text-white/70 hover:border-gold/40 hover:text-gold-soft"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to={{ pathname: "/", hash: "tra-cuu" }}
            className="shrink-0 text-sm rounded-full px-3.5 sm:px-4 py-2 border border-gold/40 text-gold-soft hover:bg-gold/10 transition min-h-[40px] flex items-center"
          >
            Tra cứu ngày
          </Link>
        </div>
      </div>
    </nav>
  );
}
