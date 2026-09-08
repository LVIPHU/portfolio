'use client'

import { MailIcon, PhoneIcon, MapPinIcon } from '@portfolio/icons/lucide'
import { Facebook, Linkedin, Github } from '@portfolio/icons'
import { me } from '@portfolio/content/data2025'
import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from '@portfolio/content/data2025'

export const ContactInfo = () => {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const p = me.profile

  const contactItems = [
    {
      icon: MailIcon,
      label: t('Contact.emailLabel'),
      value: p.email,
      href: `mailto:${p.email}`,
    },
    {
      icon: PhoneIcon,
      label: t('Contact.phoneLabel'),
      value: p.phone,
      href: p.phoneHref,
    },
    {
      icon: MapPinIcon,
      label: t('Contact.locationLabel'),
      value: p.location[locale],
      href: null as string | null,
    },
  ]

  const socials = p.socials.map((s) => ({
    icon: s.id === 'facebook' ? Facebook : s.id === 'linkedin' ? Linkedin : Github,
    label: s.label,
    href: s.url,
  }))

  return (
    <div>
      <h2 className='text-2xl font-bold tracking-tight'>{t('Contact.contactInformation')}</h2>
      <p className='text-muted-foreground mt-2'>{t('Contact.contactInfoDesc')}</p>
      <p className='text-muted-foreground mt-1 text-sm'>{t('Contact.sla')}</p>

      <ul className='mt-8 space-y-6'>
        {contactItems.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className='flex items-start gap-4'>
            <Icon className='mt-1 h-5 w-5 shrink-0' />
            <div>
              <p className='font-semibold'>{label}</p>
              {href ? (
                <a href={href} className='text-muted-foreground hover:text-foreground transition-colors'>
                  {value}
                </a>
              ) : (
                <p className='text-muted-foreground'>{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h3 className='mt-10 text-2xl font-bold tracking-tight'>{t('Contact.connect')}</h3>
      <div className='mt-4 flex items-center gap-5'>
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={label}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <Icon className='h-5 w-5' />
          </a>
        ))}
      </div>
    </div>
  )
}
