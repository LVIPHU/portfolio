import { MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react'
import { Facebook, Linkedin, Github } from '@/utils'
import { SITE_METADATA_2025 as SITE_METADATA } from '@portfolio/content/data2025'
import { useTranslations } from 'next-intl'

export const ContactInfo = () => {
  const t = useTranslations()

  const contactItems = [
    {
      icon: MailIcon,
      label: t('Contact.emailLabel'),
      value: SITE_METADATA.email,
      href: `mailto:${SITE_METADATA.email}`,
    },
    {
      icon: PhoneIcon,
      label: t('Contact.phoneLabel'),
      value: SITE_METADATA.phone,
      href: SITE_METADATA.phoneHref,
    },
    {
      icon: MapPinIcon,
      label: t('Contact.locationLabel'),
      value: SITE_METADATA.location,
      href: null,
    },
  ]

  const socials = [
    { icon: Facebook, label: 'Facebook', href: SITE_METADATA.facebook },
    { icon: Linkedin, label: 'LinkedIn', href: SITE_METADATA.linkedIn },
    { icon: Github, label: 'GitHub', href: SITE_METADATA.github },
  ]

  return (
    <div>
      <h2 className='text-2xl font-bold tracking-tight'>{t('Contact.contactInformation')}</h2>
      <p className='text-muted-foreground mt-2'>{t('Contact.contactInfoDesc')}</p>

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
            rel='noreferrer'
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
