---
phase: C03-mdx-package
plan: 02
subsystem: mdx
tags: [rsc, islands, design-tokens]
provides:
  - MDXContent RSC (slot injection components, không import app)
  - 7 component: Callout 4 biến thể (deep-dive = details/summary 0 JS), CodeTitle, Pre+CopyButton, TableWrapper, TerminalBlock, YouTube (nocookie lite), PlainImg fallback img/Image
  - styles.css token-contract (dual-theme --shiki-light/dark theo .dark, callout var override được, katex scoped)
key-decisions:
  - 'Dual theme dùng CSS var --shiki-light/--shiki-dark của pretty-code hiện đại (KHÔNG phải 2 bản code ẩn/hiện như CONTEXT mô tả — đó là hành vi bản cũ; verify data-theme vẫn pass).'
  - 'CopyButton tìm text qua closest [data-mdx-pre] — không phụ thuộc cấu trúc sibling như bản 2025.'
  - 'CodeTitle bản package không có icon map (SocialIcons là đồ 2025) — app override qua slot khi cần.'
  - 'components/index phải là .tsx (chứa PlainImg JSX).'
status: complete
completed: 2026-07-11
---

# C03-02: Components + renderer + styles — Summary

Verify: typecheck exit 0; đúng 2 'use client' (copy-button.tsx, client.ts); grep hex/oklch trong styles.css = 0; đủ 12 file.
