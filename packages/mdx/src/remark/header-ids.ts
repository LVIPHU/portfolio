import type { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Heading id tường minh — ý tưởng học từ react.dev: kết thúc heading bằng
 * comment MDX chứa custom-id (dấu ngoặc nhọn + slash-sao custom-id sao-slash)
 * → id = "custom-id" (đặt qua hProperties nên rehype-slug bỏ qua heading này,
 * không ghi đè), comment bị gỡ khỏi text hiển thị.
 * Không có nguồn 2025 — viết mới theo D-05 của C03-CONTEXT.
 */

const CUSTOM_ID = /\/\*\s*([\w-]+)\s*\*\//

type HeadingNode = Parent & {
  depth: number
  data?: { hProperties?: Record<string, unknown> }
}

export function remarkHeaderIds() {
  return (tree: Node) => {
    visit(tree, 'heading', (node: HeadingNode) => {
      const last = node.children[node.children.length - 1] as { type: string; value?: string } | undefined
      if (!last) return
      // {/*id*/} trong MDX parse thành mdxTextExpression với value "/*id*/"
      if (last.type !== 'mdxTextExpression' || typeof last.value !== 'string') return
      const match = last.value.match(CUSTOM_ID)
      if (!match) return

      node.children.pop()
      // gỡ khoảng trắng thừa cuối text đứng trước comment
      const prev = node.children[node.children.length - 1] as { type: string; value?: string } | undefined
      if (prev?.type === 'text' && typeof prev.value === 'string') prev.value = prev.value.trimEnd()

      node.data = node.data ?? {}
      node.data.hProperties = { ...node.data.hProperties, id: match[1] }
    })
  }
}
