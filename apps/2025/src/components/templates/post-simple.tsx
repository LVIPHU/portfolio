import type { ReactNode } from 'react'
import type { BlogContent } from '@/utils/content'
import type { StatsType } from '@portfolio/service'
import { Container, Separator } from '@/components/atoms'
import { BlogMeta, Comments, PostTitle, RelatedPosts, ScrollButtons, TagsList } from '@/components/molecules'

interface PostSimpleProps {
  content: BlogContent
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  relatedPosts?: { path: string; title: string }[]
  /** Page luôn truyền — simple layout không dùng. */
  authorDetails?: unknown
}

export function PostSimpleTemplate({ content, children, relatedPosts = [] }: PostSimpleProps) {
  const { slug, date, lastmod, title, tags, readingTime } = content

  return (
    <Container className='pt-4 lg:pt-12'>
      <ScrollButtons />
      <article className='space-y-6 pt-6 lg:space-y-12'>
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
        </div>
        <Separator />
        <div className='prose prose-lg dark:prose-invert max-w-none'>{children}</div>
        <Separator className='mb-2 mt-1' />
        <div className='space-y-8'>
          <RelatedPosts posts={relatedPosts} />
          <Comments />
        </div>
      </article>
    </Container>
  )
}
