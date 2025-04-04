import Image from 'next/image'
import { Footer, Header } from '@/components/organisms'
import { PreviousPage } from '@/components/molecules'
import { Container, GridBackground } from '@/components/atoms'
import React from 'react'

export default async function NotFound() {
  return (
    <React.Fragment>
      <GridBackground className='inset-x-0 top-0 z-[-1] h-[50vh]' />
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
