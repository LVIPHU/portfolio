import { useLingui } from '@lingui/react'
import { Header } from '@/components/organisms'
import { t } from '@lingui/macro'
import { Container } from '@/components/atoms'
import { HoverEffect } from '@/components/molecules'
import { projectsData } from '@data/main'

export const ProjectsTemplate = () => {
  const { i18n } = useLingui()
  return (
    <Container>
      <Header title={t(i18n)`Projects`} description={t(i18n)`Some things I've done`} />
      <HoverEffect items={projectsData} />
    </Container>
  )
}
