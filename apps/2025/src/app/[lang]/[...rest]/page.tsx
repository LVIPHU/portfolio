import { notFound } from 'next/navigation'
import { initLingui, PageLangParam } from '@/i18n'

export default async function CatchAllPage(props: PageLangParam) {
  const lang = (await props.params).lang
  await initLingui(lang)
  notFound()
}
