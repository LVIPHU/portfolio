import { useLingui } from '@lingui/react'
import { Footer, Header, Layout } from '@/components/organisms'
import { t } from '@lingui/macro'

export const ProjectsTemplate = () => {
  const { i18n } = useLingui()
  return (
    <Layout>
      <Header title={t(i18n)`Dự án`} description={t(i18n)`Một số thứ tôi đã làm`} />
      <section></section>
      <Footer description={t(i18n)`Dự án.`} />
    </Layout>
  )
}
