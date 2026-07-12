import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { buildFileMap, type RawFence } from '../components/sandpack/create-file-map'

// C11 (D-04): trích code fence con trong <Sandpack> Ở TẦNG mdast — trước
// rehype-pretty-code (nếu để tới rehype thì code bị highlight thành span, mất
// code thô + mất meta). Gộp thành file map JSON, gắn vào thuộc tính `files` của
// <Sandpack>, rồi XÓA các fence con để không bị highlight/hiển thị trùng.
// Component <Sandpack> chỉ việc JSON.parse(files).

type MdxJsxAttribute = { type: 'mdxJsxAttribute'; name: string; value: string }
type MdxJsxElement = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement'
  name: string | null
  attributes: MdxJsxAttribute[]
  children: Array<{ type: string; lang?: string | null; meta?: string | null; value?: string }>
}

export const remarkSandpackFiles: Plugin<[], Root> = () => {
  return (tree, file) => {
    visit(tree, (node) => {
      const el = node as unknown as MdxJsxElement
      if (el.type !== 'mdxJsxFlowElement' || el.name !== 'Sandpack') return

      const fences: RawFence[] = []
      for (const child of el.children) {
        if (child.type === 'code') {
          fences.push({ lang: child.lang, meta: child.meta, value: child.value ?? '' })
        }
      }

      const fileMap = buildFileMap(fences, (meta) => {
        // KHÔNG throw — 1 fence xấu không làm chết build (D-04)
        console.warn(`[sandpack] bỏ qua fence meta không hiểu "${meta}" trong ${file?.path ?? 'MDX'}`)
      })

      // gắn files= JSON string, thay mọi attribute files cũ (nếu có)
      el.attributes = (el.attributes || []).filter((a) => a.name !== 'files')
      el.attributes.push({ type: 'mdxJsxAttribute', name: 'files', value: JSON.stringify(fileMap) })

      // xóa fence con → rehype-pretty-code không đụng tới
      el.children = []
    })
  }
}
