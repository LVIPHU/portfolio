import type { Metadata } from 'next'
import { Tags } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { PostCard } from '@/components/post-card'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Blog' }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const posts = getAllPosts(locale)

  return (
    <div>
      <div className='flex items-baseline justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='text-muted-foreground mt-2'>{t('description')}</p>
        </div>
        <Link href='/tags' className='text-primary inline-flex shrink-0 items-center gap-1.5 text-sm hover:underline'>
          <Tags className='h-4 w-4' /> {t('allTags')}
        </Link>
      </div>

      <div className='mt-8 flex flex-col gap-4'>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </div>
  )
}
