'use client'
import { useTheme } from 'next-themes'
import { SocialIcons } from '@/components/atoms/social-icons'
import React from 'react'

const SIZE = 96

export const Logo = () => {
  const { resolvedTheme } = useTheme()

  const logoVariant = resolvedTheme === 'dark' ? 'logodark' : 'logolight'

  return <SocialIcons kind={logoVariant} iconType='icon' size={SIZE} />
}
