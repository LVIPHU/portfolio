import { useLingui } from '@lingui/react'
import { Header } from '@/components/organisms'
import { t } from '@lingui/macro'
import { Container } from '@/components/atoms'
import { HoverEffect } from '@/components/molecules'
import { PROJECTS } from '@data/main'

export const ProjectsTemplate = () => {
  const { i18n } = useLingui()
  const workProjects = PROJECTS.filter(({ type }) => type === 'work')
  const sideProjects = PROJECTS.filter(({ type }) => type === 'self')

  return (
    <Container>
      <Header title={t(i18n)`Projects`} description={t(i18n)`Some things I've done`} />
      <div className='py-5 md:py-10'>
        <h3 className='mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl'>
          {t(i18n)`Work`}
        </h3>
        <HoverEffect items={workProjects} />
      </div>
      <div className='mt-6 border-t border-gray-200 py-5 dark:border-gray-700 md:mt-10 md:py-10'>
        <h3 className='mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:mb-8 md:text-3xl'>
          {t(i18n)`Side projects`}
        </h3>
        <HoverEffect items={sideProjects} />
      </div>
    </Container>
  )
}
