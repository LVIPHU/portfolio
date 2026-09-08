'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const ChevronsUp = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function ChevronsUp(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='m17 11-5-5-5 5' />
      <path d='m17 18-5-5-5 5' />
    </AnimatedIcon>
  )
})
