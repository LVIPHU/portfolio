import type { Metadata } from 'next'
import { ArrowUpRight, Mail } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { profile, type Locale } from '@portfolio/content'
import { buttonVariants } from '@portfolio/ui'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Liên hệ' : 'Contact' }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <div className='mx-auto max-w-xl py-8 text-center'>
      <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
      <p className='text-muted-foreground mt-3'>{t('description')}</p>

      <a href={`mailto:${profile.email}`} className={buttonVariants({ size: 'lg', className: 'mt-8' })}>
        <Mail className='h-4 w-4' /> {t('emailMe')}
      </a>
      <p className='text-muted-foreground mt-2 text-sm'>{profile.email}</p>

      <div className='mt-12'>
        <h2 className='text-muted-foreground text-sm font-medium uppercase tracking-wide'>{t('findMeOn')}</h2>
        <div className='mt-4 flex flex-wrap justify-center gap-3'>
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target='_blank'
              rel='noreferrer'
              className='bg-card hover:border-ring inline-flex items-center gap-1 rounded-lg border px-4 py-2 text-sm transition-colors'
            >
              {social.label} <ArrowUpRight className='h-3.5 w-3.5' />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
