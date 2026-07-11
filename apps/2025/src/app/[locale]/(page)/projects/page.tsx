import { ProjectsTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations()

  return {
    title: t('Common.projects'),
  }
}

export default async function ProjectsPage(props: PageLangParam) {
  const lang = (await props.params).locale
  return <ProjectsTemplate />
}
