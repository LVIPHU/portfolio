'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const LayoutGrid = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function LayoutGrid(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <rect width='7' height='7' x='3' y='3' rx='1' />
      <rect width='7' height='7' x='14' y='3' rx='1' />
      <rect width='7' height='7' x='14' y='14' rx='1' />
      <rect width='7' height='7' x='3' y='14' rx='1' />
    </AnimatedIcon>
  )
})
