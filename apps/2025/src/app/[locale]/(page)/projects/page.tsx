import { ProjectsTemplate } from '@/components/templates'
import { PageLangParam } from '@/i18n'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(props: PageLangParam) {
  const { locale } = await props.params
  const t = await getTranslations({ locale })

  return {
    title: t('Common.projects'),
    description: t('Projects.someThingsIVe'),
  }
}

export default async function ProjectsPage(props: PageLangParam) {
  const { locale } = await props.params
  setRequestLocale(locale)
  return <ProjectsTemplate />
}
