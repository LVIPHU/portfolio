import { AboutTemplate } from '@/components/templates'
import { getI18nInstance, initLingui, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'
import { LayoutDocs, Footer, Header } from '@/components/organisms'

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: `${t(i18n)`Giới thiệu`} | ${process.env.owner}`
  }
}

export default async function About(props: PageLangParam) {
  const lang = (await props.params).lang
  const i18n = getI18nInstance(lang)
  initLingui(lang)

  return (
    <LayoutDocs>
      <Header
        title={t(i18n)`Giới thiệu`}
        description={t(
          i18n
        )`Một số điều thú vị về bản thân và sở thích viết code rồi tự làm khó chính mình sau 6 tháng.`}
      />
      <AboutTemplate />
      <Footer description={t(i18n)`Vài dòng chia sẻ về bản thân.`} />
    </LayoutDocs>
  )
}
