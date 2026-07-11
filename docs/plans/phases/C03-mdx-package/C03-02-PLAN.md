---
phase: C03-mdx-package
plan: 02
type: execute
wave: 2
depends_on: [C03-01]
files_modified:
  - packages/mdx/src/components/index.ts
  - packages/mdx/src/components/callout.tsx
  - packages/mdx/src/components/pre.tsx
  - packages/mdx/src/components/copy-button.tsx
  - packages/mdx/src/components/code-title.tsx
  - packages/mdx/src/components/table-wrapper.tsx
  - packages/mdx/src/components/terminal-block.tsx
  - packages/mdx/src/components/youtube.tsx
  - packages/mdx/src/render.tsx
  - packages/mdx/src/styles.css
  - packages/mdx/src/client.ts
  - packages/mdx/src/index.ts
autonomous: true
requirements: [REQ-02, REQ-10]
must_haves:
  truths:
    - 'MDXContent là RSC nhận source + components override, package không import component nào của app'
    - "Chỉ duy nhất copy-button.tsx mang 'use client' trong packages/mdx/src"
    - 'Callout đủ 4 biến thể note/pitfall/deep-dive/wip; deep-dive là details/summary 0 JS'
    - 'styles.css chỉ chứa CSS var + semantic token, scope dưới [data-rehype-pretty-code-figure] và .katex'
  artifacts:
    - 'packages/mdx/src/render.tsx, client.ts, styles.css'
    - 'packages/mdx/src/components/: index.ts + 7 component (callout, pre, copy-button, code-title, table-wrapper, terminal-block, youtube)'
  key_links:
    - 'components/index.ts export defaultMdxComponents có map img fallback và CodeTitle/pre/table'
    - 'index.ts barrel re-export MDXContent + defaultMdxComponents; client.ts re-export CopyButton'
---

<objective>
Đắp tầng UI lên lõi plan 01: bộ 7 component MDX (server-first theo islands architecture), renderer RSC `<MDXContent>`, barrel client và `styles.css` design-token contract. Output: package `@portfolio/mdx` hoàn chỉnh, app chỉ việc import — plan 03 nối vào 2026.
</objective>

<context>
@docs/plans/phases/C03-mdx-package/C03-CONTEXT.md
@packages/mdx/src/pipeline.ts
@apps/2025/src/mdx-components/index.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bộ component server (callout, code-title, table-wrapper, terminal-block, youtube) + defaultMdxComponents</name>
  <files>packages/mdx/src/components/callout.tsx, packages/mdx/src/components/code-title.tsx, packages/mdx/src/components/table-wrapper.tsx, packages/mdx/src/components/terminal-block.tsx, packages/mdx/src/components/youtube.tsx, packages/mdx/src/components/index.ts</files>
  <action>Tất cả là server component theo D-10 (KHÔNG 'use client'). `callout.tsx` theo D-11 + mẫu M-03 trong CONTEXT: type CalloutVariant = note|pitfall|deep-dive|wip, variantMap với label tiếng Việt (Ghi chú/Cạm bẫy/Đào sâu/Đang viết) + icon lucide-react (Info/TriangleAlert/Layers/Construction) + className callout-<variant>; biến thể deep-dive render bằng details/summary HTML thuần theo D-10 — ưu tiên 0 JS, không state client. `code-title.tsx`: nhận props lang/title do remarkCodeTitles chèn (contract xem apps/2025/src/mdx-components — plugin sinh tag tên CodeTitle). `table-wrapper.tsx`: bọc table trong div overflow-x-auto (vai trò như TableWrapper của 2025). `terminal-block.tsx` và `youtube.tsx`: port Ý TƯỞNG react.dev — TerminalBlock khung giả terminal cho output lệnh, YouTube iframe lite lazy (loading lazy, chỉ dựng iframe từ videoId) — markup chi tiết thuộc mục Claude tự quyết trong CONTEXT, không thêm dep mới. `components/index.ts`: export `defaultMdxComponents` map tag MDX → component: CodeTitle, Callout, TerminalBlock, YouTube, pre (vào ở Task 2), table → TableWrapper, và theo D-12 map `img` → thẻ img thuần forward width/height (phòng bị: remarkImgToJsx sinh tag Image nên map cũng phải có key `Image` cùng fallback; app override bằng next/image sau).</action>
  <verify>pnpm --filter @portfolio/mdx typecheck && grep -c "note\|pitfall\|deep-dive\|wip" packages/mdx/src/components/callout.tsx (kỳ vọng >= 4) && grep -c "details" packages/mdx/src/components/callout.tsx (kỳ vọng >= 1) && grep -rn "use client" packages/mdx/src/components --include="*.tsx" | wc -l (kỳ vọng 0 ở thời điểm task này) && grep -c "Image" packages/mdx/src/components/index.ts (kỳ vọng >= 1)</verify>
  <done>5 component server + defaultMdxComponents compile xanh, Callout đủ 4 biến thể với deep-dive dạng details/summary, map có fallback img/Image theo D-12.</done>
</task>

