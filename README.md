# DaZiST — Bát Tự Cá Nhân Hóa

Website Bát Tự cá nhân hóa: hero 3D với 5 hành tinh đại diện Ngũ Hành quay quanh Nhật Chủ, đầy đủ 14 phần luận giải lá số, và công cụ tra cứu "ngày tốt/xấu hôm nay" tính trực tiếp trên trình duyệt dựa trên Dụng Thần / Hỷ Thần / Kỵ Thần.

Stack: Vite + React + TypeScript + Tailwind CSS v4 + Three.js (`@react-three/fiber`) + Framer Motion. Toàn bộ tính toán Can Chi và Bát Tự chạy **client-side** — không cần backend Node.js hay database khi chạy production, nên build ra có thể deploy lên **bất kỳ gói hosting nào** (kể cả Shared Hosting cơ bản).

## Phát triển

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/` — đây là các file tĩnh (HTML/CSS/JS), dùng đường dẫn tương đối (`base: './'`) nên có thể upload vào bất kỳ thư mục con nào trên hosting mà không cần cấu hình thêm.

## Deploy lên Hostinger

**Cách đơn giản nhất — Shared Hosting / bất kỳ gói nào (khuyến nghị):**

1. Chạy `npm run build` để tạo thư mục `dist/`.
2. Vào **hPanel → File Manager**, mở thư mục `public_html` (hoặc thư mục con của domain/subdomain bạn muốn deploy).
3. Upload toàn bộ **nội dung bên trong** `dist/` (không upload cả thư mục `dist`) vào `public_html`.
4. Truy cập domain — xong. Không cần Node.js chạy trên server vì đây là site tĩnh.

Thay thế: dùng FTP/SFTP (thông tin trong hPanel → Files → FTP Accounts) để upload `dist/*` bằng FileZilla hoặc `scp`.

**Nếu gói của bạn hỗ trợ Node.js (Business/Cloud/VPS)** và sau này muốn thêm backend (ví dụ lưu nhiều hồ sơ người dùng, xác thực...), có thể dùng tính năng **Setup Node.js App** trong hPanel hoặc PM2 + Nginx trên VPS — nhưng với phiên bản hiện tại (1 hồ sơ, tính toán client-side) là không bắt buộc.

## Cấu trúc dữ liệu

- `src/data/baziProfile.ts` — toàn bộ nội dung lá số (Tứ Trụ, Thập Thần, Dụng/Hỷ/Kỵ Thần, Thần Sát, Đại Vận...).
- `src/lib/canChi.ts` — thuật toán tính Can Chi của ngày (Julian Day Number) và đối chiếu Thập Thần/Dụng-Hỷ-Kỵ để chấm điểm ngày tốt/xấu (thang 0-100).
- `src/lib/elements.ts` — bảng màu và quan hệ sinh/khắc Ngũ Hành.

## Bản quyền texture hành tinh

Ảnh bề mặt Sao Thủy/Kim/Hỏa/Mộc/Thổ, vành đai Sao Thổ và Mặt Trời trong `src/assets/textures/` lấy từ [Solar System Scope](https://www.solarsystemscope.com/textures/), phát hành theo giấy phép **Creative Commons Attribution 4.0 International (CC BY 4.0)** — được phép dùng cho mục đích thương mại lẫn phi thương mại, miễn ghi nguồn.
