import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts, type Locale } from '@portfolio/content'
import { Link } from '@portfolio/i18n/navigation'
import { AppearTitle } from '@/components/effects/appear-title'
import { PostRow } from '@/components/post-row'
import { formatDate } from '@/utils/format'
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'blog' })
  return { title: tMeta('title') }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const posts = getAllPosts(locale)

  return (
    <div>
      <header className='py-8'>
        <h1 className='h2'>
          <AppearTitle>{t('title')}</AppearTitle>
        </h1>
        <div className='mt-4 flex flex-wrap items-baseline justify-between gap-4'>
          <p className='p text-muted-foreground max-w-xl'>{t('description')}</p>
          <Link href='/tags' className='p-s dark:text-primary shrink-0 hover:underline'>
            {t('allTags')} →
          </Link>
        </div>
      </header>

      <div className='mt-6'>
        {posts.map((post) => (
          <PostRow
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={formatDate(post.date, locale)}
            summary={post.summary}
          />
        ))}
      </div>
    </div>
  )
}
