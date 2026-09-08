import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { projects, skillNames, type Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/effects/appear-title'
import { t } from '@/utils/format'
import { Link } from '@portfolio/i18n/navigation'
import { pageMetadata } from '@/utils/seo'
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'projects' })
  return pageMetadata(locale, '/projects', tMeta('title'), tMeta('description'))
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tP = await getTranslations('projects')
  const sorted = [...projects].filter((p) => !p.hidden).sort((a, b) => b.year - a.year)

  return (
    <div>
      <header className='py-8'>
        <h1 className='h2'>
          <AppearTitle>{tP('title')}</AppearTitle>
        </h1>
        <p className='p text-muted-foreground mt-4 max-w-xl'>{tP('description')}</p>
      </header>

      {/* Tín hiệu hover ở light là VIỀN gold (vai trò được cấp phép); chữ h3 chỉ 20px comp ở
          mobile nên không được là gold trên nền sáng. */}
      <div className='mt-6'>
        {sorted.map((project) => (
          <div key={project.slug} className='hover:border-primary group border-b py-8 transition-colors'>
            <div className='flex flex-col justify-between gap-2 md:flex-row md:items-baseline'>
              <h2 className='h3 dark:group-hover:text-primary transition-colors'>
                <Link href={`/projects/${project.slug}`}>{project.name}</Link>
              </h2>
              <span className='p-xs text-muted-foreground'>{project.year}</span>
            </div>
            <p className='p text-muted-foreground mt-3 max-w-2xl'>{t(project.description, locale)}</p>
            <p className='p-xs text-muted-foreground mt-4'>{skillNames(project.tech).join(' · ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
