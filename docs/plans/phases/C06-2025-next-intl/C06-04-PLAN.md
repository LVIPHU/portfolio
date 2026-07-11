---
phase: C06-2025-next-intl
plan: 04
type: execute
wave: 4
depends_on: [C06-03]
files_modified:
  - apps/2025/next.config.ts
  - apps/2025/package.json
  - apps/2025/lingui.config.js # XÓA
  - apps/2025/src/i18n/locales/ # XÓA
  - apps/2025/src/i18n/i18n.ts # XÓA
  - apps/2025/src/i18n/initLingui.tsx # XÓA
  - apps/2025/src/providers/locale.tsx # XÓA
  - apps/2025/scripts/po-to-messages.ts # XÓA
  - apps/2025/messages/msgid-map.json # XÓA
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-06, REQ-10]
must_haves:
  truths:
    - 'grep -r "@lingui" apps/2025 = 0 kể cả package.json (Success Criteria 1 của phase)'
    - 'curl -I /vi-VN/about → 308 Location /about; /en-US/blog → 308 /en/blog (SC3)'
    - 'Contact modal (@modal parallel + intercepting route) mở/đóng bình thường (SC2)'
  artifacts:
    - 'next.config.ts có redirects() 4 rule permanent, hết swcPlugins + rule .po'
  key_links:
    - 'Merge c6-next-intl → main chỉ sau khi toàn bộ gate xanh (D-14); 2 deploy Vercel xanh sau merge'
---

<objective>
Nhổ tận gốc hạ tầng Lingui (D-06), bật redirect URL cũ (D-02), chạy gate toàn phase và nghiệm thu; merge branch về main. Blocker #2 của Next 16 chính thức chết sau plan này.
</objective>

<context>
@docs/plans/phases/C06-2025-next-intl/C06-CONTEXT.md
@apps/2025/next.config.ts
@apps/2025/package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Redirects URL cũ</name>
  <files>apps/2025/next.config.ts</files>
  <action>Thêm redirects() đúng nguyên văn mẫu M-06 (theo D-02): 4 rule permanent /vi-VN→/, /vi-VN/:path*→/:path*, /en-US→/en, /en-US/:path*→/en/:path*. Không thêm rule cho 4 locale đã bỏ ở C4 (ja/ko/zh — D-04 của C04 đã chấp nhận 404, hành vi thực tế ghi trong C04-01-SUMMARY nếu cần đối chiếu). giscus tách thread theo URL mới: chấp nhận theo D-12, không làm mapping.</action>
  <verify>node -e "import('./apps/2025/next.config.ts')" không khả thi trực tiếp — thay bằng: pnpm build --filter=web-2025 thoát 0 rồi kiểm bằng curl ở Task 3</verify>
  <done>4 rule redirect có mặt, build xanh.</done>
</task>

<task type="auto">
  <name>Task 2: Gỡ trọn bộ hạ tầng Lingui</name>
  <files>apps/2025/package.json, apps/2025/next.config.ts, apps/2025/lingui.config.js, apps/2025/src/i18n/, apps/2025/src/providers/locale.tsx, apps/2025/scripts/po-to-messages.ts, apps/2025/messages/msgid-map.json, pnpm-lock.yaml</files>
  <action>Theo D-06, gỡ không giữ gì phòng hờ: pnpm --filter web-2025 remove @lingui/core @lingui/macro @lingui/react @lingui/cli @lingui/conf @lingui/loader @lingui/swc-plugin negotiator @types/negotiator. next.config.ts: xóa experimental.swcPlugins, rule turbopack '*.po', rule webpack /\.po$/. Xóa file: lingui.config.js, src/i18n/locales/ (2 thư mục catalog), src/i18n/i18n.ts, src/i18n/initLingui.tsx, src/providers/locale.tsx, 2 script lingui:* trong package.json. Theo D-03 xóa đồ dùng 1 lần: scripts/po-to-messages.ts + messages/msgid-map.json (messages/{vi,en}.json GIỮ — là runtime).</action>
  <verify>grep -rn "@lingui" apps/2025 --include="*.json" --include="*.ts" --include="*.tsx" --include="*.js" -l | grep -v node_modules | wc -l = 0; pnpm build --filter=web-2025 thoát 0 (Git Bash)</verify>
  <done>Không còn dấu vết Lingui trong source lẫn deps; build xanh không cần swc plugin.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Gate toàn phase + user nghiệm thu + merge main</name>
  <action>Executor chạy gate: (1) pnpm typecheck + pnpm build cả 2 app xanh; (2) next start :3001 rồi curl -I http://localhost:3001/vi-VN/about kỳ vọng 308 Location /about, curl -I http://localhost:3001/en-US/blog kỳ vọng 308 /en/blog (SC3); (3) grep tổng SC1. Mời user đi tay: `/` (vi không prefix) + `/en/*` đủ trang home/about/blog/projects/photos/tags/contact — không lộ key thô; contact modal mở từ navbar (parallel route — điểm dễ vỡ nhất khi mv segment, xem code_context); form validate đúng ngôn ngữ; kbar đổi locale đúng; switch locale giữ nguyên trang. User OK → merge c6-next-intl vào main (D-14), push, theo dõi 2 deploy Vercel xanh, bấm thử 1-2 URL cũ đã index.</action>
  <verify>User xác nhận OK (sau khi curl 308 + grep + build pass)</verify>
  <done>3 Success Criteria của Phase C6 trong ROADMAP đều đạt; main deploy xanh với URL scheme mới + redirect.</done>
</task>

</tasks>

<verification>
Map Success Criteria phase: SC1 = Task 2 verify; SC2 = Task 3 đi tay; SC3 = Task 3 curl. Thêm: `git log --oneline main..c6-next-intl` = 0 sau merge.
</verification>

<success_criteria>
2025 chạy thuần next-intl y hệt kiến trúc 2026; URL cũ redirect vĩnh viễn; Lingui biến mất khỏi repo.
</success_criteria>

<output>
Commit (branch, rồi merge): `feat(2025)!: complete lingui removal, permanent redirects for legacy locale urls`
Sau khi xong: viết C06-04-SUMMARY.md, tick phase C6 trong ROADMAP Progress, cập nhật STATE.md (blocker #2 chết, vị trí → C7).
</output>
