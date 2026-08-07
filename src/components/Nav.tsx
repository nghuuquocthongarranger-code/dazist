import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { to: "/bat-tu", label: "Bát Tự" },
  { to: "/chiem-tinh", label: "Chiêm Tinh" },
  { to: "/than-so-hoc", label: "Thần Số Học" },
  { to: "/tarot", label: "Tarot" },
  { to: "/tu-vi", label: "Tử Vi" },
  { to: "/tong-hop", label: "Tổng Hợp" },
  { to: "/doi-tac", label: "Xem Đối Tác" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu di động mỗi khi chuyển trang, tránh menu che nội dung sau khi bấm link.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="font-display text-lg text-gradient-gold tracking-wide shrink-0">
          DaZiST
        </Link>

        {/* Desktop: hàng ngang đầy đủ */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
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

        {/* Di động: nút mở menu — tránh phải kéo ngang mới thấy hết mục */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          className="sm:hidden shrink-0 w-11 h-11 grid place-items-center rounded-xl border border-white/15 text-gold-soft"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`h-0.5 bg-current rounded transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-current rounded transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-current rounded transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Di động: bảng menu đầy đủ, hiện toàn bộ mục cùng lúc, không cần kéo tìm */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden border-t border-white/10 glass"
          >
            <div className="grid grid-cols-2 gap-2 p-4">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `text-sm rounded-xl px-3.5 py-3 border transition text-center ${
                      isActive
                        ? "border-gold/50 text-gold-soft bg-gold/10"
                        : "border-white/15 text-white/70"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to={{ pathname: "/", hash: "tra-cuu" }}
                className="col-span-2 text-sm rounded-xl px-3.5 py-3 border border-gold/40 text-gold-soft text-center"
              >
                Tra cứu ngày
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
