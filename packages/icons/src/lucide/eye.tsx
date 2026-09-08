'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Eye = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Eye(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
      <circle cx='12' cy='12' r='3' />
    </AnimatedIcon>
  )
})
