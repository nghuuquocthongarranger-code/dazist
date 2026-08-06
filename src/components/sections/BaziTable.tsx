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
  daiVan,
  summary,
  tenGodRatios,
  tamThinTuHinh,
  luuNienByDaiVan,
} from "../../data/baziProfile";
import { CAN, CHI } from "../../lib/canChi";
import { ELEMENT_COLOR, type Element } from "../../lib/elements";

const CAN_ELEMENT: Record<string, Element> = Object.fromEntries(CAN.map((c) => [c.name, c.element]));
const CHI_ELEMENT: Record<string, Element> = Object.fromEntries(CHI.map((c) => [c.name, c.element]));

/** 12 Địa Chi luân phiên Dương/Âm bắt đầu từ Tý = Dương, đúng thứ tự khai báo trong CHI. */
const CHI_POLARITY: Record<string, "Dương" | "Âm"> = Object.fromEntries(
  CHI.map((c, i) => [c.name, i % 2 === 0 ? "Dương" : "Âm"]),
);

const ELEMENT_VN: Record<string, string> = { moc: "Mộc", hoa: "Hỏa", tho: "Thổ", kim: "Kim", thuy: "Thủy" };

function canNoteOf(can: string): string {
  const info = CAN.find((c) => c.name === can);
  if (!info) return "";
  return `${info.polarity === "duong" ? "Dương" : "Âm"} ${ELEMENT_VN[info.element]}`;
}

function chiNoteOf(chi: string): string {
  const element = CHI_ELEMENT[chi];
  if (!element) return "";
  return `${CHI_POLARITY[chi]} ${ELEMENT_VN[element]}`;
}

/* ──────── Modal ──────── */
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
            className="glass glass-gold-edge rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
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
  onClick,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`glass glass-gold-edge rounded-2xl p-5 sm:p-6 ${onClick ? "cursor-pointer hover:border-gold/50 hover:brightness-110 transition" : ""}`}
    >
      {eyebrow && <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-1">{eyebrow}</p>}
      <h3 className="font-display text-lg text-gradient-gold mb-3">{title}</h3>
      {children}
      {onClick && (
        <p className="text-xs text-gold-soft mt-2 text-right">Bấm để xem chi tiết →</p>
      )}
    </motion.div>
  );
}

/* ──────── Hồ sơ cá nhân ──────── */
function PersonalSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Hồ sơ cá nhân" eyebrow="Thông tin" onClick={() => setOpen(true)}>
        <p className="text-white/70 text-sm">{personalInfo.name} — {personalInfo.birthDate}</p>
        <p className="text-white/50 text-xs mt-1">{personalInfo.napAm}</p>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Hồ sơ cá nhân">
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
      </Modal>
    </>
  );
}

