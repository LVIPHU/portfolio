import { GrowingUnderline, NavigationLink } from '@/components/atoms'
import { useTranslations } from 'next-intl'

type RelatedPost = { path: string; title: string }

export function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  const t = useTranslations()
  if (posts.length === 0) return null

  return (
    <section className='space-y-3 py-4'>
      <h2 className='text-lg font-semibold tracking-tight'>{t('Blog.relatedPosts')}</h2>
      <ul className='space-y-2'>
        {posts.map((post) => (
          <li key={post.path}>
            <NavigationLink href={`/${post.path}`}>
              <GrowingUnderline data-umami-event='related-post'>{post.title}</GrowingUnderline>
            </NavigationLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
