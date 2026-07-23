import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { profile, resume, featuredProjects, type Locale } from '@portfolio/content'
import { t } from '@/lib/utils'
import { ShowcaseAbout, type AboutContent } from '@/components/showcase/sections/showcase-about'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'vi' ? 'Giới thiệu' : 'About' }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const vi = locale === 'vi'

  const content: AboutContent = {
    name: profile.name,
    role: t(profile.title, locale),
    tagline: t(profile.tagline, locale),
    bio: profile.bio.map((b) => t(b, locale)),
    aboutHeading: vi ? 'Về mình' : 'About me',
    scrollLabel: vi ? ['cuộn', 'khám phá'] : ['scroll', 'to explore'],
    ctaProjects: vi ? 'Xem dự án' : 'View projects',
    ctaContact: vi ? 'Liên hệ' : 'Contact',
    skillsHeading: vi ? 'Mình dùng gì' : 'What I work with',
    techs: resume.skills.flatMap((g) => g.items),
    statement: vi
      ? { first: 'Biến ý tưởng', enter: 'thành', second: 'sản phẩm' }
      : { first: 'Turn ideas', enter: 'into', second: 'products' },
    featuringIntro: t(profile.bio[0], locale),
    featuringItems: vi
      ? [
          'Code sạch',
          'Hiệu năng',
          'Trải nghiệm',
          'Dễ bảo trì',
          'Responsive',
          'Chi tiết',
          'Kiểm thử',
          'Khả dụng',
          'Hiện đại',
        ]
      : [
          'Clean code',
          'Performance',
          'User experience',
          'Maintainable',
          'Responsive',
          'Attention to detail',
          'Testing',
          'Accessibility',
          'Modern stack',
        ],
    projectsHeading: vi ? 'Dự án' : 'Projects',
    projects: featuredProjects.map((p) => ({
      title: p.name,
      source: p.tech.join(' · '),
      href: p.links.demo ?? p.links.source ?? '#',
    })),
    footerHeading: vi ? 'Cùng tạo điều gì đó' : "Let's build something",
    ctaFooter: vi ? 'Liên hệ với mình' : 'Get in touch',
    socials: profile.socials,
    email: profile.email,
    year: new Date().getFullYear(),
  }

  return <ShowcaseAbout content={content} />
}
