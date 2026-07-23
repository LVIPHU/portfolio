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
    <article>
      <Link href='/blog' className='p-s text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5'>
        <ArrowLeft className='h-4 w-4' /> {t('backToBlog')}
      </Link>

      <header className='mt-8'>
        <h1 className='h2'>{post.title}</h1>
        <div className='text-muted-foreground mt-5 flex flex-wrap items-center gap-4'>
          <time dateTime={post.date} className='p-xs'>
            {formatDate(post.date, locale)}
          </time>
          <div className='flex gap-1.5'>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge variant='outline' className='hover:border-primary hover:text-primary uppercase'>
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className='prose prose-neutral dark:prose-invert mt-10 max-w-3xl'>
        <MDXContent source={post.content} />
      </div>
    </article>
  )
}
