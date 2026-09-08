'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const XIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function XIcon(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </AnimatedIcon>
  )
})
