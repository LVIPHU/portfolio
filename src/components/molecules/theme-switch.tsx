'use client'

import { Button } from '@/components/atoms'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { CloudSun, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

type Props = {
  size?: number
  className?: string
}

export const ThemeSwitch = ({ size = 20, className }: Props) => {
  const { theme, setTheme } = useTheme()

  const variants: Variants = useMemo(() => {
    return {
      light: { x: 0 },
      system: { x: size * -1 },
      dark: { x: size * -2 }
    }
  }, [size])

  type Theme = 'light' | 'dark' | 'system'
  const toggleTheme = {
    light: 'dark',
    system: 'light',
    dark: 'system'
  }
  const validThemes: Theme[] = ['light', 'dark', 'system']
  const currentTheme = validThemes.includes(theme as Theme) ? (theme as Theme) : 'light'

  return (
    <Button size='icon' variant='ghost' className={className} onClick={() => setTheme(toggleTheme[currentTheme])}>
      <div className='cursor-pointer overflow-hidden' style={{ width: size, height: size }}>
        <motion.div animate={theme} variants={variants} className='flex gap-1 p-1'>
          <Sun size={size} className='shrink-0' />
          <CloudSun size={size} className='shrink-0' />
          <Moon size={size} className='shrink-0' />
        </motion.div>
      </div>
    </Button>
  )
}
