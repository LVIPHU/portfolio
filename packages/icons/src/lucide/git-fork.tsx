'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const GitFork = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function GitFork(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <circle cx='12' cy='18' r='3' />
      <circle cx='6' cy='6' r='3' />
      <circle cx='18' cy='6' r='3' />
      <path d='M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9' />
      <path d='M12 12v3' />
    </AnimatedIcon>
  )
})
