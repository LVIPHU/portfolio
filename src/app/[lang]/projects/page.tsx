import { ProjectsTemplate } from '@/components/templates'
import { getI18nInstance, PageLangParam } from '@/i18n'
import { t } from '@lingui/macro'

export async function generateMetadata(props: PageLangParam) {
  const i18n = getI18nInstance((await props.params).lang)

  return {
    title: `${t(i18n)`Dự án`} | ${process.env.owner}`
  }
}

export default function Projects() {
  return <ProjectsTemplate />
}
