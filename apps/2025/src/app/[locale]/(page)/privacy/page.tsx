import { PrivacyTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(props: PageLangParam) {
  const { locale } = await props.params
  const t = await getTranslations({ locale })

  return {
    title: t('Privacy.title'),
    description: t('Privacy.intro'),
  }
}

export default async function PrivacyPage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  return <PrivacyTemplate />
}
