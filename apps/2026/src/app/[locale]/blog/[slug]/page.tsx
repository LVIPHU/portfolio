import 'katex/dist/katex.min.css'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXContent } from '@portfolio/mdx'
import { getAllSlugs, getPost, type Locale } from '@portfolio/content'
import { Link } from '@/i18n/navigation'
import { Badge } from '@portfolio/ui'
import { formatDate } from '@/lib/utils'

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
  return { title: post.title, description: post.summary }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const post = getPost(slug, locale)
  if (!post) notFound()

  return (
    <article className='mx-auto max-w-3xl'>
      <Link
        href='/blog'
        className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm'
      >
        <ArrowLeft className='h-4 w-4' /> {t('backToBlog')}
      </Link>

      <header className='mt-6'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>{post.title}</h1>
        <div className='text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-sm'>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <div className='flex gap-1.5'>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge variant='outline' className='hover:bg-accent'>
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className='prose prose-neutral dark:prose-invert mt-8 max-w-none'>
        <MDXContent source={post.content} />
      </div>
    </article>
  )
}
