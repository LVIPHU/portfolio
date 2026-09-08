'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ChevronLeft = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ChevronLeft(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m15 18-6-6 6-6' />
    </AnimatedIcon>
  )
})
export { ChevronLeft as ChevronLeftIcon }
