import { getTranslations } from 'next-intl/server'
import { Link } from '@portfolio/i18n/navigation'
import type { PostMeta } from '@portfolio/content'
import { formatDate } from '@/utils/format'
import type { Locale } from '@portfolio/content'

export async function RelatedPosts({ posts, locale }: { posts: PostMeta[]; locale: Locale }) {
  if (posts.length === 0) return null
  const t = await getTranslations('blog')

  return (
    <aside className='mt-16 border-t pt-10'>
      <h2 className='h3'>{t('relatedPosts')}</h2>
      <ul className='mt-6 space-y-4'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className='group block'>
              <p className='p group-hover:text-primary font-semibold transition-colors'>{post.title}</p>
              <p className='p-xs text-muted-foreground mt-1'>{formatDate(post.date, locale)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
