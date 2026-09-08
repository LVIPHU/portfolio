'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ArrowLeft = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ArrowLeft(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m12 19-7-7 7-7' />
      <path d='M19 12H5' />
    </AnimatedIcon>
  )
})
