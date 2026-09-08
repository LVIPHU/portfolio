import type { Metadata } from 'next'
import { Download } from '@portfolio/icons/lucide'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { profile, resume, type Locale } from '@portfolio/content'
import { Badge } from '@portfolio/ui'
import { AppearTitle } from '@/components/effects/appear-title'
import { formatMonth, t } from '@/utils/format'
import { pageMetadata } from '@/utils/seo'
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'resume' })
  return pageMetadata(locale, '/resume', tMeta('title'), tMeta('experience'))
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
          href={profile.resumeUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='p-s border-primary text-foreground hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-2 border px-4 py-2.5 transition-colors'
        >
          <Download className='h-4 w-4' /> {tResume('download')}
        </a>
      </header>

      {/* Experience — company rồi từng product */}
      <section className='mt-10'>
        <h2 className='h3 dark:text-primary'>{tResume('experience')}</h2>
        <div className='mt-4 space-y-10'>
          {resume.experience.map((company) => (
            <div key={company.id}>
              <h3 className='font-semibold'>
                {company.name}
                <span className='text-muted-foreground font-normal'> · {t(company.role, locale)}</span>
              </h3>
              <p className='text-muted-foreground mt-0.5 text-sm'>
                {formatMonth(company.start, locale)} —{' '}
                {company.end ? formatMonth(company.end, locale) : tResume('present')}
              </p>
              <div className='mt-4 space-y-6 border-l pl-6'>
                {company.products
                  .filter((product) => !product.hidden)
                  .map((product) => (
                    <div key={product.id} className='relative'>
                      {/* Chấm 10px = chrome; vị trí mốc còn được báo bằng border-l nên không phụ thuộc màu */}
                      <span className='bg-primary absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full' />
                      <p className='text-muted-foreground text-sm'>
                        {formatMonth(product.start, locale)} —{' '}
                        {product.end ? formatMonth(product.end, locale) : tResume('present')}
                      </p>
                      <h4 className='mt-0.5 font-semibold'>
                        {product.name}
                        <span className='text-muted-foreground font-normal'> · {t(product.role, locale)}</span>
                      </h4>
                      <ul className='text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm'>
                        {product.summary.map((line, j) => (
                          <li key={j}>{t(line, locale)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className='mt-14'>
        <h2 className='h3 dark:text-primary'>{tResume('education')}</h2>
        <div className='mt-4'>
          {resume.education.map((item) => (
            <div key={item.id} className='border-b py-5'>
              <p className='p-xs text-muted-foreground'>
                {item.start} — {item.end}
              </p>
              <h3 className='mt-1 text-lg font-semibold normal-case' style={{ fontFamily: 'var(--font-roboto)' }}>
                {item.school}
              </h3>
              <p className='p text-muted-foreground'>
                {t(item.degree, locale)} · {t(item.field, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className='mt-14'>
        <h2 className='h3 dark:text-primary'>{tResume('skills')}</h2>
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
