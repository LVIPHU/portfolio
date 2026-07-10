import type { Locale, PostMeta } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export function PostCard({ post, locale }: { post: PostMeta; locale: Locale }) {
  return (
    <article className='bg-card hover:border-ring group rounded-xl border p-6 transition-colors'>
      <div className='text-muted-foreground flex items-center gap-3 text-xs'>
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        <div className='flex gap-1.5'>
          {post.tags.map((tag) => (
            <Badge key={tag} variant='outline'>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <h2 className='group-hover:text-primary mt-2 text-lg font-semibold'>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className='text-muted-foreground mt-1 text-sm'>{post.description}</p>
    </article>
  )
}
