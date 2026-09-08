'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ChevronRight = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ChevronRight(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m9 18 6-6-6-6' />
    </AnimatedIcon>
  )
})
export { ChevronRight as ChevronRightIcon }
