import Image from 'next/image'
import { Footer, Header } from '@/components/organisms'
import { PreviousPage } from '@/components/molecules'
import { AnimatedGridPattern, Container } from '@/components/atoms'
import React from 'react'
import { cn } from '@/utils'

export default async function NotFound() {
  return (
    <React.Fragment>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0z z-[-1] h-full skew-y-12'
        )}
      />
      <Container as={'main'} className={'mb-auto grow pt-14 md:pt-28'}>
        <Header title={'Oop!'} description={'Có vẻ như trang cậu tìm không có! Hãy quay trở lại!'} />
        <div className={'relative h-[50vh] w-full'}>
          <Image src={'/static/images/errors/404.svg'} fill={true} alt={'not found'} className={'object-contain'} />
        </div>
        <PreviousPage className={'mb-5 md:mb-10'} />
      </Container>
      <Footer />
    </React.Fragment>
  )
}
