---
phase: C07-2025-next16-dep-sweep
plan: 01
type: execute
wave: 1
depends_on: [C05-04, C06-04]
files_modified:
  - apps/2025/package.json
  - pnpm-lock.yaml
  - apps/2025/next.config.ts
  - apps/2025/src/proxy.ts
  - apps/2025/src/middleware.ts
  - apps/2025/src/components/atoms/grid-background.tsx
autonomous: true
requirements: [REQ-05, REQ-10]
must_haves:
  truths:
    - 'web-2025 build xanh bằng Turbopack trên Next 16.2.10 + React 19.2.7'
    - 'next.config.ts là object thuần: không plugin wrapper, không block webpack, nhưng CSP + 7 security headers + images.remotePatterns giữ nguyên văn'
    - 'Grid background render y hệt cũ mà không còn @svgr/webpack trong repo'
  artifacts:
    - 'apps/2025/src/proxy.ts (middleware.ts không còn tồn tại)'
    - 'apps/2025/next.config.ts dạng object thuần theo mẫu M-03'
    - 'apps/2025/src/components/atoms/grid-background.tsx chứa SVG inline theo mẫu M-01'
  key_links:
    - 'apps/2025 và apps/2026 resolve cùng 1 bản next/react/react-dom/typescript trong pnpm-lock.yaml (pnpm ls -r mỗi gói 1 version)'
---

<objective>
Đưa `apps/2025` lên bộ core khóa chung với 2026: Next 16.2.10 + React 19.2.7 + TS ~5.9, chạy codemod chính chủ, chuẩn hóa Next 16 (`middleware.ts` → `proxy.ts`, build Turbopack), và dọn `next.config.ts` về object thuần — gỡ `@svgr/webpack` (inline SVG grid-background) + `@next/bundle-analyzer` khỏi config. Kết thúc plan: build Turbopack cả 2 app xanh, 2 app cùng 1 bản next/react toàn repo.
</objective>

