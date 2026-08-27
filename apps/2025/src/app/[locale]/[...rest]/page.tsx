import { notFound } from 'next/navigation'
import { PageLangParam } from '@/i18n'
import { setRequestLocale } from 'next-intl/server'

export default async function CatchAllPage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  notFound()
}
