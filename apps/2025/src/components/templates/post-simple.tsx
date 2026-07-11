import type { ReactNode } from 'react'
import type { BlogContent } from '@/utils/content'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import type { CoreContent } from '@/types/data'
import type { StatsType } from '@/db/schema'
import { Container, Separator } from '@/components/atoms'
import { BlogMeta, Comments, PostTitle, ScrollButtons, TagsList } from '@/components/molecules'

interface PostSimpleProps {
  content: BlogContent
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export function PostSimpleTemplate({ content, children }: PostSimpleProps) {
  const { slug, date, lastmod, title, tags, readingTime } = content
  // const postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`

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
          {/* <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <DiscussOnX postUrl={postUrl} />
              <span className="text-gray-500">/</span>
              <EditOnGithub filePath={filePath} />
            </div>
            <SocialShare postUrl={postUrl} filePath={filePath} title={title} />
          </div> */}
          <Comments />
        </div>
      </article>
    </Container>
  )
}
