import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { projects, type Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/showcase/effects/appear-title'
import { t } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Dự án' : 'Projects' }
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tP = await getTranslations('projects')
  const sorted = [...projects].sort((a, b) => b.year - a.year)

  return (
    <div>
      <header className='py-8'>
        <h1 className='h2'>
          <AppearTitle>{tP('title')}</AppearTitle>
        </h1>
        <p className='p text-muted-foreground mt-4 max-w-xl'>{tP('description')}</p>
      </header>

      <div className='mt-6'>
        {sorted.map((project) => (
          <div key={project.slug} className='group border-b py-8'>
            <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline'>
              <h2 className='h3 group-hover:text-primary transition-colors'>{project.name}</h2>
              <span className='p-xs text-muted-foreground'>{project.year}</span>
            </div>
            <p className='p text-muted-foreground mt-3 max-w-2xl'>{t(project.description, locale)}</p>
            <div className='mt-4 flex flex-wrap items-center gap-x-6 gap-y-2'>
              <span className='p-xs text-muted-foreground'>{project.tech.join(' · ')}</span>
              <span className='flex gap-4'>
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target='_blank'
                    rel='noreferrer'
                    className='p-s text-primary hover:underline'
                  >
                    {tP('demo')} ↗
                  </a>
                )}
                {project.links.source && (
                  <a
                    href={project.links.source}
                    target='_blank'
                    rel='noreferrer'
                    className='p-s text-primary hover:underline'
                  >
                    {tP('source')} ↗
                  </a>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
