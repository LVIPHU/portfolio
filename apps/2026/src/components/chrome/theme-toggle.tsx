'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@portfolio/ui'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('a11y')

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Button variant='ghost' size='icon' aria-hidden />
  }

  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  const label = next === 'light' ? t('themeLight') : t('themeDark')

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label={label}
      data-umami-event='toggle-theme'
      onClick={() => setTheme(next)}
    >
      {resolvedTheme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
    </Button>
  )
}
