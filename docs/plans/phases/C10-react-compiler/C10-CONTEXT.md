# Phase C10: React Compiler cả 2 app — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Bật memo hóa tự động (React Compiler — option stable trong Next 16) cho web-2025 + web-2026, kèm ESLint flat config ở root với `eslint-plugin-react-hooks` (rules compiler đã merge vào plugin này). KHÔNG thuộc phase: gỡ `useMemo`/`useCallback` thủ công (compiler tôn trọng code hiện có — dọn là việc tương lai, tách bạch để bisect), thêm rule ESLint ngoài react-hooks.
</domain>

<decisions>
## Quyết định đã khóa

- **D-01:** `reactCompiler: true` là option TOP-LEVEL trong next.config Next 16 (không còn experimental) — bật ở CẢ 2 app cùng 1 commit; `babel-plugin-react-compiler@latest` vào devDeps từng app.
- **D-02:** ESLint quay lại repo dạng FLAT CONFIG Ở ROOT (`eslint.config.mjs`): chỉ `eslint-plugin-react-hooks` preset `recommended-latest` (đã gộp rules compiler), scope `apps/**/src` + `packages/**/src`; script root `lint: eslint .`. KHÔNG kéo lại eslint-config-next (đã gỡ ở C7, D-11 của C07).
- **D-03:** Vi phạm khó ở component phức tạp: opt-out CỤC BỘ bằng `'use no memo'` đầu function + ghi lý do — KHÔNG BAO GIỜ tắt flag toàn cục vì 1 component lỗi.
- **D-04:** Nghi phạm số 1 là kbar (beta, mutate kiểu cũ) — nếu lỗi: opt-out file kbar-modal, ghi nợ chờ kbar bản mới.
- **D-05:** Không micro-optimize theo compiler output; giá trị chính của phase là rules ép Rules of React làm nền cho refactor sau. Đo re-render bằng React DevTools Profiler trên kbar mở + gõ search (case nặng nhất) — ghi số vào SUMMARY, không gate.
- **D-06:** Build chậm hơn (babel pass) — chấp nhận; ghi số build time trước/sau vào SUMMARY; theo dõi build Vercel không timeout.

### Claude tự quyết

- Version chính xác babel-plugin + eslint-plugin-react-hooks lúc chạy.
- Xử warning lint không chặn (error mới chặn — warning ghi nợ).
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — eslint.config.mjs root:**

```js
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['**/node_modules/**', '**/.next/**', '**/public/**'] },
  {
    files: ['apps/**/src/**/*.{ts,tsx}', 'packages/**/src/**/*.{ts,tsx}'],
    ...reactHooks.configs['recommended-latest'],
  },
]
```

**M-02 — Opt-out cục bộ:**

```tsx
function KBarModal(props) {
  'use no memo' // kbar beta mutate props kiểu cũ — chờ bản mới (D-04)
  ...
}
```

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C10 — goal, REQ-07, 2 success criteria
- `apps/2025/next.config.ts` + `apps/2026/next.config.ts` — chỗ bật flag
- Docs Next 16 reactCompiler + eslint-plugin-react-hooks changelog — xác nhận tên preset lúc chạy
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts)

- Sau C7: eslint 9 + @eslint/eslintrc còn trong devDeps 2025 (giữ có chủ đích cho phase này); 2026 chưa có eslint.
- Island client chịu ảnh hưởng chính (site SSG phần lớn RSC): kbar-modal, floating-dock (GSAP C9), contact-form, theme/locale switch, gallery zoom, giscus, copy-button (mdx pkg).
- Repo chưa từng có eslint config root — C0 chỉ đặt prettier + husky + lint-staged.
  </code_context>

<deferred>
## Ý tưởng hoãn

- Gỡ useMemo/useCallback thủ công sau khi compiler chạy ổn — backlog
- Thêm rule ESLint khác (import order...) — backlog, tránh phình phase
- Nâng kbar khỏi beta để bỏ opt-out — backlog theo dõi upstream
</deferred>

---

_Phase: C10-react-compiler_
