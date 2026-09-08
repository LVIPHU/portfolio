import { Mail } from '@portfolio/icons/lucide'
import { PillButtonLink } from '@/components/effects/pill-button'
import s from './sections.module.css'

type AboutFooterContent = {
  footerHeading: string
  ctaFooter: string
  socials: { label: string; url: string }[]
  email: string
  year: number
  name: string
}

export function AboutFooter({ content }: { content: AboutFooterContent }) {
  return (
    <footer data-earth-step='7' className={s.footer}>
      <div>
        <h2 className='h1 vh'>{content.footerHeading}</h2>
        <PillButtonLink href='/contact' icon={<Mail />} label={content.ctaFooter} className={s.footerCta} />
      </div>
      <div className={s.footerBottom}>
        <div className={s.footerLinks}>
          {content.socials.map((soc) => (
            <a key={soc.label} href={soc.url} target='_blank' rel='noopener noreferrer' className='p-xs'>
              {soc.label}
            </a>
          ))}
          <a href={`mailto:${content.email}`} className='p-xs'>
            Email
          </a>
        </div>
        <p className='p-xs'>
          © {content.year} {content.name}
        </p>
      </div>
    </footer>
  )
}
