---
phase: C07-2025-next16-dep-sweep
plan: 02
type: execute
wave: 2
depends_on: [C07-01]
files_modified:
  - apps/2025/package.json
  - pnpm-lock.yaml
  - apps/2025/env.mjs
  - apps/2025/drizzle.config.ts
  - apps/2025/src/hooks/use-window-size.ts
  - apps/2025/src/hooks/use-debounce-callback.ts # XÓA (trùng @portfolio/ui)
  - apps/2025/src/hooks/index.ts
  - apps/2026/package.json # next-intl patch
autonomous: false
requirements: [REQ-05, REQ-10]
must_haves:
  truths:
    - 'pnpm ls next react react-dom typescript lucide-react tailwindcss zod -r: mỗi gói 1 version resolve toàn repo (SC1)'
    - 'curl -I :3001 thấy đủ Content-Security-Policy + 6 header còn lại (SC2)'
    - '2 deploy Vercel xanh sau push (SC3)'
  artifacts:
    - 'package.json 2025 hết: cross-env, autoprefixer, postcss-import, mini-svg-data-uri, lodash.debounce, eslint-config-next + scripts deploy/lint/lint:fix'
  key_links:
    - 'use-window-size.ts dùng useDebounceCallback từ @portfolio/ui (bản trùng trong app đã xóa)'
    - 'framer-motion/motion/@emotion + radix/vaul/cva/clsx/tailwind-merge CÒN NGUYÊN (D-13 — C8/C9 mới gỡ)'
---

<objective>
Sweep toàn bộ dependency còn lại của 2025 lên latest ổn định theo anchor 2026 (D-07…D-10), gỡ nhóm chết (D-11, D-12), xử 2 điểm nóng zod4/drizzle, rồi đóng phase bằng gate deploy Vercel (D-15).
</objective>

<context>
@docs/plans/phases/C07-2025-next16-dep-sweep/C07-CONTEXT.md
@apps/2025/package.json
@apps/2025/env.mjs
@apps/2025/drizzle.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Gỡ nhóm chết trước, sweep nhóm nâng sau</name>
  <files>apps/2025/package.json, pnpm-lock.yaml, apps/2025/src/hooks/use-window-size.ts, apps/2025/src/hooks/use-debounce-callback.ts, apps/2025/src/hooks/index.ts, apps/2026/package.json</files>
  <action>Theo D-07 (delete before upgrade): chạy lệnh gỡ theo mẫu M-05 (bundle-analyzer/svgr đã đi ở plan 01 — bỏ khỏi lệnh) + xóa scripts deploy/lint/lint:fix (analyze đã xóa); trước khi gỡ TỪNG gói chạy grep import xác nhận 0 (facts code_context: mini-svg-data-uri 0, cross-env chỉ trong 2 script bị xóa; qss GIỮ theo D-12). Riêng lodash.debounce theo D-12: sửa src/hooks/use-window-size.ts import useDebounceCallback từ @portfolio/ui, xóa src/hooks/use-debounce-callback.ts (bản trùng — packages/ui có y hệt), cập nhật hooks/index.ts, rồi mới remove lodash.debounce + @types. Sau đó sweep nhóm nâng 1 lần theo mẫu M-04 (D-10 khóa anchor: lucide ^1.24, tailwind ^4.3.2, next-themes ^0.4.6; kbar lấy beta mới nhất; version latest chốt được ghi vào SUMMARY theo mục Claude tự quyết) + patch 2026 next-intl ^4.13.2 (D-14). Build ngay sau sweep, lỗi đâu sửa đó; commit WIP cục bộ trên branch c7-next16 sau mỗi nhóm để bisect (D-07). TUYỆT ĐỐI không đụng nhóm D-13 (framer-motion, motion, @emotion, radix, vaul, cva, clsx, tailwind-merge — deferred sang C8/C9).</action>
  <verify>grep -cE "cross-env|autoprefixer|postcss-import|mini-svg-data-uri|lodash.debounce|eslint-config-next" apps/2025/package.json = 0; grep -cE "framer-motion|@radix-ui" apps/2025/package.json ≥ 15 (nhóm giữ còn nguyên); pnpm build --filter=web-2025 thoát 0</verify>
  <done>Nhóm chết sạch, nhóm nâng lên latest, nhóm giữ nguyên vẹn, build xanh.</done>
