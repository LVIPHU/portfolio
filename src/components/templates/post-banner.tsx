import type { ReactNode } from 'react'
import type { Blog } from '@contentlayer/generated'
import type { StatsType } from '@/db/schema'
import type { CoreContent } from '@/types/data'
import { SITE_METADATA } from '@data/site-metadata'
import { Container, DiscussOnX, EditOnGithub } from '@/components/atoms'
import { Banner, BlogMeta, Comments, PostTitle, ScrollButtons, TagsList } from '@/components/molecules'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostBannerTemplate({ content, children }: LayoutProps) {
  const { slug, type, title, images, date, lastmod, readingTime, tags, filePath } = content
  const postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`

  return (
    <Container className='pt-4 lg:pt-12'>
      <ScrollButtons />
      <article className='space-y-6 pt-6 lg:space-y-16'>
        <div className='space-y-4'>
          <TagsList tags={tags} />
          <PostTitle>{title}</PostTitle>
          <dl>
            <div>
              <dt className='sr-only'>Published on</dt>
              <BlogMeta
                date={date}
                lastmod={lastmod}
                type={type.toLowerCase() as StatsType}
                slug={slug}
                readingTime={readingTime}
              />
            </div>
          </dl>
          <div className='space-y-4 pt-4 md:pt-10'>
            <Banner banner={images?.[0] || SITE_METADATA.socialBanner} className='lg:-mx-8 xl:-mx-36 2xl:-mx-52' />
          </div>
        </div>
        <div className='prose prose-lg max-w-none dark:prose-invert'>{children}</div>
        <div className='space-y-8 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <DiscussOnX postUrl={postUrl} />
              <span className='text-gray-500'>/</span>
              <EditOnGithub filePath={filePath} />
            </div>
            {/* <SocialShare postUrl={postUrl} title={title} /> */}
          </div>
          <Comments />
        </div>
      </article>
    </Container>
  )
}

// function Credit({ image, className }: { image: string; className?: string }) {
//   const [, author, id] = image.split('__')
//   if (author && id) {
//     return (
//       <div className={cn('text-right text-sm italic', className)}>
//         Photo by{' '}
//         <a
//           className='text-primary-500 dark:text-primary-400 underline-offset-4 hover:underline'
//           href={`https://unsplash.com/@${author}`}
//           target='_blank'
//           rel='noreferrer'
//         >
//           <span data-umami-event='banner-author'>@{author}</span>
//         </a>{' '}
//         on{' '}
//         <a
//           className='text-primary-500 dark:text-primary-400 underline-offset-4 hover:underline'
//           href={`https://unsplash.com/photos/${id}`}
//           target='_blank'
//           rel='noreferrer'
//           data-umami-event='unsplash-link'
//         >
//           <span data-umami-event='banner-unsplash'>Unsplash</span>
//         </a>
//       </div>
//     )
//   }
//   return null
// }
