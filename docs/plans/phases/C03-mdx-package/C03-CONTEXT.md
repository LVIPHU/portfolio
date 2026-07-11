# Phase C3: packages/mdx — Context

**Thu thập:** 2026-07-11
**Trạng thái:** Sẵn sàng lập plan

<domain>
## Ranh giới phase

Phase này giao package `@portfolio/mdx` chứa **toàn bộ pipeline remark/rehype + bộ component MDX + `<MDXContent>` RSC**, và 2026 render blog qua nó (ROADMAP Phase C3 — REQ-02, REQ-10). Học **có chọn lọc** từ react.dev: Callout đa biến thể, TerminalBlock, smartypants. KHÔNG thuộc phase: 2025 tiêu thụ package (Phase C5 — C5 chỉ việc trỏ 2025 vào cùng renderer), Sandpack (Phase C11), và các thứ overkill của react.dev không port (pipeline compileMDX tự chế/VM, CodeMirror highlight, DocSearch). Phụ thuộc C2 (blog đã nằm ở `packages/content`); chặn C5 và C11.
</domain>

<decisions>
## Quyết định đã khóa

### Kiến trúc package

- **D-01:** `@portfolio/mdx` là package raw-TS không build step, tiêu thụ qua `transpilePackages` (REQ-10). Exports 3 entry: `"."` → `./src/index.ts` (barrel server-safe: MDXContent, pipeline, extractTocHeadings, types), `"./client"` → `./src/client.ts` (barrel 'use client': CopyButton; chừa chỗ Sandpack cắm vào ở C11), `"./styles.css"` → `./src/styles.css`. Peer deps: `react ^19`, `next >=16`.
- **D-02:** **Pipeline as data** — `remarkPlugins` và `rehypePlugins` là 2 mảng `PluggableList` export thuần từ `pipeline.ts`; app không cấu hình lại, chỉ import; thêm plugin = sửa 1 chỗ, cả 2 app nhận.
- **D-03:** Deps của package: `next-mdx-remote@^6`, `remark-gfm`, `remark-math`, `remark-smartypants`, `remark-github-blockquote-alert`, `rehype-slug`, `rehype-autolink-headings`, `rehype-katex`, `rehype-pretty-code`, `katex`, `probe-image-size`, `unist-util-visit`, `github-slugger`, `hast-util-from-html-isomorphic`, `mdast-util-to-string`. Ngoài danh sách gốc, code port cần thêm: `remark` (extractTocHeadings gọi `remark()`), `unified` (type `PluggableList`), devDeps `@types/unist` + `@types/probe-image-size` — xác minh từ import thật trong `apps/2025/src/libs/remark/` và `apps/2025/package.json`.
- **D-04:** **BỎ có chủ đích** so với pipeline 2025: `rehype-prism-plus` (chồng chéo pretty-code), `rehype-preset-minify` (RSC không cần), `rehype-citation` (0 bài dùng), `remarkExtractFrontmatter` (gray-matter đã tách frontmatter trước khi vào pipeline — từ C2). Các gói này KHÔNG được xuất hiện trong deps.

### Pipeline

- **D-05:** Bộ remark theo mẫu M-01: `remarkGfm`, `remarkMath`, `remarkSmartypants` (MỚI — học react.dev, quote/dash typography), `remarkAlert` (`> [!NOTE]` kiểu GitHub — 2025 đang dùng), `remarkCodeTitles` (port), `remarkImgToJsx` (port). Kèm file `remark/header-ids.ts` port ý tưởng react.dev: heading id tường minh `{/*custom-id*/}` (vị trí chèn trong mảng: xem mục Claude tự quyết).
- **D-06:** Bộ rehype theo mẫu M-01: `rehypeSlug`; `rehypeAutolinkHeadings` với `behavior: 'prepend'`, `headingProperties: { className: ['content-header'] }`, `content: anchorIcon` — **giữ nguyên SVG heroicon** từ `apps/2025/contentlayer.config.ts` (dòng 35-45) qua `hast-util-from-html-isomorphic`; `rehypeKatex`; `rehypePrettyCode` với `theme: { dark: 'github-dark-dimmed', light: 'solarized-light' }` và `keepBackground: false` (nền code block ăn theo token app — mỗi app style riêng qua CSS var).
- **D-07:** Dual theme code block: pretty-code sinh 2 bản `<code data-theme="dark|light">`; CSS trong `styles.css` show/hide theo class `.dark` gốc (pattern chuẩn của rehype-pretty-code docs).
- **D-08:** Line-highlight meta: pretty-code dùng cùng cú pháp meta `{1,3}` như prism-plus cũ — **grep 4 bài port từ 2025 kiểm meta fence trước** khi coi pipeline là xong; nếu bài dùng cú pháp chỉ prism-plus hiểu (vd `{1,3-4}` biến thể cũ) thì sửa fence ngay trong MDX (được phép — bài đã ở `packages/content` sau C2).

