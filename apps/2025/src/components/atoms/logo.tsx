'use client'
import { useTheme } from 'next-themes'
import { SocialIcons } from '@portfolio/icons'

const SIZE = 96

export const Logo = () => {
  const { resolvedTheme } = useTheme()
  const logoVariant = resolvedTheme === 'dark' ? 'logodark' : 'logolight'
  return <SocialIcons kind={logoVariant} iconType='icon' size={SIZE} />
}
