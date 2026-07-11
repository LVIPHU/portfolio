import { Header } from '@/components/organisms'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/atoms'
import { HoverEffect } from '@/components/molecules'
import { PROJECTS_2025 as PROJECTS } from '@portfolio/content/data2025'

export const ProjectsTemplate = () => {
  const t = useTranslations()
  const workProjects = PROJECTS.filter(({ type }) => type === 'work')
  const sideProjects = PROJECTS.filter(({ type }) => type === 'self')

  return (
    <Container>
      <Header title={t('Common.projects')} description={t('Projects.someThingsIVe')} />
      <div className='py-5 md:py-10'>
        <h3 className='mb-5 text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-3xl dark:text-gray-100'>
          {t('Projects.work')}
        </h3>
        <HoverEffect items={workProjects} />
      </div>
      <div className='mt-5 border-t border-gray-200 py-5 md:mt-10 md:py-10 dark:border-gray-700'>
        <h3 className='mb-5 text-2xl font-bold leading-9 tracking-tight text-gray-900 md:mb-8 md:text-3xl dark:text-gray-100'>
          {t('Projects.sideProjects')}
        </h3>
        <HoverEffect items={sideProjects} />
      </div>
    </Container>
  )
}
