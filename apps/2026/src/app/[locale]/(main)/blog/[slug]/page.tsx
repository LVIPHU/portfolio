import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from '@portfolio/icons/lucide'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXContent } from '@portfolio/mdx'
import { getAllSlugs, getPost, getRelatedPosts, profile, type Locale } from '@portfolio/content'
import { Link } from '@portfolio/i18n/navigation'
import { Badge } from '@portfolio/ui'
import { formatDate } from '@/utils/format'
import { ViewsCounter } from '@/components/views-counter'
import { Breadcrumb } from '@/components/chrome/breadcrumb'
import { RelatedPosts } from '@/components/related-posts'
import { JsonLd } from '@/components/json-ld'
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from '@/utils/seo'
import { hasMath } from '@/utils/math'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug, locale)
  if (!post) return {}
  return pageMetadata(locale, `/blog/${slug}`, post.title, post.summary, {
    article: {
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastmod ?? post.date).toISOString(),
      authors: [profile.name],
      tags: post.tags,
      section: 'Blog',
    },
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const tNav = await getTranslations('nav')
  const post = getPost(slug, locale)
  if (!post) notFound()

  const related = getRelatedPosts(slug, locale, 3)
  const KatexStyles = hasMath(post.content) ? (await import('@/components/katex-styles')).KatexStyles : null

  return (
    <article className='mx-auto w-full max-w-3xl'>
      {KatexStyles ? <KatexStyles /> : null}
      <JsonLd
        data={articleJsonLd({
          locale,
          path: `/blog/${slug}`,
          title: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.lastmod,
          tags: post.tags,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav('home'), path: '/' },
          { name: t('title'), path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />

      <Breadcrumb
        label={t('breadcrumb')}
        items={[{ href: '/', label: tNav('home') }, { href: '/blog', label: t('title') }, { label: post.title }]}
      />

      <Link
        href='/blog'
        className='p-s text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5'
      >
        <ArrowLeft className='h-4 w-4' /> {t('backToBlog')}
      </Link>

      <header className='mt-8'>
        <h1 className='h2'>{post.title}</h1>
        <div className='text-muted-foreground mt-5 flex flex-wrap items-center gap-4'>
          <time dateTime={post.date} className='p-xs'>
            {formatDate(post.date, locale)}
          </time>
          <ViewsCounter type='blog' slug={post.slug} className='p-xs' />
          <div className='flex gap-1.5'>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge variant='outline' className='hover:border-primary dark:hover:text-primary uppercase'>
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className='prose prose-neutral dark:prose-invert mt-10 max-w-none'>
        <MDXContent source={post.content} />
      </div>

      <RelatedPosts posts={related} locale={locale} />
    </article>
  )
}
