---
phase: C11-sandpack
plan: 01
type: execute
wave: 1
depends_on: [C03-03]
files_modified:
  - packages/mdx/package.json # + @codesandbox/sandpack-react ~2.20
  - packages/mdx/src/components/sandpack/index.tsx
  - packages/mdx/src/components/sandpack/sandpack-client.tsx
  - packages/mdx/src/components/sandpack/sandpack-root.tsx
  - packages/mdx/src/components/sandpack/create-file-map.ts
  - packages/mdx/src/components/sandpack/themes.ts
  - packages/mdx/src/components/index.ts
  - pnpm-lock.yaml
autonomous: true
requirements: [REQ-08, REQ-02]
must_haves:
  truths:
    - '<Sandpack> có mặt trong defaultMdxComponents; MDX không dùng nó vẫn render như cũ (regression C3 = 0)'
    - 'Chunk sandpack tách riêng, không vào SSR bundle'
  artifacts:
    - '5 file trong packages/mdx/src/components/sandpack/ theo cấu trúc M-01'
  key_links:
    - 'create-file-map parse đúng fence meta: tên file / active / hidden / readOnly; meta lạ → warn không crash (D-04)'
---

<objective>
Xây `<Sandpack>` trong `@portfolio/mdx` theo kiến trúc server-shim/client-core lazy 2 tầng (D-02, D-03) với theme CSS var (D-05).
</objective>

<context>
@docs/plans/phases/C11-sandpack/C11-CONTEXT.md
@packages/mdx/src/components/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: create-file-map + server shim</name>
  <files>packages/mdx/src/components/sandpack/create-file-map.ts, packages/mdx/src/components/sandpack/index.tsx, packages/mdx/package.json</files>
  <action>pnpm --filter @portfolio/mdx add "@codesandbox/sandpack-react@~2.20" (pin theo D-01). Viết create-file-map.ts theo D-04: đi React.Children của <Sandpack> tìm <pre><code> con, đọc className (language-js) + metastring → build record { '/<path>': { code, active, hidden, readOnly } }; fence duy nhất không tên → /App.js; meta parse fail → bỏ qua + console.warn kèm tên file bài (KHÔNG throw — build không được chết vì 1 fence xấu). index.tsx (server shim theo D-03): gọi createFileMap trên children rồi render <SandpackClient files={...} /> — file này KHÔNG 'use client'. Thêm Sandpack vào defaultMdxComponents map (components/index.ts).</action>
  <verify>pnpm --filter @portfolio/mdx typecheck thoát 0; node -p "require('./packages/mdx/package.json').dependencies['@codesandbox/sandpack-react']" bắt đầu bằng "~2.20"</verify>
  <done>Fence-as-file DSL hoạt động ở tầng parse; shim server-safe.</done>
</task>

<task type="auto">
  <name>Task 2: client core lazy 2 tầng + theme CSS var</name>
  <files>packages/mdx/src/components/sandpack/sandpack-client.tsx, packages/mdx/src/components/sandpack/sandpack-root.tsx, packages/mdx/src/components/sandpack/themes.ts</files>
  <action>sandpack-client.tsx theo mẫu M-02 (D-02 tầng 1): 'use client' + next/dynamic ssr:false + SandpackSkeleton giữ chiều cao ước tính (D-06 — số cụ thể Claude tự quyết, ghi SUMMARY). sandpack-root.tsx (chunk tách): SandpackProvider + SandpackCodeEditor + SandpackPreview với initMode='user-visible' + initModeObserverOptions rootMargin '1400px 0px' (D-02 tầng 2 — số react.dev). themes.ts theo D-05: SandpackTheme object tham chiếu var(--color-background), var(--color-foreground), var(--color-muted)... — Sandpack nhận string CSS var trực tiếp; KHÔNG hardcode hex. Gate regression C3: build web-2026, mở 1 bài KHÔNG dùng Sandpack — render y cũ.</action>
  <verify>pnpm build --filter=web-2026 thoát 0; grep -rn "ssr: false" packages/mdx/src/components/sandpack | wc -l = 1; grep -rn "user-visible" packages/mdx/src/components/sandpack | wc -l = 1; grep -rEn "#[0-9a-fA-F]{3,6}" packages/mdx/src/components/sandpack/themes.ts | wc -l = 0</verify>
  <done>Kiến trúc lazy đúng thiết kế; theme ăn token app; không regression pipeline C3.</done>
</task>

</tasks>

<verification>
Typecheck mdx + build 2026 xanh; bundle inspect nhanh: chunk chứa sandpack-react KHÔNG nằm trong first-load của trang blog thường (xem .next/analyze không cần — nhìn tên chunk trong build output).
</verification>

<success_criteria>
`<Sandpack>` sẵn sàng dùng trong mọi bài MDX của cả 2 app, chi phí 0 khi không dùng.
</success_criteria>

<output>
Commit: `feat(mdx): sandpack live playground — server shim, two-tier lazy, css-var theme`
Sau khi xong: viết C11-01-SUMMARY.md.
</output>
