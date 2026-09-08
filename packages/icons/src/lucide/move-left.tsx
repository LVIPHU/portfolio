'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const MoveLeft = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function MoveLeft(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <path d='M6 8L2 12L6 16' />
      <path d='M2 12H22' />
    </AnimatedIcon>
  )
})
