'use client'

import type { CSSProperties } from 'react'
import { EarthBackground } from '@/components/three/earth-background'
import { AppearTitle } from '@/components/effects/appear-title'
import { HorizontalSlides } from '@/components/effects/horizontal-slides'
import { Card } from '@/components/effects/card'
import { ZoomSection } from './zoom-section'
import { FeatureCards } from './feature-cards'
import { ProjectsSection } from './projects-section'
import { AboutHero } from './about-hero'
import { AboutFooter } from './about-footer'
import s from './sections.module.css'

export type AboutContent = {
  name: string
  role: string
  tagline: string
  bio: string[]
  aboutHeading: string
  scrollLabel: [string, string]
  ctaContact: string
  skillsHeading: string
  techs: string[]
  statement: { first: string; enter: string; second: string }
  featuringIntro: string
  featuringItems: string[]
  /* [dòng 1, dòng 2] — dòng 2 render màu grey, kiểu title của lenis */
  featuringTitle: [string, string]
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
      {/* EarthBackground — GsapSync gỡ vì ScrollTrigger không còn consumer */}
      <EarthBackground />

      <AboutHero content={content} />

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

      <ZoomSection {...content.statement} />

      {/* FEATURING (data-earth-step=5 — step 4 là marker cuối zoom).
          KHÔNG đặt data-theme ở đây: theme.css chỉ định nghĩa `.showcase-root[data-theme=…]`
          nên thuộc tính trên section/footer không khớp selector nào. Việc lật sang light do
          ZoomSection làm — nó setAttribute lên chính .showcase-root khi zoom chạy xong. */}
      <section data-earth-step='5' className={s.featuring}>
        <p className={`p-l ${s.featuringIntro}`}>{content.featuringIntro}</p>
        <FeatureCards items={content.featuringItems} title={content.featuringTitle} />
      </section>

      <ProjectsSection heading={content.projectsHeading} projects={content.projects} />

      <AboutFooter content={content} />
    </>
  )
}
