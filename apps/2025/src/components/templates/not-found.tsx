import { AnimatedContent, Container, GridBackground } from '@/components/atoms'
import { Footer, Header } from '@/components/organisms'
import Image from 'next/image'
import { PreviousPage } from '@/components/molecules'
import React from 'react'
import { useTranslations } from 'next-intl'

export const NotFoundTemplate = () => {
  const t = useTranslations()
  return (
    <React.Fragment>
      <GridBackground className='inset-x-0 top-0 z-[-1] h-[50vh]' />
      <Container as={'main'} className={'mb-auto grow pt-14 md:pt-28'}>
        <Header title={t('NotFound.oop')} description={t('NotFound.itSeemsLikeThe')} />
        <AnimatedContent className={'relative h-[50vh] w-full'}>
          <Image
            src={'/static/images/errors/404.svg'}
            fill={true}
            alt={t('NotFound.notFound')}
            className={'object-contain'}
          />
        </AnimatedContent>
        <PreviousPage className={'mb-5 md:mb-10'} />
      </Container>
      <Footer />
    </React.Fragment>
  )
}
