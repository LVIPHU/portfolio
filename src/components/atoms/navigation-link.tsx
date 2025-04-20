'use client'

import { ComponentProps } from 'react'
import { cn } from '@/utils'
import Link from 'next/link'

const EXTERNAL_LINK_REGEX = /^(https?:)?\/\//i

export function NavigationLink({ children, className, href, ...rest }: ComponentProps<'a'>) {
  const isExternal = EXTERNAL_LINK_REGEX.test(href || '')
  return (
    <Link
      href={href || '#'}
      target={isExternal ? '_blank' : '_self'}
      aria-current={isExternal ? undefined : 'page'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn('no-underline', className)}
      {...rest}
    >
      {children}
    </Link>
  )
}
