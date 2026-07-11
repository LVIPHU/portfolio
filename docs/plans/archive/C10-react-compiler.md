# C10 — Bật React Compiler cho cả 2 app

> **Phụ thuộc:** C9 (hết framer-motion — tránh nhiễu khi chẩn đoán lỗi compiler với thư viện animation cũ).
> **Ước lượng:** ~1–2h. **Commit:** `feat: enable react compiler in both apps`

## 1. Mục tiêu & phạm vi

Bật memo hóa tự động (React Compiler — stable option trong Next 16) cho web-2025 + web-2026. **Không** gỡ `useMemo`/`useCallback` thủ công trong phase này (compiler tôn trọng code hiện có; dọn là việc tương lai, tách bạch để dễ bisect).

## 2. Hướng code chi tiết

1. Cài: `pnpm --filter web-2025 --filter web-2026 add -D babel-plugin-react-compiler@latest`.
2. Mỗi `next.config.ts`:
   ```ts
   reactCompiler: true,   // Next 16: top-level option (không còn experimental)
   ```
3. ESLint để bắt vi phạm Rules of React (rules compiler đã merge vào `eslint-plugin-react-hooks@^6`): tạo `eslint.config.mjs` **ở root** (flat config) với `react-hooks/recommended-latest`, scope `apps/**/src` + `packages/**/src`; thêm script root `lint: eslint .`. Đây là ESLint quay lại repo sau khi C7 bỏ `next lint` — chỉ 1 plugin, không kéo cả eslint-config-next.
4. Chạy `pnpm lint` → sửa vi phạm rõ ràng (deps sai, setState trong render…); vi phạm khó ở component phức tạp: gắn `'use no memo'` đầu function để opt-out cục bộ + ghi chú lý do, quay lại sau.
5. Build cả 2 — thời gian build tăng (babel pass thêm) là chấp nhận được, ghi lại con số trước/sau để tham khảo.

## 3. Design pattern

- **Opt-out cục bộ thay vì tắt toàn cục**: `'use no memo'` per-component là van xả — không bao giờ revert cả flag vì 1 component lỗi.
- **Compiler as linter**: giá trị lớn nhất phase này không phải perf mà là ESLint rules ép code tuân Rules of React — nền cho mọi refactor sau.

## 4. Tối ưu

- Kỳ vọng thực tế: site SSG phần lớn RSC → lợi ích compiler tập trung ở island tương tác (kbar, dock GSAP, contact-form, gallery zoom). Đo re-render bằng React DevTools Profiler trước/sau trên kbar mở + gõ search (case nặng nhất).
- Không micro-optimize theo compiler output — để nguyên code idiomatic.

## 5. Testing & gate nghiệm thu

1. Build + typecheck cả 2 xanh; `pnpm lint` 0 error (warning được phép, ghi nợ).
2. Smoke kỹ các island client (compiler chỉ ảnh hưởng client components):
   - `:3001`: kbar search (gõ nhanh, kết quả đúng), dock magnify (không khựng — GSAP + compiler chung), contact-form validate + submit, theme/locale switch, gallery zoom, giscus.
   - `:3000`: theme toggle, locale switch, blog copy-button.
3. Console không có warning mới của React (double render bất thường, key…).
4. Push → 2 deploy Vercel xanh (build Vercel chậm hơn — theo dõi không timeout).

## 6. Rủi ro & rollback

| Rủi ro                                                              | Phòng bị                                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Component vi phạm rules ngầm → hành vi đổi sau memo hóa             | smoke island theo danh sách; nghi ngờ ở đâu gắn `'use no memo'` đó |
| Lib bên thứ 3 mutate props/ref kiểu cũ (kbar beta là ứng viên số 1) | nếu kbar lỗi: opt-out file kbar-modal, ghi chú chờ kbar bản mới    |
| Build Vercel chậm vượt ngưỡng                                       | đo local trước; Turbopack + compiler đã ổn ở Next 16.2             |

Rollback: đổi `reactCompiler: false` — 1 dòng mỗi app, không đụng code.
