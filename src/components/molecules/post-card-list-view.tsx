import type { Blog } from '@contentlayer/generated'
import type { CoreContent } from '@/types/data'
import { cn, formatDate } from '@/utils'
import { SITE_METADATA } from '@data/site-metadata'
import {
  Card,
  CardContent,
  CardHeader,
  GritBackground,
  GrowingUnderline,
  Image,
  NavigationLink
} from '@/components/atoms'
import { TagsList } from '@/components/molecules/tags'
import { Calendar, ClockIcon } from 'lucide-react'

export function PostCardListView({ post, loading }: { post: CoreContent<Blog>; loading?: 'lazy' | 'eager' }) {
  const { slug, date, title, summary, tags, images, readingTime } = post
  return (
    <article>
      <Card className='flex flex-col overflow-hidden rounded-md border-none shadow-none sm:flex-row sm:items-center'>
        <CardHeader className='px-0 sm:p-0'>
          <NavigationLink href={`/blog/${slug}`}>
            <Image
              src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
              alt={title}
              width={500}
              height={500}
              className='aspect-video rounded-lg bg-muted sm:aspect-square sm:w-56'
              loading={loading}
            />
          </NavigationLink>
        </CardHeader>
        <CardContent className='flex flex-col px-0 py-0 sm:px-6'>
          <TagsList tags={tags} />
          <h3 className='pb-1 text-xl font-bold tracking-tight md:text-2xl'>
            <NavigationLink href={`/blog/${slug}`} className='text-gray-900 dark:text-gray-100'>
              <GrowingUnderline>
                {title}
              </GrowingUnderline>
            </NavigationLink>
          </h3>
          <p className='mt-2 line-clamp-2 text-ellipsis text-muted-foreground md:line-clamp-3'>{summary}</p>
          <dl className='mt-4 flex items-center gap-6 text-sm font-medium text-muted-foreground'>
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