<task type="auto">
  <name>Task 2: Island copy-button + pre + renderer MDXContent + 2 barrel</name>
  <files>packages/mdx/src/components/copy-button.tsx, packages/mdx/src/components/pre.tsx, packages/mdx/src/render.tsx, packages/mdx/src/client.ts, packages/mdx/src/index.ts</files>
  <action>`copy-button.tsx`: island client DUY NHẤT của package theo D-10 — 'use client' dòng đầu, useState copied, navigator.clipboard.writeText, đổi icon/label ngắn khi copied. `pre.tsx`: server component bọc thẻ pre + đặt CopyButton (island nhỏ) — lấy text content để copy; thêm pre vào defaultMdxComponents của components/index.ts. `render.tsx` theo mẫu M-02 trong CONTEXT và D-09: export function MDXContent nhận { source, components? }, render MDXRemote từ next-mdx-remote/rsc với components = spread defaultMdxComponents rồi override bằng prop, options.mdxOptions = { remarkPlugins, rehypePlugins } import từ ./pipeline — đây là component slot injection: package TUYỆT ĐỐI không import component từ apps (tránh vòng phụ thuộc, D-09); type MDXComponents tự quyết theo CONTEXT (mdx/types hay tự khai). `client.ts`: barrel 'use client' re-export CopyButton (chừa chỗ Sandpack C11 — KHÔNG thêm Sandpack bây giờ, nó thuộc deferred). `index.ts`: barrel server-safe hoàn chỉnh theo D-01 — MDXContent, defaultMdxComponents, remarkPlugins/rehypePlugins, extractTocHeadings, types.</action>
  <verify>pnpm --filter @portfolio/mdx typecheck && grep -rn "^'use client'\|^\"use client\"" packages/mdx/src --include="*.ts*" | wc -l (kỳ vọng 2 — copy-button.tsx và client.ts, không hơn) && grep -c "MDXRemote" packages/mdx/src/render.tsx (kỳ vọng >= 1) && grep -c "MDXContent" packages/mdx/src/index.ts (kỳ vọng >= 1) && grep -rn "from '@/\|apps/2025\|apps/2026" packages/mdx/src | wc -l (kỳ vọng 0 — không import chéo app, file mới không có comment chứa các chuỗi này)</verify>
  <done>MDXContent render được với pipeline + defaultMdxComponents + override slot; đúng 1 island client; 2 barrel đầy đủ; không phụ thuộc ngược vào app.</done>
</task>

<task type="auto">
  <name>Task 3: styles.css — dual-theme pretty-code + callout token + katex tweaks</name>
  <files>packages/mdx/src/styles.css</files>
  <action>Viết styles.css theo 3 quyết định: (1) D-07 dual theme — pretty-code sinh 2 bản code với data-theme, CSS mặc định ẩn bản dark, dưới selector .dark thì ẩn bản light hiện bản dark (pattern chuẩn rehype-pretty-code docs, khớp @custom-variant dark của 2026 dùng class .dark gốc); (2) style code block qua data-attrs: [data-rehype-pretty-code-figure], [data-line], [data-highlighted-line], [data-line-numbers], [data-rehype-pretty-code-title] — nền/viền dùng CSS var semantic token (--muted, --border…) vì keepBackground false theo D-06; (3) D-11 callout: khai --callout-note-bg và các var tương ứng cho 4 biến thể với giá trị default tham chiếu semantic token, class callout-note/callout-pitfall/callout-deep-dive/callout-wip tiêu thụ các var đó — app override var là đổi skin, KHÔNG hardcode màu hex/oklch trực tiếp trên rule component. Toàn bộ rule scope chặt theo D-14: rule code block nằm dưới [data-rehype-pretty-code-figure], tinh chỉnh KaTeX (overflow-x, cỡ chữ) nằm dưới .katex — để không đụng @tailwindcss/typography (prose) của 2026.</action>
  <verify>grep -c "data-rehype-pretty-code-figure" packages/mdx/src/styles.css (kỳ vọng >= 1) && grep -c -- "--callout-note-bg" packages/mdx/src/styles.css (kỳ vọng >= 1) && grep -c "data-theme" packages/mdx/src/styles.css (kỳ vọng >= 2) && grep -c "\.katex" packages/mdx/src/styles.css (kỳ vọng >= 1) && pnpm --filter @portfolio/mdx typecheck</verify>
  <done>styles.css tồn tại, dual-theme show/hide theo .dark, mọi màu đi qua CSS var/semantic token, scope không tràn ra ngoài figure/katex.</done>
</task>

</tasks>

<verification>
- `pnpm typecheck` root xanh.
- `grep -rn "^'use client'\|^\"use client\"" packages/mdx/src --include="*.ts*" | wc -l` = 2 (copy-button.tsx + client.ts) — islands architecture giữ đúng D-10.
- `grep -rn "#[0-9a-fA-F]\{3,8\}\b\|oklch(" packages/mdx/src/styles.css | wc -l` = 0 — design token contract D-11 (styles.css chỉ var/semantic token; file tự viết không có comment chứa mã màu).
- Checklist: đủ 12 file trong files_modified tồn tại.
</verification>

<success_criteria>

- Package `@portfolio/mdx` hoàn chỉnh: renderer + components + styles, khớp cấu trúc đích M-04 (trừ phần C11 chừa chỗ).
- `<Callout>` sẵn 4 biến thể phục vụ Success Criteria 2 của phase (ROADMAP C3).
- JS client gửi xuống cho bài viết thường ~0: chỉ copy-button hydrate (REQ-02 theo hướng islands).
- App bất kỳ import `@portfolio/mdx` + `@portfolio/mdx/styles.css` là render được MDX đầy đủ, không cần cấu hình plugin (REQ-10).
  </success_criteria>

<output>
Commit: `feat(mdx): MDX component set, RSC renderer and token-based styles (C3)` (1 commit cho cả plan)
Sau khi xong: viết C03-02-SUMMARY.md cạnh plan này + cập nhật STATE.md + tick checkbox ROADMAP.md
</output>
