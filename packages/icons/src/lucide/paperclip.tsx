'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const Paperclip = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function Paperclip(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551' />
    </AnimatedIcon>
  )
})
