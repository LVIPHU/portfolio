'use client'

import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import { FelixHeroMark } from '@/components/brand/felix-mark'
import { PillButtonLink } from '@/components/effects/pill-button'
import s from './sections.module.css'

type AboutHeroContent = {
  name: string
  role: string
  tagline: string
  scrollLabel: [string, string]
  ctaContact: string
}

export function AboutHero({ content }: { content: AboutHeroContent }) {
  // Gợi ý cuộn trốn đi ngay khi người dùng bắt đầu cuộn — lenis dùng `setHasScrolled(scroll > 10)`
  // trong useScroll. Dùng listener THUẦN thay vì useLenis cho khớp earth-canvas: không phụ thuộc
  // context ReactLenis, và lenis chạy native scroll nên window.scrollY vẫn đúng.
  const [hasScrolled, setHasScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section data-earth-step='0' className={s.hero}>
      <div className={s.heroTop}>
        <h1 className={s.heroMark}>
          <FelixHeroMark fill='var(--theme-contrast)' label={content.name} />
        </h1>
        {/* Bỏ .contrast → thừa kế --theme-secondary. .h3 20px comp không được gold trên nền sáng. */}
        <h2 className={`h3 ${s.heroRole}`}>{content.role}</h2>
      </div>
      <div className={`${s.heroBottom} menu-button-reserve`}>
        <div className={`${s.scrollHint} ${hasScrolled ? s.scrollHintHidden : ''}`}>
          <span className={s.scrollHintText}>
            {content.scrollLabel[0]}
            <br />
            {content.scrollLabel[1]}
          </span>
        </div>
        <p className={`p-s ${s.heroDesc}`}>{content.tagline}</p>
        <div className={s.heroCta}>
          <PillButtonLink href='/contact' icon={<Mail />} label={content.ctaContact} />
        </div>
      </div>
    </section>
  )
}
