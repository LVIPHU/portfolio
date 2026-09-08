'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Clock = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Clock(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 6v6l4 2' />
    </AnimatedIcon>
  )
})
