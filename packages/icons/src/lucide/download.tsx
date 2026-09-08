'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Download = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Download(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M12 15V3' />
      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
      <path d='m7 10 5 5 5-5' />
    </AnimatedIcon>
  )
})
