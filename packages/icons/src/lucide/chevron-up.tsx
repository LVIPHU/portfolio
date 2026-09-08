'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ChevronUpIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ChevronUpIcon(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m18 15-6-6-6 6' />
    </AnimatedIcon>
  )
})
