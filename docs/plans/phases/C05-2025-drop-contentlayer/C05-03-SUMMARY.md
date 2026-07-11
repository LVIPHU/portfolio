---
phase: C05-2025-drop-contentlayer
plan: 03
subsystem: scripts-2025
tags: [rss, tag-data, assets-sync]
provides:
  - scripts/generate-content-json.ts (tag-data.json slugified + search.json — thay onSuccess, chạy predev/prebuild)
  - scripts/sync-content-assets.mjs (port từ 2026 — banner /content/blog hết vỡ)
  - scripts/rss.ts đọc @portfolio/content (union vi+en dedupe path, giữ nguyên template XML)
  - getTagData của packages/content SLUGIFY key bằng github-slugger (2026 hưởng chung)
key-decisions:
  - 'BUG BẮT TRONG BUILD: onSuccess của contentlayer (còn sống tới plan 04) GHI ĐÈ tag-data/search fresh bằng dữ liệu stale từ data/blog cũ → postbuild rss crash vì tag vietnamese 0 bài. Fix: vô hiệu onSuccess ngay plan này (chỉ còn log), dọn helper mồ côi.'
  - 'D-06 chốt bằng bằng chứng: consumer (tags/[tag] + rss per-tag) dùng key slugified → sửa getTagData tại packages/content.'
  - 'Xóa 2 thư mục artifact chết public/tags/{vietnamese,english}; thêm 3 tag dir mới (nextjs, monorepo, life).'
status: complete
completed: 2026-07-11
---

# C05-03 — Summary

## Gate đã chạy

1. ✅ Full build PowerShell xanh trọn chuỗi: prebuild (sync + json fresh) → next build (contentlayer không còn clobber) → postbuild (RSS nguồn mới).
2. ✅ feed.xml 6 item; tag-data.json SỐNG SÓT sau full build (bằng chứng hết ghi đè); 15 tag dir đúng bộ tag mới.
3. ✅ Banner serve 200 từ /content/blog trên :3001 (đã kiểm trước đó).
4. ✅ Tái hiện + cô lập lỗi bằng NODE_ENV=production + probe script (stack trỏ generateRss:56 → per-tag rỗng → tagData stale).
