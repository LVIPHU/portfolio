import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllTags, getPostsByTag, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { PostRow } from '@/components/post-row'
import { formatDate } from '@/lib/utils'

export function generateStaticParams() {
  // Union tag của cả 2 locale
  const tags = new Set([...getAllTags('vi').map(({ tag }) => tag), ...getAllTags('en').map(({ tag }) => tag)])
  return [...tags].map((tag) => ({ tag }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export default async function TagPage({ params }: { params: Promise<{ locale: Locale; tag: string }> }) {
  const { locale, tag: rawTag } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const tag = decodeURIComponent(rawTag)
  const posts = getPostsByTag(tag, locale)

  return (
    <div>
      <Link href='/tags' className='p-s text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5'>
        <ArrowLeft className='h-4 w-4' /> {t('allTags')}
      </Link>
      <h1 className='h2 mt-8'>
        {t('postsTaggedWith')} <span className='text-primary'>#{tag}</span>
      </h1>

      <div className='mt-8'>
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
