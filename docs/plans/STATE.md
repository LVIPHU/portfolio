# Project State — Nâng cấp C

## Tham chiếu

Roadmap: `docs/plans/ROADMAP.md` (cập nhật 2026-07-11)
**Giá trị lõi:** "Nâng 1 là nâng cho cả 2" — 3 package raw-TS dùng chung, 2 app khóa chung stack.
**Đang tập trung:** Phase C2 — thi công xong 3/3 plan, chờ user nghiệm thu checkpoint

## Vị trí hiện tại

Phase: C2 / 13 (C0→C12) — plan 3/3 đã thi công, gate tự động PASS toàn bộ
Status: ⏸ Chờ user nghiệm thu mắt :3000/blog (checkpoint C02-03 Task 3) → rồi push deploy
Hoạt động cuối: 2026-07-11 — C02-01/02/03 thi công + commit; typecheck & build 2 app xanh

Progress: [██▓░░░░░░░░░░] 2/13 phase đóng + C2 chờ nghiệm thu

## Bối cảnh tích lũy

### Quyết định toàn cục (user đã khóa)

- Chuyển **hẳn** Base UI; shadcn cài **từng component qua CLI** (`pnpm dlx shadcn@latest add <name>`), không chép tay.
- Content layer **thủ công** (gray-matter + Zod + next-mdx-remote/rsc); zod 4 toàn repo.
- i18n đích: next-intl, `vi` (mặc định, không prefix) + `en`; motion → GSAP 3.15; Next pin 16.2.10 stable, React 19.2.7.
- Mỗi PLAN = 1 atomic commit; build + typecheck cả 2 app xanh mới sang plan kế.
- Prose tiếng Việt, commit tiếng Anh.

### Phát hiện mới (C2)

- Catalog vi-VN KHÔNG chứa msgid của data/main.ts (Lingui chỉ extract src/) → production hiện hiện tiếng Anh cho experience/projects ở locale vi; 11 chỗ `TODO dịch` trong data mới là nợ CÓ TỪ TRƯỚC, không phải regression.
- Ảnh gãy có từ trước: `ocean.{jpg,jpeg}` (body bài guide) + `sparrowhawk-avatar.jpg` không tồn tại trong public 2025 (404 trên production) → giữ nguyên, ghi nợ C12.

### Blockers/Concerns

- `apps/2025` build/dev từ **PowerShell** cho tới hết C5 (bug contentlayer PWD).
- `apps/2025/data/` READ-ONLY (xác nhận git sạch sau C02-02); xóa ở C5 (blog/authors) + C6 (main/site-metadata).
- Push main auto-deploy cả 2 Vercel — chỉ push sau khi user OK checkpoint.
- Workflow subagent bị session limit (reset 6pm 2026-07-11) — không ảnh hưởng thi công inline.

## Session Continuity

Phiên cuối: 2026-07-11
Dừng tại: C02-03 xong phần máy; chờ user mở :3000/blog nghiệm thu (6 bài, banner /content/blog/, tags sạch) → push
Kế tiếp sau khi C2 đóng: `phases/C03-mdx-package/C03-01-PLAN.md` (scaffold @portfolio/mdx)
