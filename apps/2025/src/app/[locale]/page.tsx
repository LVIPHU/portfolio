import { HomeTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { setRequestLocale } from 'next-intl/server'

export default async function HomePage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  return <HomeTemplate />
}
