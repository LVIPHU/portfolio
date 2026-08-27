'use client'

import { ComponentProps } from 'react'
import { cn } from '@portfolio/utils'
import { Link, usePathname } from '@portfolio/i18n/navigation'

const EXTERNAL_LINK_REGEX = /^(https?:)?\/\//i

export function NavigationLink({ children, className, href, ...rest }: ComponentProps<'a'>) {
  const pathname = usePathname()
  const dest = href || '#'
  const isExternal = EXTERNAL_LINK_REGEX.test(dest)

  if (isExternal) {
    return (
      <a href={dest} target='_blank' rel='noopener noreferrer' className={cn('no-underline', className)} {...rest}>
        {children}
      </a>
    )
  }

  // aria-current chỉ khi pathname khớp — gán 'page' cho mọi internal link là sai (mọi mục đều "trang hiện tại").
  return (
    <Link
      href={dest}
      target='_self'
      aria-current={pathname === dest ? 'page' : undefined}
      className={cn('no-underline', className)}
      {...rest}
    >
      {children}
    </Link>
  )
}
