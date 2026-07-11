# C3 — packages/mdx: pipeline + component MDX dùng chung, 2026 tiêu thụ

> **Phụ thuộc:** C2. **Chặn:** C5 (2025 sẽ render blog qua package này), C11 (Sandpack cắm vào đây).
> **Ước lượng:** ~3–4h. **Commit:** `feat(mdx): shared MDX pipeline + components (@portfolio/mdx), adopt in 2026`

## 1. Mục tiêu & phạm vi

Một package `@portfolio/mdx` chứa **toàn bộ pipeline remark/rehype + bộ component MDX**, để C5 chỉ việc trỏ 2025 vào cùng renderer. Học có chọn lọc từ react.dev: port ý tưởng Callout đa biến thể, TerminalBlock, smartypants; **không** port pipeline compileMDX tự chế/VM, CodeMirror highlight, DocSearch (overkill với blog cá nhân).

Nguồn port chính: `apps/2025/contentlayer.config.ts` (pipeline hiện hữu) + `apps/2025/src/libs/remark/` (plugin tự viết) + mdx-components của 2025.

## 2. Cấu trúc file đích

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

`package.json`: deps `next-mdx-remote@^6`, `remark-gfm`, `remark-math`, `remark-smartypants`, `remark-github-blockquote-alert`, `rehype-slug`, `rehype-autolink-headings`, `rehype-katex`, `rehype-pretty-code`, `katex`, `probe-image-size`, `unist-util-visit`, `github-slugger`, `hast-util-from-html-isomorphic`, `mdast-util-to-string`; peer `react ^19`, `next >=16`. **Bỏ hẳn:** `rehype-prism-plus` (chồng chéo pretty-code), `rehype-preset-minify` (RSC không cần), `rehype-citation` (0 bài dùng).

## 3. Hướng code chi tiết

### 3.1 pipeline.ts — 1 nguồn sự thật cho cả 2 app

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

Lưu ý port:

- `anchorIcon`: giữ nguyên SVG heroicon từ contentlayer.config (qua `hast-util-from-html-isomorphic`).
- **Không** port `remarkExtractFrontmatter` — gray-matter đã tách frontmatter trước khi vào pipeline.
- `keepBackground: false` để nền code block ăn theo token app (mỗi app style riêng qua CSS var).
- Dual theme pretty-code sinh 2 bản `<code data-theme="dark|light">` — CSS trong `styles.css` show/hide theo class `.dark` gốc (pattern chuẩn của rehype-pretty-code docs).

### 3.2 render.tsx — RSC renderer

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

App truyền override qua prop `components` (vd 2025 truyền `Image` atom riêng của nó, 2026 truyền `next/image` wrapper) — **package không import component của app** (tránh vòng phụ thuộc).

### 3.3 components/ — quy tắc server/client

- Mặc định server component (Callout tĩnh, CodeTitle, TableWrapper, TerminalBlock, YouTube).
- Chỉ 2 island client: `copy-button.tsx` (useState copied) và phần expand của `callout.tsx` biến thể `deep-dive` (details/summary HTML thuần được ưu tiên hơn — nếu đủ đẹp thì **0 JS**).
- `callout.tsx` theo variantMap kiểu react.dev:

```tsx
const variantMap = {
  note:      { label: 'Ghi chú',   icon: Info,          className: 'callout-note' },
  pitfall:   { label: 'Cạm bẫy',   icon: TriangleAlert, className: 'callout-pitfall' },
  'deep-dive': { label: 'Đào sâu', icon: Layers,        className: 'callout-deep-dive' },
  wip:       { label: 'Đang viết', icon: Construction,  className: 'callout-wip' },
} satisfies Record<CalloutVariant, ...>
```

Style bằng semantic token + CSS var riêng (`--callout-note-bg`…) khai trong `styles.css` với giá trị default, app override được.

### 3.4 toc.ts

Port `extractTocHeadings` từ `apps/2025/src/libs/remark` (remark + mdast-util-to-string + github-slugger, trả `{ value, url, depth }[]`). Đây là hàm thuần chạy trên raw MDX string — dùng được cho cả TOC sidebar 2025 lẫn 2026 sau này.

