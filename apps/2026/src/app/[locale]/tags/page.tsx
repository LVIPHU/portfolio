import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllTags, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Tag' : 'Tags' }
}

export default async function TagsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tags')
  const tags = getAllTags(locale)

  return (
    <div>
      <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
      <p className='text-muted-foreground mt-2'>{t('description')}</p>

      <div className='mt-8 flex flex-wrap gap-3'>
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className='bg-card hover:border-ring rounded-lg border px-4 py-2 text-sm transition-colors'
          >
            <span className='font-medium'>#{tag}</span>{' '}
            <span className='text-muted-foreground'>· {t('postCount', { count })}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
