import 'katex/dist/katex.min.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXContent, extractTocHeadings } from '@portfolio/mdx'
import { PostBannerTemplate, PostLayoutTemplate, PostSimpleTemplate } from '@/components/templates'
import {
  coreContent,
  getAllAuthors,
  getAllPosts,
  getAllSlugs,
  getPost,
  getStructuredData,
  mapLocale,
} from '@/utils/content'
import { SITE_METADATA } from '@data/site-metadata'
import { MDX_COMPONENTS } from '@/mdx-components'
import { getI18nInstance } from '@/i18n'

// Map tĩnh chọn template theo frontmatter layout (D-03 — hết meta-programming)
const DEFAULT_TEMPLATE = 'PostLayout'
const TEMPLATES = {
  PostLayout: PostLayoutTemplate,
  PostSimple: PostSimpleTemplate,
  PostBanner: PostBannerTemplate,
}

type BlogPostParams = {
  params: Promise<{ slug: string[]; lang: string }>
}

function getAuthorDetails(authorList: string[]) {
  const allAuthors = getAllAuthors()
  return authorList.map((author) => {
    const found = allAuthors.find((a) => a.slug === author)
    if (!found) throw new Error(`Không tìm thấy author "${author}" trong packages/content/authors`)
    return coreContent(found)
  })
}

export async function generateMetadata(props: BlogPostParams): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = getPost(slug, mapLocale(params.lang))
  if (!post) {
    return
  }
  const authorDetails = getAuthorDetails(post.authors.length ? post.authors : ['default'])

  const i18n = await getI18nInstance(params.lang)
  const siteName = i18n._(SITE_METADATA.title)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const imageList = post.images.length ? post.images : [SITE_METADATA.socialBanner]
  const ogImages = imageList.map((img) => ({
    url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
  }))

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteName,
      locale: 'vi_VN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : SITE_METADATA.author ? [SITE_METADATA.author] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return getAllSlugs().map((slug) => ({ slug: slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: BlogPostParams) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const locale = mapLocale(params.lang)

  // Đã sort + lọc draft + fallback locale (D-04)
  const posts = getAllPosts(locale)
  const postIndex = posts.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = posts[postIndex + 1]
  const next = posts[postIndex - 1]
  const post = getPost(slug, locale)
  if (!post) {
    return notFound()
  }
  const authorDetails = getAuthorDetails(post.authors.length ? post.authors : ['default'])
  const mainContent = coreContent(post)
  const toc = await extractTocHeadings(post.content)

  // Thay computedField structuredData của hệ cũ (D-02)
  const jsonLd: Record<string, unknown> = getStructuredData(mainContent, SITE_METADATA.siteUrl ?? '')
  jsonLd['author'] = authorDetails.map((author) => ({ '@type': 'Person', name: author.name }))

  const Layout = TEMPLATES[(post.layout as keyof typeof TEMPLATES) || DEFAULT_TEMPLATE]

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout content={{ ...mainContent, toc }} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXContent source={post.content} components={MDX_COMPONENTS} />
      </Layout>
    </>
  )
}
