'use client'

import { Button } from '@/components/atoms'
import { CloudSun, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

type Props = {
  size?: number
  className?: string
}

type Theme = 'light' | 'dark' | 'system'

// C9 (D-03): gỡ lib animation cũ — dải 3 icon trượt ngang bằng CSS transition thuần.
export const ThemeSwitch = ({ size = 20, className }: Props) => {
  const { theme, setTheme } = useTheme()

  const toggleTheme: Record<Theme, Theme> = {
    light: 'dark',
    system: 'light',
    dark: 'system',
  }
  const validThemes: Theme[] = ['light', 'dark', 'system']
  const currentTheme = validThemes.includes(theme as Theme) ? (theme as Theme) : 'light'
  const offset = { light: 0, system: -size, dark: -size * 2 }[currentTheme]

  return (
    <Button size='icon' variant='ghost' className={className} onClick={() => setTheme(toggleTheme[currentTheme])}>
      <div className='cursor-pointer overflow-hidden' style={{ width: size, height: size }}>
        <div
          className='flex gap-1 p-1 transition-transform duration-300 ease-out motion-reduce:transition-none'
          style={{ transform: `translateX(${offset}px)` }}
        >
          <Sun size={size} className='shrink-0' />
          <CloudSun size={size} className='shrink-0' />
          <Moon size={size} className='shrink-0' />
        </div>
      </div>
    </Button>
  )
}