### 3.5 2026 tiêu thụ

1. `apps/2026`: gỡ code render MDX inline hiện tại ở `app/[locale]/blog/[slug]/page.tsx` → `<MDXContent source={post.content} />`.
2. `next.config.ts`: `transpilePackages: ['@portfolio/content', '@portfolio/ui', '@portfolio/mdx']`.
3. `globals.css`: thêm `@source '../../../../packages/mdx/src';` + `@import` katex css (`katex/dist/katex.min.css` import trong layout blog, không global) + import `@portfolio/mdx` styles.css.
4. Chuyển CSS code block hiện tại (nếu style theo class prism) sang data-attrs pretty-code: `[data-rehype-pretty-code-figure]`, `[data-line]`, `[data-highlighted-line]`, `[data-line-numbers]`.

## 4. Design pattern áp dụng

- **Pipeline as data**: plugin list là mảng export thuần — app không cấu hình lại, chỉ import; thêm plugin = sửa 1 chỗ, cả 2 app nhận.
- **Component slot injection**: renderer nhận `components` override — Dependency Inversion, package không biết app; app quyết định `Image`/`a` của nó.
- **Islands architecture**: MDX render tĩnh trên server, chỉ copy-button là client — JS gửi xuống ~0 cho bài viết thường.
- **Design token contract**: styles.css chỉ tham chiếu CSS var + semantic token, không hardcode màu — cùng markup, 2 app 2 skin.

## 5. Tối ưu

- RSC render = 0 hydration cost cho nội dung bài; đo bằng: view-source thấy HTML đầy đủ, bundle trang blog không chứa nội dung MDX.
- `probe-image-size` chạy build-time trong `img-to-jsx` → mọi ảnh có width/height → **không CLS**.
- KaTeX CSS chỉ import ở route blog (tránh +23KB css global).
- Shiki (trong pretty-code) chậm ở build lớn — hiện 8 bài, không cần cache; nếu sau này >50 bài mới xét `getSingletonHighlighter` chia sẻ instance.

## 6. Testing & gate nghiệm thu

1. `pnpm typecheck` root xanh (package mới + 2026).
2. `pnpm build --filter=web-2026` xanh.
3. Smoke `:3000` — checklist trên bài `kien-truc-react-fiber` (bài giàu format nhất):
   - Code block: dual theme đổi theo dark/light toggle, có tên file (code-titles), copy button hoạt động.
   - Heading có anchor icon prepend, click ra đúng `#id`; TOC (nếu trang có) khớp.
   - Blockquote alert `[!NOTE]` render callout; thêm 1 `<Callout type="pitfall">` demo vào `portfolio-monorepo.vi.mdx` để test component trực tiếp.
   - Công thức toán (nếu bài có) render KaTeX; ảnh trong bài không nhảy layout (kiểm devtools CLS).
   - Smartypants: "..." thành "…" trong đoạn văn.
4. `pnpm build --filter=web-2025` (PowerShell) xanh — 2025 chưa đụng, chỉ xác nhận không vỡ do hoisting deps.

## 7. Rủi ro & rollback

| Rủi ro                                                                  | Phòng bị                                                                                                                                 |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Bài 2025 dùng cú pháp chỉ prism-plus hiểu (`{1,3-4}` line highlight cũ) | pretty-code cùng cú pháp meta `{1,3}` — grep 4 bài kiểm meta fence trước; sai thì sửa fence trong MDX (được phép, đã ở packages/content) |
| next-mdx-remote@6 + Next 16 edge case RSC                               | đã dùng ở 2026 từ trước (next-mdx-remote sẵn trong deps) — rủi ro thấp                                                                   |
| Katex/pretty-code CSS đụng typography plugin                            | scope CSS dưới `[data-rehype-pretty-code-figure]` và `.katex`, kiểm cả 2 theme                                                           |
| img-to-jsx cần component `Image` tồn tại trong map                      | defaultMdxComponents map `img`→ thẻ `img` thuần có width/height; app override bằng next/image                                            |

Rollback: 2026 revert 3 file (page blog, next.config, globals.css) là quay lại renderer cũ; package mới không ai khác import.
