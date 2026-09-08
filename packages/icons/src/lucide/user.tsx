'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const User = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function User(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </AnimatedIcon>
  )
})
