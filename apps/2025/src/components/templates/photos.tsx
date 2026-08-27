'use client'

import { Header } from '@/components/organisms'
import { useTranslations } from 'next-intl'
import { Blur, Container } from '@/components/atoms'
import { PHOTOS_2025 } from '@portfolio/content'
import dynamic from 'next/dynamic'

const ParallaxScroll = dynamic(() => import('@/components/molecules/parallax-scroll').then((m) => m.ParallaxScroll), {
  ssr: false,
})

export function PhotosTemplate() {
  const t = useTranslations()
  const imageList = PHOTOS_2025.map((photo) => ({
    id: photo.id,
    src: photo.id,
    title: photo.title,
  }))
  return (
    <Container>
      <Header title={t('Common.photos')} description={t('Common.photos')} />
      <section className={'items-start'}>
        <ParallaxScroll images={imageList} />
      </section>
      <Blur />
    </Container>
  )
}
