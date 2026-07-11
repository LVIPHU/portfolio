import type { Blog } from '@/utils/content'
import type { CoreContent } from '@/types/data'
import { formatDate, playRandomNote } from '@/utils'
import { Card, CardContent, CardFooter, CardHeader, GrowingUnderline, Image, NavigationLink } from '@/components/atoms'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { Calendar, ClockIcon } from 'lucide-react'
import { TagsList } from '@/components/molecules/tags'

export function PostCardGridView({ post }: { post: CoreContent<Blog> }) {
  const { path, date, title, tags, images, readingTime } = post

  const handleClick = () => {
    playRandomNote()
  }

  return (
    <article className={'h-full'} onClick={handleClick}>
      <Card className='flex h-full flex-col shadow-none'>
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
            <time dateTime={date} className='text-muted-foreground text-sm'>
              {formatDate(date)}
            </time>
          </div>
          <div className='flex items-center gap-2'>
            <ClockIcon className='size-4' />
            <span className='text-muted-foreground text-sm'>{Math.ceil(readingTime.minutes)} mins read</span>
          </div>
        </CardFooter>
      </Card>
    </article>
  )
}
