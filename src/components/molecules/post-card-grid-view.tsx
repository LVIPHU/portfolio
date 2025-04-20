import type { Blog } from '@contentlayer/generated'
import type { CoreContent } from '@/types/data'
import { formatDate } from '@/utils'
import { Card, CardContent, CardFooter, CardHeader, GrowingUnderline, Image, NavigationLink } from '@/components/atoms'
import { SITE_METADATA } from '@data/site-metadata'
import { Calendar, ClockIcon } from 'lucide-react'
import { TagsList } from '@/components/molecules/tags'

export function PostCardGridView({ post }: { post: CoreContent<Blog> }) {
  const { path, date, title, tags, images, readingTime } = post
  return (
    <article className={'h-full'}>
      <Card className='shadow-none h-full flex flex-col'>
        <CardHeader className='p-2'>
          <NavigationLink href={`/${path}`}>
            <Image
              src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
              alt={title}
              width={600}
              height={400}
              className='aspect-video h-full w-full rounded-xl shadow-2xl'
            />
          </NavigationLink>
        </CardHeader>
        <CardContent className='py-5'>
          <TagsList tags={tags} />
          <h3 className='mt-4 text-[1.35rem] font-semibold tracking-tight'>
            <NavigationLink href={`/${path}`}>
              <GrowingUnderline>{title}</GrowingUnderline>
            </NavigationLink>
          </h3>
        </CardContent>
        <CardFooter className='mt-auto flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Calendar className='size-4' />
            <time dateTime={date} className='text-sm text-muted-foreground'>
              {formatDate(date)}
            </time>
          </div>
          <div className='flex items-center gap-2'>
            <ClockIcon className='size-4' />
            <span className='text-sm text-muted-foreground'>{Math.ceil(readingTime.minutes)} mins read</span>
          </div>
        </CardFooter>
      </Card>
    </article>
  )
}
