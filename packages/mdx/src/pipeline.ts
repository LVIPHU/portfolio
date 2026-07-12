import type { PluggableList } from 'unified'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkSmartypants from 'remark-smartypants'
import { remarkAlert } from 'remark-github-blockquote-alert'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkCodeTitles } from './remark/code-titles'
import { remarkImgToJsx } from './remark/img-to-jsx'
import { remarkHeaderIds } from './remark/header-ids'
import { remarkSandpackFiles } from './remark/sandpack-files'

/**
 * Pipeline MDX dùng chung cho cả 2 app — pipeline as data (D-02):
 * app chỉ import 2 mảng này, không cấu hình lại. Thêm plugin = sửa 1 chỗ.
 * Bỏ có chủ đích (D-04): rehype-prism-plus, rehype-preset-minify,
 * rehype-citation, remark-extract-frontmatter.
 */

// Icon anchor heading — nguyên văn SVG heroicon từ contentlayer.config.ts của 2025
const anchorIcon = fromHtmlIsomorphic(
  `
    <span class="content-header-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 linkicon">
        <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
        <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
      </svg>
    </span>
  `,
  { fragment: true }
)

export const remarkPlugins: PluggableList = [
  remarkSandpackFiles, // chạy ĐẦU: gộp fence trong <Sandpack> thành prop files, xóa children trước khi highlight
  remarkGfm,
  remarkMath,
  remarkSmartypants,
  remarkAlert, // > [!NOTE] kiểu GitHub — 2025 đang dùng
  remarkCodeTitles, // ```ts:file.ts → <CodeTitle>
  remarkImgToJsx, // ảnh local có width/height, không CLS
  remarkHeaderIds, // {/*custom-id*/} — chạy cuối: chỉ đụng heading, sau khi các plugin khác ổn định tree
]

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'prepend',
      headingProperties: { className: ['content-header'] },
      content: anchorIcon.children,
    },
  ],
  rehypeKatex,
  [
    rehypePrettyCode,
    {
      theme: { dark: 'github-dark-dimmed', light: 'solarized-light' },
      keepBackground: false, // nền code ăn token app (D-06)
    },
  ],
]
