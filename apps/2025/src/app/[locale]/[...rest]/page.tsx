import { notFound } from 'next/navigation'
import { PageLangParam } from '@/i18n'

export default async function CatchAllPage(props: PageLangParam) {
  const lang = (await props.params).locale
  notFound()
}
