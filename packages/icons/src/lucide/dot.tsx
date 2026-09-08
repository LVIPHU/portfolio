'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Dot = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Dot(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <circle cx='12' cy='12' r='1' />
    </AnimatedIcon>
  )
})
