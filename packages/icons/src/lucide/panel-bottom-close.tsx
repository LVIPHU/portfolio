'use client'

import { forwardRef } from 'react'
import { AnimatedIcon, type AnimatedIconHandle, type AnimatedIconProps } from './animated-icon'

export const PanelBottomClose = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function PanelBottomClose(props, ref) {
    return (
      <AnimatedIcon ref={ref} {...props}>
        <rect width='18' height='18' x='3' y='3' rx='2' />
        <path d='M3 15h18' />
        <path d='m15 8-3 3-3-3' />
      </AnimatedIcon>
    )
  }
)
