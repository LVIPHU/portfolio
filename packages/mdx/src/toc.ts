import { slug } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type Toc = TocItem[]

function remarkTocHeadings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- vfile.data là bag tự do (như bản 2025)
  return (tree: Parent, file: any) => {
    const toc: Toc = []
    visit(tree, 'heading', (node: Parent & { depth?: number }) => {
      const textContent = toString(node).replace(/<[^>]*(>|$)/g, '')
      if (textContent) {
        toc.push({
          value: textContent,
          url: '#' + slug(textContent),
          depth: node.depth ?? 1,
        })
      }
    })
    file.data.toc = toc
  }
}

/**
 * Trích danh sách heading {value, url, depth} từ raw MDX string — hàm thuần,
 * dùng cho TOC sidebar của cả 2 app. Port từ apps/2025/src/libs/remark.
 * Lưu ý: heading dùng custom-id của remarkHeaderIds chưa được nhận diện
 * ở đây — hiện 0 bài dùng; xử lý khi có nhu cầu thật.
 */
export async function extractTocHeadings(markdown: string): Promise<Toc> {
  const vfile = await remark().use(remarkTocHeadings).process(markdown)
  return (vfile.data.toc as Toc) ?? []
}
