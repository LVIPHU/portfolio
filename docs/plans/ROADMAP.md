# Roadmap: Nâng cấp C — tách packages dùng chung + hiện đại hóa 2 app

## Overview

Monorepo có `apps/2025` (Next 15.2 + Contentlayer2 + Lingui 6-locale + Radix + framer-motion, nội dung hoàn chỉnh) và `apps/2026` (Next 16 + next-intl, khung mới). Hành trình: tách content/UI/MDX dùng chung ra 3 package raw-TS → gỡ 2 blocker của 2025 (contentlayer2, lingui swc-plugin) → khóa chung stack mới nhất → hợp nhất UI trên Base UI → GSAP → React Compiler → Sandpack → CI. Kết thúc: "nâng 1 là nâng cho cả 2", cả 2 site sống trên Vercel suốt quá trình.

Bản roadmap này thay thế Giai đoạn B của `docs/PLAN-apps-2025.md` và chi tiết hóa `docs/PLAN-upgrade-C.md`.

## Yêu cầu (REQ — mọi plan phải trace về đây)

- **REQ-01** — Content hợp nhất: blog/authors/data ở `packages/content`, Zod fail-fast, cả 2 app đọc chung, locale trong tên file.
- **REQ-02** — MD renderer chung học react.dev: pipeline remark/rehype 1 nguồn, Callout/Pre+Copy/CodeTitle/Terminal, dual-theme Shiki, KaTeX.
- **REQ-03** — UI dùng chung: shadcn mới nhất trên **Base UI** trong `packages/ui` (cài từng component qua CLI `pnpm dlx shadcn@latest add <name>`), 2025 bỏ hẳn 14 gói Radix.
- **REQ-04** — Animation: framer-motion/motion → GSAP 3.15 + @gsap/react, primitives trong `packages/ui/src/motion`.
- **REQ-05** — Stack khóa chung version mới nhất: Next 16.2.10, React 19.2.7, Tailwind 4.3.x, TS ~5.9, sweep toàn bộ deps, zod 4.
- **REQ-06** — i18n hợp nhất: next-intl, 2 locale `vi` (mặc định không prefix) + `en`, URL cũ redirect permanent.
- **REQ-07** — React Compiler bật cả 2 app + eslint react-hooks flat config.
- **REQ-08** — Sandpack playground trong bài viết (pin 2.20, lazy 2 tầng).
- **REQ-09** — Tooling/CI: prettier+husky (xong C0), `ci-check` 1 lệnh, dead-link crawler, dọn xác code, docs cập nhật.
- **REQ-10** — Kiến trúc "nâng 1 nâng cả 2": 3 package raw-TS (`exports ./src/index.ts`, transpilePackages, `@source`), version anchor = 2026.

## Phases