### Renderer & components

- **D-09:** Renderer là `<MDXContent source components? />` — RSC bọc `next-mdx-remote/rsc`, theo mẫu M-02. **Component slot injection**: app truyền override qua prop `components` (vd 2025 truyền `Image` atom riêng của nó, 2026 truyền `next/image` wrapper) — package **không import component của app** (tránh vòng phụ thuộc, Dependency Inversion). Rủi ro next-mdx-remote@6 + Next 16 edge case RSC: thấp — 2026 đã dùng next-mdx-remote@^6 render RSC từ trước.
- **D-10:** **Islands architecture**: mặc định server component (Callout tĩnh, CodeTitle, TableWrapper, TerminalBlock, YouTube). Island client duy nhất: `copy-button.tsx` (`'use client'`, useState copied). Callout biến thể `deep-dive` dùng `details`/`summary` HTML thuần được ưu tiên — đủ đẹp thì **0 JS**, không dùng state client. JS gửi xuống ~0 cho bài viết thường.
- **D-11:** Callout 4 biến thể `note|pitfall|deep-dive|wip` theo variantMap kiểu ExpandableCallout react.dev, theo mẫu M-03. Style bằng semantic token + CSS var riêng (`--callout-note-bg`…) khai trong `styles.css` với giá trị default, app override được (**design token contract**: styles.css chỉ tham chiếu CSS var + semantic token, không hardcode màu — cùng markup, 2 app 2 skin).
- **D-12:** `defaultMdxComponents` map `img` → thẻ `img` thuần có width/height (phòng bị rủi ro: `remarkImgToJsx` sinh tag `Image`, map phải có sẵn component tương ứng); app override bằng next/image.
- **D-13:** `toc.ts`: port `extractTocHeadings` từ `apps/2025/src/libs/remark/remark-toc-headings.ts` (remark + mdast-util-to-string + github-slugger, trả `{ value, url, depth }[]`) — hàm thuần chạy trên raw MDX string, dùng được cho cả TOC sidebar 2025 lẫn 2026 sau này.
- **D-14:** `styles.css` scope chặt để không đụng plugin `@tailwindcss/typography` (prose): mọi rule code block nằm dưới `[data-rehype-pretty-code-figure]`, rule KaTeX nằm dưới `.katex`; kiểm cả 2 theme.

### 2026 adoption

- **D-15:** 2026 tiêu thụ: (1) `apps/2026/src/app/[locale]/blog/[slug]/page.tsx` gỡ `MDXRemote` inline → `<MDXContent source={post.content} />`; (2) `apps/2026/next.config.ts` thêm `'@portfolio/mdx'` vào `transpilePackages`; (3) `apps/2026/src/app/globals.css` thêm `@source '../../../../packages/mdx/src';` + import `styles.css` của package; (4) CSS code block theo data-attrs pretty-code: `[data-rehype-pretty-code-figure]`, `[data-line]`, `[data-highlighted-line]`, `[data-line-numbers]` (2026 hiện chưa có CSS prism nào — style mới nằm trong styles.css của package).
- **D-16:** KaTeX CSS (`katex/dist/katex.min.css`) chỉ import ở route blog (layout blog), KHÔNG global — tránh +23KB css global. 2026 chưa có `blog/layout.tsx` → tạo mới; `katex` phải vào deps của `apps/2026` (pnpm strict không hoist từ packages/mdx).
- **D-17:** Rollback: 2026 revert 3 file (blog page, next.config.ts, globals.css) là quay lại renderer cũ; package mới không ai khác import trước C5.

### Claude tự quyết

- Vị trí chèn `remarkHeaderIds` trong mảng `remarkPlugins` (mẫu M-01 chưa liệt kê nó) — chọn vị trí hợp lý, ghi lựa chọn vào SUMMARY.
- Chi tiết markup `TerminalBlock` và `YouTube` (iframe lite, lazy) — miễn là server component, không thêm dep mới.
- Cách khai type `MDXComponents` (import từ `mdx/types` hay tự định nghĩa) — miễn typecheck xanh.
- Version cụ thể cho các gói mới chưa có trong repo (remark-smartypants, rehype-slug…) — lấy latest ổn định, ghi vào SUMMARY.
</decisions>

<specifics>
## Ý tưởng & mẫu cụ thể

Muốn giống react.dev có chọn lọc: Callout đa biến thể, TerminalBlock, smartypants, heading id tường minh — KHÔNG port compileMDX tự chế/VM, CodeMirror, DocSearch.

### M-01 — pipeline.ts (1 nguồn sự thật cho cả 2 app)

````ts
import type { PluggableList } from 'unified'

