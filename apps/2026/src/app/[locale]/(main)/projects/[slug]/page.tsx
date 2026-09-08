import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { MDXContent } from '@portfolio/mdx'
import { getAllProjectSlugs, getProject, getProjectCase, profile, skillNames, type Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/effects/appear-title'
import { Breadcrumb } from '@/components/chrome/breadcrumb'
import { JsonLd } from '@/components/json-ld'
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from '@/utils/seo'
import { t } from '@/utils/format'

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  const cse = getProjectCase(slug, locale)
  const title = cse?.title ?? project.name
  const description = cse?.summary || t(project.description, locale)
  const published =
    cse?.date && !Number.isNaN(new Date(cse.date).getTime())
      ? new Date(cse.date).toISOString()
      : new Date(`${project.year}-01-01T00:00:00.000Z`).toISOString()
  return pageMetadata(locale, `/projects/${slug}`, title, description, {
    article: {
      publishedTime: published,
      authors: [profile.name],
      section: 'Projects',
    },
  })
}

export default async function ProjectCasePage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const project = getProject(slug)
  if (!project) notFound()

  const tP = await getTranslations('projects')
  const tNav = await getTranslations('nav')
  const cse = getProjectCase(slug, locale)
  const title = cse?.title ?? project.name
  const description = cse?.summary || t(project.description, locale)
  const date = cse?.date || `${project.year}-01-01`

  return (
    <article className='mx-auto w-full max-w-3xl'>
      <JsonLd
        data={articleJsonLd({
          locale,
          path: `/projects/${slug}`,
          title,
          description,
          datePublished: date,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tNav('home'), path: '/' },
          { name: tP('title'), path: '/projects' },
          { name: title, path: `/projects/${slug}` },
        ])}
      />

      <Breadcrumb
        label={tP('breadcrumb')}
        items={[{ href: '/', label: tNav('home') }, { href: '/projects', label: tP('title') }, { label: title }]}
      />

      <header className='mt-8'>
        <h1 className='h2'>
          <AppearTitle>{title}</AppearTitle>
        </h1>
        <p className='p text-muted-foreground mt-4'>{description}</p>
        <p className='p-xs text-muted-foreground mt-4'>
          {project.year} · {skillNames(project.tech).join(' · ')}
        </p>
        <div className='mt-6 flex gap-4'>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target='_blank'
              rel='noopener noreferrer'
              className='p-s dark:text-primary hover:underline'
            >
              {tP('demo')} ↗
            </a>
          )}
          {project.links.source && (
            <a
              href={project.links.source}
              target='_blank'
              rel='noopener noreferrer'
              className='p-s dark:text-primary hover:underline'
            >
              {tP('source')} ↗
            </a>
          )}
        </div>
      </header>

      {cse?.content ? (
        <div className='prose prose-neutral dark:prose-invert mt-10 max-w-none'>
          <MDXContent source={cse.content} />
        </div>
      ) : (
        <p className='p text-muted-foreground mt-10'>{t(project.description, locale)}</p>
      )}
    </article>
  )
}
