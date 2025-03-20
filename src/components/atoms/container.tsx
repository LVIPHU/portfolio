import type { ReactNode } from 'react'
import { cn } from '@/libs/utils'

export function Container({
  children,
  as: Component = 'section',
  className,
}: {
  children: ReactNode
  as?: React.ElementType
  className?: string
}) {
  return <Component className={cn('container relative mx-auto px-4 md:px-6 xl:px-12', className)}>{children}</Component>
}
