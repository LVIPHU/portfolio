'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const PanelBottomOpen = forwardRef<AnimatedIconHandle, AnimatedIconProps>(function PanelBottomOpen(props, ref) {
  return (
    <AnimatedIcon ref={ref} {...props}>
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='M3 15h18' />
      <path d='m9 10 3-3 3 3' />
    </AnimatedIcon>
  )
})
