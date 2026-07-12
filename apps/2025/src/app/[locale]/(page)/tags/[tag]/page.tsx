import { slug } from 'github-slugger'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { getPostsWithAuthors, getTagData, mapLocale } from '@/utils/content'
import { TagTemplate } from '@/components/templates'
import { getTranslations } from 'next-intl/server'

type TagPageParams = {
  params: Promise<{ tag: string; locale: string }>
}

export async function generateMetadata(props: TagPageParams): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const t = await getTranslations()
  const siteTitle = t('App.lươngVĩPhúS')
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

// Nguồn tag LIVE (getTagData key đã slugify) — bỏ snapshot json/tag-data.json (tránh nguồn-đôi lệch)
export const generateStaticParams = async ({ params }: { params: { locale: string } }) => {
  const tagCounts = getTagData(mapLocale(params.locale))
  return Object.keys(tagCounts).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: TagPageParams) {
  const params = await props.params
  const locale = mapLocale(params.locale)
  const tag = decodeURI(params.tag)
  // Capitalize first letter and convert space to dash
  const title = '#' + tag[0] + tag.split(' ').join('-').slice(1)
  // so khớp theo slug(tag): key sidebar/URL đã slugify, tag bài thì raw → slug 2 phía
  const filteredPosts = getPostsWithAuthors(locale).filter((post) => post.tags.map((t) => slug(t)).includes(tag))
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
      tagCounts={getTagData(locale)}
    />
  )
}
