import type { Blog } from '@contentlayer/generated'
import type { CoreContent } from '@/types/data'
import { formatDate } from '@/utils'
import { SITE_METADATA } from '@data/site-metadata'
import { Card, CardContent, CardHeader, GrowingUnderline, Image, NavigationLink } from '@/components/atoms'
import { TagsList } from '@/components/molecules/tags'
import { Calendar, ClockIcon } from 'lucide-react'

export function PostCardListView({ post, loading }: { post: CoreContent<Blog>; loading?: 'lazy' | 'eager' }) {
  const { slug, date, title, summary, tags, images, readingTime } = post
  return (
    <article>
      <Card className='flex flex-col overflow-hidden rounded-md border-none shadow-none sm:flex-row sm:items-center'>
        <CardHeader className='w-full px-0 sm:w-56 sm:shrink-0 sm:p-0'>
          <NavigationLink href={`/blog/${slug}`}>
            <Image
              src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
              alt={title}
              width={500}
              height={500}
              className='bg-muted aspect-video w-full rounded-lg sm:aspect-square'
              loading={loading}
            />
          </NavigationLink>
        </CardHeader>
        <CardContent className='flex flex-col px-0 py-0 sm:px-6'>
          <TagsList tags={tags} />
          <h3 className='py-1 text-xl font-bold tracking-tight md:text-2xl'>
            <NavigationLink href={`/blog/${slug}`} className='text-gray-900 dark:text-gray-100'>
              <GrowingUnderline>{title}</GrowingUnderline>
            </NavigationLink>
          </h3>
          <p className='text-muted-foreground mt-2 line-clamp-2 text-ellipsis md:line-clamp-3'>{summary}</p>
          <dl className='text-muted-foreground mt-4 flex items-center gap-6 text-sm font-medium'>
            <dt className='sr-only'>Published on</dt>
            <dd className='flex items-center gap-2'>
              <ClockIcon className='size-4' />
              <span>{Math.ceil(readingTime.minutes)} mins read</span>
            </dd>
            <div className='flex items-center gap-2'>
              <Calendar className='size-4' />
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
          </dl>
        </CardContent>
      </Card>
    </article>
  )
}
