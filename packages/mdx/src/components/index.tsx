import type { ComponentPropsWithoutRef } from 'react'
import type { MDXComponents } from 'mdx/types'
import { Callout } from './callout'
import { CodeTitle } from './code-title'
import { Pre } from './pre'
import { TableWrapper } from './table-wrapper'
import { TerminalBlock } from './terminal-block'
import { YouTube } from './youtube'

/**
 * Fallback img thuần cho cả cú pháp markdown lẫn tag <Image> do
 * remarkImgToJsx sinh ra (D-12) — forward width/height giữ chống-CLS.
 * App override bằng next/image qua prop components của MDXContent.
 */
function PlainImg(props: ComponentPropsWithoutRef<'img'>) {
  return <img loading='lazy' decoding='async' {...props} />
}

export const defaultMdxComponents: MDXComponents = {
  pre: Pre,
  table: TableWrapper,
  img: PlainImg,
  Image: PlainImg,
  CodeTitle,
  Callout,
  TerminalBlock,
  YouTube,
}

export { Callout, CodeTitle, Pre, TableWrapper, TerminalBlock, YouTube }
export type { CalloutProps, CalloutVariant } from './callout'
