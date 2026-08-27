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
  getRelatedPosts,
  getStructuredData,
  mapLocale,
} from '@/utils/content'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { MDX_COMPONENTS } from '@/mdx-components'
import { getTranslations, setRequestLocale } from 'next-intl/server'

// Map tĩnh chọn template theo frontmatter layout (D-03 — hết meta-programming)
const DEFAULT_TEMPLATE = 'PostLayout'
const TEMPLATES = {
  PostLayout: PostLayoutTemplate,
  PostSimple: PostSimpleTemplate,
  PostBanner: PostBannerTemplate,
}

type BlogPostParams = {
  params: Promise<{ slug: string[]; locale: string }>
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
  const post = getPost(slug, mapLocale(params.locale))
  if (!post) {
    return
  }
  const authorDetails = getAuthorDetails(post.authors.length ? post.authors : ['default'])

  const t = await getTranslations({ locale: params.locale })
  const siteName = t('App.lươngVĩPhúS')
  const siteUrl = SITE_METADATA.siteUrl ?? ''
  const localePrefix = params.locale === 'en' ? '/en' : ''

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const imageList = post.images.length ? post.images : [SITE_METADATA.socialBanner]
  const toAbsolute = (img: string) => (img.includes('http') ? img : `${siteUrl}${img}`)
  const ogImages = imageList.map((img) => ({ url: toAbsolute(img) }))
  const ogLocale = params.locale === 'en' ? 'en_US' : 'vi_VN'

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `${siteUrl}${localePrefix}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteName,
      locale: ogLocale,
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
      images: imageList.map(toAbsolute),
    },
  }
}

export const generateStaticParams = async () => {
  return getAllSlugs().map((slug) => ({ slug: slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: BlogPostParams) {
  const params = await props.params
  setRequestLocale(params.locale)
  const slug = decodeURI(params.slug.join('/'))
  const locale = mapLocale(params.locale)

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
  // getStructuredData fallback `/og-image.png` không tồn tại — trỏ socialBanner thật.
  if (!mainContent.images.length) {
    const banner = SITE_METADATA.socialBanner
    jsonLd.image = banner.includes('http') ? banner : `${SITE_METADATA.siteUrl ?? ''}${banner}`
  }

  const Layout = TEMPLATES[(post.layout as keyof typeof TEMPLATES) || DEFAULT_TEMPLATE]
  const relatedPosts = getRelatedPosts(slug, locale, 3)

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout
        content={{ ...mainContent, toc }}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        relatedPosts={relatedPosts}
      >
        <MDXContent source={post.content} components={MDX_COMPONENTS} />
      </Layout>
    </>
  )
}
