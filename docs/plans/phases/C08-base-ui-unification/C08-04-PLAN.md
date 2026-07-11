---
phase: C08-base-ui-unification
plan: 04
type: execute
wave: 4
depends_on: [C08-03]
files_modified:
  - apps/2025/src/ # grep data-[state= → attr Base UI
  - apps/2025/src/css/globals (file css gốc 2025)
  - apps/2025/package.json # gỡ 14 radix + vaul + cva/clsx/tailwind-merge
  - apps/2025/src/utils/style.ts # cn → re-export từ @portfolio/ui nếu tồn tại
  - pnpm-lock.yaml
autonomous: false
requirements: [REQ-03, REQ-10]
must_haves:
  truths:
    - 'grep -r @radix-ui apps/2025 = 0 kể cả package.json (SC1)'
    - 'Từng overlay smoke OK: contact modal, select/dropdown keyboard, tabs, tooltip, drawer mobile, form aria-invalid (SC2)'
    - 'User nghiệm thu bằng mắt cả 2 site (SC3, D-13)'
  artifacts:
    - 'globals css 2025 có @source packages/ui + đủ token D-11'
  key_links:
    - 'Selector data-[...] khớp attr Base UI thật trên DOM (kiểm devtools từng overlay)'
---

<objective>
Chốt 8b: đổi selector trạng thái sang attr Base UI (D-09), nối Tailwind @source + token (D-11), nhổ 14 gói Radix + vaul + cva/clsx/tailwind-merge (D-10), smoke TỪNG overlay + user duyệt mắt (D-13).
</objective>

<context>
@docs/plans/phases/C08-base-ui-unification/C08-CONTEXT.md
@apps/2026/src/app/globals.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: data-state attrs + @source + token</name>
  <files>apps/2025/src (mọi file có data-[state=), file css gốc 2025</files>
  <action>grep -rn "data-\[state=" apps/2025/src — với TỪNG kết quả, tra docs Base UI của component tương ứng (D-09: không đoán) đổi sang attr mới: data-[open], data-[closed], data-[highlighted], data-[checked], data-[popup-open]...; ghi bảng cũ→mới vào SUMMARY. Theo D-11: thêm @source '../../../../packages/ui/src' (đường tương đối đúng từ vị trí file css gốc 2025) + bổ sung token thiếu đối chiếu 2026 globals.css (--input --destructive --destructive-foreground --popover --popover-foreground ở :root/.dark/@theme inline). utils/style.ts (cn của 2025): re-export cn từ @portfolio/ui để mọi import cũ sống mà không cần clsx/tailwind-merge trong app.</action>
  <verify>grep -rn "data-\[state=" apps/2025/src | wc -l = 0; grep -c "@source" <file css gốc 2025> ≥ 1; pnpm build --filter=web-2025 thoát 0</verify>
  <done>Selector khớp Base UI; utility của packages/ui được JIT quét; cn 1 nguồn.</done>
</task>

<task type="auto">
  <name>Task 2: Nhổ deps Radix</name>
  <files>apps/2025/package.json, pnpm-lock.yaml</files>
  <action>Theo D-10: grep -rn "@radix-ui\|from 'vaul'\|class-variance-authority\|from 'clsx'\|tailwind-merge" apps/2025/src — phải 0 TRƯỚC khi gỡ (còn thì sửa nốt); rồi pnpm --filter web-2025 remove 14 gói @radix-ui/* (danh sách code_context) + vaul + class-variance-authority + clsx + tailwind-merge. Nếu D-04 fallback giữ vaul cho drawer thì GIỮ vaul, ghi chú lệch trong SUMMARY. pnpm install + build cả 2 app.</action>
  <verify>grep -c "@radix-ui" apps/2025/package.json = 0; pnpm ls "@radix-ui/react-dialog" --filter web-2025 rỗng; pnpm build --filter=web-2025 && pnpm build --filter=web-2026 thoát 0</verify>
  <done>node_modules nhẹ đi 14+ gói; cả 2 build xanh.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Task 3: Smoke từng overlay + user duyệt mắt + merge</name>
  <action>Executor start :3001 và đi TỪNG overlay theo danh sách SC2 (điểm dễ vỡ nhất là select/dropdown vì Base UI đổi part structure — code_context): (1) contact modal qua parallel route: mở/đóng/ESC/click-outside/focus trap; (2) setting dropdown + select: mở, chọn, keyboard ↑↓ Enter Esc; (3) locale switch + theme switch; (4) tabs trang about; (5) tooltip social icons (TooltipProvider hoạt động); (6) hover-card; (7) drawer menu mobile (viewport hẹp — hiệu ứng trượt tự chế D-04 có mượt không); (8) toggle-group grid/list blog; (9) pagination; (10) scroll-area TOC; (11) form contact: focus ring + aria-invalid khi lỗi; (12) TOÀN BỘ lặp lại ở dark mode. :3000 kiểm 4 component cũ không đổi. Mời user duyệt bằng mắt cả 2 site (D-13). User OK → commit, merge, push, 2 deploy Vercel xanh. Ghi chú cho C12: design-sync đã lệch (deferred).</action>
  <verify>User xác nhận OK (sau khi executor đi đủ 12 mục × 2 theme không lỗi console)</verify>
  <done>3 Success Criteria phase C8 đạt; UI 2 app sống trên 1 bộ component Base UI duy nhất.</done>
</task>

</tasks>

<verification>
SC1 = Task 2 grep; SC2 = Task 3 danh sách 12 mục; SC3 = Task 3 user. Bổ sung: console không error/warning mới ở mọi overlay.
</verification>

<success_criteria>
Phase C8 đóng: "nâng 1 là nâng cho cả 2" thành sự thật ở tầng UI — sửa component 1 chỗ, 2 app nhận.
</success_criteria>

<output>
Commit: `feat(2025)!: drop radix/vaul/cva stack — base-ui via @portfolio/ui everywhere (8b-2)`
Sau khi xong: viết C08-04-SUMMARY.md, tick phase C8, cập nhật STATE.md (vị trí → C9, ghi nợ design-sync re-sync).
</output>
