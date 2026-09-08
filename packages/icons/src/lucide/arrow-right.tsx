'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ArrowRight = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ArrowRight(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M5 12h14' />
      <path d='m12 5 7 7-7 7' />
    </AnimatedIcon>
  )
})
