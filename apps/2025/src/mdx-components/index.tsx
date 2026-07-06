import type { MDXComponents } from 'mdx/types'
import { CodeTitle } from './code-title'
import { Pre } from './pre'
import { TableWrapper } from './table-wrapper'
import { Image, Zoom, type ImageProps, NavigationLink } from '@/components/atoms'

export const MDX_COMPONENTS: MDXComponents = {
  Image: ({ alt, ...rest }: ImageProps) => {
    return (
      <Zoom>
        <Image alt={alt} {...rest} />
      </Zoom>
    )
  },
  CodeTitle,
  a: NavigationLink,
  pre: Pre,
  table: TableWrapper,
}
