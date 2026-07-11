import React, { ReactNode } from 'react'
import { Footer } from '@/components/organisms'
import { GridBackground } from '@/components/atoms'

export default function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <React.Fragment>
      <GridBackground className='inset-x-0 top-0 z-[-1] h-[50vh]' />
      <main className={'mb-auto min-h-svh grow pt-14 md:pt-28'}>{children}</main>
      <Footer />
    </React.Fragment>
  )
}
