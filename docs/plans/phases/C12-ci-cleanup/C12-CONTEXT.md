# Phase C12: CI + dọn dẹp + hậu kỳ design-sync — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Phase chốt sổ: khóa chất lượng bằng 1 lệnh `pnpm ci-check` (prettier + typecheck + build + dead-links), dọn xác code sau 10 phase, cập nhật CLAUDE.md theo kiến trúc mới, đánh dấu PLAN-apps-2025.md superseded, re-sync design-sync. KHÔNG thuộc phase: tính năng mới, tối ưu deferred của các phase trước (trừ khi ghi rõ ở đây).
</domain>

<decisions>
## Quyết định đã khóa

### CI

- **D-01:** `scripts/check-dead-links.mjs` ở root — crawler BFS trên build local (next start 2 app, port 3000/3001): fetch HTML, parse href nội bộ bằng regex (không cheerio), theo dấu link chưa thăm; link NGOÀI chỉ kiểm định dạng, KHÔNG fetch (tránh flaky mạng).
- **D-02:** Kiểm anchor `#fragment` trỏ tới id tồn tại trong trang đích (TOC + autolink-headings sinh nhiều — chỗ chết nhất); anchor check hạ thành WARNING nếu ồn quá (quyết khi chạy thật).
- **D-03:** `ci-check` root: `prettier --check . && turbo typecheck && turbo build && node scripts/check-dead-links.mjs`; turbo cache làm build lần 2 rẻ. GitHub Actions (nếu thêm): 1 job gọi đúng lệnh này, `.github/workflows/ci.yml` tối giản Node 22 + pnpm cache — Vercel vẫn là nơi build deploy chính, CI chỉ gate PR.
- **D-04:** Test negative bắt buộc: cố tình gãy 1 link trong 1 bài MDX → check-links exit 1 → hoàn lại (bằng chứng crawler sống).

### Dọn xác (grep-driven, 0 tham chiếu mới xóa)

- **D-05:** Danh sách nghi: `atoms/fade-content.tsx` (mồ côi từ trước), bản trùng `back-to-posts.tsx` (tồn tại ở CẢ atoms/ lẫn molecules/ — giữ 1, sửa import), hooks 2025 đã lên packages/ui (use-debounce-callback đã xóa ở C7; rà use-drag-rotate/use-event-listener... — GIỮ `use-blog-stats` đặc thù app), `utils/{math,style}.ts` nếu hết caller, `apps/2025/.ds-css/`, shim design-sync lingui/env thừa sau C6, `public/static/images/backgrounds/grid.svg` (đã inline ở C7), banner cũ nếu C5 chưa xóa.
- **D-06:** `pnpm dlx knip` chạy THAM KHẢO — xử bằng mắt từng finding, không tin 100%, không auto-fix.
- **D-07:** Quy tắc xóa: grep tên file + tên export đều 0 → xóa; còn nghi → GIỮ + ghi SUMMARY.

### Docs

- **D-08:** CLAUDE.md viết lại các mục lỗi thời: kiến trúc 3 package (content/ui/mdx) + quy ước raw-TS transpilePackages + @source; XÓA ghi chú PowerShell/contentlayer (chết từ C5) + `.env.local` nếu env đổi sau C6/C7; quy ước version anchor 2026; lệnh mới (ci-check, lint); mục "Active plan" trỏ docs/plans/.
- **D-09:** `docs/PLAN-apps-2025.md` thêm header `> SUPERSEDED bởi docs/plans/ (C-phases thay Giai đoạn B)`. Bảng Progress trong `docs/plans/ROADMAP.md` điền đủ hash commit các phase.

### Design-sync

- **D-10:** Re-sync theo cấu trúc mới: cập nhật `componentSrcMap` trong .design-sync/config.json (atoms còn lại + component từ @portfolio/ui), xóa mapping file đã chết, chạy lại quy trình build bundle + upload; preview vỡ (component đổi API) sửa theo lỗi build của tool. Không chặn commit CI/cleanup — tách plan riêng, làm sau cùng.

### Claude tự quyết

- Có thêm .github/workflows/ci.yml hay chỉ script local (tùy user có dùng PR flow không — hỏi ở checkpoint cuối).
- Ngưỡng concurrency/timeout của crawler.
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

**M-01 — ci-check trong package.json root:**

```jsonc
"scripts": {
  "check-links": "node scripts/check-dead-links.mjs",
  "ci-check": "prettier --check . && turbo typecheck && turbo build && node scripts/check-dead-links.mjs"
}
```

**M-02 — Khung crawler (BFS, per-app):**

```
1. next start cả 2 app (3000/3001) — hoặc nhận BASE_URL args
2. queue = ['/', '/en'] (2026) + ['/', '/en'] (2025)
3. mỗi trang: fetch → regex href="..." → nội bộ? chưa thăm? → queue
4. đồng thời gom id="..." của trang cho anchor check (D-02)
5. output bảng: trang nguồn → link chết; exit 1 nếu có (anchor có thể WARN)
```

**M-03 — Checklist đi tay cuối (gate phase, map SC3):** home / about / blog + 1 bài (code block, callout, playground) / tags + 1 tag / projects / photos / contact + modal / 404 — × 2 locale (vi, /en) × 2 theme (light, dark) × 2 app.
</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` §Phase C12 — goal, REQ-09, 3 success criteria
- `CLAUDE.md` — hiện trạng cần viết lại (D-08)
- `.design-sync/config.json` — componentSrcMap hiện tại (69 entry, sẽ lệch sau C8/C9)
- `docs/PLAN-apps-2025.md` — file cần đóng dấu superseded
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts)

- Repo chưa có scripts/ ở root (script nằm per-app); chưa có .github/workflows.
- prettier + husky + lint-staged đã có từ C0; eslint flat root từ C10 — ci-check KHÔNG cần thêm lint vào chuỗi (lint đã là script riêng, cân nhắc nối sau).
- design-sync: project d5b3d749 "Portfolio 2025 UI", 58 card, bundle build từ atoms 2025 cũ; conventions.md + previews đã được user/linter chỉnh tay — TÔN TRỌNG các sửa đổi đó khi re-sync (không revert).
- Xác code biết trước: fade-content.tsx (0 import — kiểm lại), back-to-posts.tsx × 2 (atoms + molecules).
  </code_context>

<deferred>
## Ý tưởng hoãn

- Tối ưu pick messages client bundle 2025 (deferred từ C6 D-11) — backlog
- Lighthouse/perf audit định kỳ — backlog
- knip vào ci-check thường trực — chỉ khi finding ổn định qua vài lần chạy tay
</deferred>

---

_Phase: C12-ci-cleanup_
