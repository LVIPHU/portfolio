# C7 — apps/2025: Next 16.2.10 + React 19.2.7 + sweep toàn bộ dependency

> **Phụ thuộc:** C5 + C6 (2 blocker đã gỡ: contentlayer2, @lingui/swc-plugin). **Chặn:** C8 (shadcn Base UI cần stack mới), C10 (React Compiler).
> **Ước lượng:** ~2–4h. **Commit:** `feat(2025)!: next 16 + react 19.2, full dependency sweep` (tách `chore: zod 4 migration` nếu vướng).

## 1. Mục tiêu & phạm vi

- 2025 lên **đúng version 2026 đang dùng**: `next@16.2.10` (pin, không canary 16.3), `react@19.2.7`, `react-dom@19.2.7` — từ đây 2 app khóa chung version core.
- Sweep **mọi** dependency còn lại lên latest ổn định; gỡ gói không còn lý do tồn tại.
- Chuẩn Next 16: `middleware.ts` → `proxy.ts`, build Turbopack.

## 2. Hiện trạng → đích (bảng sweep)

Nguồn: `apps/2025/package.json` hiện tại. Nhóm theo hành động:

**Nâng core (khóa chung 2026):** `next 15.2.8→16.2.10`, `react/react-dom ^19.0→19.2.7`, `typescript ^5→~5.9`, `@types/node ^20→^24`, `@types/react*` latest.

**Nâng thường (semver major cần đọc changelog):** `dayjs`, `swr`, `drizzle-orm 0.41→latest` + `drizzle-kit 0.30→latest` (đọc breaking notes — schema không đổi thì thường chỉ đổi import), `react-hook-form ^7`, `@hookform/resolvers 4→5`, `zod 3→4` (**điểm nóng** — xem 4.3), `@octokit/graphql`, `@giscus/react`, `react-share`, `react-medium-image-zoom`, `react-github-calendar`, `kbar` (vẫn beta — lấy beta mới nhất), `next-themes` (khớp 2026 ^0.4.6), `@t3-oss/env-nextjs 0.12→latest`, `tailwindcss + @tailwindcss/postcss 4.1→^4.3.2` (khớp 2026), `@tailwindcss/typography`, `tw-animate-css`, `lucide-react 0.475→^1.24` (**khớp packages/ui — 1 version cả repo**), `postgres`, `tsx`, `eslint 9` + họ hàng.

**Gỡ hẳn:**

- `@svgr/webpack` — chỉ `grid-background.tsx` import SVG qua svgr → inline SVG đó thành TSX component, xóa webpack rule.
- `@next/bundle-analyzer` + script `analyze` — không dùng thường xuyên; khi cần đo thì dùng `next build --profile` hoặc thêm lại tạm.
- `eslint-config-next` + `next lint` (deprecated ở Next 16) — 2025 theo 2026: gate = typecheck. (ESLint quay lại ở C10 với react-hooks plugin, cấu hình flat ở root.)
- `cross-env` (scripts còn dùng không? sau C5/C6 các script env đã đơn giản — grep, nếu chỉ còn trong script `deploy` cũ thì xóa cùng script đó).
- `autoprefixer` + `postcss-import` — Tailwind v4 qua `@tailwindcss/postcss` tự lo prefix/import; kiểm `postcss.config` rồi gỡ.
- `mini-svg-data-uri`, `qss`, `lodash.debounce` (packages/ui đã có bản của nó) — grep từng gói, gỡ nếu 0 tham chiếu.

**Giữ nguyên có chủ đích:** `framer-motion`/`motion`/`@emotion/is-prop-valid` (C9 mới gỡ), `@radix-ui/*`/`vaul`/`cva`/`clsx`/`tailwind-merge` (C8 mới gỡ).

**2026 tiện tay:** `next-intl` lên `^4.13.2` (patch), xác nhận không lệch version core.

## 3. Hướng code chi tiết (trình tự)