- [x] **Phase C0: Tooling nền móng** — prettier/husky/tsconfig base (commit `9e0fdbd`, `0b070a2`)
- [x] **Phase C1: packages/ui khởi tạo (Base UI) + 2026 tiêu thụ** — button/badge/card/separator + 7 hooks (commit `a1a323e`)
- [x] **Phase C2: packages/content v2** — Zod + hút blog/authors/data 2025 (user đã duyệt trên :3000; +fix fallback `40a7453`)
- [x] **Phase C3: packages/mdx** — pipeline + components + 2026 dùng (tự test browser theo ủy quyền user)
- [x] **Phase C4: 2025 thu gọn 6 locale → vi-VN + en-US** (`d899975` — gate grep/build/curl + tự test browser)
- [x] **Phase C5: 2025 bỏ Contentlayer2** (blocker #1 CHẾT — build chạy từ Git Bash; merge `c957184`)
- [x] **Phase C6: 2025 Lingui → next-intl + data chung** (blocker #2 CHẾT — merge `6ec2b20`)
- [x] **Phase C7: 2025 Next 16.2.10 + dep sweep toàn bộ** (merge `5718356` — Turbopack 33s, 1 version/gói toàn repo)
- [x] **Phase C8: UI hợp nhất — full Base UI, 2025 bỏ Radix** (packages/ui 21 component; 2025 gỡ 18 gói, 0 asChild, 0 @radix-ui)
- [ ] **Phase C9: motion → GSAP**
- [ ] **Phase C10: React Compiler cả 2 app**
- [ ] **Phase C11: Sandpack playground**
- [ ] **Phase C12: CI + dọn dẹp + hậu kỳ design-sync**

Thứ tự bắt buộc: C2 → C3 → C5 → C6 → C7 → C8 → C9 → C10 → C11 → C12; C4 chạy song song được miễn xong trước C6.

## Phase Details

### Phase C2: packages/content v2

**Goal**: `@portfolio/content` là nguồn sự thật duy nhất: schema Zod hợp nhất, 8 bài blog (4 của 2026 + 4 hút từ 2025), 5 authors, data tĩnh 2025 dịch sang `Localized{vi,en}`.
**Depends on**: C1 (xong)
**Requirements**: REQ-01, REQ-10
**Success Criteria**:

1. `pnpm --filter @portfolio/content typecheck` xanh (hết 4 file thiếu)
2. `:3000/blog` hiện đủ 6 slug (4 vi + 2 en fallback ở locale vi), ảnh banner load từ `/content/blog/…`
3. Frontmatter sai (`date: banana`) làm build đỏ kèm đường dẫn file
4. Build web-2025 xanh không đổi hành vi
   **Plans**: 3 plans — xem `phases/C02-content-v2/`

### Phase C3: packages/mdx

**Goal**: `@portfolio/mdx` chứa pipeline remark/rehype + bộ component MDX + `<MDXContent>` RSC; 2026 render blog qua nó.
**Depends on**: C2
**Requirements**: REQ-02, REQ-10
**Success Criteria**:

1. Bài `kien-truc-react-fiber` trên :3000: dual-theme code block đổi theo dark/light, code title, copy button, anchor heading, KaTeX
2. `<Callout type="pitfall">` render đúng 4 biến thể
3. Ảnh trong bài có width/height (không CLS)
   **Plans**: 3 plans — xem `phases/C03-mdx-package/`

### Phase C4: 2025 thu gọn locale

**Goal**: 2025 còn 2 locale vi-VN + en-US, Lingui giữ nguyên.
**Depends on**: không (trước C6 là được)
**Requirements**: REQ-06
**Success Criteria**:

1. `grep -r "ja-JP\|ko-KR\|zh-CN\|zh-TW" apps/2025/src apps/2025/*.ts` = 0
2. `/vi-VN` + `/en-US` chạy, switch 2 chiều; `Accept-Language: ja` → fallback không crash
   **Plans**: 1 plan — xem `phases/C04-2025-trim-locales/`

### Phase C5: 2025 bỏ Contentlayer2

**Goal**: 2025 đọc blog từ @portfolio/content, render qua @portfolio/mdx, side-effects (tag-data/search/RSS) thành script thường; URL bài viết không đổi.
**Depends on**: C2, C3
**Requirements**: REQ-01, REQ-02, REQ-10
**Success Criteria**:

1. Build web-2025 chạy được **từ Git Bash** (hết bug PWD)
2. `grep -ri "contentlayer" apps/2025 --include="*.ts*"` = 0
3. Blog/tags/kbar/feed.xml hoạt động, tập slug bài viết y hệt trước
   **Plans**: 4 plans — xem `phases/C05-2025-drop-contentlayer/`

### Phase C6: 2025 Lingui → next-intl

**Goal**: 2025 i18n y hệt kiến trúc 2026 (vi không prefix + /en), data tĩnh đọc từ @portfolio/content, xóa data/ + 7 gói @lingui.
**Depends on**: C4, C5
**Requirements**: REQ-06, REQ-01, REQ-10
**Success Criteria**:

1. `grep -r "@lingui" apps/2025` = 0 (kể cả package.json)
2. Đủ trang ở `/` (vi) + `/en/*`, không lộ key; contact modal (parallel route) sống
3. `curl -I /vi-VN/about` → 308 `/about`; `/en-US/blog` → 308 `/en/blog`
   **Plans**: 4 plans — xem `phases/C06-2025-next-intl/`

### Phase C7: 2025 Next 16 + dep sweep

**Goal**: 2025 khóa version core theo 2026 (Next 16.2.10/React 19.2.7/TS/Tailwind 4.3), sweep mọi dep, gỡ svgr/bundle-analyzer/next lint, build Turbopack.
**Depends on**: C5, C6
**Requirements**: REQ-05, REQ-10
**Success Criteria**:

1. `pnpm ls next react typescript lucide-react tailwindcss -r` — mỗi gói 1 version toàn repo
2. Build Turbopack cả 2 xanh; CSP headers còn nguyên
3. 2 deploy Vercel xanh
   **Plans**: 2 plans — xem `phases/C07-2025-next16-dep-sweep/`

### Phase C8: UI hợp nhất Base UI

**Goal**: packages/ui đầy đủ ~20 component (mỗi cái cài bằng `pnpm dlx shadcn@latest add <name>`), 2025 dùng shim `atoms/index.ts` re-export, gỡ 14 gói Radix + vaul + cva/clsx/tailwind-merge.
**Depends on**: C7
**Requirements**: REQ-03, REQ-10
**Success Criteria**:

1. `grep -r "@radix-ui" apps/2025` = 0; `grep -rn "asChild" apps/2025/src` = 0
2. Từng overlay smoke OK: contact modal, select/dropdown, tabs, tooltip, drawer mobile, form aria-invalid
3. User nghiệm thu bằng mắt cả 2 site
   **Plans**: 4 plans (2 commit lớn 8a/8b) — xem `phases/C08-base-ui-unification/`

### Phase C9: motion → GSAP

**Goal**: 9 file framer-motion của 2025 port sang GSAP/CSS, primitives trong ui/src/motion, gỡ framer-motion + motion + @emotion/is-prop-valid.
**Depends on**: C8
**Requirements**: REQ-04, REQ-10
**Success Criteria**:

1. `grep -rn "framer-motion\|from 'motion'" apps packages` = 0
2. Dock magnify/parallax/timeline beam/hover highlight chạy mượt, không leak ScrollTrigger khi chuyển trang
3. User nghiệm thu bằng mắt
   **Plans**: 4 plans — xem `phases/C09-gsap-migration/`

### Phase C10: React Compiler

**Goal**: `reactCompiler: true` cả 2 app + eslint-plugin-react-hooks flat config ở root.
**Depends on**: C9
**Requirements**: REQ-07
**Success Criteria**:

1. Build cả 2 xanh, `pnpm lint` 0 error
2. Island client (kbar, dock, contact-form, theme switch) hành vi không đổi
   **Plans**: 1 plan — xem `phases/C10-react-compiler/`

### Phase C11: Sandpack

**Goal**: `<Sandpack>` trong @portfolio/mdx (lazy 2 tầng, theme theo CSS var) + 1 bài demo chạy trên cả 2 app.
**Depends on**: C3 (C5 để 2025 hưởng)
**Requirements**: REQ-08, REQ-02
**Success Criteria**:

1. Bài demo: sửa code → preview cập nhật, dark mode đổi theme
2. Network tab: trang không dùng Sandpack không tải chunk Sandpack
   **Plans**: 2 plans — xem `phases/C11-sandpack/`

### Phase C12: CI + dọn dẹp

**Goal**: `pnpm ci-check` 1 lệnh (prettier+typecheck+build+dead-links), dọn xác code, CLAUDE.md cập nhật kiến trúc 3 package, design-sync re-sync.
**Depends on**: C2–C11
**Requirements**: REQ-09
**Success Criteria**:

1. `pnpm ci-check` xanh từ cache sạch; link cố tình gãy bị bắt
2. CLAUDE.md hết ghi chú contentlayer/PowerShell; PLAN-apps-2025.md đánh dấu superseded
3. Đi tay 1 vòng đủ trang cả 2 site, cả 2 deploy xanh
   **Plans**: 3 plans — xem `phases/C12-ci-cleanup/`

## Progress

| Phase                 | Plans Complete | Status      | Completed                        |
| --------------------- | -------------- | ----------- | -------------------------------- |
| C0. Tooling           | 1/1            | ✅ Done     | 2026-07 (`9e0fdbd`, `0b070a2`)   |
| C1. packages/ui init  | 1/1            | ✅ Done     | 2026-07 (`a1a323e`)              |
| C2. content v2        | 3/3            | ✅ Done     | 2026-07-11 (`0f66153`…`40a7453`) |
| C3. mdx               | 3/3            | ✅ Done     | 2026-07-11                       |
| C4. trim locales      | 1/1            | ✅ Done     | 2026-07-11 (`d899975`)           |
| C5. drop contentlayer | 4/4            | ✅ Done     | 2026-07-11 (merge `c957184`)     |
| C6. next-intl         | 4/4            | ✅ Done     | 2026-07-12 (merge `6ec2b20`)     |
| C7. next16 + sweep    | 2/2            | ✅ Done     | 2026-07-12 (merge `5718356`)     |
| C8. Base UI           | 4/4            | ✅ Done     | 2026-07-12 (merge pending)       |
| C9. GSAP              | 0/4            | Not started | -                                |
| C10. React Compiler   | 0/1            | Not started | -                                |
| C11. Sandpack         | 0/2            | Not started | -                                |
| C12. CI + cleanup     | 0/3            | Not started | -                                |
