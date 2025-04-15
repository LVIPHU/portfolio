import { ContactTemplate } from '@/components/templates'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'

export async function generateMetadata(props: PageLangParam) {
  const i18n = await getI18nInstance((await props.params).lang)

  return {
    title: t(i18n)`Contact`,
  }
}

export default async function ContactPage(props: PageLangParam) {
  const lang = (await props.params).lang
  await initLingui(lang)
  return <ContactTemplate />
}