</task>

<task type="auto">
  <name>Task 2: Điểm nóng zod 4 + drizzle latest</name>
  <files>apps/2025/env.mjs, apps/2025/drizzle.config.ts</files>
  <action>Theo D-08: zod đã lên 4 trong sweep Task 1 cùng @hookform/resolvers@5 + @t3-oss/env-nextjs latest — giờ rà 3 chỗ dùng: env.mjs (createEnv + z.string().refine — sửa API đổi nếu có), grep zodResolver + from 'zod' toàn src (contact-form có thể đã đổi sau C6 — lấy hiện trạng), API validate route nếu có. Nếu domino kẹt (t3-env chưa ăn zod4): tách commit riêng chore: zod 4 migration + dùng subpath zod/v3 compat tạm, ghi nợ vào SUMMARY. Theo D-09: drizzle-orm/drizzle-kit đã latest — mở drizzle.config.ts sửa theo format defineConfig mới nếu breaking; schema views/reactions không đổi, KHÔNG sinh migration; DB client lazy nên build không chứng minh được gì — smoke views counter dồn sang Task 3.</action>
  <verify>pnpm --filter web-2025 typecheck thoát 0; node -e "const p=require('./apps/2025/package.json');const z=p.dependencies.zod;if(!z.startsWith('^4'))throw z"</verify>
  <done>zod 4 + resolvers 5 + t3-env mới typecheck xanh; drizzle config đúng format mới.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Gate 1-version + CSP + smoke + đợi Vercel xanh</name>
  <action>Executor chạy gate: (1) pnpm ls next react react-dom typescript lucide-react tailwindcss zod -r — TỪNG gói đúng 1 version resolve toàn repo (SC1, D-01 anchor); (2) pnpm build cả 2 app (Turbopack) + next start :3001 rồi curl -I http://localhost:3001 đếm đủ 7 security header trong đó có Content-Security-Policy (SC2, điểm rà D-04); (3) smoke danh sách của plan gốc: home, blog + 1 bài (highlight/KaTeX), photos (parallax — framer còn nguyên), projects (GitHub stats card — octokit mới), contact form submit validate (zod4 + resolvers 5), views counter (drizzle — cần DATABASE_URL thật, không có thì xác nhận fail-safe tĩnh không crash theo D-09), giscus load, theme + locale switch, kbar. User xem nhanh :3001 + :3000 xác nhận không vỡ mắt thường → merge c7-next16 vào main, push, ĐỢI cả 2 deploy Vercel xanh (D-15 — điểm nghi Turbopack trên CI khác local) rồi mới đóng phase.</action>
  <verify>User xác nhận OK (sau khi pnpm ls 1-version + curl 7 header + smoke pass; 2 deploy Vercel status READY)</verify>
  <done>3 Success Criteria phase C7 đạt; stack 2 app khóa chung; production sống trên Next 16.</done>
</task>

</tasks>

<verification>
SC1 = Task 3 pnpm ls; SC2 = Task 3 curl CSP; SC3 = Task 3 Vercel. Bổ sung: grep nhóm D-13 còn nguyên (không gỡ nhầm việc của C8/C9).
</verification>

<success_criteria>
Toàn bộ dep 2025 mới nhất hoặc bị gỡ có bằng chứng; 2 app cùng 1 bản core/tailwind/lucide/zod; deploy production xanh.
</success_criteria>

<output>
Commit (branch, rồi merge): `chore(2025)!: full dependency sweep — one version per package across the repo` (+ commit tách `chore: zod 4 migration` nếu kẹt domino theo D-08)
Sau khi xong: viết C07-02-SUMMARY.md, tick phase C7 trong ROADMAP, cập nhật STATE.md (vị trí → C8).
</output>
