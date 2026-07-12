---
phase: C11-sandpack
plan: 01
subsystem: mdx-sandpack
tags: [sandpack, remark, lazy-hydration, css-var-theme]
provides:
  - <Sandpack> trong @portfolio/mdx — dùng được ở mọi bài MDX của cả 2 app, chi phí 0 khi không dùng
  - remarkSandpackFiles trích fence→files (mdast), server shim + client lazy 2 tầng, theme CSS var
key-decisions:
  - 'DEVIATION lớn so plan (create-file-map walk React.Children): pipeline có rehype-pretty-code highlight MỌI fence thành span + drop meta → không lấy được code thô/tên file từ children đã render. Giải: remark plugin remarkSandpackFiles đọc lang/meta/value THÔ ở tầng mdast (trước rehype), gộp file map, gắn `files` (JSON string) vào thuộc tính <Sandpack>, XÓA fence con (khỏi bị highlight). Component chỉ JSON.parse(files). Robust + đúng hơn.'
  - 'Fence DSL (D-04) giữ nguyên ý: ```js src/App.js active → path/active/hidden/readOnly; token lạ → warn (kèm file.path) + bỏ qua, KHÔNG throw. Fence không tên → path mặc định theo lang (js→/App.js, css→/styles.css…).'
  - "Lazy 2 tầng (D-02): sandpack-client 'use client' + next/dynamic ssr:false (tách chunk ~200KB khỏi SSR) + SandpackSkeleton height 420px (D-06 chống CLS); sandpack-root initMode user-visible + initModeObserverOptions rootMargin 1400px 0px (số react.dev)."
  - 'Theme (D-05): SandpackTheme trỏ var(--color-background/foreground/muted/accent/primary/destructive/muted-foreground) — CẢ 2 app đều định nghĩa đủ (đã verify) → bỏ luôn hex fallback (gate 0 hex). font trỏ var(--font-sans/mono) + fallback tên (không hex).'
  - 'next là peerDependency mdx sẵn; thêm next + @types/mdast vào devDependencies mdx để typecheck standalone (sandpack-client import next/dynamic — next-import THẬT đầu tiên của package; trước chỉ nhắc next/image trong comment).'
  - 'remarkSandpackFiles đặt ĐẦU remarkPlugins (trước remarkGfm/codeTitles) — claim fence Sandpack trước mọi biến đổi khác. No-op nếu bài không có <Sandpack>.'
status: complete
completed: 2026-07-12
---

# C11-01 — Summary

## Kiến trúc (5 file + 1 remark plugin)

| File                                    | Vai trò                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| remark/sandpack-files.ts                | remark plugin: fence con <Sandpack> → attr `files` JSON (mdast, trước highlight); xóa children |
| components/sandpack/create-file-map.ts  | parse meta fence (path/active/hidden/readOnly), buildFileMap + warn                            |
| components/sandpack/index.tsx           | server shim (no 'use client'): JSON.parse(files) → SandpackClient                              |
| components/sandpack/sandpack-client.tsx | 'use client' + next/dynamic ssr:false + skeleton 420px                                         |
| components/sandpack/sandpack-root.tsx   | SandpackProvider (chunk tách) initMode user-visible + rootMargin 1400px                        |
| components/sandpack/themes.ts           | SandpackTheme qua var(--color-*), 0 hex                                                        |

## Gate

- `pnpm --filter @portfolio/mdx typecheck` → 0 (sau khi thêm next + @types/mdast devDep).
- grep: ssr:false=1, user-visible=1 (code), hex trong themes=0, dep `~2.20.0`.
- build web-2026 xanh 1m8s + web-2025 xanh 58s — bài KHÔNG dùng Sandpack render y cũ (0 regression C3).

## Nợ chuyển plan 02

- CSP 2025 mở `*.codesandbox.io` (frame-src + connect-src, D-07).
- Bài demo `playground-demo.{vi,en}.mdx` (D-08): 1 Sandpack React counter + 1 code block thường.
- Gate lazy bằng Network: bài thường 0 chunk sandpack; bài demo chỉ load khi cuộn gần (D-09).
- Verify theme dark/light + skeleton→mount không CLS trên browser.
