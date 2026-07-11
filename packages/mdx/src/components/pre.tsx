import type { ComponentPropsWithoutRef } from 'react'
import { CopyButton } from './copy-button'

/**
 * Server component bọc <pre> của rehype-pretty-code + đặt island CopyButton.
 * data-mdx-pre là mỏ neo để CopyButton tìm text cần copy.
 */
export function Pre(props: ComponentPropsWithoutRef<'pre'>) {
  return (
    <div className='mdx-pre' data-mdx-pre>
      <CopyButton />
      <pre {...props} />
    </div>
  )
}
