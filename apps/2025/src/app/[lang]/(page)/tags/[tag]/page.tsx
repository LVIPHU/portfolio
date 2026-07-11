import { slug } from 'github-slugger'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_METADATA } from '@data/site-metadata'
import tagData from '@json/tag-data.json'
import { getAllPosts, mapLocale } from '@/utils/content'
import { TagTemplate } from '@/components/templates'
import { getI18nInstance, PageLangParam } from '@/i18n'

type TagPageParams = {
  params: Promise<{ tag: string; lang: string }>
}

export async function generateMetadata(props: TagPageParams): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const i18n = await getI18nInstance(params.lang)
  const siteTitle = i18n._(SITE_METADATA.title)
  return {
    title: tag,
    description: `${siteTitle} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${SITE_METADATA.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  }
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: TagPageParams) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  const title = '#' + tag[0] + tag.split(' ').join('-').slice(1)
  // so khớp theo slug(tag) như bản cũ — key trong tag-data.json là dạng slugified (D-06)
  const filteredPosts = getAllPosts(mapLocale(params.lang)).filter((post) =>
    post.tags.map((t) => slug(t)).includes(tag)
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return (
    <TagTemplate
      title={title}
      description={
        <>
          Things I&#39;ve written about <span className='ml-1 font-semibold'>{tag}</span>
        </>
      }
      posts={filteredPosts}
    />
  )
}
