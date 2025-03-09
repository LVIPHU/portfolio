import { useLingui } from '@lingui/react'
import { Footer, Header, Layout } from '@/components/organisms'
import { t } from '@lingui/macro'

export const ProjectsTemplate = () => {
  const { i18n } = useLingui()
  return (
    <Layout>
      <Header title={t(i18n)`Projects`} description={t(i18n)`Some things I've done`} />
      <section></section>
      <Footer description={t(i18n)`Projects`} />
    </Layout>
  )
}