/* ──────── Bảng Tứ Trụ ──────── */
function PillarsTable() {
  const [selectedSao, setSelectedSao] = useState<string | null>(null);
  const saoData = selectedSao ? thanSatMeanings.find((s) => s.name === selectedSao) : null;

  return (
    <>
      <Section title="Lá số Tứ Trụ" eyebrow="Năm – Tháng – Ngày – Giờ">
        <p className="text-white/60 text-sm mb-4">
          Nhật Chủ: <span className="text-white font-semibold">{nhatChu.can}</span>{" "}
          <span className="text-white/40">({nhatChu.note})</span>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xs sm:text-sm text-white/80">
            <thead>
              <tr className="text-gold-soft border-b border-gold/20">
                <th className="text-left py-2 pr-3 w-[16%]"></th>
                {fourPillars.map((p) => (
                  <th key={p.position} className="text-center py-2 px-2 w-[21%]">{p.position}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-gold-soft font-semibold">Thiên Can</td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-2">
                    <span
                      className="font-display text-base sm:text-lg font-semibold"
                      style={{ color: ELEMENT_COLOR[CAN_ELEMENT[p.can]] }}
                    >
                      {p.can}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-1 text-white/30 text-[10px] sm:text-xs"></td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-1 text-[10px] sm:text-xs text-white/40">
                    {canNoteOf(p.can)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-gold-soft font-semibold">Địa Chi</td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-2">
                    <span
                      className="font-display text-base sm:text-lg font-semibold"
                      style={{ color: ELEMENT_COLOR[CHI_ELEMENT[p.chi]] }}
                    >
                      {p.chi}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-1 text-white/30 text-[10px] sm:text-xs"></td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-1 text-[10px] sm:text-xs text-white/40">
                    {chiNoteOf(p.chi)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 text-gold-soft font-semibold">Thập Thần</td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-2 text-white/70">{p.canTenGod}</td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 text-gold-soft font-semibold align-top">Can Tàng</td>
                {fourPillars.map((p) => (
                  <td key={p.position} className="text-center py-2">
                    {p.tangCan.map((tc, i) => (
                      <div key={i} className="text-white/60 leading-relaxed">
                        {tc.can} <span className="text-white/30">({tc.tenGod})</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-gold-soft font-semibold align-top">Thần Sát</td>
                {fourPillars.map((p) => {
                  const tsData = thanSatByPillar.find((t) => t.pillar.startsWith(p.position));
                  return (
                    <td key={p.position} className="text-center py-2">
                      {tsData?.list.map((sao, i) => {
                        const meaning = thanSatMeanings.find((m) => m.name === sao);
                        const color = meaning?.nature === "tot" ? "text-green-400" : meaning?.nature === "xau" ? "text-red-400" : "text-yellow-400";
                        return (
                          <button key={i} onClick={() => setSelectedSao(sao)} className={`block w-full text-left text-[10px] sm:text-xs leading-relaxed hover:underline ${color}`}>
                            {sao}
                          </button>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Modal open={!!selectedSao} onClose={() => setSelectedSao(null)} title={`Thần Sát: ${selectedSao}`}>
        {saoData ? (
          <div className="space-y-3 text-sm text-white/80">
            <p><span className="text-gold-soft font-semibold">Tần suất:</span> {saoData.freq}</p>
            <p><span className="text-gold-soft font-semibold">Tính chất:</span>{" "}
              <span className={saoData.nature === "tot" ? "text-green-400" : saoData.nature === "xau" ? "text-red-400" : "text-yellow-400"}>
                {saoData.nature === "tot" ? "Cát" : saoData.nature === "xau" ? "Hung" : "Trung tính"}
              </span>
            </p>
            <p><span className="text-gold-soft font-semibold">Ý nghĩa:</span> {saoData.desc}</p>
          </div>
        ) : (
          <p className="text-white/50 text-sm">Thần Sát này chưa có dữ liệu chi tiết.</p>
        )}
      </Modal>
    </>
  );
}

/* ──────── Thân Vượng & Dụng Thần ──────── */
function BodySection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Thân Vượng — Dụng / Hỷ / Kỵ Thần" eyebrow="Cốt lõi lá số" onClick={() => setOpen(true)}>
        <p className="text-gold-soft font-display text-lg">{bodyStrength.verdict}</p>
        <p className="text-white/50 text-xs mt-1">Cách cục: {bodyStrength.cachCuc}</p>
        <p className="text-white/60 text-sm mt-2 line-clamp-2">{bodyStrength.paragraphs[0]}</p>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Thân Vượng — Dụng / Hỷ / Kỵ Thần">
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
      </Modal>
    </>
  );
}

/* ──────── Ngũ Hành & Thập Thần ──────── */
function ElementsSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Tỉ lệ Ngũ Hành & Thập Thần" eyebrow="Ngũ Hành" onClick={() => setOpen(true)}>
        <div className="flex gap-2">
          {elementRatios.map((e) => (
            <div key={e.element} className="flex-1 text-center">
              <div className="h-2 rounded-full mb-1" style={{ background: ELEMENT_COLOR[e.element] }} />
              <span className="text-[10px] text-white/50">{e.label} {e.percent}%</span>
            </div>
          ))}
        </div>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tỉ lệ Ngũ Hành & Thập Thần">
        <div className="space-y-2">
          {elementRatios.map((e) => (
            <div key={e.element} className="flex items-center gap-3">
              <span className="text-xs text-white/70 w-10">{e.label}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${e.percent}%`, background: ELEMENT_COLOR[e.element] }} />
              </div>
              <span className="text-xs text-white/50 w-10 text-right">{e.percent}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-gold-soft text-xs font-semibold mb-2">Thập Thần:</p>
          <div className="grid grid-cols-2 gap-1">
            {tenGodRatios.filter(t => t.percent > 0).map((t) => (
              <div key={t.name} className="flex justify-between text-xs text-white/60">
                <span>{t.name}</span>
                <span>{t.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ──────── Gia đình & Hôn nhân ──────── */
function FamilySection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Gia đình & Hôn nhân" eyebrow="Lục thân · Lương duyên" onClick={() => setOpen(true)}>
        <div className="space-y-1">
          {family.slice(0, 2).map((f, i) => (
            <p key={i} className="text-xs text-white/60"><span className="text-gold-soft">{f.role}:</span> {f.desc.slice(0, 80)}...</p>
          ))}
        </div>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Gia đình & Hôn nhân">
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
      </Modal>
    </>
  );
}

/* ──────── Sức khỏe ──────── */
function HealthSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Sức khỏe" eyebrow="Cơ thể" onClick={() => setOpen(true)}>
        <div className="flex flex-wrap gap-2">
          {health.slice(0, 3).map((h, i) => (
            <span key={i} className="text-xs text-white/60 px-2 py-1 rounded-full bg-white/5">{h.organ}</span>
          ))}
          <span className="text-xs text-gold-soft">+{health.length - 3} mục</span>
        </div>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Sức khỏe">
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
      </Modal>
    </>
  );
}

/* ──────── Tài lộc & Sự nghiệp ──────── */
function WealthCareerSection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Tài lộc & Sự nghiệp" eyebrow="Tiền bạc · Con đường" onClick={() => setOpen(true)}>
        <p className="text-xs text-white/60 line-clamp-2">{wealth.taiTinh}</p>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tài lộc & Sự nghiệp">
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
      </Modal>
    </>
  );
}

/* ──────── Đại Vận & Lưu Niên ──────── */
function DaiVanSection() {
  const [selectedDV, setSelectedDV] = useState<string | null>(null);
  const luuNien = selectedDV ? luuNienByDaiVan[selectedDV] : null;

  return (
    <>
      <Section title="Đại Vận" eyebrow="Hành trình 10 năm một chặng">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-white/70">
            <thead>
              <tr className="text-gold-soft">
                <th className="text-left pb-2">#</th>
                <th className="text-left pb-2">Can Chi</th>
                <th className="text-left pb-2">Bắt đầu</th>
                <th className="text-left pb-2">Tuổi</th>
                <th className="text-left pb-2">Thập Thần</th>
              </tr>
            </thead>
            <tbody>
              {daiVan.map((dv, i) => (
                <tr key={i} onClick={() => setSelectedDV(dv.ganChi)} className="border-t border-white/5 cursor-pointer hover:bg-white/5 transition">
                  <td className="py-2">{i + 1}</td>
                  <td className={`py-2 font-semibold ${dv.favorable ? "text-green-400" : "text-red-400"}`}>{dv.ganChi}</td>
                  <td className="py-2">{dv.start}</td>
                  <td className="py-2">{dv.age}t</td>
                  <td className="py-2">{dv.tenGod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gold-soft mt-2 text-right">Bấm vào hàng để xem Lưu Niên →</p>
      </Section>

      <Modal open={!!selectedDV} onClose={() => setSelectedDV(null)} title={`Lưu Niên — Đại Vận ${selectedDV}`}>
        {luuNien && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-white/70">
              <thead>
                <tr className="text-gold-soft">
                  <th className="text-left pb-2">Năm</th>
                  <th className="text-left pb-2">Can Chi</th>
                  <th className="text-left pb-2">Tình cảm</th>
                  <th className="text-left pb-2">Tiền bạc</th>
                  <th className="text-left pb-2">Công việc</th>
                  <th className="text-left pb-2">Gia đình</th>
                  <th className="text-left pb-2">Sức khỏe</th>
                </tr>
              </thead>
              <tbody>
                {luuNien.map((ln, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2">{ln.nam}</td>
                    <td className="py-2 text-gold-soft">{ln.canChi}</td>
                    <td className="py-2 text-white/60 max-w-[120px] truncate" title={ln.tinhCam}>{ln.tinhCam}</td>
                    <td className="py-2 text-white/60 max-w-[120px] truncate" title={ln.tienBac}>{ln.tienBac}</td>
                    <td className="py-2 text-white/60 max-w-[120px] truncate" title={ln.congViec}>{ln.congViec}</td>
                    <td className="py-2 text-white/60 max-w-[120px] truncate" title={ln.giaDinh}>{ln.giaDinh}</td>
                    <td className="py-2 text-white/60 max-w-[120px] truncate" title={ln.sucKhoe}>{ln.sucKhoe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </>
  );
}

/* ──────── Tổng kết ──────── */
function SummarySection() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Section title="Tổng kết lá số" eyebrow="Luận chung" onClick={() => setOpen(true)}>
        <p className="text-sm text-white/70 line-clamp-3">{summary}</p>
      </Section>
      <Modal open={open} onClose={() => setOpen(false)} title="Tổng kết lá số">
        <p className="text-sm text-white/80 leading-relaxed">{summary}</p>
        <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
          <p className="text-gold-soft text-sm font-semibold mb-2">Tam Thìn Tự Hình</p>
          {tamThinTuHinh.paragraphs.map((p, i) => (
            <p key={i} className="text-xs text-white/70 mt-1">{p}</p>
          ))}
        </div>
      </Modal>
    </>
  );
}

/* ──────── Component chính ──────── */
export function BaziTable() {
  return (
    <section className="pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <PersonalSection />
        <PillarsTable />
        <BodySection />
        <ElementsSection />
        <FamilySection />
        <HealthSection />
        <WealthCareerSection />
        <DaiVanSection />
        <SummarySection />
      </div>
    </section>
  );
}