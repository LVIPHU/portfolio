'use client'

import { Container } from '@/components/atoms'
import { Header } from '@/components/organisms'
import { useTranslations } from 'next-intl'

export function PrivacyTemplate() {
  const t = useTranslations()
  return (
    <Container className='pt-4 lg:pt-12'>
      <Header title={t('Privacy.title')} description={t('Privacy.intro')} />
      <div className='prose dark:prose-invert max-w-none space-y-4 py-5 text-base md:py-10'>
        <p>{t('Privacy.umami')}</p>
        <p>{t('Privacy.speedInsights')}</p>
        <p>{t('Privacy.giscus')}</p>
        <p>{t('Privacy.contactForm')}</p>
      </div>
    </Container>
  )
}
