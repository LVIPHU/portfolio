import { slug } from 'github-slugger'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { getPostsWithAuthors, getTagData, mapLocale } from '@/utils/content'
import { TagTemplate } from '@/components/templates'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type TagPageParams = {
  params: Promise<{ tag: string; locale: string }>
}

export async function generateMetadata(props: TagPageParams): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const t = await getTranslations({ locale: params.locale })
  return {
    title: tag,
    description: t('Tags.writtenAbout', { tag }),
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
  setRequestLocale(params.locale)
  const locale = mapLocale(params.locale)
  const tag = decodeURI(params.tag)
  const first = tag[0] ?? ''
  const title = '#' + first + tag.split(' ').join('-').slice(1)
  const t = await getTranslations()
  const filteredPosts = getPostsWithAuthors(locale).filter((post) => post.tags.map((item) => slug(item)).includes(tag))
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return (
    <TagTemplate
      title={title}
      description={t('Tags.writtenAbout', { tag })}
      posts={filteredPosts}
      tagCounts={getTagData(locale)}
    />
  )
}
