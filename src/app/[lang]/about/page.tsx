import { AboutTemplate } from '@/components/templates'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: `${t(i18n)`About`} | ${process.env.owner}`
  }
}

export default async function AboutPage(props: PageLangParam) {
  const lang = (await props.params).lang
  initLingui(lang)
  return <AboutTemplate />
}
