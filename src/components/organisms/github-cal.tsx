'use client'
import GitHubCalendar from 'react-github-calendar'
import { useTheme } from 'next-themes'
import { Trans } from '@lingui/react/macro'
import { Container } from '@/components/atoms'

export function GithubCal() {
  const { theme } = useTheme()

  const colorScheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <Container className='w-full py-5 md:py-10'>
      <h3 className='md:leading-14 text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl'>
        <Trans>Work Calendar</Trans>
      </h3>
      <div className='mt-5 flex w-full items-center justify-center'>
        <GitHubCalendar colorScheme={colorScheme} username='LVIPHU' showWeekdayLabels={true} />
      </div>
    </Container>
  )
}
