# C12 — CI, dọn dẹp, cập nhật docs, hậu kỳ design-sync

> **Phụ thuộc:** C2–C11 xong (phase chốt sổ).
> **Ước lượng:** ~2–3h. **Commit:** `chore: ci-check pipeline, dead-link crawler, repo cleanup` (+ `docs: update CLAUDE.md for 3-package architecture`).

## 1. Mục tiêu & phạm vi

Khóa chất lượng bằng 1 lệnh (`pnpm ci-check`), quét link chết kiểu react.dev, dọn xác code sau 10 phase, cập nhật tài liệu cho khớp kiến trúc mới, re-sync design-sync.

## 2. Cấu trúc file đích

```
portfolio/
├── package.json                # + scripts: ci-check, check-links
├── scripts/
│   └── check-dead-links.mjs    # MỚI — crawler link nội bộ trên build local
├── CLAUDE.md                    # CẬP NHẬT LỚN
├── docs/
│   ├── PLAN-apps-2025.md        # đánh dấu SUPERSEDED (header)
│   └── plans/README.md          # điền hash commit các phase, trạng thái ✅
└── .design-sync/                # re-sync theo cấu trúc mới
```

## 3. Hướng code chi tiết

### 3.1 `scripts/check-dead-links.mjs`

Ý tưởng react.dev (deadLinkChecker) đơn giản hóa cho SSG:

1. Input: thư mục build tĩnh hoặc server local (`next start` cả 2 app, port 3000/3001).
2. Crawl BFS từ `/` (+ `/en`): fetch HTML, parse `href` nội bộ (regex đủ, không cần cheerio), theo dấu link chưa thăm; link ngoài chỉ kiểm định dạng, **không** fetch (tránh flaky mạng).
3. Kiểm thêm anchor `#fragment` trỏ tới id có tồn tại trong trang đích (TOC + autolink-headings sinh nhiều — đây là chỗ hay chết nhất).
4. Output: bảng `trang nguồn → link chết`, exit 1 nếu có.

### 3.2 Script `ci-check` (root package.json)

```jsonc
"ci-check": "prettier --check . && turbo typecheck && turbo build && node scripts/check-dead-links.mjs"
```

(turbo cache làm build lần 2 rẻ). Nếu muốn chạy trên GitHub Actions: workflow 1 job gọi đúng lệnh này — thêm `.github/workflows/ci.yml` tối giản (Node 22 + pnpm cache). Vercel vẫn là nơi build deploy chính; CI chỉ là gate PR.

### 3.3 Dọn xác code (grep-driven, xóa khi 0 tham chiếu)

- `apps/2025/src/components/atoms/fade-content.tsx` (mồ côi từ trước).
- Bản trùng `back-to-posts.tsx` (tồn tại ở cả atoms/ lẫn molecules/ — giữ 1, sửa import).
- Hooks/utils mồ côi sau C8/C9: `apps/2025/src/hooks/*` đã lên packages/ui (giữ `use-blog-stats` — đặc thù app), `utils/{math,style}.ts` nếu hết caller.
- `apps/2025/.ds-css/`, shim design-sync cho lingui/env đã thừa sau C6.
- Quét chung: `pnpm dlx knip` (chạy tham khảo, xử lý bằng mắt — không tin 100%).

### 3.4 Cập nhật docs

`CLAUDE.md` viết lại các mục đã lỗi thời:

- Kiến trúc 3 package (content/ui/mdx) + quy ước raw-TS transpilePackages + `@source`.
- **Xóa** ghi chú PowerShell/Git Bash contentlayer (hết lý do từ C5), ghi chú `.env.local` nếu env đã đổi sau C6/C7.
- Quy ước version anchor (2026 neo version core, 2 app khóa chung).
- `docs/PLAN-apps-2025.md`: thêm header `> SUPERSEDED bởi PLAN-upgrade-C.md (C-phases đã thay Giai đoạn B)`.

### 3.5 Hậu kỳ design-sync

Bundle design-sync đang build từ atoms 2025 cũ — sau C8/C9 nhiều component đã dời/đổi. Chạy lại quy trình `/design-sync` với `componentSrcMap` cập nhật (atoms còn lại + component từ `@portfolio/ui`), xóa mapping của file đã xóa, upload lại. Preview nào chết (component đổi API) sửa theo lỗi build của tool.

## 4. Design pattern

- **Single-command gate**: mọi tiêu chuẩn chất lượng sau 1 lệnh `pnpm ci-check` — người và CI chạy cùng một thứ, không lệch.
- **Crawler trên sản phẩm build** (không lint source): link chết bắt ở HTML cuối cùng — đúng thứ user thấy, bao cả link sinh từ MDX/frontmatter.

## 5. Testing & gate nghiệm thu

1. `pnpm ci-check` xanh từ máy sạch (xóa cache turbo chạy 1 lần full).
2. Cố tình gãy 1 link trong 1 bài MDX → check-links bắt được, exit 1 (test negative rồi sửa lại).
3. Sau dọn xác: typecheck + build cả 2 xanh; đi tay 1 vòng đủ trang cả 2 site (checklist cuối: home/about/blog+post/tags/projects/photos/contact/404, cả vi lẫn en, cả dark lẫn light).
4. 2 deploy Vercel xanh; design-sync project render lại đủ card.
5. Điền bảng trạng thái `docs/plans/README.md` — toàn bộ ✅ + hash.

## 6. Rủi ro & rollback

| Rủi ro                                          | Phòng bị                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Xóa nhầm code "mồ côi" thật ra được import động | chỉ xóa khi grep string tên file + tên export đều 0; build + đi tay đủ trang                |
| Dead-link checker flaky trên anchor sinh động   | anchor chỉ so id tĩnh trong HTML SSG — deterministic; nếu ồn, hạ anchor check thành warning |
| Design-sync re-sync tốn công hơn dự tính        | không chặn commit CI/cleanup — tách việc, làm sau cùng                                      |
