import React, { ReactNode } from 'react'
import { Footer } from '@/components/organisms'
import { AnimatedGridPattern } from '@/components/atoms'
import { cn } from '@/utils'

export default function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <React.Fragment>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0 z-[-1] h-full skew-y-12'
        )}
      />
      <main className={'mb-auto grow pt-14 md:pt-28'}>{children}</main>
      <Footer />
    </React.Fragment>
  )
}
