'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { Mail } from 'lucide-react'
import { EarthBackground } from '@/components/three/earth-background'
import { AppearTitle } from '@/components/effects/appear-title'
import { HorizontalSlides } from '@/components/effects/horizontal-slides'
import { Card } from '@/components/effects/card'
import { ZoomSection } from './zoom-section'
import { FeatureCards } from './feature-cards'
import { ProjectsSection } from './projects-section'
import { FelixHeroMark } from '@/components/brand/felix-mark'
import { PillButtonLink } from '@/components/effects/pill-button'
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
  // Gợi ý cuộn trốn đi ngay khi người dùng bắt đầu cuộn — lenis dùng `setHasScrolled(scroll > 10)`
  // trong useScroll (pages/home/index.js:120). Dùng listener THUẦN thay vì useLenis cho khớp
  // earth-canvas: không phụ thuộc context ReactLenis, và lenis chạy native scroll nên
  // window.scrollY vẫn đúng. setState với cùng giá trị thì React bail out, không re-render.
  const [hasScrolled, setHasScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* GsapSync đã chuyển lên (showcase)/layout.tsx — hạ tầng thuộc về layout, không phải page */}
      <EarthBackground />

      {/* HERO */}
      <section data-earth-step='0' className={s.hero}>
        <div className={s.heroTop}>
          {/* Wordmark FELIX (blackletter) thay dòng tên — tên đầy đủ vẫn ở nav/footer/metadata */}
          <h1 className={s.heroMark}>
            <FelixHeroMark fill='var(--theme-contrast)' label={content.name} />
          </h1>
          {/* Bỏ .contrast → thừa kế --theme-secondary (trắng ở dark). Cũng đúng luật cấp phép
              gold: .h3 chỉ 20px comp ở mobile nên không được là gold trên nền sáng. */}
          <h2 className={`h3 ${s.heroRole}`}>{content.role}</h2>
        </div>
        {/* menu-button-reserve: chỉ mobile — né XUỐNG dưới nút mở menu (desktop né ngang bằng
            padding-right của .heroCta) */}
        <div className={`${s.heroBottom} menu-button-reserve`}>
          <div className={`${s.scrollHint} ${hasScrolled ? s.scrollHintHidden : ''}`}>
            <span className={s.scrollHintText}>
              {content.scrollLabel[0]}
              <br />
              {content.scrollLabel[1]}
            </span>
          </div>
          <p className={`p-s ${s.heroDesc}`}>{content.tagline}</p>
          {/* MỘT nút thôi: nút thứ hai ở hàng này là nút mở menu (lớp fixed góc phải-dưới).
              Công thức nút nằm ở @/components/effects/pill-button — nút menu dùng chung. */}
          <div className={s.heroCta}>
            <PillButtonLink href='/contact' icon={<Mail />} label={content.ctaContact} />
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

      {/* FEATURING (data-earth-step=5 — step 4 là marker cuối zoom).
          KHÔNG đặt data-theme ở đây: theme.css chỉ định nghĩa `.showcase-root[data-theme=…]`
          nên thuộc tính trên section/footer không khớp selector nào. Việc lật sang light do
          ZoomSection làm — nó setAttribute lên chính .showcase-root khi zoom chạy xong. */}
      <section data-earth-step='5' className={s.featuring}>
        <p className={`p-l ${s.featuringIntro}`}>{content.featuringIntro}</p>
        <FeatureCards items={content.featuringItems} title={content.featuringTitle} />
      </section>

      {/* PROJECTS (data-earth-step=6) */}
      <ProjectsSection heading={content.projectsHeading} projects={content.projects} />

      {/* FOOTER (data-earth-step=7) */}
      <footer data-earth-step='7' className={s.footer}>
        <div>
          <h2 className='h1 vh'>{content.footerHeading}</h2>
          <PillButtonLink href='/contact' icon={<Mail />} label={content.ctaFooter} className={s.footerCta} />
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
