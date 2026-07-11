---
phase: C03-mdx-package
plan: 01
subsystem: mdx
tags: [remark, rehype, pipeline]
provides:
  - '@portfolio/mdx package (raw-TS, exports ./ + ./client + ./styles.css)'
  - pipeline.ts remarkPlugins/rehypePlugins 1 nguồn sự thật (smartypants + alert + code-titles + img-to-jsx + header-ids; slug + autolink heroicon + katex + pretty-code dual keepBackground:false)
  - extractTocHeadings + remarkHeaderIds (custom-id kiểu react.dev, viết mới)
key-decisions:
  - 'remarkHeaderIds đặt CUỐI mảng remark (chỉ đụng heading, chạy sau khi tree ổn định).'
  - 'anchorIcon truyền content: anchorIcon.children (fromHtmlIsomorphic trả root — autolink cần mảng node con).'
  - 'img-to-jsx: width/height stringify (an toàn với serializer mdx attr; hành vi img/next-image không đổi).'
  - 'D-08 ĐÓNG: meta fence 4 bài 2025 chỉ có showLineNumbers + lang:file — pretty-code hiểu cả hai, 0 fence phải sửa.'
  - 'Bẫy tự gây đã sửa: chuỗi mdx-comment trong JSDoc chứa */ đóng comment sớm → viết lại comment.'
status: complete
completed: 2026-07-11
---

# C03-01: Scaffold @portfolio/mdx + pipeline — Summary

Verify: `pnpm --filter @portfolio/mdx typecheck` exit 0; deps sạch 3 gói bị bỏ (prism-plus/preset-minify/citation); 0 'use client' trong plan này.