<context>
@docs/plans/phases/C07-2025-next16-dep-sweep/C07-CONTEXT.md
@docs/plans/archive/C7-2025-next16-dep-sweep.md
@apps/2025/package.json
@apps/2025/next.config.ts
@apps/2025/src/components/atoms/grid-background.tsx
@apps/2026/package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Nâng bộ core lên khớp anchor 2026 + chạy codemod Next 16</name>
  <files>apps/2025/package.json, pnpm-lock.yaml, apps/2025/src/** (diff codemod)</files>
  <action>Tạo branch `c7-next16` (theo D-07 — mọi WIP của phase commit cục bộ trên branch này để bisect được). Chạy lệnh nâng nhóm core theo mẫu M-02 trong CONTEXT: next lên range `^16.2.10` khớp hệt 2026 — CẤM canary 16.3 (theo D-01), react/react-dom `^19.2.7`, typescript `~5.9.0`, @types/node `^24`, @types/react + @types/react-dom latest. Sau đó chạy `npx @next/codemod@latest upgrade` trong `apps/2025` theo D-02 — để codemod lo async request APIs (`params`/`searchParams` đã là Promise từ Next 15 nên ít việc) và rename middleware nếu nó hỗ trợ. Review toàn bộ diff codemod tạo ra trước khi đi tiếp; KHÔNG tự viết lại các API async bằng tay khi codemod đã phủ. Lưu ý chạy pnpm từ PowerShell nếu C5 chưa merge (bug PWD contentlayer), còn sau C5 thì shell nào cũng được.</action>
  <verify>grep -n '"next"' apps/2025/package.json (thấy ^16.2.10) && grep -n '"react"' apps/2025/package.json (thấy ^19.2.7) && pnpm ls next react react-dom typescript -r (mỗi gói đúng 1 version toàn repo) && pnpm --filter web-2025 typecheck</verify>
  <done>package.json 2025 khai next ^16.2.10 / react ^19.2.7 / typescript ~5.9; `pnpm ls -r` cho thấy next/react/react-dom/typescript mỗi gói 1 version duy nhất; typecheck web-2025 xanh.</done>
</task>

<task type="auto">
  <name>Task 2: middleware → proxy.ts + next.config.ts về object thuần</name>
  <files>apps/2025/src/middleware.ts, apps/2025/src/proxy.ts, apps/2025/next.config.ts</files>
  <action>Nếu codemod ở Task 1 chưa rename: `git mv apps/2025/src/middleware.ts apps/2025/src/proxy.ts` theo D-03 — convention Next 16 giống 2026; nội dung và export giữ nguyên (sau C6 file này là createMiddleware của next-intl, C7 chỉ đổi tên file). Viết lại `apps/2025/next.config.ts` theo D-04 và mẫu M-03 trong CONTEXT: xóa `withBundleAnalyzer` và mọi cấu trúc reduce plugin (nextConfig thành object thuần export default); xóa toàn bộ block `webpack` (rule svgr hết lý do sau Task 3, rule `.po` đã xóa ở C6); xóa `experimental.turbo.rules` và `experimental.swcPlugins` nếu C6 còn sót. GIỮ NGUYÊN VĂN: chuỗi ContentSecurityPolicy, mảng 7 securityHeaders, `images.remotePatterns` (api.microlink.io + drive.google.com — điểm rà 4.1 plan gốc), `env` version/owner/email, `pageExtensions`, `reactStrictMode`. Nếu C5/C6 đã sửa file khác mẫu thì lấy hiện trạng làm gốc, chỉ áp phần bất biến của M-03. Lý do phải giữ CSP: sau khi bỏ 2 plugin wrapper, headers dễ bị xóa nhầm theo — đây là success criterion số 2 của phase trong ROADMAP.</action>
  <verify>test -f apps/2025/src/proxy.ts && test ! -f apps/2025/src/middleware.ts && grep -c "Content-Security-Policy" apps/2025/next.config.ts (=1) && grep -c "key:" apps/2025/next.config.ts (=7) && grep -cE "webpack|withBundleAnalyzer|swcPlugins" apps/2025/next.config.ts (=0) && grep -c "remotePatterns" apps/2025/next.config.ts (=1)</verify>
  <done>proxy.ts tồn tại thay middleware.ts; next.config.ts là object thuần không webpack/wrapper/swcPlugins nhưng còn đủ CSP + 7 header + remotePatterns + env + pageExtensions.</done>
</task>

<task type="auto">
  <name>Task 3: Inline SVG grid-background, gỡ @svgr/webpack + @next/bundle-analyzer, build Turbopack</name>
  <files>apps/2025/src/components/atoms/grid-background.tsx, apps/2025/package.json, pnpm-lock.yaml</files>
  <action>Sửa `grid-background.tsx` theo D-05 và mẫu M-01 trong CONTEXT: bỏ `import Grid from '@public/static/images/backgrounds/grid.svg'`, dán SVG inline làm JSX (đổi `stroke-width` → `strokeWidth`, đặt id pattern không đụng id khác), giữ nguyên wrapper div, prop `className` và toàn bộ class fill/stroke dark/light. KHÔNG xóa file svg nguồn trong public (dọn xác ở C12 — nằm ngoài phase). Sau đó trong `apps/2025`: `pnpm remove @svgr/webpack @next/bundle-analyzer` và xóa script `analyze` khỏi package.json (theo D-05, D-11 — khi cần đo bundle dùng `next build --profile` hoặc thêm lại tạm). Chạy build Turbopack theo D-06: `pnpm build --filter=web-2025` — Next 16 mặc định Turbopack, không thêm cấu hình webpack mới; nếu lỗi tương thích thì soi 2 điểm nghi (format postcss config, import .css từ node_modules), fix tại chỗ hoặc pin gói lỗi và ghi nợ C8/C9 vào SUMMARY (radix/framer-motion chưa đụng đều Turbopack-safe).</action>
  <verify>grep -rn "\.svg'" apps/2025/src --include="*.tsx" | grep -v "src=" | wc -l (=0 import svgr) && grep -cE "svgr|bundle-analyzer" apps/2025/package.json (=0) && pnpm build --filter=web-2025 && pnpm build --filter=web-2026</verify>
  <done>Không còn import .svg qua svgr trong src; @svgr/webpack + @next/bundle-analyzer + script analyze biến mất khỏi package.json; build Turbopack cả 2 app xanh.</done>
</task>

</tasks>

<verification>
- `pnpm typecheck` toàn repo xanh.
- `pnpm build` (cả web-2025 lẫn web-2026, Turbopack) xanh.
- `pnpm ls next react react-dom typescript -r` — mỗi gói đúng 1 version toàn repo.
- `grep -cE "webpack|withBundleAnalyzer" apps/2025/next.config.ts` = 0 và `grep -c "key:" apps/2025/next.config.ts` = 7 (đủ security headers).
- `test -f apps/2025/src/proxy.ts && test ! -f apps/2025/src/middleware.ts`.
</verification>

<success_criteria>

- apps/2025 chạy Next 16.2.10 + React 19.2.7 + TS ~5.9, build bằng Turbopack, cùng 1 bản core với apps/2026 trong lockfile (goal-backward từ success criteria 1–2 của C7 trong ROADMAP).
- next.config.ts object thuần, CSP + 7 header + remotePatterns nguyên vẹn ở mức config (curl kiểm response ở checkpoint plan 02).
- Grid background inline SVG, hết dấu vết svgr/bundle-analyzer.
  </success_criteria>

<output>
Commit: `feat(2025)!: upgrade to next 16.2.10 + react 19.2.7 on turbopack` (1 commit cho cả plan, trên branch c7-next16)
Sau khi xong: viết C07-01-SUMMARY.md cạnh plan này + cập nhật STATE.md + tick checkbox ROADMAP.md
</output>
