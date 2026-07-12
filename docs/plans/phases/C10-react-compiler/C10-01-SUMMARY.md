---
phase: C10-react-compiler
plan: 01
subsystem: build-lint
tags: [react-compiler, eslint-flat, react-hooks-v7]
provides:
  - reactCompiler:true (top-level Next 16) cả web-2025 + web-2026 + babel-plugin-react-compiler
  - eslint.config.mjs flat config root — eslint-plugin-react-hooks v7 (gộp rules React Compiler) + @typescript-eslint/parser (chỉ parse); script `pnpm lint`
key-decisions:
  - 'reactCompiler là option TOP-LEVEL trong Next 16 (stable, off mặc định), cần babel-plugin-react-compiler (context7 xác nhận). Build chậm hơn do babel pass (D-06): 2026 21→28s, 2025 34→44s — chấp nhận.'
  - 'kbar (D-04 nghi phạm #1) compile + search OK KHÔNG cần `use no memo` — 0 opt-out compiler toàn repo. Không component nào lỗi Rules-of-React ở build.'
  - 'Dọn rác eslint thời eslint-config-next (gỡ C7): xóa apps/2025/eslint.config.mjs (extend next/typescript — làm eslint . chết ở root); xóa 4 eslint-disable-next-line trỏ rule của plugin đã gỡ (@next/next/no-img-element ×3, @typescript-eslint/no-explicit-any ×1) — chúng báo "rule not found" khi plugin vắng.'
  - 'react-hooks v7: preset flat nằm ở configs.flat[recommended-latest] (bản top-level còn eslintrc-style plugins array — flat config từ chối). Cần @typescript-eslint/parser để parse .ts/.tsx (espree không hiểu TS); KHÔNG thêm rule TS nào (đúng D-02 chỉ react-hooks).'
  - "DEVIATION D-02 (chỉ 0 error): 3 rule MỚI của v7 — react-hooks/refs (10), set-state-in-effect (3), immutability (3) — flag pattern hợp lệ có sẵn (đọc ref trong event handler/cleanup useUnmount, setState mount-gate hydration, mutate .current useRef trong useMagnify/useDragRotate). Không phải bug → hạ 'warn' (16 nợ, D-02 warning không chặn). rules-of-hooks + exhaustive-deps + rules React Compiler GIỮ error. Ds-bundle + .ds-css (design-sync) thêm ignore (dọn C12)."
  - 'ignore ds-bundle/** + **/.ds-css/** trong eslint (artifact design-sync, không phải source).'
status: complete — PHASE C10 chờ user duyệt island (SC2)
completed: 2026-07-12
---

# C10-01 — Summary

## 2 Success Criteria (ROADMAP)

1. ✅ SC1: build 2 app xanh với reactCompiler:true (2026 28.6s, 2025 44.4s); `pnpm lint` exit 0 (0 error, 16 warning nợ).
2. ⏳ SC2 (island không đổi hành vi): kbar mở + search ("blog"→3 kết quả) OK, 0 dev issue — chờ user duyệt nhanh 2 site.

## Việc

- next.config 2 app: `reactCompiler: true` top-level; babel-plugin-react-compiler devDep.
- `eslint.config.mjs` root: react-hooks v7 flat recommended-latest + @typescript-eslint/parser; 3 rule mới → warn; ignore artifacts.
- Dọn: xóa apps/2025/eslint.config.mjs cũ + 4 disable-directive chết.

## 16 warning nợ (ghi để C-sau dọn/refactor)

| Rule                            | #   | Chỗ                                                                                 |
| ------------------------------- | --- | ----------------------------------------------------------------------------------- |
| react-hooks/refs                | 10  | home.tsx (5 video ref), hover-highlight, use-magnify?, use-unmount ×2, link-preview |
| react-hooks/set-state-in-effect | 3   | link-preview (mount), kbar-provider, theme-toggle 2026                              |
| react-hooks/immutability        | 3   | use-drag-rotate ×2, use-magnify (entries.current)                                   |

Đều pattern hợp lệ (không bug); rule v7 mới khắt khe. Rollback compiler = `reactCompiler:false` 1 dòng/app.

## Self-test (:3001)

kbar Ctrl+K mở, gõ "blog" → 3 kết quả (Content + 2 bài); devIssues 0/none. Compiler chạy sạch trên island khó nhất.

## Nợ

- 16 warning react-hooks (refactor sau, backlog).
- Gỡ useMemo/useCallback thủ công sau khi compiler ổn — backlog.
- ds-bundle/.ds-css dọn ở C12.
