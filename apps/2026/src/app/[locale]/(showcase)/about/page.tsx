import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { profile, resume, featuredProjects, type Locale } from '@portfolio/content'
import { t } from '@/utils/format'
import { ShowcaseAbout, type AboutContent } from '@/components/showcase/showcase-about'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const tAbout = await getTranslations({ locale, namespace: 'about' })
  return { title: tAbout('title') }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const ts = await getTranslations('showcase')

  const content: AboutContent = {
    name: profile.name,
    role: t(profile.title, locale),
    tagline: t(profile.tagline, locale),
    bio: profile.bio.map((b) => t(b, locale)),
    aboutHeading: ts('aboutHeading'),
    scrollLabel: ts.raw('scrollLabel') as [string, string],
    ctaProjects: ts('ctaProjects'),
    ctaContact: ts('ctaContact'),
    skillsHeading: ts('skillsHeading'),
    techs: resume.skills.flatMap((g) => g.items),
    statement: {
      first: ts('statement.first'),
      enter: ts('statement.enter'),
      second: ts('statement.second'),
    },
    featuringIntro: t(profile.bio[0], locale),
    featuringTitle: ts.raw('featuringTitle') as [string, string],
    featuringItems: ts.raw('featuringItems') as string[],
    projectsHeading: ts('projectsHeading'),
    projects: featuredProjects.map((p) => ({
      title: p.name,
      source: p.tech.join(' · '),
      href: p.links.demo ?? p.links.source ?? '#',
    })),
    footerHeading: ts('footerHeading'),
    ctaFooter: ts('ctaFooter'),
    socials: profile.socials,
    email: profile.email,
    year: new Date().getFullYear(),
  }

  return <ShowcaseAbout content={content} />
}
