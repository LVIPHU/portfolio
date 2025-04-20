import { Container, GridBackground } from '@/components/atoms'
import { Footer, Header } from '@/components/organisms'
import Image from 'next/image'
import { PreviousPage } from '@/components/molecules'
import React from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

export const NotFoundTemplate = () => {
  const { i18n } = useLingui()
  return (
    <React.Fragment>
      <GridBackground className='inset-x-0 top-0 z-[-1] h-[50vh]' />
      <Container as={'main'} className={'mb-auto grow pt-14 md:pt-28'}>
        <Header
          title={'Oop!'}
          description={t(i18n)`It seems like the page you're looking for doesn't exist! Please go back!`}
        />
        <div className={'relative h-[50vh] w-full'}>
          <Image
            src={'/static/images/errors/404.svg'}
            fill={true}
            alt={t(i18n)`not found`}
            className={'object-contain'}
          />
        </div>
        <PreviousPage className={'mb-5 md:mb-10'} />
      </Container>
      <Footer />
    </React.Fragment>
  )
}
