'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Command = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Command(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
    </AnimatedIcon>
  )
})
