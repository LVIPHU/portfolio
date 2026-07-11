---
phase: C02-content-v2
plan: 02
subsystem: content
tags: [mdx, blog, authors, assets]
provides:
  - 4 bài blog 2025 trong packages/content/blog với tên <slug>.<locale>.mdx
  - 5 author MDX trong packages/content/authors
  - 4 banner JPG trong packages/content/assets/blog
affects: [C02-03, C05-2025-drop-contentlayer]
key-files:
  created:
    - packages/content/blog/kien-truc-react-fiber.vi.mdx
    - packages/content/blog/cac-component-element-va-instance-trong-react.vi.mdx
    - packages/content/blog/does-promise-all-run-in-parallel-or-sequential.en.mdx
    - packages/content/blog/guide-to-using-images-in-nextjs.en.mdx
    - packages/content/authors/*.mdx (5 file)
    - packages/content/assets/blog/*.jpg (4 banner)
key-decisions:
  - 'Tag vietnamese/english đã gỡ khỏi dòng tags (grep = 0); banner /static/images/banners/* → /content/blog/* (4 ảnh copy đủ).'
  - "PHÁT HIỆN ảnh gãy CÓ TỪ TRƯỚC: guide-to-using-images-in-nextjs body tham chiếu /static/images/ocean.{jpg,jpeg} và sparrowhawk.mdx avatar /static/images/sparrowhawk-avatar.jpg — các file này KHÔNG tồn tại ở bất kỳ đâu trong apps/2025/public (đã 404 trên production hiện tại). Theo luật 'không im lặng bỏ qua': giữ nguyên tham chiếu (body giữ 100%, không regression), ghi nợ C12 cân nhắc xóa/thay."
  - 'Dòng prose dòng 75 bài guide nhắc /static/images/ocean.jpeg là văn bản minh họa — giữ nguyên có chủ đích.'
  - 'Nguồn apps/2025/data không đổi 1 byte (git status sạch — bằng chứng D-07 read-only).'
status: complete
completed: 2026-07-11
---

# C02-02: Copy blog/authors/assets — Summary

**8 file MDX blog (4 cũ 2026 + 4 hút từ 2025), 5 authors, 4 banner — nguồn 2025 nguyên vẹn.**

## Verify đã chạy

- `ls packages/content/blog | wc -l` = 8 ✓; tên đúng dạng `<slug>.<vi|en>.mdx` ✓
- grep vietnamese/english trong tags = 0 ✓; grep /static/ trong frontmatter images/avatar = chỉ còn 3 tham chiếu ảnh-vốn-đã-chết (xem key-decisions) + 1 avatar sparrowhawk cùng loại
- grep layout: trong authors = 0 ✓
- 4/4 banner được frontmatter tham chiếu tồn tại trong assets/blog ✓

## Next Phase Readiness

C02-03 chạy được ngay: 2026 đổi description→summary + sync assets + gate build/smoke.
