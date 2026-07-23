import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { profile, type Locale } from '@portfolio/content'
import { AppearTitle } from '@/components/showcase/effects/appear-title'
import { ListItem } from '@/components/showcase/effects/list-item'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Liên hệ' : 'Contact' }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <div className='flex min-h-[70svh] flex-col justify-center py-8'>
      <h1 className='h1'>
        <AppearTitle>{t('title')}</AppearTitle>
      </h1>
      <p className='p text-muted-foreground mt-6 max-w-xl'>{t('description')}</p>

      <a
        href={`mailto:${profile.email}`}
        className='p-s bg-primary text-primary-foreground mt-10 inline-flex w-fit items-center gap-2 px-6 py-3.5 transition-opacity hover:opacity-80'
      >
        <Mail className='h-4 w-4' /> {t('emailMe')}
      </a>
      <p className='p-xs text-muted-foreground mt-3'>{profile.email}</p>

      <div className='mt-16'>
        <h2 className='h3 text-primary'>{t('findMeOn')}</h2>
        <div className='mt-6 max-w-2xl'>
          {profile.socials.map((social, i) => (
            <ListItem
              key={social.label}
              title={social.label}
              source={social.url.replace('https://', '')}
              href={social.url}
              index={i}
              visible
            />
          ))}
        </div>
      </div>
    </div>
  )
}
