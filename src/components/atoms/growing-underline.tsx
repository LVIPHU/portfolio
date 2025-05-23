import React, { CSSProperties } from 'react'
import { cn } from '@/utils'

export function GrowingUnderline({
  as: Component = 'span',
  children,
  active,
  className,
  duration,
  ...rest
}: {
  children: React.ReactNode
  as?: React.ElementType
  active?: boolean
  className?: string
  duration?: number
  [key: string]: any
}) {
  return (
    <Component
      className={cn([
        'bg-gradient-to-r bg-left-bottom bg-no-repeat',
        'duration-[var(--duration,300ms)] transition-[background-size]',
        'from-amber-200 to-amber-100',
        'dark:from-amber-800 dark:to-amber-900',
        active ? 'bg-[length:100%_50%] hover:bg-[length:100%_100%]' : 'bg-[length:0px_50%] hover:bg-[length:100%_50%]',
        className,
      ])}
      style={{ '--duration': `${duration || 300}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  )
}
