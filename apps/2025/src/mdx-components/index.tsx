import type { MDXComponents } from 'mdx/types'
import { Image, Zoom, type ImageProps, NavigationLink } from '@/components/atoms'

/**
 * Override đặc thù app truyền vào <MDXContent components> (D-11):
 * Pre/CodeTitle/TableWrapper... giờ là default của @portfolio/mdx —
 * ở đây chỉ giữ cái riêng của 2025 (Image có zoom, link nội bộ).
 */
export const MDX_COMPONENTS: MDXComponents = {
  Image: ({ alt, ...rest }: ImageProps) => {
    return (
      <Zoom>
        <Image alt={alt} {...rest} />
      </Zoom>
    )
  },
  a: NavigationLink,
}