export const remarkPlugins: PluggableList = [
  remarkGfm,
  remarkMath,
  remarkSmartypants, // MỚI (học react.dev): quote/dash typography
  remarkAlert, // > [!NOTE] kiểu GitHub — 2025 đang dùng
  remarkCodeTitles, // ```js:file.ts → <CodeTitle>
  remarkImgToJsx, // ![](x.png) → <Image width height> (probe-image-size)
]

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    { behavior: 'prepend', headingProperties: { className: ['content-header'] }, content: anchorIcon },
  ],
  rehypeKatex,
  [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'solarized-light' }, keepBackground: false }],
]
````

### M-02 — render.tsx (RSC renderer)

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { remarkPlugins, rehypePlugins } from './pipeline'
import { defaultMdxComponents } from './components'

export function MDXContent({ source, components }: { source: string; components?: MDXComponents }) {
  return (
    <MDXRemote
      source={source}
      components={{ ...defaultMdxComponents, ...components }}
      options={{ mdxOptions: { remarkPlugins, rehypePlugins } }}
    />
  )
}
```

### M-03 — callout.tsx variantMap (kiểu react.dev)

```tsx
const variantMap = {
  note:      { label: 'Ghi chú',   icon: Info,          className: 'callout-note' },
  pitfall:   { label: 'Cạm bẫy',   icon: TriangleAlert, className: 'callout-pitfall' },
  'deep-dive': { label: 'Đào sâu', icon: Layers,        className: 'callout-deep-dive' },
  wip:       { label: 'Đang viết', icon: Construction,  className: 'callout-wip' },
} satisfies Record<CalloutVariant, ...>
```

### M-04 — cấu trúc file đích của package

```
packages/mdx/
├── package.json           # exports ./src/index.ts (server) + ./src/client.ts ('use client' re-exports)
├── tsconfig.json          # extends ../../tsconfig.base.json
└── src/
    ├── index.ts            # barrel server-safe: MDXContent, pipeline, extractTocHeadings, types
    ├── client.ts           # barrel client: CopyButton, Callout (nếu có state), Sandpack (C11)
    ├── pipeline.ts         # remarkPlugins[] + rehypePlugins[] + options pretty-code
    ├── toc.ts              # extractTocHeadings (port từ libs/remark của 2025)
    ├── render.tsx           # <MDXContent source components? /> — RSC bọc next-mdx-remote/rsc
    ├── styles.css           # CSS cho pretty-code data-attrs + callout + katex tweaks
    ├── remark/
    │   ├── code-titles.ts   # port apps/2025/src/libs/remark/remark-code-titles
    │   ├── img-to-jsx.ts    # port (dùng probe-image-size lấy width/height)
    │   └── header-ids.ts    # port ý tưởng react.dev: heading id tường minh `{/*custom-id*/}`
    └── components/
        ├── index.ts         # map tên tag MDX → component (defaultMdxComponents)
        ├── callout.tsx      # kiểu ExpandableCallout react.dev: note|pitfall|deep-dive|wip
        ├── pre.tsx          # Pre + nút copy (client island nhỏ)
        ├── copy-button.tsx  # 'use client'
        ├── code-title.tsx
        ├── table-wrapper.tsx
        ├── terminal-block.tsx
        └── youtube.tsx      # iframe lite, lazy
