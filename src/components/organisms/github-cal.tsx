'use client'
import GitHubCalendar from 'react-github-calendar'
import { useTheme } from 'next-themes'
import { Trans } from '@lingui/react/macro'
import { Container } from '@/components/atoms'

export function GithubCal() {
  const { theme } = useTheme()

  const colorScheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <Container className='my-5 md:my-10 w-full'>
      <h3 className='text-2xl font-extrabold leading-9 tracking-tight sm:text-3xl sm:leading-10 md:text-4xl md:leading-14'>
        <Trans>Work Calendar</Trans>
      </h3>
      <div className='mt-5 w-full flex items-center justify-center'>
        <GitHubCalendar colorScheme={colorScheme} username='LVIPHU' showWeekdayLabels={true} />
      </div>
    </Container>
  )
}
