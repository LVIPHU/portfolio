---
phase: C11-sandpack
plan: 02
subsystem: sandpack-demo-csp
tags: [sandpack, csp, transpile-packages, code-split]
provides:
  - Bài demo playground-demo.{vi,en}.mdx (React counter + code block đối chứng)
  - CSP 2025 mở codesandbox iframe; sandpack-react vào transpilePackages CẢ 2 app
  - Playground render + code-split thật (bài không dùng Sandpack không tải bundle nặng)
key-decisions:
  - 'ROOT CAUSE bắt khi self-test (không có ở plan gốc): dưới Turbopack, ESM thô của @codesandbox/sandpack-react KHÔNG evaluate trên client → next/dynamic tải chunk 200 nhưng promise TREO (React.lazy + import tĩnh cũng kẹt/rò). FIX: thêm @codesandbox/sandpack-react vào transpilePackages CẢ 2 app → dynamic resolve, editor render (68 sp node + cm-editor + iframe). Cô lập bằng stub + log để chắc chắn (SandpackClient hydrate OK, lỗi nằm ở eval sandpack-react).'
  - 'Giữ next/dynamic ssr:false (M-02) sau khi transpile fix — QUAN TRỌNG cho code-split: import tĩnh làm defaultMdxComponents kéo sandpack-react vào MỌI bài (đã đo: bài thường tải 2 chunk sandpack). Với dynamic: bài thường chỉ tải stub loader nhỏ (packages_mdx...sandpack-client), KHÔNG tải sandpack-react ~200KB. D-09 thỏa (chi phí nặng chỉ ở bài dùng Sandpack).'
  - 'CSP (D-07): frame-src += *.codesandbox.io *.csb.app (connect-src đã *). Iframe bundler thực tế = https://2-19-8-sandpack.codesandbox.io → khớp *.codesandbox.io, console 0 lỗi CSP.'
  - 'Bài demo (D-08): fence `js App.js active` + `css styles.css hidden` → editor tab App.js active, styles.css ẩn (đúng DSL). Thêm 1 code block ```ts thường đối chứng pipeline C3.'
  - 'pnpm để lại placeholder hỏng es5-ext (transitive của sandpack) trong pnpm-workspace allowBuilds → set false (không cần build script).'
status: complete — PHASE C11 chờ user nghiệm thu (SC1) trước merge
completed: 2026-07-12
---

# C11-02 — Summary

## 2 Success Criteria (ROADMAP)

1. ⏳ SC1: sửa code → preview cập nhật + dark mode đổi theme editor — chờ user chơi thử (desktop rộng dễ thao tác). Self-test đã xác nhận editor render đúng code + iframe bundler sống.
2. ✅ SC2: code-split — bài KHÔNG dùng Sandpack tải 0 chunk sandpack-react (chỉ stub loader nhỏ); bài demo tải đủ khi cuộn tới. Đo bằng performance.getEntriesByType.

## Việc

- `playground-demo.{vi,en}.mdx` — React counter Sandpack + code block thường.
- CSP 2025: frame-src += codesandbox/csb.
- transpilePackages += @codesandbox/sandpack-react (cả 2 app) — FIX Turbopack.
- pnpm-workspace: es5-ext build = false.

## Self-test (:3001, sau khi trị bug transpile)

| Kiểm              | Kết quả                                                             |
| ----------------- | ------------------------------------------------------------------- |
| Editor render     | ✅ .cm-editor, 68 sp-node, code counter đúng                        |
| Tab active/hidden | ✅ tab App.js active, styles.css ẩn                                 |
| Bundler iframe    | ✅ https://2-19-8-sandpack.codesandbox.io (CSP pass, 0 lỗi console) |
| Code-split        | ✅ bài thường 0 chunk sandpack-react (chỉ stub); bài demo tải đủ    |
| Build 2 app       | ✅ 2026 27s, 2025 44s                                               |

Ảnh chụp pane trống ở vùng Sandpack (pane không paint được iframe cross-origin + CodeMirror) — xác minh bằng DOM/network thay ảnh.

## Nợ

- SC1 (chơi thử + dark mode editor) cần mắt user trên desktop.
- Nếu bản Sandpack 2.20 patch sau khác host bundler → cập nhật CSP.
