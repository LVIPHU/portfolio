import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'
import { remarkPlugins, rehypePlugins } from './pipeline'
import { defaultMdxComponents } from './components/index'

export interface MDXContentProps {
  source: string
  /**
   * Slot injection (D-09): app truyền override (vd Image → next/image wrapper),
   * package TUYỆT ĐỐI không import component của app — tránh vòng phụ thuộc.
   */
  components?: MDXComponents
}

/** Renderer RSC dùng chung — 0 hydration cho nội dung bài, island duy nhất là CopyButton. */
export function MDXContent({ source, components }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={{ ...defaultMdxComponents, ...components }}
      options={{ mdxOptions: { remarkPlugins, rehypePlugins } }}
    />
  )
}
