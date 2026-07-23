import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { resume, type Locale } from '@portfolio/content'
import { Badge } from '@portfolio/ui'
import { AppearTitle } from '@/components/showcase/effects/appear-title'
import { formatMonth, t } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Resume' }
}

export default async function ResumePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const tResume = await getTranslations('resume')

  return (
    <div>
      <header className='flex flex-wrap items-end justify-between gap-4 py-8'>
        <h1 className='h2'>
          <AppearTitle>{tResume('title')}</AppearTitle>
        </h1>
        <a
          href='/resume.pdf'
          download
          className='p-s border-primary text-foreground hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-2 border px-4 py-2.5 transition-colors'
        >
          <Download className='h-4 w-4' /> {tResume('download')}
        </a>
      </header>

      {/* Experience */}
      <section className='mt-10'>
        <h2 className='h3 text-primary'>{tResume('experience')}</h2>
        <div className='mt-4 space-y-6 border-l pl-6'>
          {resume.experience.map((item, i) => (
            <div key={i} className='relative'>
              <span className='bg-primary absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full' />
              <p className='text-muted-foreground text-sm'>
                {formatMonth(item.start, locale)} — {item.end ? formatMonth(item.end, locale) : tResume('present')}
              </p>
              <h3 className='mt-0.5 font-semibold'>
                {t(item.role, locale)} <span className='text-muted-foreground font-normal'>· {item.company}</span>
              </h3>
              <ul className='text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm'>
                {item.summary.map((line, j) => (
                  <li key={j}>{t(line, locale)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className='mt-14'>
        <h2 className='h3 text-primary'>{tResume('education')}</h2>
        <div className='mt-4'>
          {resume.education.map((item, i) => (
            <div key={i} className='border-b py-5'>
              <p className='p-xs text-muted-foreground'>
                {item.start} — {item.end}
              </p>
              <h3 className='mt-1 text-lg font-semibold normal-case' style={{ fontFamily: 'var(--font-roboto)' }}>
                {item.school}
              </h3>
              <p className='p text-muted-foreground'>{t(item.degree, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className='mt-14'>
        <h2 className='h3 text-primary'>{tResume('skills')}</h2>
        <div className='mt-4 space-y-4'>
          {resume.skills.map((group, i) => (
            <div key={i}>
              <h3 className='text-muted-foreground mb-2 text-sm font-medium'>{t(group.label, locale)}</h3>
              <div className='flex flex-wrap gap-1.5'>
                {group.items.map((skill) => (
                  <Badge key={skill} variant='secondary'>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
