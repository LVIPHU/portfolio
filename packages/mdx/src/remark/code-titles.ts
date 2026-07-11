import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Fence dạng ```lang:tên-file → chèn node <CodeTitle lang title> làm sibling
 * đứng trước code block, rồi trả node.lang về ngôn ngữ thuần.
 * Port nguyên logic từ apps/2025/src/libs/remark/remark-code-titles.ts.
 */
export function remarkCodeTitles() {
  return (tree: Parent & { lang?: string }) =>
    visit(tree, 'code', (node: Parent & { lang?: string }, index: number | undefined, parent: Parent | undefined) => {
      const nodeLang = node.lang || ''
      let language = ''
      let title = ''

      if (nodeLang.includes(':')) {
        language = nodeLang.slice(0, nodeLang.search(':'))
        title = nodeLang.slice(nodeLang.search(':') + 1, nodeLang.length)
      }

      if (!title || !parent || index === undefined) return

      parent.children.splice(index, 0, {
        type: 'mdxJsxFlowElement',
        // @ts-expect-error mdxJsxFlowElement không nằm trong type mdast lõi
        name: 'CodeTitle',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'lang', value: language },
          { type: 'mdxJsxAttribute', name: 'title', value: title },
        ],
        data: { _xdmExplicitJsx: true },
      })
      node.lang = language
    })
}
