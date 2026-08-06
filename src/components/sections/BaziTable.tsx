import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fourPillars,
  nhatChu,
  personalInfo,
  bodyStrength,
  dungHyKy,
  elementRatios,
  family,
  marriage,
  health,
  healthGeneral,
  wealth,
  career,
  thanSatByPillar,
  thanSatMeanings,
  thanSatSummary,
  daiVan,
  daiVanNote,
  daiVanMeta,
  summary,
  tenGodRatios,
  tamThinTuHinh,
} from "../../data/baziProfile";

const ELEMENT_COLOR: Record<string, string> = {
  moc: "#2fbf9b",
  hoa: "#e2493f",
  tho: "#e0b23c",
  kim: "#a988d9",
  thuy: "#22447a",
};

/* ──────── Modal dùng chung ──────── */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-gold-edge rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 className="font-display text-xl text-gradient-gold mb-4">{title}</h3>
            {children}
            <button onClick={onClose} className="mt-4 text-sm text-gold-soft hover:text-gold transition">
              Đóng
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────── Card Section ──────── */
function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
      className="glass glass-gold-edge rounded-2xl p-5 sm:p-6"
    >
      {eyebrow && <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">{eyebrow}</p>}
      <h3 className="font-display text-lg text-gradient-gold mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

/* ──────── Bảng Tứ Trụ 4 cột ──────── */
function PillarsTable() {
  const [selected, setSelected] = useState<(typeof fourPillars)[0] | null>(null);

  return (
    <>
      <Section title="Tứ Trụ" eyebrow="Năm – Tháng – Ngày – Giờ">
        <p className="text-white/60 text-sm mb-4">
          Nhật Chủ: <span className="text-white font-semibold">{nhatChu.can}</span>{" "}
          <span className="text-white/40">({nhatChu.note})</span>
        </p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {fourPillars.map((p) => (
            <button
              key={p.position}
              onClick={() => setSelected(p)}
              className="glass rounded-xl p-3 hover:border-gold/40 transition text-left"
            >
              <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">{p.position}</p>
              <p className="font-display text-xl text-white">{p.can}</p>
              <p className="text-xs text-white/40">{p.canNote}</p>
              <p className="text-lg text-gold-soft font-display mt-1">{p.chi}</p>
              <p className="text-[10px] text-white/50 mt-1">{p.canTenGod}</p>
            </button>
          ))}
        </div>
      </Section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Trụ ${selected?.position}`}>
        {selected && (
          <div className="space-y-3 text-sm text-white/80">
            <p><span className="text-gold-soft font-semibold">Thiên Can:</span> {selected.can} ({selected.canNote})</p>
            <p><span className="text-gold-soft font-semibold">Địa Chi:</span> {selected.chi}</p>
            <p><span className="text-gold-soft font-semibold">Thập Thần:</span> {selected.canTenGod}</p>
            <div>
              <p className="text-gold-soft font-semibold mb-1">Can Tàng (Địa Chi ẩn tàng):</p>
              <div className="space-y-1 pl-3">
                {selected.tangCan.map((tc, i) => (
                  <p key={i}>{tc.can} — {tc.tenGod}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/* ──────── Hồ sơ ──────── */
function PersonalSection() {
  return (
    <Section title="Hồ sơ cá nhân" eyebrow="I. Thông tin">
      <div className="space-y-2 text-sm">
        <p><span className="text-gold-soft">Họ tên:</span> {personalInfo.name}</p>
        <p><span className="text-gold-soft">Ngày sinh:</span> {personalInfo.birthDate}</p>
        <p><span className="text-gold-soft">Giới tính:</span> {personalInfo.gender}</p>
        <p><span className="text-gold-soft">Nạp Âm:</span> {personalInfo.napAm}</p>
        <div className="mt-2 space-y-2">
          {personalInfo.napAmDesc.map((d, i) => (
            <p key={i} className="text-white/55 text-sm leading-relaxed">{d}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──────── Thân Vượng & Dụng Thần ──────── */
function BodySection() {
  return (
    <Section title="Thân Vượng — Dụng / Hỷ / Kỵ Thần" eyebrow="II & III. Cốt lõi lá số">
      <p className="text-gold-soft font-display text-lg">{bodyStrength.verdict}</p>
      <p className="text-white/50 text-xs mt-1">Cách cục: {bodyStrength.cachCuc}</p>
      <div className="mt-3 space-y-2">
        {bodyStrength.paragraphs.map((p, i) => (
          <p key={i} className="text-white/70 text-sm leading-relaxed">{p}</p>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {dungHyKy.map((d) => (
          <div key={d.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: ELEMENT_COLOR[d.colorElement] + "18" }}>
            <span className="shrink-0 w-3 h-3 rounded-full mt-1.5" style={{ background: ELEMENT_COLOR[d.colorElement] }} />
            <div>
              <p className="text-sm font-semibold text-white">{d.title}: {d.element}</p>
              <p className="text-xs text-white/50">{d.tenGod}</p>
              <p className="text-xs text-white/70 mt-1">{d.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ──────── Ngũ Hành ──────── */
function ElementsSection() {
  return (
    <Section title="Tỉ lệ Ngũ Hành toàn cục" eyebrow="IV. Ngũ Hành">
      <div className="space-y-2">
        {elementRatios.map((e) => (
          <div key={e.element} className="flex items-center gap-3">
            <span className="text-xs text-white/70 w-10">{e.label}</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${e.percent}%`, background: ELEMENT_COLOR[e.element] }} />
            </div>
            <span className="text-xs text-white/50 w-10 text-right">{e.percent}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-gold-soft text-xs font-semibold mb-2">Thập Thần:</p>
        <div className="space-y-1">
          {tenGodRatios.filter(t => t.percent > 0).map((t) => (
            <div key={t.name} className="flex justify-between text-xs text-white/60">
              <span>{t.name}</span>
              <span>{t.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ──────── Gia đình & Hôn nhân ──────── */
function FamilySection() {
  return (
    <Section title="Gia đình & Hôn nhân" eyebrow="V & VI. Lục thân · Lương duyên">
      <div className="space-y-4">
        {family.map((f, i) => (
          <div key={i}>
            <p className="text-gold-soft font-semibold text-sm">{f.role}</p>
            <p className="text-xs text-white/40">{f.tenGod}</p>
            <p className="text-xs text-white/70 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gold/10">
        <p className="text-gold-soft text-sm font-semibold mb-2">Hôn nhân</p>
        {marriage.map((m, i) => (
          <p key={i} className="text-xs text-white/70 leading-relaxed mb-2">{m}</p>
        ))}
      </div>
    </Section>
  );
}

/* ──────── Sức khỏe ──────── */
function HealthSection() {
  return (
    <Section title="Sức khỏe" eyebrow="VII. Cơ thể">
      <div className="space-y-3">
        {health.map((h, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: ELEMENT_COLOR[h.element] }} />
            <div>
              <p className="text-sm text-white font-semibold">{h.organ}</p>
              <p className="text-xs text-white/60">{h.note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-3 italic">{healthGeneral}</p>
    </Section>
  );
}

/* ──────── Tài lộc & Sự nghiệp ──────── */
function WealthCareerSection() {
  return (
    <Section title="Tài lộc & Sự nghiệp" eyebrow="VIII & IX. Tiền bạc · Con đường">
      <div className="space-y-3">
        <div>
          <p className="text-gold-soft text-sm font-semibold">Tài tinh</p>
          <p className="text-xs text-white/70">{wealth.taiTinh}</p>
        </div>
        <div>
          <p className="text-red-400 text-sm font-semibold">Rủi ro</p>
          <p className="text-xs text-white/70">{wealth.risk}</p>
        </div>
        <div>
          <p className="text-gold-soft text-sm font-semibold">Gợi ý</p>
          <p className="text-xs text-white/70">{wealth.suggestion}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gold/10">
        <p className="text-gold-soft text-sm font-semibold mb-2">Sự nghiệp</p>
        {career.map((c, i) => (
          <p key={i} className="text-xs text-white/70 leading-relaxed mb-1">• {c}</p>
        ))}
      </div>
    </Section>
  );
}

/* ──────── Thần Sát ──────── */
function ThanSatSection() {
  return (
    <Section title="Thần Sát" eyebrow="X. Các sao trong lá số">
      <div className="grid sm:grid-cols-2 gap-4">
        {thanSatByPillar.map((ts) => (
          <div key={ts.pillar}>
            <p className="text-gold-soft text-xs font-semibold mb-1">Trụ {ts.pillar}</p>
            <p className="text-xs text-white/60">{ts.list.join(" · ")}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {thanSatMeanings.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`shrink-0 text-[10px] mt-0.5 ${s.nature === "tot" ? "text-green-400" : s.nature === "xau" ? "text-red-400" : "text-yellow-400"}`}>
              {s.nature === "tot" ? "●" : s.nature === "xau" ? "▲" : "■"}
            </span>
            <div>
              <p className="text-xs text-white font-semibold">{s.name} <span className="text-white/30">({s.freq})</span></p>
              <p className="text-xs text-white/60">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50 mt-3 italic">{thanSatSummary}</p>
    </Section>
  );
}

/* ──────── Đại Vận ──────── */
function DaiVanSection() {
  return (
    <Section title="Đại Vận" eyebrow="XI. Hành trình 10 năm">
      <p className="text-xs text-white/50 mb-4">{daiVanMeta}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-white/70">
          <thead>
            <tr className="text-gold-soft">
              <th className="text-left pb-2">TT</th>
              <th className="text-left pb-2">Can Chi</th>
              <th className="text-left pb-2">Bắt đầu</th>
              <th className="text-left pb-2">Tuổi</th>
              <th className="text-left pb-2">Thập Thần</th>
            </tr>
          </thead>
          <tbody>
            {daiVan.map((dv, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-2">{i + 1}</td>
                <td className={`py-2 ${dv.favorable ? "text-green-400" : "text-red-400"}`}>{dv.ganChi}</td>
                <td className="py-2">{dv.start}</td>
                <td className="py-2">{dv.age}t</td>
                <td className="py-2">{dv.tenGod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/50 mt-3 italic">{daiVanNote}</p>
    </Section>
  );
}

/* ──────── Tổng kết ──────── */
function SummarySection() {
  return (
    <Section title="Tổng kết lá số" eyebrow="XII. Luận chung">
      <p className="text-sm text-white/80 leading-relaxed">{summary}</p>
      <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
        <p className="text-gold-soft text-sm font-semibold mb-2">Tam Thìn Tự Hình</p>
        <p className="text-xs text-white/70">{tamThinTuHinh.paragraphs[0]}</p>
        <p className="text-xs text-white/70 mt-1">{tamThinTuHinh.paragraphs[1]}</p>
      </div>
    </Section>
  );
}

/* ──────── Component chính ──────── */
export function BaziTable() {
  return (
    <section className="pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <PillarsTable />
        <PersonalSection />
        <BodySection />
        <ElementsSection />
        <FamilySection />
        <HealthSection />
        <WealthCareerSection />
        <ThanSatSection />
        <DaiVanSection />
        <SummarySection />
      </div>
    </section>
  );
}