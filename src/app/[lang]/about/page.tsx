import { AboutTemplate } from '@/components/templates'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'
import { LayoutDocs, Footer, Header } from '@/components/organisms'

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: `${t(i18n)`About`} | ${process.env.owner}`
  }
}

export default function About() {
  return (
    <LayoutDocs>
      <Header title={'About me'} />
      <AboutTemplate />
      <Footer description={'không có'} />
    </LayoutDocs>
  )
}
