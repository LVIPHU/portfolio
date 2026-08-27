import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllTags, type Locale } from '@portfolio/content'
import { Link } from '@portfolio/i18n/navigation'
import { AppearTitle } from '@/components/effects/appear-title'
import { pageMetadata } from '@/utils/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'tags' })
  return pageMetadata(locale, '/tags', tMeta('title'), tMeta('description'))
}

export default async function TagsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tags')
  const tags = getAllTags(locale)

  return (
    <div>
      <header className='py-8'>
        <h1 className='h2'>
          <AppearTitle>{t('title')}</AppearTitle>
        </h1>
        <p className='p text-muted-foreground mt-4 max-w-xl'>{t('description')}</p>
      </header>

      <div className='mt-6 flex flex-wrap gap-3'>
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className='p-s hover:border-primary dark:hover:text-primary border px-4 py-2.5 transition-colors'
          >
            #{tag} <span className='text-muted-foreground'>· {t('postCount', { count })}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