1. Branch `c7-next16`. Chạy `npx @next/codemod@latest upgrade` trong `apps/2025` — để codemod lo async request APIs (`params`/`searchParams` Promise — **đã là Promise từ Next 15, ít việc**), rename middleware.
2. `git mv src/middleware.ts src/proxy.ts` nếu codemod chưa làm (convention Next 16 như 2026; export giữ nguyên `createMiddleware`).
3. Sửa `next.config.ts`: xóa block `webpack` (svgr rule đã hết lý do — `.po` rule đã xóa ở C6), xóa `withBundleAnalyzer`, giữ headers/CSP; `experimental.turbo.rules` xóa (không còn `.po`).
4. Inline SVG của `grid-background.tsx`: mở file svg nguồn, dán vào TSX làm component (giữ props `className`).
5. Nâng deps theo bảng — **1 lần `pnpm up` theo danh sách rồi build ngay**, lỗi đâu sửa đó thay vì nâng từng gói build từng lần (danh sách dài, đa số patch/minor an toàn).
6. Grep các gói "gỡ hẳn" trước khi xóa khỏi package.json (xác nhận 0 import).
7. Build Turbopack: Next 16 mặc định Turbopack — chạy `pnpm build --filter=web-2025`, sửa lỗi tương thích nếu có (điểm nghi: postcss config format, import `.css` từ node_modules).

## 4. Điểm nóng kỹ thuật

### 4.1 Next 16 breaking cần rà

- `params`/`searchParams` async (kiểm codemod đã phủ), `revalidate`/`dynamic` semantics không đổi với SSG thuần.
- `images.remotePatterns` giữ (microlink + drive.google.com).
- CSP headers: xác nhận vẫn áp sau khi bỏ 2 plugin wrapper (giờ `nextConfig` là object thuần, không còn reduce plugins).

### 4.2 drizzle 0.41 → latest

Schema chỉ có bảng views/reactions đơn giản; breaking thường ở `drizzle-kit` config format (`drizzle.config.ts` — đổi theo docs mới). DB client lazy — build không kết nối, nên lỗi chỉ lộ khi chạy thật: smoke views counter ở gate.

### 4.3 zod 3 → 4

- `@portfolio/content` đã zod 4 từ C2 — sweep này đưa 2025 về cùng version, tránh 2 bản zod trong node_modules.
- Chỗ dùng: `contact-form` (resolver), `@t3-oss/env-nextjs` (env schema), API validate. `@hookform/resolvers@5` + `t3-env` mới đều hỗ trợ zod 4. Nếu kẹt: tách riêng commit `chore: zod 4`, dùng subpath `zod/v3` compat tạm cho t3-env.

## 5. Design pattern

- **Version pinning theo "anchor app"**: 2026 là mỏ neo version core (next/react/tailwind/lucide); 2025 khớp theo, không tự do trôi. Ghi quy ước vào CLAUDE.md ở C12.
- **Delete before upgrade**: gỡ gói chết trước khi nâng — mỗi gói gỡ là một nguồn breaking biến mất.

## 6. Testing & gate nghiệm thu

1. `pnpm typecheck` + `pnpm build` cả 2 app (Turbopack) xanh.
2. `pnpm ls next react react-dom typescript lucide-react tailwindcss -r` — mỗi gói **1 version duy nhất** toàn repo.
3. Smoke `:3001`: home, blog + 1 bài (highlight/KaTeX), photos (parallax), projects (GitHub stats card — octokit mới), contact form submit validate (zod 4 + resolvers 5), views counter tăng (drizzle — cần DATABASE_URL thật hoặc chấp nhận fail-safe tĩnh), giscus load, theme + locale switch, kbar.
4. `curl -I` kiểm CSP header còn nguyên trên response.
5. Push → **đợi cả 2 deploy Vercel xanh** (điểm nghi: khác biệt Turbopack trên CI) mới đóng phase.

## 7. Rủi ro & rollback

| Rủi ro                            | Phòng bị                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Turbopack lỗi với 1 dep cũ nào đó | còn radix/framer-motion là 2 nhóm lớn chưa đụng — cả 2 đều Turbopack-safe; lỗi khác thì fix hoặc pin gói lỗi, ghi nợ C8/C9 |
| zod 4 domino qua t3-env/resolvers | kế hoạch compat ở 4.3                                                                                                      |
| Nâng cả chùm khó bisect lỗi       | build sau mỗi nhóm (core → thường → gỡ); commit WIP cục bộ trên branch để bisect được                                      |
| Vercel build khác local           | gate 5 bắt buộc đợi deploy xanh                                                                                            |

Rollback: revert merge; không có migration dữ liệu (drizzle schema không đổi trong phase này).
