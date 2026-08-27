import type { ReactNode } from 'react'
import type { BlogContent } from '@/utils/content'
import type { StatsType } from '@portfolio/service'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { Container, DiscussOnX, EditOnGithub } from '@/components/atoms'
import { Banner, BlogMeta, Comments, PostTitle, RelatedPosts, ScrollButtons, TagsList } from '@/components/molecules'

interface LayoutProps {
  content: BlogContent
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  relatedPosts?: { path: string; title: string }[]
  /** Page luôn truyền — banner layout không dùng. */
  authorDetails?: unknown
}

export function PostBannerTemplate({ content, children, relatedPosts = [] }: LayoutProps) {
  const { slug, title, images, date, lastmod, readingTime, tags, filePath } = content
  const postUrl = `${SITE_METADATA.siteUrl}/blog/${slug}`

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
                type={'blog' as StatsType}
                slug={slug}
                readingTime={readingTime}
              />
            </div>
          </dl>
          <div className='space-y-4 pt-4 md:pt-10'>
            <Banner banner={images?.[0] || SITE_METADATA.socialBanner} className='lg:-mx-8 xl:-mx-36 2xl:-mx-52' />
          </div>
        </div>
        <div className='prose prose-lg dark:prose-invert max-w-none'>{children}</div>
        <div className='space-y-8 border-t border-gray-200 pt-4 dark:border-gray-700'>
          <div className='flex justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <DiscussOnX postUrl={postUrl} />
              <span className='text-gray-500'>/</span>
              <EditOnGithub filePath={filePath} />
            </div>
          </div>
          <RelatedPosts posts={relatedPosts} />
          <Comments />
        </div>
      </article>
    </Container>
  )
}
