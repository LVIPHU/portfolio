'use client'

import type { PostWithAuthor } from '@/utils/content'
import { cn, playRandomNote } from '@/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  buttonVariants,
  Card,
  CardContent,
  GrowingUnderline,
  NavigationLink,
} from '@/components/atoms'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { Clock } from 'lucide-react'
import { slug as slugify } from 'github-slugger'
import { useTranslations } from 'next-intl'
import NextImage from 'next/image'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function PostCardGridView({ post }: { post: PostWithAuthor }) {
  const t = useTranslations()
  const { path, title, summary, tags, images, readingTime, author } = post

  return (
    <article className='h-full' onClick={() => playRandomNote()}>
      <Card className='flex h-full flex-col gap-0 overflow-hidden p-0 shadow-none'>
        {/* next/image fill (không dùng atom .image-container vì nó rounded-lg cả 4 góc);
            card overflow-hidden tự bo góc TRÊN, đáy ảnh vuông giáp nội dung — như mẫu */}
        <NavigationLink href={`/${path}`} className='relative block aspect-video w-full'>
          <NextImage
            src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
            alt={title}
            fill
            sizes='(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw'
            className='object-cover'
          />
        </NavigationLink>
        <CardContent className='flex flex-1 flex-col space-y-4 p-6'>
          <div className='flex items-start justify-between gap-2'>
            {tags?.[0] ? (
              <NavigationLink href={`/tags/${slugify(tags[0])}`}>
                <Badge variant='secondary'>{tags[0]}</Badge>
              </NavigationLink>
            ) : (
              <span />
            )}
            <div className='text-muted-foreground flex shrink-0 items-center text-xs'>
              <Clock className='me-1 size-3' />
              {Math.ceil(readingTime.minutes)} {t('Blog.minRead')}
            </div>
          </div>
          <h4 className='text-xl font-semibold tracking-tight'>
            <NavigationLink href={`/${path}`}>
              <GrowingUnderline>{title}</GrowingUnderline>
            </NavigationLink>
          </h4>
          <p className='text-muted-foreground line-clamp-3 text-sm'>{summary}</p>
          {author && (
            <div className='mt-auto flex items-center gap-3 pt-2'>
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>{author.name}</p>
                <p className='text-muted-foreground text-xs'>{author.occupation ?? t('Blog.author')}</p>
              </div>
            </div>
          )}
          <NavigationLink
            href={`/${path}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
          >
            {t('Blog.readMore')}
          </NavigationLink>
        </CardContent>
      </Card>
    </article>
  )
}
