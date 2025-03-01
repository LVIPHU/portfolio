import { cn } from '@/libs/utils'
import * as React from 'react'

type LayoutProps = React.HTMLAttributes<HTMLDivElement>

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('container flex flex-col min-h-screen relative mx-auto px-6 py-32', className)}>
      {children}
    </div>
  )
})

Layout.displayName = 'Layout'

export { Layout }
