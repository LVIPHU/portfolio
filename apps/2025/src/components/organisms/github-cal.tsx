'use client'
import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Reveal, Container } from '@/components/atoms'

export function GithubCal() {
  const t = useTranslations()
  const { theme } = useTheme()

  const colorScheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <Container className='w-full py-5 md:py-10'>
      <Reveal direction={'horizontal'} reverse={true}>
        <h3 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl'>
          {t('GithubCal.workCalendar')}
        </h3>
      </Reveal>
      <Reveal>
        <div className='mt-5 flex w-full items-center justify-center'>
          <GitHubCalendar colorScheme={colorScheme} username='LVIPHU' showWeekdayLabels={true} />
        </div>
      </Reveal>
    </Container>
  )
}
