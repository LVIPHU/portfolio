'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ChevronDownIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ChevronDownIcon(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m6 9 6 6 6-6' />
    </AnimatedIcon>
  )
})
