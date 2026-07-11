import fs from 'node:fs'
import type { Literal, Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { sync as sizeOf } from 'probe-image-size'

export type ImageNode = Parent & {
  url: string
  alt: string
  name: string
  attributes: (Literal & { name: string })[]
}

/**
 * ![alt](/duong-dan.png) → <Image alt src width height> với kích thước đo
 * bằng probe-image-size lúc build (chỉ áp cho file local tồn tại trong public/)
 * → ảnh luôn có width/height, không CLS. Paragraph bọc ngoài đổi thành div
 * để tránh lỗi nesting p > div của next/image.
 * Port từ apps/2025/src/libs/remark/remark-img-to-jsx.ts.
 */
export function remarkImgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      (node: Node): node is Parent =>
        node.type === 'paragraph' && 'children' in node && (node as Parent).children.some((n) => n.type === 'image'),
      (node: Parent) => {
        const imageNodeIndex = node.children.findIndex((n) => n.type === 'image')
        const imageNode = node.children[imageNodeIndex] as ImageNode

        // chỉ xử lý file local có thật — url ngoài giữ nguyên thẻ img thường
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sizeOf(fs.readFileSync(`${process.cwd()}/public${imageNode.url}`))

          imageNode.type = 'mdxJsxFlowElement'
          imageNode.name = 'Image'
          imageNode.attributes = [
            { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
            { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
            { type: 'mdxJsxAttribute', name: 'width', value: String(dimensions?.width ?? '') },
            { type: 'mdxJsxAttribute', name: 'height', value: String(dimensions?.height ?? '') },
          ] as ImageNode['attributes']

          node.type = 'div'
          node.children[imageNodeIndex] = imageNode
        }
      }
    )
  }
}