```

</specifics>

<canonical_refs>

## Tài liệu gốc phải đọc

- `docs/plans/ROADMAP.md` — Goal, REQ-02/REQ-10, Success Criteria của Phase C3.
- `apps/2025/contentlayer.config.ts` — pipeline nguồn port: thứ tự plugin, options rehypeAutolinkHeadings, theme pretty-code, SVG anchor icon (dòng 35-45).
- `apps/2025/src/libs/remark/` — 4 plugin tự viết nguồn port (`remark-code-titles.ts`, `remark-img-to-jsx.ts`, `remark-toc-headings.ts`; `remark-extract-frontmatter.ts` KHÔNG port theo D-04).
- `apps/2025/src/mdx-components/index.tsx` — contract map component hiện hữu của 2025 (tham chiếu để override sau này ở C5).
- `apps/2026/src/app/[locale]/blog/[slug]/page.tsx` — nơi thay renderer (D-15).
- `apps/2026/next.config.ts` + `apps/2026/src/app/globals.css` — điểm tích hợp transpilePackages / `@source`.
- `packages/ui/package.json` + `packages/ui/tsconfig.json` — mẫu scaffold package raw-TS đã chạy (C1).
- `docs/plans/STATE.md` — quyết định toàn cục + blockers (2025 build từ PowerShell tới hết C5).
  </canonical_refs>

<code_context>

## Hiện trạng codebase (facts đã xác minh 2026-07-11)

### Tài sản tái dùng

- `apps/2025/contentlayer.config.ts`: remark hiện hữu = `[remarkExtractFrontmatter, remarkGfm, remarkCodeTitles, remarkMath, remarkImgToJsx, remarkAlert]`; rehype hiện hữu = `[rehypeSlug, rehypeAutolinkHeadings(prepend, className content-header, content icon), rehypeKatex, rehypeCitation, rehypePrismPlus, rehypePrettyCode(dark github-dark-dimmed / light solarized-light), rehypePresetMinify]`. Anchor icon = SVG heroicon 20x20 qua `fromHtmlIsomorphic`, span class `content-header-link`.
- `apps/2025/src/libs/remark/` gồm 5 file: `index.ts`, `remark-code-titles.ts`, `remark-extract-frontmatter.ts`, `remark-img-to-jsx.ts`, `remark-toc-headings.ts`.
  - `remarkCodeTitles`: fence dạng lang:tên-file → chèn node `mdxJsxFlowElement` tên `CodeTitle` với attrs `lang`/`title`, rồi gán lại `node.lang`.
  - `remarkImgToJsx`: `probe-image-size` sync đọc `${process.cwd()}/public${url}` (chỉ file local tồn tại) → node `Image` attrs `alt/src/width/height`, đổi `p` → `div` tránh nesting error.
  - `extractTocHeadings(markdown: string): Promise<Toc>` với `TocItem = { value, url, depth }`; import từ `remark`, `mdast-util-to-string`, `github-slugger`, `unist-util-visit`.
- `apps/2025/src/mdx-components/index.tsx`: `MDX_COMPONENTS = { Image (bọc Zoom), CodeTitle, a: NavigationLink, pre: Pre, table: TableWrapper }`.

### Pattern đã có

- Package raw-TS chuẩn repo: `packages/ui/package.json` (`exports "." → ./src/index.ts`, script `typecheck: tsc --noEmit`, peer `react ^19`) + `packages/ui/tsconfig.json` (`extends ../../tsconfig.base.json`, `jsx: react-jsx`, `include: ["src"]`). `packages/content/package.json` cùng pattern.
- `apps/2026/src/app/globals.css` đã có pattern `@source '../../../../packages/ui/src';` (dòng 3), `@plugin '@tailwindcss/typography'`, token oklch trong `:root`/`.dark`.

### Điểm tích hợp

- `apps/2026/src/app/[locale]/blog/[slug]/page.tsx` dòng 5 + 59: render `<MDXRemote source={post.content} />` TRẦN — không plugin, không components. Đây là chỗ thay bằng `<MDXContent>`.
- `apps/2026/next.config.ts`: `transpilePackages: ['@portfolio/content', '@portfolio/ui']` (dòng 10).
- `apps/2026/package.json` đã có `next-mdx-remote ^6.0.0`; CHƯA có `katex`. Chưa tồn tại `apps/2026/src/app/[locale]/blog/layout.tsx`.
- `packages/content/blog/`: hiện 4 file mdx (hello-world, portfolio-monorepo × vi/en); sau C2 sẽ có 8 bài, gồm `kien-truc-react-fiber` (nguồn `apps/2025/data/blog/` — 4 bài, đã xác minh có `kien-truc-react-fiber.mdx`).
- Version deps nguồn port (từ `apps/2025/package.json`): `remark ^15.0.1`, `github-slugger 2.0.0`, `hast-util-from-html-isomorphic 2.0.0`, `mdast-util-to-string 4.0.0`, `probe-image-size ^7.2.3`, `remark-github-blockquote-alert ^1.3.0`, `unist-util-visit 5.1.0`, `@types/probe-image-size ^7.2.5`, `@types/unist 3.0.3`.

### Tối ưu đã tính (từ plan gốc — bảo toàn làm tiêu chí đo)

- RSC render = 0 hydration cost cho nội dung bài; đo bằng: view-source thấy HTML đầy đủ, bundle trang blog không chứa nội dung MDX.
- `probe-image-size` chạy build-time trong img-to-jsx → mọi ảnh có width/height → không CLS.
- KaTeX CSS chỉ ở route blog (D-16).
- Shiki (trong pretty-code) chậm ở build lớn — hiện 8 bài, không cần cache.
  </code_context>

<deferred>
## Ý tưởng hoãn

- Sandpack trong `client.ts` (pin 2.20, lazy 2 tầng) — Phase C11.
- 2025 render blog qua `@portfolio/mdx` — Phase C5.
- Cache Shiki bằng `getSingletonHighlighter` chia sẻ instance — chỉ xét khi >50 bài; backlog.
- TOC sidebar 2026 dùng `extractTocHeadings` — backlog (hàm đã sẵn từ C3, chưa có UI tiêu thụ).
</deferred>

---

_Phase: C03-mdx-package_
