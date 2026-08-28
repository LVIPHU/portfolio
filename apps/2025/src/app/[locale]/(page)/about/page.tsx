import { AboutTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { withOg } from '@/utils/og-meta'

export async function generateMetadata(props: PageLangParam) {
  const { locale } = await props.params
  const t = await getTranslations({ locale })

  return withOg({
    locale,
    path: '/about',
    title: t('Common.about'),
    description: t('About.someInterestingThingsAbout'),
  })
}

export default async function AboutPage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  return <AboutTemplate />
}
