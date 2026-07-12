'use client'

import type { PostWithAuthor } from '@/utils/content'
import { cn } from '@/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  buttonVariants,
  Card,
  CardContent,
  GrowingUnderline,
  NavigationLink,
} from '@/components/atoms'
import { PostViews } from '@/components/atoms/post-views'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { Clock, Eye } from 'lucide-react'
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

export function PostCardListView({ post }: { post: PostWithAuthor }) {
  const t = useTranslations()
  const { slug, title, summary, images, readingTime, author } = post

  return (
    <article>
      <Card className='flex flex-col gap-0 overflow-hidden p-0 shadow-none'>
        <div className='flex flex-col sm:flex-row'>
          {/* ảnh giữ tỉ lệ 16:9 cố định (không kéo giãn theo chiều cao card) */}
          <NavigationLink href={`/blog/${slug}`} className='relative aspect-video w-full self-start sm:w-1/3'>
            <NextImage
              src={images && images.length > 0 ? images[0] : SITE_METADATA.socialBanner}
              alt={title}
              fill
              sizes='(min-width: 640px) 33vw, 100vw'
              className='object-cover'
            />
          </NavigationLink>
          <CardContent className='flex flex-1 flex-col justify-between gap-4 p-6'>
            <div className='space-y-2'>
              <h4 className='text-2xl font-semibold tracking-tight'>
                <NavigationLink href={`/blog/${slug}`}>
                  <GrowingUnderline>{title}</GrowingUnderline>
                </NavigationLink>
              </h4>
              <p className='text-muted-foreground line-clamp-3 text-sm'>{summary}</p>
            </div>
            <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
              {author && (
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>{author.name}</p>
                    <div className='text-muted-foreground flex items-center text-xs'>
                      <Clock className='me-1 size-3' />
                      {Math.ceil(readingTime.minutes)} {t('Blog.minRead')}
                      <Eye className='me-1 ms-3 size-3' />
                      <PostViews slug={slug} />
                    </div>
                  </div>
                </div>
              )}
              <NavigationLink
                href={`/blog/${slug}`}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full sm:w-auto')}
              >
                {t('Blog.readMore')}
              </NavigationLink>
            </div>
          </CardContent>
        </div>
      </Card>
    </article>
  )
}
