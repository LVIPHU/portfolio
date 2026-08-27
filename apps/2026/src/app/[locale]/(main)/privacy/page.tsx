import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/effects/appear-title'
import { pageMetadata } from '@/utils/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return pageMetadata(locale, '/privacy', t('title'), t('intro'))
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  return (
    <article className='mx-auto w-full max-w-2xl py-8'>
      <h1 className='h2'>
        <AppearTitle>{t('title')}</AppearTitle>
      </h1>
      <p className='p text-muted-foreground mt-6'>{t('intro')}</p>
      <ul className='p mt-8 space-y-4'>
        <li>{t('umami')}</li>
        <li>{t('speed')}</li>
        <li>{t('mailto')}</li>
      </ul>
    </article>
  )
}
