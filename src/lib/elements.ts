export type Element = "moc" | "hoa" | "tho" | "kim" | "thuy";

export const ELEMENT_LABEL: Record<Element, string> = {
  moc: "Mộc",
  hoa: "Hỏa",
  tho: "Thổ",
  kim: "Kim",
  thuy: "Thủy",
};

export const ELEMENT_COLOR: Record<Element, string> = {
  moc: "#3ddc84",
  hoa: "#ff5f5f",
  tho: "#e0a94a",
  kim: "#f2e6c8",
  thuy: "#4a9fe0",
};

export const ELEMENT_COLOR_DIM: Record<Element, string> = {
  moc: "#1f6b45",
  hoa: "#7a2323",
  tho: "#7a5a1e",
  kim: "#a89a6f",
  thuy: "#1e3f6b",
};

// Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ
export const SINH: Record<Element, Element> = {
  tho: "kim",
  kim: "thuy",
  thuy: "moc",
  moc: "hoa",
  hoa: "tho",
};

// Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc
export const KHAC: Record<Element, Element> = {
  moc: "tho",
  tho: "thuy",
  thuy: "hoa",
  hoa: "kim",
  kim: "moc",
};

export type DungHyKy = "dung-than" | "hy-than" | "hy-than-phu" | "ky-than" | "trung-tinh";

/** Vai trò ngũ hành riêng cho lá số Mậu Nhật Chủ (Thân cực vượng) của DaZiST demo profile */
export const ELEMENT_ROLE: Record<Element, DungHyKy> = {
  moc: "dung-than",
  thuy: "hy-than",
  kim: "hy-than-phu",
  tho: "ky-than",
  hoa: "ky-than",
};

export const ROLE_LABEL: Record<DungHyKy, string> = {
  "dung-than": "Dụng Thần",
  "hy-than": "Hỷ Thần",
  "hy-than-phu": "Hỷ Thần phụ",
  "ky-than": "Kỵ Thần",
  "trung-tinh": "Trung tính",
};

export const ROLE_SCORE: Record<DungHyKy, number> = {
  "dung-than": 2,
  "hy-than": 1,
  "hy-than-phu": 0.5,
  "ky-than": -1.5,
  "trung-tinh": 0,
};
