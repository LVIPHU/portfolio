'use client'

import type { CSSProperties } from 'react'
import { GsapSync } from '../gsap-sync'
import { EarthBackground } from '@/components/three/earth-background'
import { AppearTitle } from '../effects/appear-title'
import { HorizontalSlides } from '../effects/horizontal-slides'
import { Card } from '../effects/card'
import { ZoomSection } from './zoom-section'
import { FeatureCards } from './feature-cards'
import { ProjectsSection } from './projects-section'
import { Link } from '@/i18n/navigation'
import s from './sections.module.css'

export type AboutContent = {
  name: string
  role: string
  tagline: string
  bio: string[]
  aboutHeading: string
  scrollLabel: [string, string]
  ctaProjects: string
  ctaContact: string
  skillsHeading: string
  techs: string[]
  statement: { first: string; enter: string; second: string }
  featuringIntro: string
  featuringItems: string[]
  projectsHeading: string
  projects: { title: string; source: string; href: string }[]
  footerHeading: string
  ctaFooter: string
  socials: { label: string; url: string }[]
  email: string
  year: number
}

export function ShowcaseAbout({ content }: { content: AboutContent }) {
  return (
    <>
      <GsapSync />
      <EarthBackground />

      {/* HERO */}
      <section data-earth-step='0' className={s.hero}>
        <div className={s.heroTop}>
          <h1 className='h1'>{content.name}</h1>
          <h2 className={`h3 contrast ${s.heroRole}`}>{content.role}</h2>
        </div>
        <div className={s.heroBottom}>
          <div className={s.scrollHint}>
            <span className='p-s'>
              {content.scrollLabel[0]}
              <br />
              {content.scrollLabel[1]}
            </span>
          </div>
          <p className={`p-s ${s.heroDesc}`}>{content.tagline}</p>
          <div className={s.heroCta}>
            <Link href='/projects' className={`${s.btn} ${s.btnFilled}`}>
              {content.ctaProjects}
            </Link>
            <Link href='/contact' className={s.btn}>
              {content.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section data-earth-step='1' className={s.about}>
        <div className={s.aboutSticky}>
          <h2 className='h2'>
            <AppearTitle>{content.aboutHeading}</AppearTitle>
          </h2>
        </div>
        <div className={s.aboutFeatures}>
          {content.bio.map((para, i) => (
            <div key={i} className={s.aboutFeature}>
              <p className='p'>{para}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section data-earth-step='2' className={s.skills}>
        <div className={s.skillsHead}>
          <h2 className='h2'>
            <AppearTitle>{content.skillsHeading}</AppearTitle>
          </h2>
        </div>
        <HorizontalSlides>
          {content.techs.map((tech, i) => (
            <div key={tech} style={{ marginRight: 'var(--gap)' } as CSSProperties}>
              <Card number={i + 1} text={tech} />
            </div>
          ))}
        </HorizontalSlides>
      </section>

      {/* ZOOM / STATEMENT (data-earth-step=3) */}
      <ZoomSection {...content.statement} />

      {/* FEATURING (data-earth-step=5 — step 4 là marker cuối zoom) */}
      <section data-earth-step='5' data-theme='light' className={s.featuring}>
        <p className={`p-l ${s.featuringIntro}`}>{content.featuringIntro}</p>
        <FeatureCards items={content.featuringItems} />
      </section>

      {/* PROJECTS (data-earth-step=6) */}
      <ProjectsSection heading={content.projectsHeading} projects={content.projects} />

      {/* FOOTER (data-earth-step=7) */}
      <footer data-earth-step='7' data-theme='light' className={s.footer}>
        <div>
          <h2 className='h1 vh'>{content.footerHeading}</h2>
          <Link href='/contact' className={`${s.btn} ${s.btnFilled} ${s.footerCta}`}>
            {content.ctaFooter}
          </Link>
        </div>
        <div className={s.footerBottom}>
          <div className={s.footerLinks}>
            {content.socials.map((soc) => (
              <a key={soc.label} href={soc.url} target='_blank' rel='noreferrer' className='p-xs'>
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
    </>
  )
}
